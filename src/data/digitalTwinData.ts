import type { FocusObjective, HierarchyEntity, ScenarioModel, TemporalEpoch } from '../types';

const recoveryAction = {
  id:'act_recovery_01',
  title:'Launch enterprise expansion recovery sequence',
  description:'Coordinate account, sales and finance follow-up for the affected enterprise segment.',
  riskLevel:'medium' as const,
  targetSystem:'CRM & Revenue Operations',
  requiresApproval:true,
  status:'PROPOSED' as const,
  parameters:{worldEntity:'revenue',workflow:'enterprise-expansion-recovery'},
};

export const initialHierarchyEntities: HierarchyEntity[] = [
  { id:'company_core', level:'company', name:'Business OS Enterprise', code:'BOS-001', status:'optimal', revenueOrMetric:'€2.84M', metricLabel:'ARR', healthScore:92, headcountOrCapacity:'128 capacity', summary:'Central enterprise operating model and AI runtime.', ownerAgent:'CEO Agent', signals:[{label:'ARR growth',trend:'up',type:'growth'},{label:'Policy integrity',trend:'up',type:'operational'}], activeAgents:['CEO Agent','Revenue Agent','Sales Agent'], childrenCount:3, evidence:{transactionsCount:18240,crmEventsCount:9420,historicalComparisons:12,primaryFactors:[{name:'Revenue velocity',weight:0.42,impact:'positive'},{name:'Operational stability',weight:0.31,impact:'positive'}],traces:[{id:'trace_01',timestamp:'08:42:10',text:'Revenue and sales telemetry correlated.'}]} },
  { id:'revenue_division', level:'division', parentId:'company_core', name:'Revenue', code:'REV-01', status:'warning', revenueOrMetric:'€2.84M', metricLabel:'ARR', healthScore:72, headcountOrCapacity:'12 analysts', summary:'Revenue and enterprise expansion telemetry.', ownerAgent:'Revenue Agent', signals:[{label:'Expansion velocity',trend:'down',type:'risk'},{label:'Renewal rate',trend:'up',type:'growth'}], activeAgents:['Revenue Agent'], childrenCount:2, evidence:{transactionsCount:8240,crmEventsCount:3120,historicalComparisons:8,primaryFactors:[{name:'Expansion velocity',weight:0.58,impact:'negative'},{name:'Renewal rate',weight:0.24,impact:'positive'}],traces:[{id:'trace_02',timestamp:'08:41:12',text:'Expansion anomaly detected.'}]} },
  { id:'operations_division', level:'division', parentId:'company_core', name:'Operations', code:'OPS-01', status:'warning', revenueOrMetric:'99.2%', metricLabel:'Uptime', healthScore:78, headcountOrCapacity:'34 operators', summary:'Fulfilment and operational reliability telemetry.', ownerAgent:'Ops Agent', signals:[{label:'Fulfilment latency',trend:'down',type:'risk'},{label:'Capacity',trend:'up',type:'operational'}], activeAgents:['Ops Agent'], childrenCount:1, evidence:{transactionsCount:5400,crmEventsCount:1800,historicalComparisons:6,primaryFactors:[{name:'Latency',weight:0.49,impact:'negative'}],traces:[{id:'trace_03',timestamp:'08:38:44',text:'Latency variance opened for investigation.'}]} },
  { id:'enterprise_ops', level:'operation', parentId:'revenue_division', name:'Enterprise Expansion', code:'REV-ENT', status:'critical', revenueOrMetric:'-14.8%', metricLabel:'Expansion delta', healthScore:61, headcountOrCapacity:'4 account pods', summary:'Enterprise expansion motion requiring investigation.', ownerAgent:'Revenue Agent', signals:[{label:'Expansion velocity',trend:'down',type:'risk'},{label:'Account engagement',trend:'down',type:'risk'}], activeAgents:['Revenue Agent','Sales Agent'], childrenCount:1, evidence:{transactionsCount:1240,crmEventsCount:890,historicalComparisons:5,primaryFactors:[{name:'Expansion velocity',weight:0.67,impact:'negative'},{name:'Engagement',weight:0.21,impact:'negative'}],traces:[{id:'trace_04',timestamp:'08:40:31',text:'Enterprise cohort diverged from baseline.'}]} },
  { id:'fulfilment_ops', level:'operation', parentId:'operations_division', name:'Fulfilment', code:'OPS-FUL', status:'warning', revenueOrMetric:'+9.2%', metricLabel:'Latency', healthScore:78, headcountOrCapacity:'16 operators', summary:'Fulfilment latency cluster.', ownerAgent:'Ops Agent', signals:[{label:'Latency',trend:'down',type:'risk'}], activeAgents:['Ops Agent'], childrenCount:0 },
];

export const initialFocusObjectives: FocusObjective[] = [
  { id:'focus_revenue_anomaly', title:'Enterprise expansion anomaly', metricName:'Expansion velocity', metricDelta:'-14.8%', detectedAt:'Today 08:41', causeAnalysis:[{segment:'Enterprise cohort',percentage:67,delta:'-14.8%',detail:'Largest contribution to observed variance.'},{segment:'Engagement',percentage:21,delta:'-6.1%',detail:'Lower recent engagement correlates with the anomaly.'}], findings:[{id:'f_01',number:'01',headline:'Variance is concentrated',description:'A small enterprise cohort accounts for most of the observed deviation.',confidence:92,evidenceId:'trace_04'},{id:'f_02',number:'02',headline:'Operational response is bounded',description:'No external mutation is proposed without human authorization.',confidence:98,evidenceId:'policy'}], confidence:91, recommendation:'Investigate affected enterprise accounts and prepare a controlled recovery sequence.', proposedAction:recoveryAction, affectedEntityIds:['revenue_division','enterprise_ops'] },
];

export const initialScenarioModels: ScenarioModel[] = [
  { id:'scenario_a', name:'Baseline Continuation', type:'baseline', projectedArr:'€3.08M', arrGrowth:'+8.5%', projectedRunway:'14.2 months', confidence:76, keyAssumptions:['Current retention remains stable.','Pipeline conversion remains near current baseline.'], requiredDecisions:['Maintain current hiring envelope.','Review expansion pipeline weekly.'], riskFactors:['Enterprise expansion remains below baseline.','Macro demand can shift conversion rates.'] },
  { id:'scenario_b', name:'Controlled Acceleration', type:'aggressive', projectedArr:'€3.34M', arrGrowth:'+17.6%', projectedRunway:'13.1 months', confidence:68, keyAssumptions:['Expansion recovery sequence succeeds.','Late-stage pipeline converts above baseline.'], requiredDecisions:['Authorize targeted account investment.','Increase sales capacity selectively.'], riskFactors:['Higher operating spend.','Execution depends on account response.'] },
  { id:'scenario_c', name:'Stress Test', type:'stress_test', projectedArr:'€2.51M', arrGrowth:'-11.6%', projectedRunway:'18.6 months', confidence:72, keyAssumptions:['Expansion remains constrained.','Pipeline conversion declines.'], requiredDecisions:['Freeze non-critical spend.','Increase liquidity monitoring.'], riskFactors:['Lower expansion revenue.','Potential capacity under-utilization.'] },
];

export const initialTemporalSnapshots: Record<TemporalEpoch, {
  arr:string; runway:string; customers:string; simulationNotice:boolean; keyEvent:string;
}> = {
  JAN:{arr:'€2.31M',runway:'11.8 months',customers:'1,120',simulationNotice:false,keyEvent:'Baseline captured'},
  FEB:{arr:'€2.38M',runway:'12.1 months',customers:'1,145',simulationNotice:false,keyEvent:'Retention stabilized'},
  MAR:{arr:'€2.42M',runway:'12.4 months',customers:'1,168',simulationNotice:false,keyEvent:'Pipeline expanded'},
  APR:{arr:'€2.51M',runway:'12.8 months',customers:'1,201',simulationNotice:false,keyEvent:'Enterprise cohort expanded'},
  MAY:{arr:'€2.63M',runway:'13.1 months',customers:'1,226',simulationNotice:false,keyEvent:'Expansion velocity improved'},
  JUN:{arr:'€2.71M',runway:'13.4 months',customers:'1,251',simulationNotice:false,keyEvent:'Operational stability improved'},
  NOW:{arr:'€2.84M',runway:'13.7 months',customers:'1,284',simulationNotice:false,keyEvent:'Enterprise expansion anomaly detected'},
  SIM_3M:{arr:'€3.08M',runway:'14.2 months',customers:'1,350',simulationNotice:true,keyEvent:'Baseline scenario projection'},
  SIM_6M:{arr:'€3.34M',runway:'13.1 months',customers:'1,430',simulationNotice:true,keyEvent:'Controlled acceleration projection'},
};
