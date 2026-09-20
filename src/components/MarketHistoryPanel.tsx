import React, { useEffect, useMemo, useState } from 'react';

type Point = { date: string; open: number; high: number; low: number; close: number; volume: number };

type Analysis = {
  trend: 'BULLISH' | 'BEARISH' | 'MIXED';
  changePercent: number;
  volatilityPercent: number;
  sma20: number | null;
  sma50: number | null;
  anomaly: boolean;
  anomalyScore: number;
};

function fmt(value: number | null) {
  return value == null ? '—' : `$${value.toFixed(2)}`;
}

export const MarketHistoryPanel: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [points, setPoints] = useState<Point[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`/api/market/time-series?symbol=${symbol}&outputsize=compact`).then(r => r.json()),
      fetch(`/api/market/analysis?symbol=${symbol}`).then(r => r.json()),
    ]).then(([seriesPayload, analysisPayload]) => {
      if (cancelled) return;
      if (!seriesPayload?.success) throw new Error(seriesPayload?.error || 'Historical data unavailable.');
      setPoints((seriesPayload.data || []).slice(0, 90).reverse());
      setAnalysis(analysisPayload?.success ? analysisPayload.data : null);
    }).catch((e) => {
      if (!cancelled) { setPoints([]); setAnalysis(null); setError(e?.message || 'Market data unavailable.'); }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [symbol]);

  const chart = useMemo(() => {
    if (!points.length) return null;
    const values = points.map(p => p.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 0.01);
    const width = 760, height = 190, pad = 10;
    const path = values.map((v, i) => {
      const x = pad + (i / Math.max(values.length - 1, 1)) * (width - pad * 2);
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    return { path, first: values[0], last: values[values.length - 1], min, max };
  }, [points]);

  return (
    <div className="rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">HISTORICAL MARKET TELEMETRY</div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Alpha Vantage daily series / trend and anomaly analysis</div>
        </div>
        <div className="flex gap-1">
          {['AAPL','NVDA','MSFT'].map(s => (
            <button key={s} onClick={() => setSymbol(s)} className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono ${symbol===s ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-white/10 text-slate-500'}`}>{s}</button>
          ))}
        </div>
      </div>
      {loading && <div className="h-[210px] rounded-xl bg-black/30 border border-white/[0.05] flex items-center justify-center text-[10px] font-mono text-slate-500">LOADING HISTORICAL SERIES…</div>}
      {!loading && error && <div className="h-[210px] rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-center text-[10px] font-mono text-amber-300">{error}</div>}
      {!loading && !error && chart && (
        <>
          <div className="rounded-xl bg-[#050811] border border-white/[0.05] p-2 overflow-hidden">
            <svg viewBox="0 0 760 190" className="w-full h-[210px]">
              <path d={chart.path} fill="none" stroke="currentColor" className="text-cyan-300" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.05]"><div className="text-[8px] font-mono text-slate-500">LAST</div><div className="text-xs font-mono text-cyan-200 mt-1">{fmt(chart.last)}</div></div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.05]"><div className="text-[8px] font-mono text-slate-500">SERIES LOW</div><div className="text-xs font-mono text-slate-200 mt-1">{fmt(chart.min)}</div></div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.05]"><div className="text-[8px] font-mono text-slate-500">SERIES HIGH</div><div className="text-xs font-mono text-slate-200 mt-1">{fmt(chart.max)}</div></div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.05]"><div className="text-[8px] font-mono text-slate-500">SMA20</div><div className="text-xs font-mono text-violet-200 mt-1">{fmt(analysis?.sma20 ?? null)}</div></div>
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.05]"><div className="text-[8px] font-mono text-slate-500">TREND</div><div className={`text-xs font-mono mt-1 ${analysis?.trend==='BULLISH'?'text-emerald-300':analysis?.trend==='BEARISH'?'text-rose-300':'text-amber-300'}`}>{analysis?.trend || 'MIXED'}</div></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>{points[0]?.date} → {points[points.length-1]?.date}</span>
            <span>{analysis?.anomaly ? `ANOMALY SCORE ${analysis.anomalyScore.toFixed(2)}σ` : 'NO STATISTICAL ANOMALY'}</span>
          </div>
        </>
      )}
    </div>
  );
};
