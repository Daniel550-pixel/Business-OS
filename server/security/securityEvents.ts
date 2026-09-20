import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export type SecuritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecurityPolicyDecision = 'ALLOW' | 'DENY' | 'REQUIRE_HUMAN';
export type SecurityVerification = 'VERIFIED' | 'FAILED' | 'PENDING' | 'NOT_APPLICABLE';

export interface SecurityEvent {
  eventId: string;
  eventType: string;
  severity: SecuritySeverity;
  timestamp: string;
  actorId?: string;
  agentId?: string;
  sessionId?: string;
  actionId?: string;
  targetSystem?: string;
  targetResource?: string;
  policyDecision?: SecurityPolicyDecision;
  verification?: SecurityVerification;
  description: string;
  metadata?: Record<string, unknown>;
  previousEventHash?: string;
  eventHash: string;
}

const dataDir = process.env.BUSINESS_OS_DATA_DIR || path.join(process.cwd(), '.business-os-data');
const ledgerPath = path.join(dataDir, 'security-events.jsonl');

function hashEvent(event: Omit<SecurityEvent, 'eventHash'>): string {
  return createHash('sha256').update(JSON.stringify(event)).digest('hex');
}

function readEvents(): SecurityEvent[] {
  if (!fs.existsSync(ledgerPath)) return [];
  const lines = fs.readFileSync(ledgerPath, 'utf8').split(/\r?\n/).filter(Boolean);
  let previous: string | undefined;
  return lines.map((line, index) => {
    const event = JSON.parse(line) as SecurityEvent;
    if (event.previousEventHash !== previous) {
      throw new Error(`Security event ledger integrity failure at record ${index}.`);
    }
    const { eventHash, ...unsigned } = event;
    if (hashEvent(unsigned) !== eventHash) {
      throw new Error(`Security event hash mismatch at record ${index}.`);
    }
    previous = eventHash;
    return event;
  });
}

export function appendSecurityEvent(input: Omit<SecurityEvent, 'eventId' | 'timestamp' | 'previousEventHash' | 'eventHash'>): SecurityEvent {
  const events = readEvents();
  const timestamp = new Date().toISOString();
  const unsigned: Omit<SecurityEvent, 'eventHash'> = {
    ...input,
    eventId: `sec_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    timestamp,
    previousEventHash: events.at(-1)?.eventHash,
  };
  const event: SecurityEvent = { ...unsigned, eventHash: hashEvent(unsigned) };
  fs.mkdirSync(dataDir, { recursive: true });
  fs.appendFileSync(ledgerPath, JSON.stringify(event) + '\n', 'utf8');
  return event;
}

export function getSecurityEvents(): SecurityEvent[] {
  return readEvents().reverse();
}

export function verifySecurityLedger(): { valid: boolean; eventCount: number; latestHash?: string; error?: string } {
  try {
    const events = readEvents();
    return { valid: true, eventCount: events.length, latestHash: events.at(-1)?.eventHash };
  } catch (error: any) {
    return { valid: false, eventCount: 0, error: error?.message || 'Security ledger verification failed.' };
  }
}
