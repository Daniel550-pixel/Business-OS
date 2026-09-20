import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.BUSINESS_OS_DATA_DIR = mkdtempSync(path.join(os.tmpdir(), 'business-os-ledger-'));

const adapterServer = createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const payload = JSON.parse(body);
  assert.ok(payload.operation === 'execute' || payload.operation === 'rollback');
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ verified: true, details: payload.operation + '_ok' }));
});

await new Promise<void>((resolve) => adapterServer.listen(0, '127.0.0.1', resolve));
const address = adapterServer.address();
if (!address || typeof address === 'string') throw new Error('Adapter test server did not bind.');
process.env.EXECUTION_WEBHOOK_URL = `http://127.0.0.1:${address.port}`;

const runtime = await import('../server/actionRuntime.ts');

assert.equal(runtime.getExecutionRecords().length, 0);

const first = await runtime.commitExecution({
  actionId: 'test_action',
  title: 'Test verified mutation',
  targetSystem: 'Test Gateway',
  authorizedBy: 'Test Operator',
  parameters: { value: 42 },
  idempotencyKey: 'test-idempotency-1',
});
assert.equal(first.duplicate, false);
assert.equal(first.record.status, 'COMMITTED');

const duplicate = await runtime.commitExecution({
  actionId: 'test_action',
  title: 'Test verified mutation',
  targetSystem: 'Test Gateway',
  authorizedBy: 'Test Operator',
  parameters: { value: 42 },
  idempotencyKey: 'test-idempotency-1',
});
assert.equal(duplicate.duplicate, true);
assert.equal(duplicate.record.executionId, first.record.executionId);

const rolledBack = await runtime.rollbackExecution(first.record.executionId);
assert.equal(rolledBack.status, 'ROLLED_BACK');
assert.equal(runtime.getExecutionRecords()[0].status, 'ROLLED_BACK');

const ledger = readFileSync(path.join(process.env.BUSINESS_OS_DATA_DIR!, 'execution-ledger.jsonl'), 'utf8');
assert.equal(ledger.trim().split(/\r?\n/).length, 2, 'ledger must be append-only');

const source = readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
assert.equal(source.includes('temperature:'), false, 'Gemini 3.8 must not send deprecated temperature config');
assert.equal(source.includes('new Map<string'), false, 'execution ledger must not be an in-memory Map');

await new Promise<void>((resolve) => adapterServer.close(() => resolve()));
console.log('runtime-integrity: PASS');
