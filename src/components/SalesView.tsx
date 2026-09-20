import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Building,
  DollarSign,
  Clock,
  CheckCircle2,
  Send,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ProposedAction } from '../types';

interface SalesViewProps {
  onExecuteAction: (action: ProposedAction) => void;
}

interface Deal {
  id: string;
  company: string;
  dealSize: string;
  stage: 'Discovery' | 'Evaluation' | 'Legal/Procurement' | 'Closing';
  health: 'healthy' | 'at_risk' | 'stalled';
  winProb: number;
  contact: string;
  lastTouch: string;
  riskReason?: string;
  recommendedAction?: string;
}

export const SalesView: React.FC<SalesViewProps> = ({ onExecuteAction }) => {
  const [stageFilter, setStageFilter] = useState<string>('all');

  const deals: Deal[] = [
    {
      id: 'deal_1',
      company: 'Sovereign Infrastructure UAE',
      dealSize: '$680,000 ARR',
      stage: 'Legal/Procurement',
      health: 'at_risk',
      winProb: 78,
      contact: 'H.E. Tariq Al-Mansoor (CIO)',
      lastTouch: '6 days ago',
      riskReason: 'Stalled in security review regarding localized UAE data sovereignty guarantees.',
      recommendedAction: 'Dispatch Sovereign Architecture Compliance Brief and schedule executive technical session.',
    },
    {
      id: 'deal_2',
      company: 'Vertex Global Logistics',
      dealSize: '$340,000 ARR',
      stage: 'Closing',
      health: 'healthy',
      winProb: 88,
      contact: 'Sarah Jenkins (VP Global Supply Chain)',
      lastTouch: 'Yesterday',
      riskReason: undefined,
      recommendedAction: 'Send final Master Services Agreement with enterprise SLA addendum.',
    },
    {
      id: 'deal_3',
      company: 'Helix Financial Holdings',
      dealSize: '$290,000 ARR',
      stage: 'Legal/Procurement',
      health: 'at_risk',
      winProb: 65,
      contact: 'Marcus Vance (Head of Treasury Tech)',
      lastTouch: '8 days ago',
      riskReason: 'Procurement cycle lengthened due to secondary SOC2 Type II audit verification.',
      recommendedAction: 'Fast-track executive VP sponsor alignment meeting.',
    },
    {
      id: 'deal_4',
      company: 'Aura Health Technologies',
      dealSize: '$180,000 ARR',
      stage: 'Evaluation',
      health: 'healthy',
      winProb: 72,
      contact: 'Dr. Elena Rostova (Chief Digital Officer)',
      lastTouch: '2 days ago',
      riskReason: undefined,
      recommendedAction: 'Assist engineering team with HIPAA-compliant sandbox verification.',
    },
    {
      id: 'deal_5',
      company: 'Nordic Clean Energy Grid',
      dealSize: '$210,000 ARR',
      stage: 'Discovery',
      health: 'healthy',
      winProb: 55,
      contact: 'Jonas Lind (Head of Real-Time Telemetry)',
      lastTouch: '3 days ago',
      riskReason: undefined,
      recommendedAction: 'Schedule technical deep dive on edge latency architecture.',
    },
  ];

  const filteredDeals = deals.filter((d) => stageFilter === 'all' || d.stage === stageFilter);

  const handleRunMitigation = (deal: Deal) => {
    const action: ProposedAction = {
      id: `act_${Date.now()}`,
      title: `Schedule Executive Concierge touchpoint for ${deal.company}`,
      riskLevel: 'low',
      targetSystem: 'Salesforce & Google Calendar',
      requiresApproval: true,
      status: 'PROPOSED',
      parameters: {
        company: deal.company,
        contact: deal.contact,
        dealSize: deal.dealSize,
        recommendedAction: deal.recommendedAction,
      },
    };
    onExecuteAction(action);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sales Horizon Header */}
      <div className="p-4 lg:p-5 rounded-xl os-glass-strong os-cyber-corners border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] os-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 uppercase">
                SALES & PIPELINE INTELLIGENCE
              </span>
              <span className="text-xs os-mono text-slate-400">• Win Rate: 34.8%</span>
            </div>
            <h2 className="text-2xl font-bold text-white os-mono">$14.2M Weighted Active Enterprise Pipeline</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              42 qualified active enterprise opportunities. Current average sales velocity: 68 days. 2 high-value deals in Procurement require executive sponsor touchpoints.
            </p>
          </div>

          <div className="flex items-center gap-2 os-mono text-xs">
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Q3 Quota Coverage</div>
              <div className="text-sm font-bold text-emerald-400">3.4x Target</div>
            </div>
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Procurement Cycle</div>
              <div className="text-sm font-bold text-rose-400">+14 Days Lag</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Breakdown Funnel Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { stage: 'Discovery', count: '14 Deals', value: '$3.8M' },
          { stage: 'Evaluation', count: '16 Deals', value: '$5.2M' },
          { stage: 'Legal/Procurement', count: '7 Deals', value: '$3.6M', alert: true },
          { stage: 'Closing', count: '5 Deals', value: '$1.6M', highlight: true },
        ].map((st, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg os-surface os-interactive ${
              st.alert
                ? 'border-amber-500/40 bg-amber-950/20'
                : st.highlight
                ? 'border-cyan-500/40 bg-cyan-950/20'
                : ''
            }`}
          >
            <div className="text-[10px] os-mono text-slate-400 uppercase">{st.stage}</div>
            <div className="text-lg font-bold os-mono text-white mt-0.5">{st.value}</div>
            <div className="text-[10px] os-mono text-slate-400">{st.count}</div>
          </div>
        ))}
      </div>

      {/* Enterprise Deals Ledger */}
      <div className="p-4 lg:p-5 rounded-xl os-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase os-mono tracking-wider">
              Priority Enterprise Deals Under Active Observation
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 os-mono text-xs">
            {['all', 'Discovery', 'Evaluation', 'Legal/Procurement', 'Closing'].map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  stageFilter === st
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white bg-black/30 border border-white/[0.06]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className={`p-4 rounded-lg os-surface os-interactive space-y-3 ${
                deal.health === 'at_risk'
                  ? 'border-rose-500/40 bg-rose-950/15'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{deal.company}</span>
                    <span
                      className={`text-[9px] os-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        deal.health === 'at_risk'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {deal.health.replace('_', ' ')}
                    </span>
                    <span className="text-xs os-mono font-bold text-cyan-300">{deal.dealSize}</span>
                  </div>
                  <div className="text-[11px] os-mono text-slate-400">
                    Lead Contact: <strong className="text-slate-200">{deal.contact}</strong> • Stage: {deal.stage} • Last Touch: {deal.lastTouch}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right os-mono text-xs">
                    <div className="text-emerald-400 font-bold">{deal.winProb}%</div>
                    <div className="text-[10px] text-slate-500">Win Prob</div>
                  </div>

                  {deal.riskReason && (
                    <button
                      onClick={() => handleRunMitigation(deal)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)] os-mono"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Mitigate Bottleneck</span>
                    </button>
                  )}
                </div>
              </div>

              {deal.riskReason && (
                <div className="p-3 rounded-lg bg-black/60 border border-rose-500/30 text-xs os-mono text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Bottleneck Detected by Sales Agent:</span>
                  </div>
                  <p className="text-slate-300">{deal.riskReason}</p>
                  {deal.recommendedAction && (
                    <p className="text-cyan-300 pt-1">› Recommendation: {deal.recommendedAction}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
