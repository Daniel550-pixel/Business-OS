import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type ExecutionStatus = 'COMMITTED' | 'ROLLED_BACK';

export interface ExecutionRecord {
  executionId: string;
  actionId: string;
  title: string;
  targetSystem: string;
  authorizedBy: string;
  timestamp: string;
  status: ExecutionStatus;
  verification: string;
  parameters: Record<string, unknown>;
  auditHash: string;
  previousAuditHash: string | null;
  idempotencyKey: string;
}

interface LedgerEvent {
  type: 'EXECUTION_COMMITTED' | 'EXECUTION_ROLLED_BACK';
  record: ExecutionRecord;
}

export interface ExecutionAdapter {
  execute(input: {
    executionId: string;
    actionId: string;
    title: string;
    targetSystem: string;
    parameters: Record<string, unknown>;
  }): Promise<{ verified: boolean; details?: string }>;
  rollback(record: ExecutionRecord): Promise<{ verified: boolean; details?: string }>;
}

class WebhookExecutionAdapter implements ExecutionAdapter {
  private readonly url: string;
  private readonly secret?: string;

  constructor(url: string, secret?: string) {
    this.url = url;
    this.secret = secret;
  }

  private async call(operation: 'execute' | 'rollback', payload: Record<string, unknown>) {
    const body = JSON.stringify({ operation, ...payload });
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.secret) {
      headers['x-business-os-signature'] = crypto.createHmac('sha256', this.secret).update(body).digest('hex');
    }

    const response = await fetch(this.url, { method: 'POST', headers, body });
    let data: { verified?: boolean; details?: string } = {};
    try {
      data = await response.json() as typeof data;
    } catch {
      // A non-JSON response cannot be treated as verified.
    }

    return {
      verified: response.ok && data.verified === true,
      details: data.details || `adapter_http_${response.status}`,
    };
  }

  execute(input: {
    executionId: string;
    actionId: string;
    title: string;
    targetSystem: string;
    parameters: Record<string, unknown>;
  }) {
    return this.call('execute', input);
  }

  rollback(record: ExecutionRecord) {
    return this.call('rollback', {
      executionId: record.executionId,
      actionId: record.actionId,
      title: record.title,
      targetSystem: record.targetSystem,
      parameters: record.parameters,
    });
  }
}

const dataRoot = process.env.BUSINESS_OS_DATA_DIR || path.join(process.cwd(), 'data');
const ledgerPath = path.join(dataRoot, 'execution-ledger.jsonl');

function ensureLedger() {
  mkdirSync(dataRoot, { recursive: true });
  if (!existsSync(ledgerPath)) appendFileSync(ledgerPath, '');
}

function auditHashFor(eventType: LedgerEvent['type'], record: ExecutionRecord) {
  if (eventType === 'EXECUTION_COMMITTED') {
    return hashRecord({
      event: eventType,
      executionId: record.executionId,
      actionId: record.actionId,
      targetSystem: record.targetSystem,
      authorizedBy: record.authorizedBy,
      timestamp: record.timestamp,
      parameters: record.parameters,
      previousAuditHash: record.previousAuditHash,
    });
  }
  return hashRecord({
    event: eventType,
    executionId: record.executionId,
    actionId: record.actionId,
    rollbackTimestamp: record.timestamp,
    previousAuditHash: record.previousAuditHash,
  });
}

function loadEvents(): LedgerEvent[] {
  ensureLedger();
  const raw = readFileSync(ledgerPath, 'utf8');
  if (!raw.trim()) return [];
  const events = raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as LedgerEvent);
  let previousHash: string | null = null;
  for (const event of events) {
    if (event.record.previousAuditHash !== previousHash || event.record.auditHash !== auditHashFor(event.type, event.record)) {
      throw new Error('Execution ledger integrity check failed: hash chain is inconsistent or tampered.');
    }
    previousHash = event.record.auditHash;
  }
  return events;
}

function appendEvent(event: LedgerEvent) {
  ensureLedger();
  appendFileSync(ledgerPath, JSON.stringify(event) + '\n', 'utf8');
}

function currentRecords(): ExecutionRecord[] {
  const records = new Map<string, ExecutionRecord>();
  for (const event of loadEvents()) records.set(event.record.executionId, event.record);
  return [...records.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function hashRecord(input: Record<string, unknown>) {
  return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
}

export function getExecutionRecords() {
  return currentRecords();
}

export function getExecutionById(executionId: string) {
  return currentRecords().find((record) => record.executionId === executionId);
}

export function getExecutionAdapter(): ExecutionAdapter | null {
  const url = process.env.EXECUTION_WEBHOOK_URL;
  if (!url) return null;
  return new WebhookExecutionAdapter(url, process.env.EXECUTION_WEBHOOK_SECRET);
}

export async function commitExecution(input: {
  actionId: string;
  title: string;
  targetSystem: string;
  authorizedBy: string;
  parameters: Record<string, unknown>;
  idempotencyKey: string;
}) {
  const existing = currentRecords().find(
    (record) => record.status === 'COMMITTED' && record.idempotencyKey === input.idempotencyKey
  );
  if (existing) return { record: existing, duplicate: true };

  const adapter = getExecutionAdapter();
  if (!adapter) {
    throw new Error('No execution adapter configured. Set EXECUTION_WEBHOOK_URL before allowing external mutations.');
  }

  const executionId = `exec_${crypto.randomUUID()}`;
  const verification = await adapter.execute({
    executionId,
    actionId: input.actionId,
    title: input.title,
    targetSystem: input.targetSystem,
    parameters: input.parameters,
  });

  if (!verification.verified) {
    throw new Error(`Execution adapter did not verify the mutation: ${verification.details || 'unknown verification failure'}`);
  }

  const timestamp = new Date().toISOString();
  const previousAuditHash = loadEvents().at(-1)?.record.auditHash || null;
  const record: ExecutionRecord = {
    executionId,
    actionId: input.actionId,
    title: input.title,
    targetSystem: input.targetSystem,
    authorizedBy: input.authorizedBy,
    timestamp,
    status: 'COMMITTED',
    verification: 'ADAPTER_VERIFIED',
    parameters: input.parameters,
    idempotencyKey: input.idempotencyKey,
    previousAuditHash,
    auditHash: hashRecord({
      event: 'EXECUTION_COMMITTED',
      executionId,
      actionId: input.actionId,
      targetSystem: input.targetSystem,
      authorizedBy: input.authorizedBy,
      timestamp,
      parameters: input.parameters,
      previousAuditHash,
    }),
  };

  appendEvent({ type: 'EXECUTION_COMMITTED', record });
  return { record, duplicate: false };
}

export async function rollbackExecution(executionId: string) {
  const record = getExecutionById(executionId);
  if (!record) throw new Error('Execution record not found.');
  if (record.status !== 'COMMITTED') throw new Error('Execution is not currently committed.');

  const adapter = getExecutionAdapter();
  if (!adapter) throw new Error('No execution adapter configured. Rollback is disabled until an execution adapter is configured.');

  const verification = await adapter.rollback(record);
  if (!verification.verified) {
    throw new Error(`Rollback adapter did not verify the reversal: ${verification.details || 'unknown verification failure'}`);
  }

  const rollbackTimestamp = new Date().toISOString();
  const previousAuditHash = loadEvents().at(-1)?.record.auditHash || null;
  const rolledBack: ExecutionRecord = {
    ...record,
    status: 'ROLLED_BACK',
    timestamp: rollbackTimestamp,
    verification: 'ROLLBACK_ADAPTER_VERIFIED',
    idempotencyKey: record.idempotencyKey,
    previousAuditHash,
    auditHash: hashRecord({
      event: 'EXECUTION_ROLLED_BACK',
      executionId,
      actionId: record.actionId,
      rollbackTimestamp,
      previousAuditHash,
    }),
  };

  appendEvent({ type: 'EXECUTION_ROLLED_BACK', record: rolledBack });
  return rolledBack;
}
