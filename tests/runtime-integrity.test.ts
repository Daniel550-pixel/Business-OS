import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.BUSINESS_OS_DATA_DIR = mkdtempSync(path.join(os.tmpdir(), 'business-os-ledger-'));
process.env.EXECUTION_WEBHOOK_URL = 'http://127.0.0.1:1';

const runtime = await import('../server/actionRuntime.ts');

assert.equal(runtime.getExecutionRecords().length, 0);
assert.equal(runtime.getExecutionAdapter() !== null, true);

const source = readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
assert.equal(source.includes('temperature:'), false, 'Gemini 3.8 must not send deprecated temperature config');
assert.equal(source.includes('new Map<string'), false, 'execution ledger must not be an in-memory Map');

console.log('runtime-integrity: PASS');
