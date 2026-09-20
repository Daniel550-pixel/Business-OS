import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { ProposedAction, ExecutionRecord } from '../types';

interface AutomationsViewProps {
  pendingActions: ProposedAction[];
  executionRecords: ExecutionRecord[];
  onExecuteAction: (action: ProposedAction) => void;
  onRollbackAction: (recordId: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  pendingActions,
  executionRecords,
  onExecuteAction,
  onRollbackAction,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'ledger' | 'policies'>('pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Horizon Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b101c] to-[#161226] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                AI DECIDES ≠ AI EXECUTES · POLICY GATE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Execution Authorization &amp; Immutable Audit Ledger</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Strict governance layer ensuring autonomous agents can formulate strategies, run simulations, and propose mutations, but cannot touch production without authorized approval.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
              <div className="text-[10px] text-slate-400 uppercase">Pending Approvals</div>
              <div className="text-sm font-bold text-amber-400">{pendingActions.length} Actions</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-right">
              <div className="text-[10px] text-slate-400 uppercase">Executed Audit Hashes</div>
              <div className="text-sm font-bold text-emerald-400">{executionRecords.length} Committed</div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06] font-mono text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'pending'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Policy Gate ({pendingActions.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'ledger'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Execution Audit Ledger ({executionRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'policies'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Governance &amp; Guardrails
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Actions Awaiting Human Review */}
      {activeTab === 'pending' && (
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Actions Requiring Executive Authorization ({pendingActions.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Deterministic simulation verified</span>
          </div>

          {pendingActions.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500 bg-black/20 rounded-xl border border-white/[0.04]">
              No actions currently waiting in Policy Gate. All system invariants satisfied.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            action.riskLevel === 'critical' || action.riskLevel === 'high'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : action.riskLevel === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {action.riskLevel} Risk
                        </span>
                        <span className="text-xs font-mono text-slate-400">Target: {action.targetSystem}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-300">
                          Reversible: Yes
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{action.title}</h4>
                      {action.description && (
                        <p className="text-xs text-slate-300">{action.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => onExecuteAction(action)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] font-mono shrink-0"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize &amp; Commit</span>
                    </button>
                  </div>

                  {/* Simulated Outcome Preview */}
                  <div className="p-3 rounded-lg bg-[#06090e] border border-cyan-500/20 text-xs font-mono text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulated Execution Outcome:</span>
                    </div>
                    <p className="text-slate-300">
                      Execution will invoke authenticated API mutation on {action.targetSystem}. Expected delta: Anomaly resolution with zero downtime risk.
                    </p>
                    {action.parameters && (
                      <div className="text-[10px] text-slate-400 truncate pt-1 border-t border-white/[0.04]">
                        Payload: {JSON.stringify(action.parameters)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Execution Audit Ledger */}
      {activeTab === 'ledger' && (
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Immutable Policy Execution Ledger ({executionRecords.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Cryptographically auditable</span>
          </div>

          <div className="space-y-3">
            {executionRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rec.status}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-200 font-semibold">{rec.actionTitle}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Target: {rec.targetSystem} • Approver: <strong className="text-slate-300">{rec.authorizedBy}</strong> • {rec.timestamp}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Trace Hash: <span className="text-cyan-400/80">{rec.hash}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rec.reversible && (
                    <button
                      onClick={() => onRollbackAction(rec.id || rec.executionId || '')}
                      className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-[11px] flex items-center gap-1 transition-all"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Rollback</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Governance Policies */}
      {activeTab === 'policies' && (
        <div className="p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Autonomous Agent Governance Rules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-xs font-bold text-white font-mono">1. Financial Ceiling</div>
              <p className="text-xs text-slate-400">
                Any action involving budget reallocation or commitments above <strong>$5,000 USD</strong> strictly halts at Policy Gate for CEO/VP authorization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-xs font-bold text-white font-mono">2. Customer Communication</div>
              <p className="text-xs text-slate-400">
                Agents may draft personalized retention emails or pricing proposals, but cannot dispatch unreviewed messages to executive contacts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="text-xs font-bold text-white font-mono">3. Production Deployments</div>
              <p className="text-xs text-slate-400">
                Infrastructure mutations (Kubernetes ingress, Terraform updates) require verified pre-flight dry runs and rollback snapshots.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
