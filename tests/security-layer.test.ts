import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'business-os-security-'));
process.env.BUSINESS_OS_DATA_DIR = temp;

const { evaluateSecurityRequest, getSecurityStatus, getSecurityIntegrity } = await import('../server/security/securityKernel.ts');

const denied = evaluateSecurityRequest({
  actionId: 'test-deny',
  title: 'Test action',
  targetSystem: 'Test System',
  authorizedBy: '',
  parameters: {},
  humanApproval: true,
  requiresApproval: true,
  riskLevel: 'low',
});
assert.equal(denied.allowed, false);
assert.equal(denied.decision, 'DENY');

const approval = evaluateSecurityRequest({
  actionId: 'test-approval',
  title: 'Test action',
  targetSystem: 'Test System',
  authorizedBy: 'Test Operator',
  parameters: {},
  humanApproval: false,
  requiresApproval: true,
  riskLevel: 'medium',
});
assert.equal(approval.allowed, false);
assert.equal(approval.decision, 'REQUIRE_HUMAN');

const allowed = evaluateSecurityRequest({
  actionId: 'test-allowed',
  title: 'Test action',
  targetSystem: 'Test System',
  authorizedBy: 'Test Operator',
  parameters: {},
  humanApproval: true,
  requiresApproval: true,
  riskLevel: 'low',
});
assert.equal(allowed.allowed, true);
assert.equal(allowed.decision, 'ALLOW');

assert.equal(getSecurityStatus().ledger.valid, true);
assert.equal(getSecurityIntegrity().valid, true);

console.log('Security layer integrity tests passed.');
