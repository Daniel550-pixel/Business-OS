import { createHash } from 'node:crypto';

export interface ProvenanceRecord {
  version: 1;
  subject: string;
  source: string;
  createdAt: string;
  authorizedBy: string;
  payloadHash: string;
}

function hash(payload: unknown) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function createProvenanceRecord(input: {subject:string;payload:unknown;source:string;authorizedBy:string}): ProvenanceRecord {
  return { version:1, subject:input.subject, source:input.source, createdAt:new Date().toISOString(), authorizedBy:input.authorizedBy, payloadHash:hash(input.payload) };
}

export function verifyProvenanceRecord(record: ProvenanceRecord, payload: unknown) {
  const actualHash=hash(payload);
  return { valid: record?.version===1 && typeof record.payloadHash==='string' && record.payloadHash===actualHash, expectedHash:record?.payloadHash, actualHash };
}
