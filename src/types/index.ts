export type ViewMode =
  | 'command-center'
  | 'command'
  | 'business-world'
  | 'world'
  | 'missions'
  | 'agents'
  | 'finance'
  | 'sales'
  | 'operations'
  | 'customers'
  | 'research'
  | 'intelligence'
  | 'automations'
  | 'settings';

export type OperatingMode = 'executive' | 'deep-work' | 'deep_work';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface BusinessMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  sparkline: number[];
  category: 'financial' | 'sales' | 'operational' | 'customers';
}

export interface BusinessAnomaly {
  id: string;
  metric: string;
  delta: string;
  significance: 'critical' | 'warning' | 'notice' | 'positive';
  description: string;
  detectedAt: string;
  relatedNodeId?: string;
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  estimatedValue: string;
  confidence: number;
  timeHorizon: string;
  description: string;
  recommendedAgent: string;
  actionRequired: string;
}

export interface ProposedAction {
  id: string;
  title: string;
  description?: string;
  riskLevel: RiskLevel;
  targetSystem: string;
  requiresApproval: boolean;
  status: 'PROPOSED' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  parameters?: Record<string, any>;
  authorizedBy?: string;
  executionTimestamp?: string;
  auditHash?: string;
}

export interface MissionStep {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  assignedAgent: string;
  details?: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  status: 'active' | 'investigating' | 'completed' | 'needs_approval';
  leadAgent: string;
  collaboratingAgents: string[];
  progress: number;
  startedAt: string;
  steps: MissionStep[];
  findings: string[];
  recommendations: string[];
  proposedActions: ProposedAction[];
  priority: 'urgent' | 'high' | 'medium';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  domain: string;
  status: 'active' | 'analyzing' | 'idle' | 'standby';
  confidence: number;
  currentMission?: string;
  capabilities: string[];
  tools: string[];
  context: string;
  policies: string[];
  permissions: {
    canAnalyze: boolean;
    canPropose: boolean;
    canAutoExecute: boolean;
    executionCap?: string;
  };
  memoryTokens: string;
  recentOutputs: {
    id: string;
    text: string;
    timestamp: string;
    type: 'finding' | 'alert' | 'decision';
  }[];
}

export interface WorldNode {
  id: string;
  label: string;
  type: 'revenue' | 'customers' | 'sales' | 'operations' | 'projects' | 'agents' | 'finance' | 'systems';
  status: 'optimal' | 'warning' | 'critical' | 'active';
  x: number;
  y: number;
  metric: string;
  subMetric: string;
  connections: string[];
  description: string;
  details: {
    keyDrivers: string[];
    riskScore: number;
    headcountOrCapacity: string;
    activeAnomalies: number;
    ownerAgent: string;
  };
}

export interface IntelligenceEvent {
  id: string;
  type: 'anomaly' | 'opportunity' | 'customer_change' | 'revenue_change' | 'market_signal' | 'operational_issue' | 'agent_finding' | 'security_event' | 'action_executed';
  title?: string;
  summary: string;
  severity: 'critical' | 'high' | 'warning' | 'medium' | 'low' | 'info';
  timestamp: string;
  source: string;
  impactNode?: string;
  actionable: boolean;
  proposedActionId?: string;
  domain?: string;
  details?: string;
  recommendedAction?: string;
  entityId?: string;
}

export interface ExecutionRecord {
  executionId?: string;
  id?: string;
  actionId?: string;
  actionTitle?: string;
  title?: string;
  targetSystem: string;
  authorizedBy: string;
  timestamp: string;
  status: 'COMMITTED' | 'FAILED' | 'ROLLED_BACK';
  verification?: string;
  parameters?: Record<string, any>;
  auditHash?: string;
  hash?: string;
  reversible?: boolean;
}

export interface AICommandResponse {
  title: string;
  analysis: string;
  confidence: number;
  recommendations: string[];
  anomalies: {
    metric: string;
    delta: string;
    significance: 'critical' | 'warning' | 'notice' | 'positive';
    description: string;
  }[];
  mission: {
    title: string;
    objective: string;
    leadAgent: string;
    collaboratingAgents: string[];
    steps: string[];
  };
  proposedActions: ProposedAction[];
  affectedNodes?: string[];
}
