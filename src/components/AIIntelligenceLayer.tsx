import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Search,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { SystemRuntimeState } from '../types';

interface AIIntelligenceLayerProps {
  systemState: SystemRuntimeState;
  onSelectStep?: (stepName: string) => void;
  onOpenFocus?: (objectiveId: string) => void;
  onNavigateToLivingFlow?: () => void;
}

export const AIIntelligenceLayer: React.FC<AIIntelligenceLayerProps> = ({
  systemState,
  onSelectStep,
  onOpenFocus,
  onNavigateToLivingFlow,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const loopSteps = [
    { name: 'Observation', desc: 'Telemetry & Ingest', active: true },
    { name: 'Analysis', desc: 'Anomaly & Causality', active: systemState !== 'calm' },
    { name: 'Findings', desc: 'Verifiable Proof', active: systemState === 'investigating' || systemState === 'risk_detected' || systemState === 'major_decision' },
    { name: 'Recommendation', desc: 'Mitigation Plan', active: systemState === 'risk_detected' || systemState === 'major_decision' },
    { name: 'Human Approval', desc: 'Policy Gate', active: systemState === 'major_decision' },
    { name: 'Action', desc: 'Execution & Ledger', active: systemState === 'mission_executing' },
  ];

  const activeAnalyses = [
    {
      agent: 'Finance & Sales Agents',
      task: 'Scanning EMEA sales pipeline for procurement legal bottlenecks',
      status: 'High Priority',
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      actionId: 'focus_revenue_anomaly',
    },
    {
      agent: 'Operations Agent',
      task: 'Profiling Frankfurt cluster (fra-01) telemetry egress compression',
      status: 'Active Audit',
      badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
      actionId: 'focus_infra_anomaly',
    },
    {
      agent: 'Security Agent',
      task: 'Verifying zero-drift air-gapped cryptographic enclave guarantees',
      status: 'Sovereign Verified',
      badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className="rounded-2xl bg-[#12161F]/90 os-glass border border-cyan-500/30 shadow-[0_4px_24px_rgba(6,182,212,0.12)] overflow-hidden transition-all">
      {/* Top Banner Bar */}
      <div className="p-3 px-4 flex items-center justify-between border-b border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI Continuous Intelligence Loop
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
              State: {systemState.replace('_', ' ')}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">3 Autonomous Scans Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToLivingFlow && (
            <button
              onClick={onNavigateToLivingFlow}
              className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              title="Open full 3D Living System Flow"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>3D FLOW</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <span>{isExpanded ? 'Minimize' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 font-mono text-xs">
          {/* Horizontal Investigation Loop Pipeline */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
              <span>Sovereign Reasoning Pipeline: See → Reason → Verify → Act</span>
              <span className="text-cyan-400 font-bold">Policy-Gated</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {loopSteps.map((step, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectStep && onSelectStep(step.name)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      step.active
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-white'
                        : 'bg-white/[0.025] border-white/[0.05] text-slate-500'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{step.name}</div>
                    <div className="text-[9px] text-slate-400 font-sans truncate">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Background Analyses */}
          <div className="space-y-2 pt-1 border-t border-white/[0.06]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Real-Time Active Autonomous Inquiries
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {activeAnalyses.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05] flex items-start justify-between gap-2 hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-400 truncate">
                        {item.agent}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-sans line-clamp-2 leading-relaxed">
                      {item.task}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${item.badgeColor}`}
                    >
                      {item.status}
                    </span>
                    {item.actionId && onOpenFocus && (
                      <button
                        onClick={() => onOpenFocus(item.actionId)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        <span>Focus</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
