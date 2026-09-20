import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  PieChart,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { BusinessMetric } from '../types';

interface FinanceViewProps {
  metrics: BusinessMetric[];
  onTriggerAction?: (actionTitle: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ metrics, onTriggerAction }) => {
  const [forecastMonths, setForecastMonths] = useState<number>(12);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Horizon Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b1219] to-[#0c1424] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 uppercase">
                FINANCIAL INTELLIGENCE
              </span>
              <span className="text-xs font-mono text-slate-400">• Net Burn: $184k/mo</span>
            </div>
            <h2 className="text-2xl font-bold text-white">$24,840,000 ARR · $4.12M Liquid Treasury</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              22.4 months of fully funded cash runway at current operating cadence. Gross margin pacing at 79.6% against 82% annual target.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
              <div className="text-[10px] text-slate-400 uppercase">Cash Collection Rate</div>
              <div className="text-sm font-bold text-emerald-400">97.4% (DSO: 28d)</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
              <div className="text-[10px] text-slate-400 uppercase">Rule of 40 Index</div>
              <div className="text-sm font-bold text-cyan-300">46.2 (Top 5% SaaS)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Gross Profit Margin</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-white">79.6%</span>
            <span className="text-xs font-mono font-bold text-emerald-400">+2.8% QoQ</span>
          </div>
          <p className="text-[11px] text-slate-400">Target 82% driven by LLM caching optimization</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Net Monthly Burn</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-white">$184,200</span>
            <span className="text-xs font-mono text-slate-400">Within Budget</span>
          </div>
          <p className="text-[11px] text-slate-400">R&amp;D (62%), Sales &amp; Mktg (26%), G&amp;A (12%)</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Average Contract Value</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-white">$142,000</span>
            <span className="text-xs font-mono font-bold text-cyan-400">+14% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400">Enterprise tier-1 accounts expanding rapidly</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Cloud &amp; Model COGS</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-amber-300">$64,800/mo</span>
            <span className="text-xs font-mono font-bold text-rose-400">+12% Unplanned</span>
          </div>
          <p className="text-[11px] text-slate-400">Frankfurt egress anomaly accounts for $14.2k</p>
        </div>
      </div>

      {/* Deep Financial Modeling & Cashflow Horizon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Runway & ARR Projection Forecast */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Runway &amp; ARR Trajectory Simulation
              </h3>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span>Model Horizon:</span>
              <button
                onClick={() => setForecastMonths(12)}
                className={`px-2 py-0.5 rounded ${forecastMonths === 12 ? 'bg-emerald-500/20 text-emerald-300' : 'hover:text-white'}`}
              >
                12M
              </button>
              <button
                onClick={() => setForecastMonths(24)}
                className={`px-2 py-0.5 rounded ${forecastMonths === 24 ? 'bg-emerald-500/20 text-emerald-300' : 'hover:text-white'}`}
              >
                24M
              </button>
            </div>
          </div>

          {/* Forecast Horizon Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400">
                  <th className="pb-2">Quarter</th>
                  <th className="pb-2">Projected ARR</th>
                  <th className="pb-2">Net Burn</th>
                  <th className="pb-2">Ending Treasury</th>
                  <th className="pb-2">Runway Remaining</th>
                  <th className="pb-2">Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                <tr>
                  <td className="py-2.5 font-bold text-white">Q3 2026 (Current)</td>
                  <td className="py-2.5 text-cyan-300">$24.84M</td>
                  <td className="py-2.5 text-rose-400">-$184k/mo</td>
                  <td className="py-2.5 font-bold">$4.12M</td>
                  <td className="py-2.5 text-emerald-400">22.4 mos</td>
                  <td className="py-2.5 text-slate-400">Actual</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-300">Q4 2026</td>
                  <td className="py-2.5 text-cyan-300">$27.20M</td>
                  <td className="py-2.5 text-rose-400">-$162k/mo</td>
                  <td className="py-2.5 font-bold">$3.63M</td>
                  <td className="py-2.5 text-emerald-400">22.4 mos</td>
                  <td className="py-2.5 text-emerald-400">92% High</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-300">Q1 2027</td>
                  <td className="py-2.5 text-cyan-300">$30.10M</td>
                  <td className="py-2.5 text-rose-400">-$120k/mo</td>
                  <td className="py-2.5 font-bold">$3.27M</td>
                  <td className="py-2.5 text-emerald-400">27.2 mos</td>
                  <td className="py-2.5 text-cyan-400">84% Med-High</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-300">Q2 2027 (Cashflow Breakeven)</td>
                  <td className="py-2.5 text-cyan-300">$33.40M</td>
                  <td className="py-2.5 text-emerald-400">+$24k/mo (Profitable)</td>
                  <td className="py-2.5 font-bold">$3.34M</td>
                  <td className="py-2.5 text-emerald-400">Self-Sustaining</td>
                  <td className="py-2.5 text-cyan-400">78% Target</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Finance Agent Forecast: Cashflow breakeven achievable by Q2 2027 with zero additional dilution.</span>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Unit Economics & Capital Allocation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Unit Economics Snapshot
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-black/30">
                <span className="text-slate-400">LTV / CAC Ratio</span>
                <span className="text-emerald-400 font-bold">5.8x (Elite Tier)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/30">
                <span className="text-slate-400">CAC Payback</span>
                <span className="text-white font-bold">8.4 Months</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/30">
                <span className="text-slate-400">Magic Number</span>
                <span className="text-cyan-300 font-bold">1.42 (Highly Efficient)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/30">
                <span className="text-slate-400">Annual Contract Churn</span>
                <span className="text-white font-bold">4.8%</span>
              </div>
            </div>
          </div>

          {/* Actionable Finance Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#121826] to-[#0c1017] border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <DollarSign className="w-4 h-4" />
              <span>Capital Influx Proposal</span>
            </div>
            <p className="text-xs text-slate-300">
              Deploying a 15% margin-neutral annual prepayment incentive for top 412 monthly accounts would pull forward <strong>+$1.1M in cash</strong> this quarter.
            </p>
            <button
              onClick={() => onTriggerAction && onTriggerAction('Annual Prepayment Campaign')}
              className="w-full mt-2 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold font-mono transition-all"
            >
              Authorize Stripe Prepay Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
