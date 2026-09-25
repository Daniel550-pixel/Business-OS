import express from 'express';

// Business OS accepts large natural-language intents. The stock Express JSON
// parser defaults to a much smaller payload ceiling, so raise the boundary
// before server.ts registers its middleware/routes.
const originalJson = express.json;
express.json = ((options: Parameters<typeof originalJson>[0] = {}) =>
  originalJson({ limit: process.env.BUSINESS_OS_HTTP_BODY_LIMIT || '2mb', ...options })
) as typeof originalJson;

await import('../server.ts');
