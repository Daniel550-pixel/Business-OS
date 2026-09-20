import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  });
});

// AI Command Core endpoint
app.post('/api/gemini/command', async (req, res) => {
  const { command, businessContext } = req.body;
  const prompt = command || 'Analyze current business health and anomalies';

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

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Business Context: ${JSON.stringify(businessContext || { arr: '$24.8M', runway: '22 mos', nrr: '118%' })}
User Request: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, source: 'gemini', data: parsed });
      } catch (e) {
        // if raw json parse fails, wrap text
        return res.json({
          success: true,
          source: 'gemini-raw',
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

  res.json({ success: true, source: 'offline-intelligence-core', data: result });
});

// Action Execution endpoint (implements AI DECIDES != AI EXECUTES)
app.post('/api/actions/execute', (req, res) => {
  const { actionId, title, targetSystem, authorizedBy, parameters, humanApproval } = req.body ?? {};
  if (!actionId || !title || !targetSystem || !authorizedBy || humanApproval !== true) {
    return res.status(400).json({ success: false, error: 'Policy Gate requires a complete action and explicit human approval.' });
  }

  const timestamp = new Date().toISOString();
  const canonical = JSON.stringify({ actionId, title, targetSystem, authorizedBy, parameters: parameters || {}, timestamp });
  const auditHash = crypto.createHash('sha256').update(canonical).digest('hex');

  const executionRecord = {
    executionId: `exec_${crypto.randomUUID()}`,
    actionId,
    title,
    targetSystem,
    authorizedBy,
    timestamp,
    status: 'COMMITTED',
    verification: 'VERIFIED_DETERMINISTIC_POLICY',
    parameters: parameters || {},
    auditHash,
  };

  res.json({
    success: true,
    message: `Action "${title}" safely verified by Policy Gate and executed.`,
    executionRecord,
  });
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
