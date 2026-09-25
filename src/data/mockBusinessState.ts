import type {
  Agent,
  AIActivityTick,
  BusinessAnomaly,
  BusinessMetric,
  BusinessOpportunity,
  ExecutionRecord,
  IntelligenceEvent,
  Mission,
  ProposedAction,
  WorldNode,
} from '../types';

export const initialMetrics: BusinessMetric[] = [
  { id:'arr', label:'Annual Recurring Revenue', value:'€2.84M', change:'+8.4%', isPositive:true, timeframe:'vs. prior period', sparkline:[2.31,2.38,2.42,2.51,2.63,2.71,2.84], category:'financial' },
  { id:'pipeline', label:'Qualified Pipeline', value:'€1.18M', change:'+12.1%', isPositive:true, timeframe:'30 days', sparkline:[.71,.78,.82,.91,.96,1.04,1.18], category:'sales' },
  { id:'retention', label:'Customer Retention', value:'94.6%', change:'+1.7%', isPositive:true, timeframe:'rolling 90 days', sparkline:[91.8,92.4,92.1,93.0,93.5,94.0,94.6], category:'customers' },
  { id:'uptime', label:'Operational Uptime', value:'99.2%', change:'-0.2%', isPositive:false, timeframe:'30 days', sparkline:[99.7,99.6,99.5,99.4,99.3,99.1,99.2], category:'operational' },
];

export const initialAnomalies: BusinessAnomaly[] = [
  { id:'anom_revenue_01', metric:'Enterprise Expansion Rate', delta:'-14.8%', significance:'critical', description:'Expansion activity in two enterprise accounts is below the established baseline.', detectedAt:'08:41:12', relatedNodeId:'revenue' },
  { id:'anom_ops_01', metric:'Fulfilment Latency', delta:'+9.2%', significance:'warning', description:'Average fulfilment latency increased across the operations cluster.', detectedAt:'08:38:44', relatedNodeId:'operations' },
  { id:'anom_sales_01', metric:'Proposal Conversion', delta:'+6.3%', significance:'positive', description:'Proposal conversion is trending above the current operating baseline.', detectedAt:'08:31:07', relatedNodeId:'sales' },
];

export const initialOpportunities: BusinessOpportunity[] = [
  { id:'opp_01', title:'Enterprise expansion recovery', estimatedValue:'€420K', confidence:88, timeHorizon:'30–60 days', description:'Recover delayed expansion motions through targeted account intervention.', recommendedAgent:'Revenue Agent', actionRequired:'Review affected accounts' },
  { id:'opp_02', title:'Pipeline acceleration', estimatedValue:'€185K', confidence:81, timeHorizon:'14–30 days', description:'Prioritize late-stage opportunities with high engagement signals.', recommendedAgent:'Sales Agent', actionRequired:'Re-sequence follow-ups' },
];

const proposedRecoveryAction: ProposedAction = {
  id:'act_recovery_01',
  title:'Launch enterprise expansion recovery sequence',
  description:'Coordinate account, sales and finance follow-up for the affected enterprise segment.',
  riskLevel:'medium',
  targetSystem:'CRM & Revenue Operations',
  requiresApproval:true,
  status:'PROPOSED',
  parameters:{ worldEntity:'revenue', workflow:'enterprise-expansion-recovery' },
};

export const initialMissions: Mission[] = [
  {
    id:'mission_revenue_01',
    title:'Investigate revenue expansion anomaly',
    objective:'Identify the operational causes behind the enterprise expansion slowdown and prepare a policy-gated response.',
    status:'investigating',
    leadAgent:'Revenue Agent',
    collaboratingAgents:['Sales Agent','Finance Agent'],
    progress:42,
    startedAt:'Today 08:41',
    priority:'urgent',
    steps:[
      { id:'step_01', title:'Correlate account telemetry', status:'completed', assignedAgent:'Revenue Agent' },
      { id:'step_02', title:'Compare historical conversion patterns', status:'in_progress', assignedAgent:'Sales Agent' },
      { id:'step_03', title:'Prepare response proposal', status:'pending', assignedAgent:'Finance Agent' },
    ],
    findings:['Expansion velocity diverged from the recent enterprise baseline.','The largest variance is concentrated in a small set of accounts.'],
    recommendations:['Inspect affected account journeys before authorizing external actions.'],
    proposedActions:[proposedRecoveryAction],
  },
];

export const initialAgents: Agent[] = [
  { id:'agent_ceo', name:'CEO Agent', role:'Executive Orchestrator', avatar:'CEO', domain:'strategy', status:'active', confidence:94, capabilities:['orchestration','prioritization','decision synthesis'], tools:['Business OS','Policy Gate','Execution Ledger'], context:'Cross-domain executive context.', policies:['human approval for external mutations'], permissions:{canAnalyze:true,canPropose:true,canAutoExecute:false,executionCap:'proposal only'}, memoryTokens:'128K', recentOutputs:[{id:'out_01',text:'Correlated revenue and sales telemetry.',timestamp:'08:42:10',type:'finding'}] },
  { id:'agent_revenue', name:'Revenue Agent', role:'Revenue Intelligence', avatar:'REV', domain:'revenue', status:'analyzing', confidence:91, capabilities:['revenue analysis','forecasting','anomaly detection'], tools:['CRM','Billing','Revenue Model'], context:'Revenue and expansion telemetry.', policies:['read-only until Policy Gate approval'], permissions:{canAnalyze:true,canPropose:true,canAutoExecute:false,executionCap:'none'}, memoryTokens:'96K', recentOutputs:[] },
  { id:'agent_sales', name:'Sales Agent', role:'Pipeline Intelligence', avatar:'SAL', domain:'sales', status:'active', confidence:89, capabilities:['pipeline analysis','account prioritization'], tools:['CRM','Calendar'], context:'Sales pipeline and customer signals.', policies:['human approval for outbound actions'], permissions:{canAnalyze:true,canPropose:true,canAutoExecute:false,executionCap:'proposal only'}, memoryTokens:'96K', recentOutputs:[] },
];

export const initialWorldNodes: WorldNode[] = [
  { id:'revenue', label:'Revenue', type:'revenue', status:'warning', x:-15,y:2,metric:'€2.84M',subMetric:'ARR',connections:['core','finance'],description:'Recurring revenue and expansion telemetry.',details:{keyDrivers:['Enterprise expansion','Renewal velocity'],riskScore:28,headcountOrCapacity:'12 analysts',activeAnomalies:1,ownerAgent:'Revenue Agent'} },
  { id:'sales', label:'Sales', type:'sales', status:'optimal', x:0,y:2,metric:'€1.18M',subMetric:'Pipeline',connections:['core','customers'],description:'Pipeline, proposals and conversion telemetry.',details:{keyDrivers:['Late-stage pipeline','Proposal conversion'],riskScore:18,headcountOrCapacity:'8 sellers',activeAnomalies:0,ownerAgent:'Sales Agent'} },
  { id:'customers', label:'Customers', type:'customers', status:'optimal', x:15,y:2,metric:'94.6%',subMetric:'Retention',connections:['sales','operations'],description:'Customer health and engagement telemetry.',details:{keyDrivers:['Retention','Expansion'],riskScore:12,headcountOrCapacity:'1,284 accounts',activeAnomalies:0,ownerAgent:'Customer Agent'} },
  { id:'operations', label:'Operations', type:'operations', status:'warning', x:15,y:2,metric:'99.2%',subMetric:'Uptime',connections:['core','customers'],description:'Operational performance and fulfilment telemetry.',details:{keyDrivers:['Latency','Capacity'],riskScore:31,headcountOrCapacity:'34 operators',activeAnomalies:1,ownerAgent:'Ops Agent'} },
  { id:'finance', label:'Finance', type:'finance', status:'optimal', x:-14,y:2,metric:'€2.84M',subMetric:'ARR',connections:['revenue','core'],description:'Financial state and forecast telemetry.',details:{keyDrivers:['ARR','Runway'],riskScore:9,headcountOrCapacity:'6 analysts',activeAnomalies:0,ownerAgent:'Finance Agent'} },
  { id:'core', label:'Business OS Core', type:'systems', status:'active', x:0,y:4,metric:'ONLINE',subMetric:'Runtime',connections:['revenue','sales','customers','operations','finance'],description:'Central AI orchestration and policy runtime.',details:{keyDrivers:['Policy Gate','Event Ledger'],riskScore:4,headcountOrCapacity:'Runtime',activeAnomalies:0,ownerAgent:'CEO Agent'} },
];

export const initialEvents: IntelligenceEvent[] = [
  { id:'evt_01', type:'anomaly', title:'Enterprise expansion anomaly', summary:'Expansion velocity dropped below the monitored baseline.', severity:'critical', timestamp:'08:41:12', source:'Revenue Agent', impactNode:'revenue', actionable:true, proposedActionId:proposedRecoveryAction.id, entityId:'revenue' },
  { id:'evt_02', type:'market_signal', title:'Pipeline acceleration', summary:'Late-stage proposal activity is improving.', severity:'info', timestamp:'08:31:07', source:'Sales Agent', impactNode:'sales', actionable:false, entityId:'sales' },
  { id:'evt_03', type:'operational_issue', title:'Fulfilment latency', summary:'Operations latency is elevated and under investigation.', severity:'warning', timestamp:'08:38:44', source:'Ops Agent', impactNode:'operations', actionable:true, entityId:'operations' },
];

export const initialPendingActions: ProposedAction[] = [proposedRecoveryAction];

export const initialExecutionRecords: ExecutionRecord[] = [];

export const initialAIActivityStreamTicks: AIActivityTick[] = [
  { id:'tick_01', timestamp:'08:42:10', agentName:'Revenue Agent', agentRole:'Revenue Intelligence', action:'correlated enterprise expansion telemetry', target:'Revenue', category:'reasoning', confidence:91, entityId:'revenue' },
  { id:'tick_02', timestamp:'08:41:12', agentName:'CEO Agent', agentRole:'Executive Orchestrator', action:'opened anomaly investigation', target:'Business OS Core', category:'telemetry', confidence:94, entityId:'core' },
  { id:'tick_03', timestamp:'08:38:44', agentName:'Ops Agent', agentRole:'Operations Intelligence', action:'flagged fulfilment latency variance', target:'Operations', category:'reasoning', confidence:87, entityId:'operations' },
];

export const initialAIActivityStreamTicksTyped = initialAIActivityStreamTicks;
