import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Search,
  Compass,
  CheckCircle2,
  Lock,
  Send,
  Sliders,
  MessageSquare,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Agent } from '../types';

interface AgentsViewProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
}) => {
  const activeAgent = selectedAgent || agents[0];
  const [directPrompt, setDirectPrompt] = useState('');
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const getAgentIcon = (name: string) => {
    if (name.includes('CEO')) return <Compass className="w-4 h-4 text-amber-400" />;
    if (name.includes('Finance')) return <DollarSign className="w-4 h-4 text-emerald-400" />;
    if (name.includes('Sales')) return <TrendingUp className="w-4 h-4 text-cyan-400" />;
    if (name.includes('Operations')) return <Activity className="w-4 h-4 text-blue-400" />;
    if (name.includes('Customer')) return <Users className="w-4 h-4 text-indigo-400" />;
    if (name.includes('Marketing')) return <Zap className="w-4 h-4 text-purple-400" />;
    if (name.includes('Research')) return <Search className="w-4 h-4 text-teal-400" />;
    return <Shield className="w-4 h-4 text-rose-400" />;
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPrompt.trim()) return;

    setAgentResponse(
      `[${activeAgent.name}] Acknowledged intent: "${directPrompt}". Running specialized domain evaluation using tools [${activeAgent.tools.slice(0, 2).join(', ')}]. Formulated 2 deterministic hypotheses and scheduled telemetry check.`
    );
    setDirectPrompt('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              AI Agent Management & Fleet Orchestration
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              8 SPECIALIZED AGENTS ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous domain experts operating under bounded policy constraints and cryptographic action verification.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span>Autonomy Level: <strong className="text-cyan-300">Level 3 (Policy-Gated)</strong></span>
        </div>
      </div>

      {/* Main Agent Grid & Deep Work Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Agent Fleet Roster */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Registered Agents ({agents.length})
          </span>

          <div className="space-y-2">
            {agents.map((ag) => {
              const isSelected = activeAgent?.id === ag.id;
              return (
                <div
                  key={ag.id}
                  onClick={() => {
                    onSelectAgent(ag);
                    setAgentResponse(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_16px_rgba(99,102,241,0.15)]'
                      : 'bg-[#0b0f19] border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                        {getAgentIcon(ag.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">{ag.name}</h4>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                              ag.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : ag.status === 'analyzing'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                            }`}
                          >
                            {ag.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ag.role}</p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <div className="text-cyan-400 font-bold">{ag.confidence}%</div>
                      <div className="text-slate-500">Confidence</div>
                    </div>
                  </div>

                  {ag.currentMission && (
                    <div className="p-2 rounded bg-black/30 border border-white/[0.04] text-[11px] font-mono text-slate-300 flex items-center gap-1.5 truncate">
                      <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{ag.currentMission}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/[0.04]">
                    <span>Memory: {ag.memoryTokens}</span>
                    <span>Tools: {ag.tools.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Columns: Deep Agent Inspection Workspace */}
        {activeAgent && (
          <div className="lg:col-span-7 space-y-5 p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08]">
            {/* Agent Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  {getAgentIcon(activeAgent.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{activeAgent.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10 uppercase">
                      {activeAgent.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{activeAgent.domain}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Context Memory</div>
                  <div className="text-xs font-bold text-cyan-300">{activeAgent.memoryTokens}</div>
                </div>
              </div>
            </div>

            {/* Operational Context & Mission */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Operational Context & Intent
              </span>
              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                {activeAgent.context}
              </p>
            </div>

            {/* Capabilities & Registered Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Core Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAgent.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Registered Enterprise Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAgent.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-[11px] font-mono bg-cyan-950/30 text-cyan-300 border border-cyan-800/40 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Permission Boundaries & Policy Guardrails (AI DECIDES != AI EXECUTES) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#121826] to-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold tracking-wider text-slate-100 uppercase font-mono">
                    Policy Boundaries & Execution Authority
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  BOUNDED POLICY
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">Analyze Data</div>
                  <div className="text-emerald-400 font-bold mt-1">Authorized</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">Propose Action</div>
                  <div className="text-emerald-400 font-bold mt-1">Authorized</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">Auto-Execute</div>
                  <div className={`font-bold mt-1 ${activeAgent.permissions.canAutoExecute ? 'text-amber-300' : 'text-rose-400'}`}>
                    {activeAgent.permissions.canAutoExecute ? 'Restricted' : 'Forbidden'}
                  </div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">Spend Ceiling</div>
                  <div className="text-cyan-300 font-bold mt-1">{activeAgent.permissions.executionCap || '$0 (Gate)'}</div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">Governance Policies:</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeAgent.policies.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono mt-0.5">›</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Outputs Ledger */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Recent Agent Output Ledger
              </span>
              <div className="space-y-2">
                {activeAgent.recentOutputs.map((out) => (
                  <div
                    key={out.id}
                    className="p-3 rounded-lg bg-black/40 border border-white/[0.06] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            out.type === 'decision'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : out.type === 'alert'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {out.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{out.timestamp}</span>
                      </div>
                      <p className="text-slate-200">{out.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Task Dispatching Interface */}
            <div className="pt-2 border-t border-white/[0.06] space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Dispatch Domain Intent to {activeAgent.name}
              </span>

              <form onSubmit={handleSendPrompt} className="flex items-center gap-2">
                <input
                  type="text"
                  value={directPrompt}
                  onChange={(e) => setDirectPrompt(e.target.value)}
                  placeholder={`Instruct ${activeAgent.name} to run an investigation or draft action...`}
                  className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={!directPrompt.trim()}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </button>
              </form>

              {agentResponse && (
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs font-mono text-indigo-200 animate-in fade-in">
                  {agentResponse}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
