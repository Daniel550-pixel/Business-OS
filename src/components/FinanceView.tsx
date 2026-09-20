import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Sliders,
  Sparkles,
  ShieldAlert,
  Activity,
  Award,
  Layers,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  MoreVertical,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';
import { BusinessMetric } from '../types';

interface FinanceViewProps {
  metrics?: BusinessMetric[];
  onTriggerAction?: (actionTitle: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ onTriggerAction }) => {
  const [simulationTab, setSimulationTab] = useState<'cashflow' | 'revenues' | 'capex' | 'factors'>('cashflow');
  const [marketCondition, setMarketCondition] = useState<number>(20);
  const [revenueTarget, setRevenueTarget] = useState<number>(50);
  const [capexVal, setCapexVal] = useState<number>(20);
  const [activeTooltip, setActiveTooltip] = useState<string | null>('tool_1');

  const [marketQuotes, setMarketQuotes] = useState<Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    latestTradingDay: string;
  }>>([]);
  const [marketSource, setMarketSource] = useState<'Alpha Vantage' | 'SIMULATED'>('SIMULATED');
  const [marketLoading, setMarketLoading] = useState(true);

  React.useEffect(() => {
    let cancelled = false;
    const loadMarket = async () => {
      setMarketLoading(true);
      try {
        const statusResponse = await fetch('/api/market/status');
        const status = await statusResponse.json();
        if (!cancelled) setMarketSource(status?.marketData?.source === 'Alpha Vantage' ? 'Alpha Vantage' : 'SIMULATED');
        const symbols = ['AAPL', 'NVDA', 'MSFT'];
        const results = [];
        for (const symbol of symbols) {
          const response = await fetch(`/api/market/quote?symbol=${symbol}`);
          if (!response.ok) continue;
          const payload = await response.json();
          if (payload?.success && payload.data) results.push(payload.data);
        }
        if (!cancelled) setMarketQuotes(results);
      } catch {
        if (!cancelled) {
          setMarketSource('SIMULATED');
          setMarketQuotes([]);
        }
      } finally {
        if (!cancelled) setMarketLoading(false);
      }
    };
    void loadMarket();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-100px)] bg-[#07090e] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col font-sans select-none space-y-4 p-4 lg:p-5">
      {/* Top Header Bar (Screenshot 4) */}
      <div className="h-14 border-b border-white/[0.08] bg-[#090d16]/90 px-4 rounded-xl flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
              Business-OS
            </h2>
            <span className="text-slate-500 font-mono text-xs">//</span>
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-bold">
              FINANCE INTELLIGENCE TERMINAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">REAL-TIME STATUS</span>
            <span className="text-slate-500">•</span>
            {/* Health rate pill */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-400 font-bold">
              <span>💚</span>
              <span>89</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">14:32:15 GMT | OCT 26</span>
          </div>

          <div className="w-7 h-7 rounded-full bg-blue-600 text-[11px] font-bold text-white flex items-center justify-center font-mono">
            AL
          </div>
        </div>
      </div>

      {/* Top Grid: Financial Topology + Cashflow Projection Simulation + AI Evidence Trail */}
      {/* External market intelligence surface */}
      <div className="rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">MARKET INTELLIGENCE</div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">External market telemetry / server-routed data</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${marketSource === 'Alpha Vantage' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={marketSource === 'Alpha Vantage' ? 'text-emerald-400' : 'text-amber-300'}>{marketSource.toUpperCase()}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{marketLoading ? 'SYNCING' : marketQuotes.length ? 'LIVE QUOTES' : 'NO QUOTES'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {marketQuotes.map((quote) => (
            <div key={quote.symbol} className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{quote.symbol}</span>
                <span className={`text-[10px] font-mono ${quote.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="mt-2 text-lg font-bold font-mono text-cyan-300">${quote.price.toFixed(2)}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} / trading day {quote.latestTradingDay}
              </div>
            </div>
          ))}
          {!marketLoading && marketQuotes.length === 0 && (
            <div className="md:col-span-3 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] font-mono text-amber-300">
              External market telemetry unavailable. Finance surface remains in simulated mode.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1 (Col 1-5): FINANCIAL TOPOLOGY Network Graph */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[360px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-2">
            <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">
              FINANCIAL TOPOLOGY
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="p-1 rounded bg-black/40 border border-white/10 text-slate-400 hover:text-white cursor-pointer">
                <MoreVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Network Graph Interactive Canvas */}
          <div className="relative w-full h-64 bg-[#050811]/60 rounded-xl overflow-hidden border border-white/[0.04]">
            {/* Network Graph Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />

            <svg className="w-full h-full">
              {/* Cyan Starburst cluster (Left) */}
              <g stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.7">
                <line x1="140" y1="130" x2="60" y2="70" />
                <line x1="140" y1="130" x2="90" y2="50" />
                <line x1="140" y1="130" x2="150" y2="50" />
                <line x1="140" y1="130" x2="60" y2="120" />
                <line x1="140" y1="130" x2="80" y2="170" />
                <line x1="140" y1="130" x2="60" y2="200" />
                <line x1="140" y1="130" x2="140" y2="220" />
                <line x1="140" y1="130" x2="220" y2="130" strokeWidth="2.5" />
              </g>

              {/* Orange Starburst cluster (Right) */}
              <g stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.7">
                <line x1="280" y1="120" x2="330" y2="60" />
                <line x1="280" y1="120" x2="360" y2="80" />
                <line x1="280" y1="120" x2="380" y2="120" />
                <line x1="280" y1="120" x2="360" y2="160" />
                <line x1="280" y1="120" x2="330" y2="200" />
                <line x1="280" y1="120" x2="220" y2="130" strokeWidth="2.5" />
              </g>

              {/* Nodes */}
              {/* Cyan peripheral nodes */}
              <circle cx="60" cy="70" r="4" fill="#06b6d4" />
              <circle cx="90" cy="50" r="4" fill="#06b6d4" />
              <circle cx="150" cy="50" r="5" fill="#38bdf8" />
              <circle cx="60" cy="120" r="4" fill="#06b6d4" />
              <circle cx="80" cy="170" r="5" fill="#06b6d4" />
              <circle cx="60" cy="200" r="4" fill="#06b6d4" />
              <circle cx="140" cy="220" r="5" fill="#38bdf8" />

              {/* Orange peripheral nodes */}
              <circle cx="330" cy="60" r="4" fill="#f59e0b" />
              <circle cx="360" cy="80" r="4" fill="#f59e0b" />
              <circle cx="380" cy="120" r="5" fill="#fbbf24" />
              <circle cx="360" cy="160" r="4" fill="#f59e0b" />
              <circle cx="330" cy="200" r="5" fill="#f59e0b" />

              {/* Main Hub Nodes */}
              <circle cx="140" cy="130" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="220" cy="130" r="13" fill="#06b6d4" stroke="#e0f2fe" strokeWidth="2.5" />
              <circle cx="280" cy="120" r="10" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
            </svg>

            {/* Interactive Tooltips on Graph (Screenshot 4) */}
            <div
              style={{ left: '190px', top: '70px' }}
              className="absolute z-10 px-2 py-1 rounded bg-[#0b1220]/95 border border-cyan-400 text-[9px] font-mono text-cyan-300 shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-1" />
              Positive effect: +12.4% ARR
            </div>

            <div
              style={{ left: '230px', top: '160px' }}
              className="absolute z-10 px-2 py-1 rounded bg-[#1a1208]/95 border border-amber-400 text-[9px] font-mono text-amber-300 shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1" />
              Account Kipn Violates Noes
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/[0.04]">
            <span>42 Financial Entities</span>
            <span>Synchronized with NetSuite ERP</span>
          </div>
        </div>

        {/* Panel 2 (Col 6-9): CASHFLOW PROJECTION SIMULATION NODE */}
        <div className="lg:col-span-4 rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs font-bold font-mono text-white tracking-wider uppercase border-b border-white/[0.06] pb-3 mb-3">
              CASHFLOW PROJECTION SIMULATION NODE
            </div>

            {/* Simulation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 mb-4 text-[11px] font-mono">
              {(['cashflow', 'revenues', 'capex', 'factors'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSimulationTab(tab)}
                  className={`flex-1 py-1 rounded-lg capitalize transition-colors ${
                    simulationTab === tab
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dials & Sliders (Screenshot 4) */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[9px] font-mono text-slate-400 uppercase">Market Conditions</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-1">{marketCondition}%</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={marketCondition}
                  onChange={(e) => setMarketCondition(Number(e.target.value))}
                  className="w-full mt-2 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[9px] font-mono text-slate-400 uppercase">Revenue Target</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-1">{revenueTarget}%</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={revenueTarget}
                  onChange={(e) => setRevenueTarget(Number(e.target.value))}
                  className="w-full mt-2 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[9px] font-mono text-slate-400 uppercase">Capex</div>
                <div className="text-sm font-mono font-bold text-amber-400 mt-1">{capexVal}%</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={capexVal}
                  onChange={(e) => setCapexVal(Number(e.target.value))}
                  className="w-full mt-2 accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Simulation Node Diagram (Screenshot 4) */}
            <div className="relative p-3 rounded-xl bg-[#050811] border border-white/[0.06] flex items-center justify-between min-h-[110px]">
              {/* Left Incoming Lines */}
              <div className="space-y-2 text-[9px] font-mono text-slate-500">
                <div>Market: {marketCondition}%</div>
                <div>Target: {revenueTarget}%</div>
                <div>Capex: {capexVal}%</div>
              </div>

              {/* Central CashFlow Node with Play icon */}
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                  <Play className="w-4 h-4 text-cyan-300 fill-cyan-300 ml-0.5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1">CashFlow</span>
              </div>

              {/* Right Branching Paths into Future and What-If */}
              <div className="space-y-2 text-right">
                <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 justify-end">
                  <span>INTO FUTURE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>

                <div className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300">
                  WHAT-IF: PREDICTED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3 (Col 10-12): AI EVIDENCE TRAIL */}
        <div className="lg:col-span-3 rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">
                AI EVIDENCE TRAIL
              </div>
              <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Critical Alert Banner (Screenshot 4) */}
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2.5 text-xs text-rose-300 font-mono font-bold mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>CRITICAL ALERT: FORECAST VARIANCE (Q4)</span>
            </div>

            {/* Numbered Evidence Items (Screenshot 4) */}
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06] space-y-0.5">
                <div className="font-mono font-bold text-slate-200">
                  1. Unexpected Supplier Price Increase (Model 7)
                </div>
                <div className="text-[10px] text-slate-400">
                  Insights: Cloud GPU reservation contracts adjusted +12%
                </div>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06] space-y-0.5">
                <div className="font-mono font-bold text-slate-200">
                  2. Sales Momentum Slowdown (Region B)
                </div>
                <div className="text-[10px] text-slate-400">
                  Insights: EMEA Mid-Market deals cycling 8 days slower
                </div>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06] space-y-0.5">
                <div className="font-mono font-bold text-slate-200">
                  3. Product Delay Impact
                </div>
                <div className="text-[10px] text-slate-400">
                  Insights: Sovereign On-Premises release shifted 2 weeks
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence Rating Badge (Screenshot 4) */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                AI CONFIDENCE RATING
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">96%</div>
            </div>
            <Award className="w-7 h-7 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Bottom Grid: Real-Time Key Metrics + Anomaly Detection & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bottom-Left Panel (Col 1-7): REAL-TIME KEY METRICS */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
            <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">
              REAL-TIME KEY METRICS
            </div>
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: ARR */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                ANNUAL RECURRING REVENUE (ARR)
              </div>
              <div className="text-xl font-bold font-mono text-cyan-400">$12,450,000</div>

              {/* Sparkline Visual (Screenshot 4) */}
              <div className="h-14 w-full flex items-end">
                <svg className="w-full h-12 overflow-visible">
                  <path
                    d="M 0 40 Q 40 35, 70 28 T 130 18 T 180 8"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>2018</span>
                <span>2020</span>
                <span>2022</span>
                <span>2024</span>
              </div>
            </div>

            {/* Metric 2: Monthly Cashflow */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                MONTHLY CASHFLOW
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300">$1.2M</div>

              {/* Bar Chart Visual (Screenshot 4) */}
              <div className="h-14 w-full flex items-end gap-2 pb-1">
                <div className="flex-1 bg-cyan-900/60 h-4 rounded-sm" />
                <div className="flex-1 bg-cyan-800/80 h-7 rounded-sm" />
                <div className="flex-1 bg-cyan-600 h-10 rounded-sm" />
                <div className="flex-1 bg-cyan-400 h-12 rounded-sm" />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>

            {/* Metric 3: Operating Expenses */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                OPERATING EXPENSES
              </div>
              <div className="text-xl font-bold font-mono text-amber-400">$780K ↗</div>

              {/* Amber Sparkline (Screenshot 4) */}
              <div className="h-14 w-full flex items-end">
                <svg className="w-full h-12 overflow-visible">
                  <path
                    d="M 0 35 Q 40 30, 80 25 T 140 15 T 180 6"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>Budget: $850K</span>
                <span className="text-emerald-400">Within Range</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right Panel (Col 8-12): ANOMALY DETECTION & ALERTS */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090d16]/90 border border-white/[0.08] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">
                ANOMALY DETECTION & ALERTS
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Warning Banner (Screenshot 4) */}
            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300 font-mono font-bold mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>CRITICAL ALERT: FORECAST VARIANCE DETECTED (Q4)</span>
            </div>

            {/* Comparison Line Chart (Screenshot 4) */}
            <div className="relative h-28 w-full bg-[#050811] rounded-xl p-2 border border-white/[0.04]">
              {/* Y-Axis labels */}
              <div className="absolute left-2 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-slate-600">
                <span>$70M</span>
                <span>$40M</span>
                <span>$10M</span>
              </div>

              <div className="ml-8 h-full relative">
                <svg className="w-full h-full overflow-visible">
                  {/* Cyan line: Projected Revenue */}
                  <path
                    d="M 10 70 Q 70 60, 140 50 T 210 60 T 280 40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />

                  {/* Gold line: Actual/Simulated with variance dip */}
                  <path
                    d="M 10 70 Q 70 50, 140 30 T 200 80 T 280 15"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* Variance callout tag (Screenshot 4) */}
                <div
                  style={{ left: '55%', top: '55%' }}
                  className="absolute px-2 py-0.5 rounded bg-black/90 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold shadow-lg"
                >
                  Variance: +18.5% above threshold
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400" />
                <span>Projected Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-400" />
                <span>Actual/Simulated Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
