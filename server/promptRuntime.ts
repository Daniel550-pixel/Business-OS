import crypto from 'node:crypto';

const configuredPromptLimit = Number(process.env.BUSINESS_OS_MAX_PROMPT_CHARS);
const configuredContextLimit = Number(process.env.BUSINESS_OS_MAX_CONTEXT_CHARS);

export const DEFAULT_MAX_PROMPT_CHARS = Number.isInteger(configuredPromptLimit) && configuredPromptLimit > 0 ? configuredPromptLimit : 1_500_000;
export const DEFAULT_MAX_CONTEXT_CHARS = Number.isInteger(configuredContextLimit) && configuredContextLimit > 0 ? configuredContextLimit : 120_000;

export interface PromptEnvelope {
  requestId: string;
  prompt: string;
  promptChars: number;
  context: string;
  contextChars: number;
  receivedAt: string;
  promptSha256: string;
}

export interface PromptLimits {
  maxPromptChars?: number;
  maxContextChars?: number;
}

function asPositiveInteger(value: number | undefined, fallback: number) {
  return Number.isInteger(value) && (value as number) > 0 ? value as number : fallback;
}

/** Normalize and validate user input at the runtime boundary. */
export function createPromptEnvelope(promptInput: unknown, contextInput?: unknown, limits: PromptLimits = {}): PromptEnvelope {
  const maxPromptChars = asPositiveInteger(limits.maxPromptChars, DEFAULT_MAX_PROMPT_CHARS);
  const maxContextChars = asPositiveInteger(limits.maxContextChars, DEFAULT_MAX_CONTEXT_CHARS);
  if (typeof promptInput !== 'string') throw new Error('Prompt must be a string.');
  const prompt = promptInput.normalize('NFC');
  if (!prompt.trim()) throw new Error('Prompt cannot be empty.');
  if (prompt.length > maxPromptChars) throw new Error('Prompt exceeds the maximum supported size of ' + maxPromptChars.toLocaleString() + ' characters.');
  const context = contextInput === undefined || contextInput === null ? '' : typeof contextInput === 'string' ? contextInput.normalize('NFC') : JSON.stringify(contextInput);
  if (context.length > maxContextChars) throw new Error('Business context exceeds the maximum supported size of ' + maxContextChars.toLocaleString() + ' characters.');
  return {
    requestId: 'prompt_' + crypto.randomUUID(),
    prompt,
    promptChars: prompt.length,
    context,
    contextChars: context.length,
    receivedAt: new Date().toISOString(),
    promptSha256: crypto.createHash('sha256').update(prompt, 'utf8').digest('hex'),
  };
}
