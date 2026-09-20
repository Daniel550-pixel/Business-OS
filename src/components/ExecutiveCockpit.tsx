import React from 'react';
import {
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Briefcase,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { ProposedAction } from '../types';

interface ExecutiveCockpitProps {
  onAuthorizeAction: (action: ProposedAction) => void;
  onFocusObjective: (objectiveId: string) => void;
  onExplainEvidence: (headline: string, claim: string, confidence: number) => void;
  onSwitchToOperate: () => void;
}

export const ExecutiveCockpit: React.FC<ExecutiveCockpitProps> = ({
  onAuthorizeAction,
  onFocusObjective,
  onExplainEvidence,
  onSwitchToOperate,
}) => {
  const topPriorities: {
    id: string;
    num: string;
    title: string;
    impact: string;
    urgency: 'high' | 'urgent';
    action: ProposedAction;
    objectiveId?: string;
  }[] = [
    {
      id: 'p_1',
      num: '01',
      title: 'Siemens & Standard Chartered Procurement Acceleration',
      impact: 'Unblocks €730,000 ARR in delayed Q3 enterprise contracts',
      urgency: 'urgent',
      objectiveId: 'focus_revenue_anomaly',
      action: {
        id: 'act_exec_01',
        title: 'Dispatch Executive Concierge Sponsor Touchpoint to Siemens & Standard Chartered',
        description: 'Authorize personalized executive sponsor briefing and expedited SOC2 addendum to procurement leaders.',
        riskLevel: 'medium',
        targetSystem: 'Salesforce & Google Calendar API',
        requiresApproval: true,
        status: 'PROPOSED',
        parameters: {
          accounts: ['Siemens AG (€420k)', 'Standard Chartered (€310k)'],
          execLead: 'CEO & VP Enterprise',
        },
      },
    },
    {
      id: 'p_2',
      num: '02',
      title: 'Frankfurt Cluster Uncompressed Telemetry Egress Recovery',
      impact: 'Recovers €8,400 / Month in uncompressed inter-region cloud spend',
      urgency: 'high',
      objectiveId: 'focus_infra_anomaly',
      action: {
        id: 'act_exec_02',
        title: 'Commit zstd-3 Stream Compression Patch to Frankfurt Kubernetes Gateway',
        description: 'Mitigates 4.8 TB/day raw telemetry replication to iad-01 cluster with automatic rollback guardrail.',
        riskLevel: 'low',
        targetSystem: 'Kubernetes Cluster Gateway & Terraform',
        requiresApproval: true,
        status: 'PROPOSED',
        parameters: {
          savings: '€8,400/mo',
          cluster: 'fra-01',
        },
      },
    },
    {
      id: 'p_3',
      num: '03',
      title: 'Global Freight Networks Renewal Risk Mitigation',
      impact: 'Protects €185,000 ARR at risk due to seat utilization contraction',
      urgency: 'high',
      action: {
        id: 'act_exec_03',
        title: 'Initiate Automated Customer Success Re-engagement & License Reallocation',
        description: 'Rebalance 27 unallocated seats and schedule quarterly business review with new VP Operations.',
        riskLevel: 'low',
        targetSystem: 'Zendesk & HubSpot CRM',
        requiresApproval: true,
        status: 'PROPOSED',
        parameters: {
          account: 'Global Freight Networks',
          reallocatedSeats: 27,
        },
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl os-glass-strong os-cyber-corners border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs os-mono font-bold tracking-widest text-cyan-400 uppercase">
              Executive Sovereign Cockpit Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white os-mono tracking-tight">
            Consolidated Enterprise Posture
          </h1>
          <p className="text-xs text-slate-300 font-sans">
            Stripping operational noise. High-fidelity decision surface centered on macro indicators and top sovereign authorizations.
          </p>
        </div>

        <button
          onClick={onSwitchToOperate}
          className="px-4 py-2 rounded-lg os-surface os-interactive text-xs os-mono font-bold text-slate-200 hover:text-white transition-all shrink-0"
        >
          Switch to Operational Mode
        </button>
      </div>

      {/* 3 High-Level Business Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Consolidated ARR */}
        <div className="p-5 sm:p-6 rounded-xl os-glass os-interactive space-y-3">
          <div className="flex items-center justify-between text-xs os-mono">
            <span className="text-slate-400 uppercase tracking-wider">Consolidated ARR</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              +12.4% YoY
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold os-mono text-white tracking-tight">
            €24.84M
          </div>
          <div className="text-xs text-slate-400 font-sans flex items-center justify-between">
            <span>Net Revenue Retention: 118.2%</span>
            <button
              onClick={() =>
                onExplainEvidence(
                  'Consolidated ARR: €24.84M',
                  'Enterprise contribution represents 41.1% (€10.2M ARR) while PLG accounts for 18.5% (€4.6M ARR).',
                  96
                )
              }
              className="text-cyan-400 text-[11px] os-mono hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Evidence</span>
            </button>
          </div>
        </div>

        {/* Metric 2: Runway & Capital Safety */}
        <div className="p-5 sm:p-6 rounded-xl os-glass os-interactive space-y-3">
          <div className="flex items-center justify-between text-xs os-mono">
            <span className="text-slate-400 uppercase tracking-wider">Capital Runway</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Healthy
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold os-mono text-white tracking-tight">
            22.4 Mos
          </div>
          <div className="text-xs text-slate-400 font-sans flex items-center justify-between">
            <span>Net Burn: €380k / Month</span>
            <button
              onClick={() =>
                onExplainEvidence(
                  'Runway & Burn Velocity',
                  'Net cash reserves of €8.5M across treasury enclaves with zero outstanding venture debt.',
                  99
                )
              }
              className="text-cyan-400 text-[11px] os-mono hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Evidence</span>
            </button>
          </div>
        </div>

        {/* Metric 3: Overall Health Index */}
        <div className="p-5 sm:p-6 rounded-xl os-glass os-interactive space-y-3">
          <div className="flex items-center justify-between text-xs os-mono">
            <span className="text-slate-400 uppercase tracking-wider">Company Health Index</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              Grade A-
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold os-mono text-cyan-400 tracking-tight">
            91 / 100
          </div>
          <div className="space-y-1">
            <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 w-[91%]" />
            </div>
            <div className="flex items-center justify-between text-[10px] os-mono text-slate-400 pt-0.5">
              <span>Growth 88%</span>
              <span>Ops 94%</span>
              <span>Security 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Priorities Requiring Decisions */}
      <div className="rounded-xl os-glass-strong p-5 sm:p-7 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 os-live-dot" />
              <h2 className="text-base font-bold os-mono text-white uppercase tracking-wider">
                Top Sovereign Executive Priorities (Policy Gate)
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              High-consequence authorizations evaluated and queued by autonomous agents awaiting human sign-off.
            </p>
          </div>
          <span className="text-xs os-mono text-amber-400 font-bold hidden sm:inline">
            3 Awaiting Decision
          </span>
        </div>

        <div className="space-y-4">
          {topPriorities.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-lg os-surface os-interactive flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded os-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.num}
                  </span>
                  <h3 className="text-base font-bold text-white os-mono">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-300 font-sans pl-8">{item.impact}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-8 lg:pl-0">
                {item.objectiveId && (
                  <button
                    onClick={() => onFocusObjective(item.objectiveId!)}
                    className="px-3.5 py-2 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-xs os-mono text-slate-200 border border-white/10 transition-all"
                  >
                    Investigate Context
                  </button>
                )}

                <button
                  onClick={() => onAuthorizeAction(item.action)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs os-mono font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize Execution</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
