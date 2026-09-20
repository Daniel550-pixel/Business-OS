import { createHash } from 'node:crypto';

export type MarketQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
  source: 'alphavantage';
  fetchedAt: string;
};

export type DailyPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type CacheEntry<T> = { value: T; expiresAt: number };

const BASE_URL = process.env.ALPHAVANTAGE_BASE_URL || 'https://www.alphavantage.co/query';
const QUOTE_TTL_MS = 60_000;
const DAILY_TTL_MS = 300_000;
const cache = new Map<string, CacheEntry<unknown>>();

function getApiKey() {
  const key = process.env.ALPHAVANTAGE_API_KEY?.trim();
  if (!key || key === 'MY_ALPHA_VANTAGE_API_KEY') {
    throw new Error('Alpha Vantage API key is not configured.');
  }
  return key;
}

function normalizeSymbol(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  if (!/^[A-Z0-9._-]{1,20}$/.test(normalized)) {
    throw new Error('Invalid market symbol.');
  }
  return normalized;
}

async function queryAlphaVantage(params: Record<string, string>) {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', getApiKey());
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Alpha Vantage HTTP ${response.status}.`);

  const data = await response.json() as Record<string, unknown>;
  const note = typeof data.Note === 'string' ? data.Note : '';
  const information = typeof data.Information === 'string' ? data.Information : '';
  const error = typeof data['Error Message'] === 'string' ? data['Error Message'] : '';
  if (error) throw new Error(`Alpha Vantage: ${error}`);
  if (note || information) throw new Error(`Alpha Vantage: ${note || information}`);
  return data;
}

function cached<T>(key: string, ttl: number, loader: () => Promise<T>) {
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > Date.now()) return Promise.resolve(existing.value);
  return loader().then((value) => {
    cache.set(key, { value, expiresAt: Date.now() + ttl });
    return value;
  });
}

export function getMarketDataStatus() {
  const configured = Boolean(process.env.ALPHAVANTAGE_API_KEY?.trim());
  return {
    configured,
    source: configured ? 'Alpha Vantage' : 'SIMULATED',
    mode: configured ? 'LIVE_EXTERNAL' : 'SIMULATED',
    baseUrlConfigured: Boolean(process.env.ALPHAVANTAGE_BASE_URL),
  } as const;
}

export async function getGlobalQuote(symbolInput: string): Promise<MarketQuote> {
  const symbol = normalizeSymbol(symbolInput);
  return cached(`quote:${symbol}`, QUOTE_TTL_MS, async () => {
    const data = await queryAlphaVantage({ function: 'GLOBAL_QUOTE', symbol });
    const quote = data['Global Quote'] as Record<string, string> | undefined;
    if (!quote || !quote['05. price']) throw new Error(`No quote returned for ${symbol}.`);

    const price = Number(quote['05. price']);
    const change = Number(quote['09. change'] || 0);
    const changePercent = Number.parseFloat((quote['10. change percent'] || '0').replace('%', ''));
    const volume = Number(quote['06. volume'] || 0);
    if (!Number.isFinite(price)) throw new Error(`Invalid quote returned for ${symbol}.`);

    return {
      symbol,
      price,
      change,
      changePercent,
      volume,
      latestTradingDay: quote['07. latest trading day'] || '',
      source: 'alphavantage',
      fetchedAt: new Date().toISOString(),
    };
  });
}

export async function getDailySeries(symbolInput: string, outputSize: 'compact' | 'full' = 'compact'): Promise<DailyPoint[]> {
  const symbol = normalizeSymbol(symbolInput);
  return cached(`daily:${symbol}:${outputSize}`, DAILY_TTL_MS, async () => {
    const data = await queryAlphaVantage({
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: outputSize,
    });
    const series = data['Time Series (Daily)'] as Record<string, Record<string, string>> | undefined;
    if (!series) throw new Error(`No daily series returned for ${symbol}.`);

    return Object.entries(series).map(([date, point]) => ({
      date,
      open: Number(point['1. open']),
      high: Number(point['2. high']),
      low: Number(point['3. low']),
      close: Number(point['4. close']),
      volume: Number(point['5. volume']),
    }));
  });
}

export type MarketAnalysis = {
  symbol: string;
  trend: 'BULLISH' | 'BEARISH' | 'MIXED';
  changePercent: number;
  volatilityPercent: number;
  sma20: number | null;
  sma50: number | null;
  anomaly: boolean;
  anomalyScore: number;
  analyzedAt: string;
};

export function analyzeDailySeries(symbolInput: string, series: DailyPoint[]): MarketAnalysis {
  const symbol = normalizeSymbol(symbolInput);
  const ordered = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const closes = ordered.map(p => p.close).filter(Number.isFinite);
  if (closes.length < 2) throw new Error(`Insufficient historical data for ${symbol}.`);

  const last = closes[closes.length - 1];
  const first = closes[0];
  const changePercent = ((last - first) / first) * 100;
  const returns = closes.slice(1).map((v, i) => (v - closes[i]) / closes[i]).filter(Number.isFinite);
  const mean = returns.reduce((a, b) => a + b, 0) / Math.max(returns.length, 1);
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / Math.max(returns.length, 1);
  const volatilityPercent = Math.sqrt(variance) * 100;
  const sma = (n: number) => closes.length < n ? null : closes.slice(-n).reduce((a,b)=>a+b,0)/n;
  const sma20 = sma(20);
  const sma50 = sma(50);
  const baseline = returns.slice(-20);
  const latestReturn = returns[returns.length - 1];
  const baselineMean = baseline.reduce((a,b)=>a+b,0)/Math.max(baseline.length,1);
  const baselineStd = Math.sqrt(baseline.reduce((s,r)=>s+(r-baselineMean)**2,0)/Math.max(baseline.length,1));
  const anomalyScore = baselineStd > 0 ? Math.abs((latestReturn-baselineMean)/baselineStd) : 0;
  const trend = sma20 == null ? (changePercent >= 0 ? 'BULLISH' : 'BEARISH') : last > sma20 && changePercent >= 0 ? 'BULLISH' : last < sma20 && changePercent < 0 ? 'BEARISH' : 'MIXED';
  return { symbol, trend, changePercent, volatilityPercent, sma20, sma50, anomaly: anomalyScore >= 2.5, anomalyScore, analyzedAt: new Date().toISOString() };
}

export function marketDataFingerprint(symbol: string, quote: MarketQuote) {
  return createHash('sha256')
    .update(JSON.stringify({ symbol, quote }))
    .digest('hex');
}
