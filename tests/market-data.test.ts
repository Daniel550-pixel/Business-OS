import assert from 'node:assert/strict';
import { getDailySeries, getGlobalQuote, getMarketDataStatus } from '../server/marketData.js';

process.env.ALPHAVANTAGE_API_KEY = 'test-key';
process.env.ALPHAVANTAGE_BASE_URL = 'https://example.test/query';

const originalFetch = globalThis.fetch;
let calls = 0;

globalThis.fetch = (async (input: RequestInfo | URL) => {
  calls += 1;
  const url = new URL(String(input));
  assert.equal(url.searchParams.get('apikey'), 'test-key');

  if (url.searchParams.get('function') === 'GLOBAL_QUOTE') {
    return new Response(JSON.stringify({
      'Global Quote': {
        '01. symbol': 'IBM',
        '05. price': '182.50',
        '06. volume': '123456',
        '07. latest trading day': '2026-09-19',
        '09. change': '2.50',
        '10. change percent': '1.39%',
      },
    }), { status: 200 });
  }

  return new Response(JSON.stringify({
    'Time Series (Daily)': {
      '2026-09-19': {
        '1. open': '180',
        '2. high': '184',
        '3. low': '179',
        '4. close': '182.5',
        '5. volume': '123456',
      },
    },
  }), { status: 200 });
}) as typeof fetch;

try {
  const status = getMarketDataStatus();
  assert.equal(status.configured, true);
  assert.equal(status.mode, 'LIVE_EXTERNAL');

  const quote = await getGlobalQuote('IBM');
  assert.equal(quote.symbol, 'IBM');
  assert.equal(quote.price, 182.5);
  assert.equal(quote.changePercent, 1.39);

  const cachedQuote = await getGlobalQuote('IBM');
  assert.deepEqual(cachedQuote, quote);
  assert.equal(calls, 1);

  const series = await getDailySeries('IBM');
  assert.equal(series[0].close, 182.5);
  assert.equal(series[0].volume, 123456);

  console.log('market-data: PASS');
} finally {
  globalThis.fetch = originalFetch;
}
