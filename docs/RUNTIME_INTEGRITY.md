# Business OS Runtime Integrity

## Execution boundary

AI-generated actions are proposals. The server will only commit an external mutation after:

1. explicit human approval;
2. an execution adapter is configured;
3. the adapter reports verified success;
4. the server appends an immutable ledger event.

Without `EXECUTION_WEBHOOK_URL`, the execute endpoint fails closed and does not claim that anything was executed.

## Durable ledger

Execution events are stored as append-only JSONL at:

`BUSINESS_OS_DATA_DIR/execution-ledger.jsonl`

Set `BUSINESS_OS_DATA_DIR` to a durable volume in production.

## Adapter contract

Set:

- `EXECUTION_WEBHOOK_URL`
- optional `EXECUTION_WEBHOOK_SECRET`

The adapter receives `operation: "execute"` or `operation: "rollback"` and must return JSON containing:

`{ "verified": true, "details": "..." }`

A 2xx response without `verified: true` is rejected.

## Data provenance

The current Business OS visual dataset is simulated/mock data. UI surfaces must not label it as live external telemetry until a real connector is attached.
