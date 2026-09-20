import React from 'react';
import {
  HelpCircle,
  X,
  FileText,
  TrendingUp,
  Database,
  History,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  claim: string;
  confidence: number;
  factors?: { name: string; weight: number; impact: string }[];
  metricsEvidence?: {
    transactionsCount?: number;
    crmEventsCount?: number;
    historicalComparisons?: number;
    traces?: { id: string; timestamp: string; text: string }[];
  };
  onInvestigateFurther?: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  title,
  claim,
  confidence,
  factors = [
    { name: 'Enterprise Contract Volume Drag', weight: 48, impact: '4 tier-1 deals delayed in legal review' },
    { name: 'SSO Onboarding Failure Rate', weight: 32, impact: '14% drop in mid-market trial activations' },
    { name: 'Seasonal / Cyclical Variance', weight: 20, impact: 'Historical intra-quarter variation' },
  ],
  metricsEvidence = {
    transactionsCount: 1420,
    crmEventsCount: 94,
    historicalComparisons: 4,
    traces: [
      { id: 'tr_1', timestamp: '14m ago', text: 'Stripe billing ledger flagged $184k weekly gross deceleration.' },
      { id: 'tr_2', timestamp: '22m ago', text: 'Gong call transcript flagged security audit query from Siemens counsel.' },
      { id: 'tr_3', timestamp: '35m ago', text: 'Auth0 SAML configuration failure rate spiked in EU-West cluster.' },
    ],
  },
  onInvestigateFurther,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0b0f19] border border-cyan-500/40 shadow-[0_16px_50px_rgba(0,0,0,0.9)] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                <HelpCircle className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                Inspectable Reasoning & Evidence Surface
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono">{title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claim & Confidence */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">AI Conclusion / Claim:</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{confidence}% Confidence Score</span>
            </span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{claim}</p>
        </div>

        {/* Weighted Causality Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">Weighted Contributing Drivers</span>
            <span className="text-slate-500">Total Influence: 100%</span>
          </div>

          <div className="space-y-2">
            {factors.map((factor, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">{factor.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{factor.weight}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${factor.weight}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">{factor.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Underlying Telemetry Evidence Grid */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Empirical Evidence Backing
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-mono mb-1">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Transactions</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {metricsEvidence.transactionsCount?.toLocaleString() || 142}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-mono mb-1">
                <FileText className="w-3 h-3 text-emerald-400" />
                <span>CRM Signals</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {metricsEvidence.crmEventsCount || 38}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-mono mb-1">
                <History className="w-3 h-3 text-indigo-400" />
                <span>Prior Periods</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {metricsEvidence.historicalComparisons || 4} Quarters
              </div>
            </div>
          </div>

          {/* Trace Log Snippet */}
          {metricsEvidence.traces && metricsEvidence.traces.length > 0 && (
            <div className="p-3 rounded-lg bg-black/50 border border-white/[0.04] space-y-1.5 text-xs font-mono">
              <div className="text-[10px] text-slate-500 uppercase">Recent Verifiable Traces</div>
              {metricsEvidence.traces.map((trace) => (
                <div key={trace.id} className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-400 shrink-0">•</span>
                  <span className="text-slate-500 shrink-0">[{trace.timestamp}]</span>
                  <span className="truncate">{trace.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <div className="text-[11px] font-mono text-slate-500">
            Source: Sovereign Multi-Agent Evidence Ledger
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 transition-colors"
            >
              Close
            </button>
            {onInvestigateFurther && (
              <button
                onClick={() => {
                  onClose();
                  onInvestigateFurther();
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.3)] transition-all"
              >
                <span>Launch Deep Investigation</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
