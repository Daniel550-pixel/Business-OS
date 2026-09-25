# Business OS Prompt Runtime

The Command Core needs to accept large natural-language business intents without relying on an unbounded browser or HTTP payload.

## Runtime contract

`server/promptRuntime.ts` defines the boundary contract:

- Prompt input is UTF-8 text and normalized to NFC.
- Default prompt ceiling: **1,500,000 characters**.
- Default serialized business-context ceiling: **120,000 characters**.
- Oversized input is rejected explicitly rather than silently truncated.
- Every accepted prompt receives a unique request ID.
- A SHA-256 digest is generated for correlation/audit without storing the prompt itself in the execution ledger.
- Business context remains separate from the user prompt.

## Integration contract

The HTTP boundary should use a body limit larger than the prompt ceiling, then call `createPromptEnvelope(req.body.command, req.body.businessContext)` before invoking Gemini.

If a downstream model has a smaller context window, the runtime should fail explicitly or use a documented summarization/chunking stage; it must not silently discard user input.

**PROMPT → REASONING → PROPOSAL → POLICY GATE → HUMAN APPROVAL → VERIFIED EXECUTION**

A large prompt can influence a proposal, but it never bypasses the Policy Gate.
