import express from 'express';
import path from 'path';
import { commitExecution, getExecutionById, getExecutionRecords, rollbackExecution } from './server/actionRuntime.js';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import { evaluateSecurityRequest, getSecurityIntegrity, getSecurityStatus, recordVerificationFailure, recordVerifiedExecution } from './server/security/securityKernel.js';
import { getSecurityEvents, appendSecurityEvent } from './server/security/securityEvents.js';
import { detectIncidents, listIncidents, updateIncident } from './server/security/incidents.js';
import { createProvenanceRecord, verifyProvenanceRecord } from './server/security/provenance.js';
import { createVaultProvenance, verifyVaultProvenance } from './server/security/vaultProvenance.js';
import { executeSecurityResponse, executeRollbackResponse } from './server/security/responseRuntime.js';
import { chunkPrompt, createPromptEnvelope } from './server/promptRuntime.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: process.env.BUSINESS_OS_HTTP_BODY_LIMIT || '8mb' }));

app.use((req, _res, next) => {
  const ignored = req.path === '/api/health' || req.path.startsWith('/api/security/');
  if (!ignored && req.path.startsWith('/api/')) {
    appendSecurityEvent({
      eventType: 'API_ACCESS',
      severity: req.method === 'POST' ? 'LOW' : 'INFO',
      actorId: typeof req.header('x-actor-id') === 'string' ? req.header('x-actor-id') || undefined : undefined,
      sessionId: typeof req.header('x-session-id') === 'string' ? req.header('x-session-id') || undefined : undefined,
      targetResource: req.path,
      description: 'API resource accessed.',
      metadata: { method: req.method, path: req.path },
    });
  }
  next();
});

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
    dataMode: 'SIMULATED',
  });
});

// AI Command Core endpoint
app.post('/api/gemini/command', async (req, res) => {
  appendSecurityEvent({
    eventType:'AGENT_COMMAND_REQUEST',
    severity:'LOW',
    actorId:typeof req.header('x-actor-id')==='string'?req.header('x-actor-id')||undefined:undefined,
    agentId:'command-core',
    sessionId:typeof req.header('x-session-id')==='string'?req.header('x-session-id')||undefined:undefined,
    description:'Command Core received an agent/AI command request.',
    metadata:{commandPresent:typeof req.body?.command==='string'},
  });
  let promptEnvelope;
  try {
    promptEnvelope = createPromptEnvelope(
      req.body?.command || 'Analyze current business health and anomalies',
      req.body?.businessContext
    );
  } catch (error: any) {
    const message = error?.message || 'Invalid prompt payload.';
    appendSecurityEvent({
      eventType: 'AGENT_COMMAND_REJECTED',
      severity: 'MEDIUM',
      actorId: typeof req.header('x-actor-id') === 'string' ? req.header('x-actor-id') || undefined : undefined,
      agentId: 'command-core',
      sessionId: typeof req.header('x-session-id') === 'string' ? req.header('x-session-id') || undefined : undefined,
      verification: 'FAILED',
      policyDecision: 'DENY',
      description: 'Command Core rejected an invalid or oversized prompt envelope.',
      metadata: { reason: message },
    });
    return res.status(message.includes('maximum supported size') ? 413 : 400).json({
      success: false,
      error: message,
      code: message.includes('maximum supported size') ? 'PROMPT_TOO_LARGE' : 'INVALID_PROMPT',
    });
  }

  const prompt = promptEnvelope.prompt;
  const businessContext = promptEnvelope.context;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are the AI Command Core of Business OS (an advanced business operating environment).
Analyze the user's business intent with extreme precision.
Always strictly separate:
1. ANALYSIS: What is happening and why (root causes, metrics).
2. ANOMALIES: 2-4 quantified negative or positive deviations.
3. RECOMMENDATIONS: Clear strategic counsel.
4. PROPOSED ACTION: 1-3 concrete executable actions that will require policy authorization / human approval.
5. AFFECTED_NODES: List of related business world entities: e.g. ["revenue", "enterprise_sales", "customers", "operations", "projects", "finance"].

Return clean, valid JSON matching this schema:
{
  "title": "Short title of analysis or mission",
  "analysis": "Detailed business analysis in 2-3 concise paragraphs",
  "confidence": 94,
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "anomalies": [
    { "metric": "Enterprise Pipeline", "delta": "-18.4%", "significance": "critical", "description": "3 tier-1 deals stalled in procurement" },
    { "metric": "Trial-to-Paid Conversion", "delta": "-7.2%", "significance": "warning", "description": "SSO onboarding failure spike" }
  ],
  "mission": {
    "title": "Actionable mission title",
    "objective": "Clear single-sentence target",
    "leadAgent": "Sales Agent" or "Finance Agent" or "Operations Agent",
    "collaboratingAgents": ["Finance Agent", "Customer Agent"],
    "steps": ["Step 1 description", "Step 2 description", "Step 3 description"]
  },
  "proposedActions": [
    {
      "id": "act_1",
      "title": "Authorize emergency procurement concierge for stalled $420k ARR accounts",
      "riskLevel": "medium",
      "targetSystem": "Salesforce CRM & Slack Gateway",
      "requiresApproval": true,
      "parameters": { "pipelineGroup": "Enterprise Tier-1", "priority": "urgent" }
    }
  ],
  "affectedNodes": ["revenue", "sales", "customers"]
}`;

      const maxModelPromptChars = Number(process.env.BUSINESS_OS_GEMINI_CHUNK_CHARS || 240_000);
      const chunks = chunkPrompt(prompt, maxModelPromptChars);
      let responseText = '{}';

      if (chunks.length === 1) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Request ID: ${promptEnvelope.requestId}
Prompt SHA-256: ${promptEnvelope.promptSha256}
Business Context: ${businessContext || JSON.stringify({ arr: '$24.8M', runway: '22 mos', nrr: '118%' })}
User Request: ${prompt}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          },
        });
        responseText = response.text || '{}';
      } else {
        const chunkResults: string[] = [];
        for (const chunk of chunks) {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Request ID: ${promptEnvelope.requestId}
Prompt SHA-256: ${promptEnvelope.promptSha256}
Business Context: ${businessContext || '{}'}
This is chunk ${chunk.index} of ${chunk.total}, covering source character offsets ${chunk.start}-${chunk.end}.
Analyze this chunk as evidence only. Preserve concrete facts, numbers, anomalies, recommendations, and candidate actions. Do not invent missing context.
Chunk:
${chunk.text}`,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            },
          });
          chunkResults.push(response.text || '{}');
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Request ID: ${promptEnvelope.requestId}
Original Prompt SHA-256: ${promptEnvelope.promptSha256}
Business Context: ${businessContext || '{}'}
The original user prompt was processed completely across ${chunks.length} bounded chunks. Synthesize the chunk evidence below into the required final JSON response. Preserve facts and quantitative details; resolve duplicates conservatively; do not claim evidence that is absent from the chunk results.

Chunk evidence:\n${chunkResults.map((result, index) => `--- CHUNK ${index + 1}/${chunks.length} ---\\n${result}`).join('\\n')}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          },
        });
        responseText = response.text || '{}';
      }
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, source: 'gemini', request: { requestId: promptEnvelope.requestId, promptChars: promptEnvelope.promptChars, contextChars: promptEnvelope.contextChars, promptSha256: promptEnvelope.promptSha256 }, data: parsed });
      } catch (e) {
        // if raw json parse fails, wrap text
        return res.json({
          success: true,
          source: 'gemini-raw',
          request: { requestId: promptEnvelope.requestId, promptChars: promptEnvelope.promptChars, contextChars: promptEnvelope.contextChars, promptSha256: promptEnvelope.promptSha256 },
          data: {
            title: 'Executive Intelligence Briefing',
            analysis: responseText,
            confidence: 88,
            recommendations: ['Inspect underlying telemetry across enterprise pipeline cohorts.'],
            anomalies: [
              { metric: 'Pipeline Velocity', delta: '-12.5%', significance: 'warning', description: 'Procurement cycle lengthened by 9 days' }
            ],
            mission: {
              title: 'Revenue Acceleration Sprint',
              objective: 'Address deal velocity deceleration across strategic accounts',
              leadAgent: 'Sales Agent',
              collaboratingAgents: ['Finance Agent', 'Customer Agent'],
              steps: ['Review stalled opportunities >$100k', 'Dispatch customer success audit', 'Re-align pricing incentives']
            },
            proposedActions: [
              {
                id: `act_${Date.now()}`,
                title: 'Deploy Executive Sponsor Alert to top 5 at-risk deals',
                riskLevel: 'low',
                targetSystem: 'HubSpot & Executive Dispatcher',
                requiresApproval: true,
              }
            ],
            affectedNodes: ['revenue', 'sales']
          }
        });
      }
    }
  } catch (err: any) {
    console.warn('Gemini API call failed or timed out, utilizing high-fidelity offline business engine:', err?.message);
  }

  // High-fidelity fallback business intelligence engine
  const lower = prompt.toLowerCase();
  let result;

  if (lower.includes('revenue') || lower.includes('drop') || lower.includes('sales decline') || lower.includes('pipeline')) {
    result = {
      title: 'Q3 Enterprise Revenue & Pipeline Deceleration Investigation',
      analysis: 'Comprehensive telemetry synthesis across Stripe billing, HubSpot pipeline, and product usage logs indicates a composite $184k weekly revenue deceleration. The contraction is concentrated in EMEA enterprise tier-1 expansions (-18.4%) and mid-market renewal slippage (-7.4%), compounded by a 9-day extension in legal procurement cycles. Core SaaS self-serve remains resilient (+3.1% DoD).',
      confidence: 96,
      recommendations: [
        'Prioritize 4 stalled strategic renewals totalling $890k ARR with executive sponsor touchpoints.',
        'Activate Finance Agent discounting waiver policy for deals closing before Friday cutoff.',
        'Isolate SSO integration telemetry causing 14% drop in mid-market trial activation.'
      ],
      anomalies: [
        { metric: 'Enterprise Pipeline Volume', delta: '-18.4%', significance: 'critical', description: '4 key opportunities stalled at security & procurement review' },
        { metric: 'Trial-to-Paid Conversion', delta: '-7.4%', significance: 'warning', description: 'Auth0 SAML configuration failure rate spiked in EU-West' },
        { metric: 'Net Revenue Retention (NRR)', delta: '118.2% (down from 122%)', significance: 'notice', description: 'Slight seat contraction in fintech vertical accounts' }
      ],
      mission: {
        title: 'Enterprise Pipeline Unblocking & Recovery',
        objective: 'Unblock 4 Tier-1 stalled enterprise opportunities and restore weekly run-rate to $520k ARR',
        leadAgent: 'Sales Agent',
        collaboratingAgents: ['Finance Agent', 'Security Agent', 'Customer Agent'],
        steps: [
          'Verify SOC2 Type II compliance pack delivery to Siemens & Standard Chartered procurement',
          'Deploy custom annual prepayment incentive (12% margin-neutral tier)',
          'Schedule direct briefing between VP Engineering and client InfoSec leads'
        ]
      },
      proposedActions: [
        {
          id: `act_${Date.now()}_1`,
          title: 'Dispatch Automated Executive Outreach to Stalled Enterprise Champions',
          riskLevel: 'medium',
          targetSystem: 'Salesforce & Executive Desk',
          requiresApproval: true,
          parameters: { dealIds: ['OPP-8921', 'OPP-8944', 'OPP-9012'], discountCeiling: '12%' }
        },
        {
          id: `act_${Date.now()}_2`,
          title: 'Deploy Hotfix to Identity Gateway v4.8.2 for Enterprise SSO Provisioning',
          riskLevel: 'high',
          targetSystem: 'Production Kubernetes Cluster / Identity Provider',
          requiresApproval: true,
          parameters: { targetService: 'auth-gateway-eu', canaryRate: '10%' }
        }
      ],
      affectedNodes: ['revenue', 'sales', 'customers', 'operations']
    };
  } else if (lower.includes('customer') || lower.includes('churn') || lower.includes('behavior')) {
    result = {
      title: 'Customer Health & Behavioral Cohort Analysis',
      analysis: 'Cross-analysis of 1,420 active organizations indicates divergence between power developer cohorts (DAU/MAU 74%, up 4%) and non-technical business user seats (-14% 30-day activity). 6 enterprise accounts with upcoming Q4 renewals show telemetry indicative of contraction risk due to under-utilized workspace seats.',
      confidence: 93,
      recommendations: [
        'Trigger Customer Success intervention for accounts with license utilization below 45%.',
        'Initiate workspace seat rebalancing automation before annual contract renewal notice.',
        'Deploy targeted in-app workflow onboarding for business user personas.'
      ],
      anomalies: [
        { metric: 'Seat Utilization Velocity', delta: '-14.2%', significance: 'warning', description: 'Marketing & HR user cohorts inactive >14 days' },
        { metric: 'Expansion Intent Score', delta: '+22.5%', significance: 'positive', description: '18 accounts hitting 95% API quota limit' }
      ],
      mission: {
        title: 'At-Risk Enterprise Retention Safeguard',
        objective: 'Re-engage 6 enterprise accounts with seat under-utilization to secure $1.2M renewal ARR',
        leadAgent: 'Customer Agent',
        collaboratingAgents: ['Marketing Agent', 'Finance Agent'],
        steps: [
          'Map active versus dormant license seats across Tier-1 accounts',
          'Coordinate executive CS business review for bottom decile usage teams',
          'Offer seamless migration to consumption-based add-on tiers'
        ]
      },
      proposedActions: [
        {
          id: `act_${Date.now()}_cs`,
          title: 'Schedule Automated Customer Health Checkpoints & Account Rebalancing',
          riskLevel: 'low',
          targetSystem: 'Gainsight & Customer Success Gateway',
          requiresApproval: true,
          parameters: { threshold: '<45% utilization', cohort: 'Enterprise Tier-1' }
        }
      ],
      affectedNodes: ['customers', 'revenue', 'projects']
    };
  } else if (lower.includes('risk') || lower.includes('operation') || lower.includes('infra') || lower.includes('security')) {
    result = {
      title: 'Global Operational & Infrastructure Risk Matrix',
      analysis: 'Operational telemetry across 14 global edge clusters reports nominal latency (p99 42ms) except in the Frankfurt cluster where cloud compute egress costs exceeded budget baseline by 26% due to uncompressed vector index replication. In addition, 2 SOC2 compliance continuous monitoring tokens require credential rotation.',
      confidence: 97,
      recommendations: [
        'Enforce zstd vector compression stream on inter-region sync to trim $14.2k/mo egress.',
        'Execute automated zero-downtime key rotation for OAuth service accounts.',
        'Scale down idle staging pods in us-central1.'
      ],
      anomalies: [
        { metric: 'Inter-Region Egress Cost', delta: '+26.1%', significance: 'critical', description: 'Frankfurt -> Ashburn vector replication without delta compression' },
        { metric: 'Worker Node Memory Saturation', delta: '84.8% peak', significance: 'warning', description: 'Batch ETL queue bursting at 03:00 UTC' }
      ],
      mission: {
        title: 'Infrastructure Cost & Security Hardening Operation',
        objective: 'Eliminate $180k annualized cloud waste and complete credential hygiene rotation',
        leadAgent: 'Operations Agent',
        collaboratingAgents: ['Security Agent', 'Finance Agent'],
        steps: [
          'Deploy gzip/zstd payload compression filter to cross-region broker',
          'Rotate production service principal credentials with zero downtime',
          'Set up automated budget kill-switches on dev clusters'
        ]
      },
      proposedActions: [
        {
          id: `act_${Date.now()}_ops`,
          title: 'Apply Real-Time Egress Compression & Re-route Inter-DC Sync',
          riskLevel: 'medium',
          targetSystem: 'Cloud Networking & Envoy Proxy Mesh',
          requiresApproval: true,
          parameters: { targetCluster: 'fra-01', compressionAlgo: 'zstd-level-3' }
        }
      ],
      affectedNodes: ['operations', 'finance', 'systems']
    };
  } else {
    result = {
      title: 'Holistic Business State & Strategic Intelligence Synthesis',
      analysis: `Evaluated 48 discrete signals across revenue operations, enterprise sales pipeline, customer satisfaction, active engineering sprints, and agent autonomy metrics. Current business operational momentum is Strong (Composite Health Index: 92/100). ARR trajectory is pacing at $24.8M with 22 months cash runway at current net burn ($182k/mo).`,
      confidence: 95,
      recommendations: [
        'Accelerate hiring pipeline for Senior Machine Learning Infra roles.',
        'Consolidate 3 parallel customer feedback initiatives under Research Agent.',
        'Review 2 pending high-impact action approvals in the Executive Gate.'
      ],
      anomalies: [
        { metric: 'Gross Margin Expansion', delta: '+2.8%', significance: 'positive', description: 'Model inference caching efficiency improved to 76%' },
        { metric: 'Sales Cycle Duration', delta: '+4.2 days', significance: 'warning', description: 'Extended legal and IT review in Fortune 500 prospects' }
      ],
      mission: {
        title: 'Executive Strategic Alignment Sprint',
        objective: 'Maintain >30% YoY growth trajectory while expanding gross margin toward 82%',
        leadAgent: 'CEO Agent',
        collaboratingAgents: ['Finance Agent', 'Sales Agent', 'Operations Agent'],
        steps: [
          'Audit unit economics across customer tiers',
          'Streamline customer procurement packet with pre-certified terms',
          'Authorize automated cache tier warmups for top 20 enterprise tenants'
        ]
      },
      proposedActions: [
        {
          id: `act_${Date.now()}_strat`,
          title: 'Authorize Dynamic Pricing & Packaging Pilot for Q4 Enterprise Cohort',
          riskLevel: 'medium',
          targetSystem: 'Billing System & Product Catalog',
          requiresApproval: true,
          parameters: { cohortSize: 50, discountFloor: '10%' }
        }
      ],
      affectedNodes: ['revenue', 'sales', 'operations', 'customers', 'finance']
    };
  }

  res.json({ success: true, source: 'offline-intelligence-core', request: { requestId: promptEnvelope.requestId, promptChars: promptEnvelope.promptChars, contextChars: promptEnvelope.contextChars, promptSha256: promptEnvelope.promptSha256 }, data: result });
});

function evaluatePolicyGate(input: {
  actionId: unknown;
  title: unknown;
  targetSystem: unknown;
  authorizedBy: unknown;
  parameters: unknown;
  humanApproval: unknown;
  requiresApproval: unknown;
  riskLevel: unknown;
}) {
  const security = evaluateSecurityRequest(input);
  if (!security.allowed) return security.reason;

  const allowedTargets = (process.env.EXECUTION_ALLOWED_TARGETS || '')
    .split(',')
    .map((target) => target.trim())
    .filter(Boolean);
  if (allowedTargets.length > 0 && !allowedTargets.includes(String(input.targetSystem))) {
    return `Target system "${String(input.targetSystem)}" is not allowlisted by Policy Gate.`;
  }
  return null;
}

// Durable execution runtime. AI proposals never execute directly; an approved action must
// pass the Policy Gate and a configured adapter must verify the external mutation.
app.get('/api/actions/executions', (_req, res) => {
  res.json({ success: true, executionRecords: getExecutionRecords() });
});

app.post('/api/actions/execute', async (req, res) => {
  const { actionId, title, targetSystem, authorizedBy, parameters, humanApproval, idempotencyKey, requiresApproval, riskLevel } = req.body ?? {};
  const policyError = evaluatePolicyGate({ actionId, title, targetSystem, authorizedBy, parameters, humanApproval, requiresApproval, riskLevel });
  if (policyError) {
    return res.status(403).json({ success: false, error: `Policy Gate denied the action: ${policyError}` });
  }
  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return res.status(400).json({ success: false, error: 'An idempotency key is required for execution.' });
  }

  try {
    const result = await commitExecution({
      actionId,
      title,
      targetSystem,
      authorizedBy,
      parameters: parameters || {},
      idempotencyKey,
    });
    if (!result.duplicate) {
      recordVerifiedExecution(actionId, targetSystem);
    }
    return res.json({
      success: true,
      duplicate: result.duplicate,
      message: result.duplicate
        ? 'Idempotent execution request resolved to an existing verified execution.'
        : `Action "${title}" was verified and committed by the configured execution adapter.`,
      executionRecord: result.record,
    });
  } catch (error: any) {
    if (typeof actionId === 'string' && typeof targetSystem === 'string') {
      recordVerificationFailure(actionId, targetSystem, error?.message || 'Execution adapter rejected the mutation.');
    }
    return res.status(503).json({
      success: false,
      error: error?.message || 'Execution adapter rejected the mutation. No ledger commit was recorded.',
    });
  }
});

app.post('/api/actions/rollback', async (req, res) => {
  const { executionId, humanApproval } = req.body ?? {};
  if (!executionId || humanApproval !== true) {
    return res.status(400).json({ success: false, error: 'Rollback requires an execution ID and explicit human approval.' });
  }
  if (!getExecutionById(executionId)) {
    return res.status(404).json({ success: false, error: 'Execution record not found.' });
  }

  try {
    const rolledBack = await rollbackExecution(executionId);
    return res.json({ success: true, executionRecord: rolledBack });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      error: error?.message || 'Rollback adapter rejected the reversal. The prior ledger event remains unchanged.',
    });
  }
});

// Security Layer API
app.get('/api/security/status', (_req, res) => res.json({ success:true, status:getSecurityStatus(), events:getSecurityEvents().slice(0,80), incidents:detectIncidents() }));
app.get('/api/security/events', (req, res) => {
  const limit=Math.min(Math.max(Number(req.query.limit)||80,1),500);
  const severity=typeof req.query.severity==='string'?req.query.severity:undefined;
  res.json({success:true,events:getSecurityEvents().filter(e=>!severity||e.severity===severity).slice(0,limit)});
});
app.get('/api/security/integrity', (_req,res)=>{const integrity=getSecurityIntegrity();res.status(integrity.valid?200:503).json({success:integrity.valid,integrity});});
app.get('/api/security/policies', (_req,res)=>res.json({success:true,policy:{authorization:'SERVER_AUTHORITATIVE',humanApprovalRequired:true,failClosed:true,executionModel:'AI_DECIDES != AI_EXECUTES'}}));
app.get('/api/security/incidents', (_req,res)=>res.json({success:true,incidents:detectIncidents()}));
app.post('/api/security/incidents/:incidentId/transition',(req,res)=>{
 const {status,authorizedBy}=req.body??{};
 if(!['ACKNOWLEDGED','CONTAINED','RESOLVED'].includes(status)||typeof authorizedBy!=='string'||!authorizedBy.trim())return res.status(400).json({success:false,error:'Valid status and authorizedBy required.'});
 try{return res.json({success:true,incident:updateIncident(req.params.incidentId,status,authorizedBy)});}catch(error:any){return res.status(403).json({success:false,error:error?.message||'Incident transition denied.'});}
});
app.post('/api/security/operator-action',async (req,res)=>{
 const {action,targetResource,authorizedBy,humanApproval,parameters,executionId}=req.body??{};
 const allowed=new Set(['acknowledge','deny','revoke','isolate','quarantine','investigate','rollback']);
 if(!allowed.has(action)||typeof authorizedBy!=='string'||!authorizedBy.trim()||humanApproval!==true)return res.status(403).json({success:false,error:'Supported action, identity, and explicit human approval are required.'});
 const policy=evaluateSecurityRequest({actionId:'security_'+action,title:'Security operator '+action,targetSystem:'Business OS Security Response',authorizedBy,parameters:parameters&&typeof parameters==='object'?parameters:{},humanApproval:true,requiresApproval:true,riskLevel:['isolate','quarantine','revoke','rollback'].includes(action)?'high':'medium',sessionId:typeof req.header('x-session-id')==='string'?req.header('x-session-id')||undefined:undefined,targetResource:typeof targetResource==='string'?targetResource:undefined});
 if(!policy.allowed)return res.status(403).json({success:false,error:'Security Policy Gate denied the operator action: '+policy.reason});
 appendSecurityEvent({eventType:'OPERATOR_SECURITY_ACTION_REQUESTED',severity:['isolate','quarantine','revoke'].includes(action)?'HIGH':'MEDIUM',actorId:authorizedBy,targetResource:typeof targetResource==='string'?targetResource:undefined,description:'Authorized operator requested security action: '+action,metadata:{action,humanApproval:true}});
 try{
   if(action==='acknowledge'||action==='investigate') return res.json({success:true,verified:true,accepted:true,action});
   if(action==='rollback'){
     if(typeof executionId!=='string'||!executionId)return res.status(400).json({success:false,error:'executionId is required for rollback.'});
     return res.json({success:true,...await executeRollbackResponse(executionId,authorizedBy)});
   }
   if(typeof targetResource!=='string'||!targetResource.trim())return res.status(400).json({success:false,error:'targetResource is required for external security response actions.'});
   return res.json({success:true,...await executeSecurityResponse({action,targetResource,authorizedBy,parameters:parameters&&typeof parameters==='object'?parameters:{}})});
 }catch(error:any){
   appendSecurityEvent({eventType:'SECURITY_RESPONSE_FAILURE',severity:'CRITICAL',actorId:authorizedBy,targetResource:typeof targetResource==='string'?targetResource:undefined,verification:'FAILED',policyDecision:'ALLOW',description:error?.message||'Security response execution failed.'});
   return res.status(503).json({success:false,error:error?.message||'Security response failed closed.'});
 }
});
app.post('/api/security/provenance/create',(req,res)=>{
 const {subject,payload,source,authorizedBy}=req.body??{};
 if(typeof subject!=='string'||typeof source!=='string'||payload===undefined||typeof authorizedBy!=='string')return res.status(400).json({success:false,error:'subject, payload, source, and authorizedBy are required.'});
 return res.json({success:true,record:createProvenanceRecord({subject,payload,source,authorizedBy})});
});
app.post('/api/security/vault/provenance/create',(req,res)=>{
 const {manifest,authorizedBy}=req.body??{};
 if(!manifest||typeof authorizedBy!=='string'||!authorizedBy.trim())return res.status(400).json({success:false,error:'manifest and authorizedBy are required.'});
 try{return res.json({success:true,record:createVaultProvenance({manifest,authorizedBy})});}catch(error:any){return res.status(400).json({success:false,error:error?.message||'Vault provenance rejected.'});}
});
app.post('/api/security/vault/provenance/verify',(req,res)=>{
 const {record,manifest}=req.body??{};
 if(!record||!manifest)return res.status(400).json({success:false,error:'record and manifest are required.'});
 try{const verification=verifyVaultProvenance(record,manifest);return res.status(verification.valid?200:409).json({success:verification.valid,verification});}catch(error:any){return res.status(400).json({success:false,error:error?.message||'Vault provenance verification failed.'});}
});
app.post('/api/security/provenance/verify',(req,res)=>{
 const {record,payload}=req.body??{};
 if(!record||payload===undefined)return res.status(400).json({success:false,error:'record and payload are required.'});
 const verification=verifyProvenanceRecord(record,payload);return res.status(verification.valid?200:409).json({success:verification.valid,verification});
});

// Production static file serving or Vite dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Business OS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
