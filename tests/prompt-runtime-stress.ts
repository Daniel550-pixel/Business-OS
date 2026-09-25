import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const BASE_URL = process.env.BUSINESS_OS_BASE_URL || 'http://localhost:3000';
const SIZES = [100_000, 500_000, 1_000_000, 1_500_000];
const LIMIT = 1_500_000;
const TIMEOUT_MS = Number(process.env.BUSINESS_OS_STRESS_TIMEOUT_MS || 180_000);

function buildPrompt(size: number): string {
  const seed = [
    'Business OS large-prompt production capacity test. ',
    'Preserve this payload exactly as received and analyze it as business context. ',
    'Deterministic sequence: 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ. ',
  ].join('');
  return seed.repeat(Math.ceil(size / seed.length)).slice(0, size);
}

async function postCommand(prompt: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = performance.now();
  try {
    const response = await fetch(`${BASE_URL}/api/gemini/command`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-business-os-stress-test': 'true',
      },
      body: JSON.stringify({
        command: prompt,
        businessContext: {
          source: 'production-prompt-stress',
          test: true,
        },
      }),
      signal: controller.signal,
    });
    const elapsedMs = Math.round(performance.now() - started);
    const text = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return { response, elapsedMs, data };
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  console.log(`prompt-stress: target=${BASE_URL}`);
  console.log(`prompt-stress: timeout=${TIMEOUT_MS}ms`);

  for (const size of SIZES) {
    const prompt = buildPrompt(size);
    const expectedHash = crypto.createHash('sha256').update(prompt, 'utf8').digest('hex');
    const { response, elapsedMs, data } = await postCommand(prompt);

    if (!response.ok) {
      console.error(JSON.stringify({
        size,
        status: response.status,
        elapsedMs,
        code: data?.code,
        error: data?.error,
      }, null, 2));
      throw new Error(`Large-prompt request failed at ${size.toLocaleString()} characters with HTTP ${response.status}.`);
    }

    assert.equal(data?.success, true, `Expected success at ${size.toLocaleString()} characters.`);
    assert.equal(data?.request?.promptChars, size, 'Runtime prompt character count mismatch.');
    assert.equal(data?.request?.promptSha256, expectedHash, 'Runtime prompt SHA-256 mismatch.');
    console.log(`PASS size=${size.toLocaleString()} chars status=${response.status} latency=${elapsedMs}ms source=${data?.source}`);
  }

  const overLimitPrompt = buildPrompt(LIMIT) + 'X';
  const overLimit = await postCommand(overLimitPrompt);
  const expectedStatus = 413;
  assert.equal(overLimit.response.status, expectedStatus, 'Over-limit prompt did not return HTTP 413.');
  assert.equal(overLimit.data?.code, 'PROMPT_TOO_LARGE', 'Over-limit prompt did not return PROMPT_TOO_LARGE.');

  console.log(`PASS boundary=1,500,001 chars status=${overLimit.response.status} code=${overLimit.data?.code}`);
  console.log('prompt-stress: PASS');
}

run().catch((error) => {
  console.error('prompt-stress: FAIL');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
