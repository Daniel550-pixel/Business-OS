import express from 'express';

// Business OS accepts large natural-language intents. The stock Express JSON
// parser defaults to a much smaller payload ceiling, so raise the boundary
// before server.ts registers its middleware/routes.
const originalJson = express.json;
express.json = ((options: Parameters<typeof originalJson>[0] = {}) =>
  originalJson({ limit: process.env.BUSINESS_OS_HTTP_BODY_LIMIT || '2mb', ...options })
) as typeof originalJson;

// Keep the production bundle compatible with the existing CommonJS build.
// A top-level await would force esbuild to emit ESM, while this bootstrap
// only needs to load server.ts after the Express parser override is installed.
(async () => {
  await import('../server.ts');
})().catch((error) => {
  console.error('[Business OS] Bootstrap failed:', error);
  process.exitCode = 1;
});
