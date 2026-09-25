import assert from 'node:assert/strict';
import express from 'express';
const source = (await import('node:fs')).readFileSync(new URL('../server/bootstrap.ts', import.meta.url), 'utf8');
assert.match(source, /BUSINESS_OS_HTTP_BODY_LIMIT/);
assert.match(source, /2mb/);
assert.match(source, /import\('\.\.\/server\.ts'\)/);
console.log('bootstrap-body-limit: PASS');
