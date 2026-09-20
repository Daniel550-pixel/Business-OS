# Security Vault Boundary

Business OS does not import or copy the offline Vault into the application repository.

The integration boundary is metadata-only: a Vault manifest crosses into Business OS with the object ID, object SHA-256, chunk SHA-256 values, AES-256-GCM encryption scheme, source marker, and creation timestamp. Business OS hashes and verifies that manifest and records the crossing in the append-only security ledger.

The Vault remains responsible for object/chunk storage, AES-256-GCM encryption, chunk nonces, source removal and staging, and offline/air-gapped retention.

Business OS is responsible for provenance records, policy authorization, verification, security event lineage, and incident response orchestration.

Set SECURITY_RESPONSE_WEBHOOK_URL for an external response executor and keep its secret in SECURITY_RESPONSE_WEBHOOK_SECRET. The executor must return JSON {"verified":true}; otherwise the action fails closed.
