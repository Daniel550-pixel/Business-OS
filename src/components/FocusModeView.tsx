import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
} from 'lucide-react';
import { FocusObjective, ProposedAction } from '../types';

interface FocusModeViewProps {
  objective: FocusObjective;
  onExitFocus: () => void;
  onLaunchMission: (objective: FocusObjective) => void;
  onAuthorizeAction: (action: ProposedAction) => void;
  onExplainEvidence: (headline: string, claim: string, confidence: number) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  objective,
  onExitFocus,
  onLaunchMission,
  onAuthorizeAction,
  onExplainEvidence,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Reconfiguration Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0e1424] border border-cyan-500/40 shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitFocus}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Panoramic View</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              FOCUS MODE ACTIVE: SYSTEM RECONFIGURED AROUND OBJECTIVE
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Detected: <span className="text-slate-200">{objective.detectedAt}</span>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="rounded-3xl bg-[#0a0d16] border border-white/[0.12] shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header Title Section */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Target Metric Anomaly</span>
            </div>
            <div className="text-sm font-mono font-bold px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {objective.metricDelta} Delta
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {objective.title}
          </h1>

          <p className="text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
            {objective.recommendation}
          </p>
        </div>

        {/* 2-Column Split: Cause Analysis vs AI Findings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* Left Column: Cause Analysis Breakdown (5 Cols) */}
          <div className="lg:col-span-5 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Root Cause Decomposition
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Variance Share</span>
            </div>

            <div className="space-y-4 font-mono">
              {objective.causeAnalysis.map((cause, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{cause.segment}</span>
                    <span className="text-rose-400 font-bold">{cause.delta}</span>
                  </div>

                  {/* Proportional visual bar */}
                  <div className="w-full h-2.5 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                      style={{ width: `${cause.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="truncate pr-2">{cause.detail}</span>
                    <span className="text-slate-500 shrink-0">{cause.percentage}% Impact</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Confidence Gauge */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between font-mono">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500 uppercase">Analysis Confidence</div>
                <div className="text-xl font-bold text-cyan-400">{objective.confidence}%</div>
              </div>
              <button
                onClick={() =>
                  onExplainEvidence(
                    objective.title,
                    `Identified ${objective.causeAnalysis[0].segment} as the primary root cause (${objective.causeAnalysis[0].percentage}% variance share) with ${objective.causeAnalysis[0].delta} contraction.`,
                    objective.confidence
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1.5 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Explain Evidence</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Findings & Next Steps (7 Cols) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            <div className="border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Verifiable AI Findings
              </h3>
            </div>

            <div className="space-y-3">
              {objective.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                        {finding.number}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {finding.headline}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {finding.confidence}% Conf.
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 pl-7 leading-relaxed font-sans">
                    {finding.description}
                  </p>

                  <div className="pl-7 pt-1 flex items-center gap-3">
                    <button
                      onClick={() =>
                        onExplainEvidence(
                          finding.headline,
                          finding.description,
                          finding.confidence
                        )
                      }
                      className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>View Telemetry Evidence</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Proposed Next Step & Decision Box */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  Proposed Next Strategic Action (Policy Gate)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  Human Approval Required
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-mono">
                  {objective.proposedAction.title}
                </h4>
                {objective.proposedAction.description && (
                  <p className="text-xs text-slate-300 font-sans">
                    {objective.proposedAction.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onAuthorizeAction(objective.proposedAction)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Mitigation Now</span>
                </button>

                <button
                  onClick={() => onLaunchMission(objective)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Autonomous Mission</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
