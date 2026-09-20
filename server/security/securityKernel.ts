import { appendSecurityEvent, SecurityEvent, SecurityPolicyDecision, SecurityVerification, verifySecurityLedger } from './securityEvents.js';

export type SecurityState =
  | 'SECURE'
  | 'MONITORING'
  | 'ANOMALY'
  | 'POLICY_BLOCK'
  | 'REQUIRES_APPROVAL'
  | 'INCIDENT'
  | 'INTEGRITY_FAILURE'
  | 'VERIFICATION_FAILURE'
  | 'OFFLINE';

export interface SecurityActionRequest {
  actionId: unknown;
  title: unknown;
  targetSystem: unknown;
  authorizedBy: unknown;
  parameters: unknown;
  humanApproval: unknown;
  requiresApproval: unknown;
  riskLevel: unknown;
  idempotencyKey?: unknown;
  agentId?: unknown;
  sessionId?: unknown;
  targetResource?: unknown;
}

export interface SecurityEvaluation {
  allowed: boolean;
  decision: SecurityPolicyDecision;
  reason: string;
  state: SecurityState;
  event: SecurityEvent;
}

const allowedRisk = new Set(['low', 'medium', 'high', 'critical']);

export function evaluateSecurityRequest(input: SecurityActionRequest): SecurityEvaluation {
  const identity = typeof input.authorizedBy === 'string' && input.authorizedBy.trim().length > 0;
  const action = typeof input.actionId === 'string' && typeof input.title === 'string' && typeof input.targetSystem === 'string';
  const parameters = !!input.parameters && typeof input.parameters === 'object' && !Array.isArray(input.parameters);
  const risk = allowedRisk.has(String(input.riskLevel));

  let decision: SecurityPolicyDecision = 'ALLOW';
  let reason = 'Security controls passed.';
  let state: SecurityState = 'SECURE';

  if (!identity) {
    decision = 'DENY';
    reason = 'Identity is required.';
    state = 'POLICY_BLOCK';
  } else if (!action) {
    decision = 'DENY';
    reason = 'Action identity is incomplete.';
    state = 'POLICY_BLOCK';
  } else if (!risk) {
    decision = 'DENY';
    reason = 'Unsupported risk level.';
    state = 'POLICY_BLOCK';
  } else if (!parameters) {
    decision = 'DENY';
    reason = 'Action parameters must be a JSON object.';
    state = 'POLICY_BLOCK';
  } else if (input.requiresApproval !== true || input.humanApproval !== true) {
    decision = 'REQUIRE_HUMAN';
    reason = 'Explicit human approval is required.';
    state = 'REQUIRES_APPROVAL';
  }

  const event = appendSecurityEvent({
    eventType: decision === 'ALLOW' ? 'SECURITY_AUTHORIZATION' : 'SECURITY_POLICY_DECISION',
    severity: decision === 'DENY' ? 'HIGH' : decision === 'REQUIRE_HUMAN' ? 'MEDIUM' : 'INFO',
    actorId: typeof input.authorizedBy === 'string' ? input.authorizedBy : undefined,
    actionId: typeof input.actionId === 'string' ? input.actionId : undefined,
    targetSystem: typeof input.targetSystem === 'string' ? input.targetSystem : undefined,
    agentId: typeof input.agentId === 'string' ? input.agentId : undefined,
    sessionId: typeof input.sessionId === 'string' ? input.sessionId : undefined,
    targetResource: typeof input.targetResource === 'string' ? input.targetResource : undefined,
    policyDecision: decision,
    verification: 'NOT_APPLICABLE',
    description: reason,
    metadata: { riskLevel: input.riskLevel, requiresApproval: input.requiresApproval },
  });

  return { allowed: decision === 'ALLOW', decision, reason, state, event };
}

export function recordVerificationFailure(actionId: string, targetSystem: string, description: string) {
  return appendSecurityEvent({
    eventType: 'VERIFICATION_FAILURE',
    severity: 'CRITICAL',
    actionId,
    targetSystem,
    policyDecision: 'ALLOW',
    verification: 'FAILED',
    description,
  });
}

export function recordVerifiedExecution(actionId: string, targetSystem: string) {
  return appendSecurityEvent({
    eventType: 'VERIFIED_EXECUTION',
    severity: 'INFO',
    actionId,
    targetSystem,
    policyDecision: 'ALLOW',
    verification: 'VERIFIED',
    description: 'External mutation was verified and committed.',
  });
}

export function getSecurityStatus() {
  const ledger = verifySecurityLedger();
  if (!ledger.valid) {
    return {
      state: 'INTEGRITY_FAILURE' as SecurityState,
      ledger,
      timestamp: new Date().toISOString(),
    };
  }
  const events = ledger.eventCount;
  return {
    state: events === 0 ? 'MONITORING' as SecurityState : 'SECURE' as SecurityState,
    ledger,
    timestamp: new Date().toISOString(),
  };
}

export function getSecurityIntegrity() {
  return verifySecurityLedger();
}
