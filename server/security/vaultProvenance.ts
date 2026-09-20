import { createHash } from 'node:crypto';
import { appendSecurityEvent } from './securityEvents.js';
import { createProvenanceRecord, ProvenanceRecord, verifyProvenanceRecord } from './provenance.js';

export interface VaultManifestBoundary {
  manifestId: string; objectId: string; objectHash: string; chunkHashes: string[];
  encryptionScheme: 'AES-256-GCM'; source: 'OFFLINE_VAULT'; createdAt: string;
}
export interface VaultProvenanceRecord extends ProvenanceRecord {
  vault: VaultManifestBoundary;
}
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,canonicalize(v)]));
  return value;
}
function sha256(value: unknown) { return createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex'); }
function assertBoundary(input: VaultManifestBoundary) {
  if (!/^[a-f0-9]{64}$/i.test(input.objectHash)) throw new Error('Vault objectHash must be a SHA-256 digest.');
  if (!Array.isArray(input.chunkHashes) || input.chunkHashes.length===0 || input.chunkHashes.some(h=>!/^[a-f0-9]{64}$/i.test(h))) throw new Error('Vault chunkHashes must contain SHA-256 digests.');
  if (input.encryptionScheme!=='AES-256-GCM' || input.source!=='OFFLINE_VAULT') throw new Error('Unsupported vault boundary metadata.');
}
export function createVaultProvenance(input:{manifest:VaultManifestBoundary;authorizedBy:string}):VaultProvenanceRecord {
  assertBoundary(input.manifest); if(!input.authorizedBy.trim()) throw new Error('Vault provenance requires an authorized operator.');
  const payload=canonicalize(input.manifest);
  const base=createProvenanceRecord({subject:'vault/'+input.manifest.objectId,payload,source:'OFFLINE_VAULT',authorizedBy:input.authorizedBy});
  const record={...base,payloadHash:sha256(payload),vault:input.manifest};
  appendSecurityEvent({eventType:'VAULT_PROVENANCE_CREATED',severity:'INFO',actorId:input.authorizedBy,targetResource:'vault/'+input.manifest.objectId,verification:'VERIFIED',description:'Offline Vault manifest crossed the Business OS provenance boundary.',metadata:{manifestId:input.manifest.manifestId,objectHash:input.manifest.objectHash,chunkCount:input.manifest.chunkHashes.length}});
  return record;
}
export function verifyVaultProvenance(record:VaultProvenanceRecord,manifest:VaultManifestBoundary) {
  assertBoundary(manifest);
  const verification=verifyProvenanceRecord(record,canonicalize(manifest));
  const objectMatch=record.vault?.objectId===manifest.objectId&&record.vault?.objectHash===manifest.objectHash;
  const chunksMatch=JSON.stringify(record.vault?.chunkHashes)===JSON.stringify(manifest.chunkHashes);
  const valid=verification.valid&&objectMatch&&chunksMatch&&record.vault?.encryptionScheme==='AES-256-GCM';
  return {valid,expectedHash:record.payloadHash,actualHash:verification.actualHash,objectMatch,chunksMatch};
}
