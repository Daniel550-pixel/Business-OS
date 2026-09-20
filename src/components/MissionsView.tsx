import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { Mission, ProposedAction } from '../types';

interface MissionsViewProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
  onExecuteAction: (action: ProposedAction) => void;
  onCreateMission: (newMission: Partial<Mission>) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  selectedMission,
  onSelectMission,
  onExecuteAction,
  onCreateMission,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'needs_approval' | 'investigating'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newLeadAgent, setNewLeadAgent] = useState('Sales Agent');

  const activeMission = selectedMission || missions[0];

  const filteredMissions = missions.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newObjective.trim()) return;

    onCreateMission({
      title: newTitle,
      objective: newObjective,
      leadAgent: newLeadAgent,
      collaboratingAgents: ['Operations Agent', 'Finance Agent'],
      priority: 'high',
      status: 'active',
      progress: 15,
      startedAt: 'Just now',
      steps: [
        { id: `s_${Date.now()}_1`, title: 'Gather relevant cross-system telemetry', status: 'in_progress', assignedAgent: newLeadAgent },
        { id: `s_${Date.now()}_2`, title: 'Isolate root causes & simulate mitigation scenarios', status: 'pending', assignedAgent: 'Finance Agent' },
        { id: `s_${Date.now()}_3`, title: 'Propose executable actions for Policy Gate review', status: 'pending', assignedAgent: newLeadAgent },
      ],
      findings: ['Mission initialized. Dispatched initial telemetry sensors across production systems.'],
      recommendations: ['Monitor initial anomaly convergence rate over next 60 minutes.'],
      proposedActions: [
        {
          id: `act_${Date.now()}`,
          title: `Initiate automated diagnostics for "${newTitle}"`,
          riskLevel: 'low',
          targetSystem: 'Corporate Intelligence Gateway',
          requiresApproval: true,
          status: 'PROPOSED',
        },
      ],
    });

    setNewTitle('');
    setNewObjective('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0b0f19] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Mission / Task Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
              AI DECIDES ≠ AI EXECUTES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transform high-level business objectives into verified, multi-agent autonomous execution workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
            {(['all', 'active', 'needs_approval', 'investigating'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-2.5 py-1 rounded transition-all capitalize ${
                  filter === st
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch Mission</span>
          </button>
        </div>
      </div>

      {/* Main Missions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Columns: Mission Roster */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Active Workflows ({filteredMissions.length})
          </span>

          <div className="space-y-2.5">
            {filteredMissions.map((mission) => {
              const isSelected = activeMission?.id === mission.id;
              return (
                <div
                  key={mission.id}
                  onClick={() => onSelectMission(mission)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0b0f19] border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            mission.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {mission.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{mission.leadAgent}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100">{mission.title}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">{mission.progress}%</span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{mission.objective}</p>

                  <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Started: {mission.startedAt}</span>
                    <span className="capitalize">{mission.status.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Columns: Deep Mission Workflow View */}
        {activeMission ? (
          <div className="lg:col-span-8 space-y-5 p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08]">
            {/* Mission Hero */}
            <div className="space-y-3 pb-4 border-b border-white/[0.06]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      activeMission.priority === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {activeMission.priority} PRIORITY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/10 uppercase">
                    Status: {activeMission.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Overall Completion:</span>
                  <span className="text-cyan-300 font-bold text-sm">{activeMission.progress}%</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{activeMission.title}</h3>
                <p className="text-xs text-slate-300 mt-1 font-mono">{activeMission.objective}</p>
              </div>

              {/* Agent Collaborator Ribbon */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                <span className="text-slate-400">Assigned Agents:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Lead: {activeMission.leadAgent}
                </span>
                {activeMission.collaboratingAgents.map((agentName, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                    {agentName}
                  </span>
                ))}
              </div>
            </div>

            {/* Workflow Steps Execution Pipeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Execution Steps ({activeMission.steps.length})
              </h4>

              <div className="space-y-2.5">
                {activeMission.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-lg bg-black/40 border border-white/[0.06] flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : step.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-mono text-slate-500">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{step.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-1.5 py-0.2 rounded">
                            {step.assignedAgent}
                          </span>
                        </div>
                        {step.details && (
                          <p className="text-[11px] text-slate-400 leading-relaxed">{step.details}</p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded shrink-0 ${
                        step.status === 'completed'
                          ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                          : step.status === 'in_progress'
                          ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                          : 'text-slate-500 bg-white/[0.02]'
                      }`}
                    >
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings & Intelligence Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <h5 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Agent Findings
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeMission.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono mt-0.5">›</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                <h5 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Strategic Recommendations
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeMission.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono mt-0.5">›</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Proposed Actions & Policy Gate */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#121826] to-[#0c1017] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold tracking-wider text-slate-100 uppercase font-mono">
                    Policy Gate & Action Approvals ({activeMission.proposedActions.length})
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  HUMAN VERIFICATION REQUIRED
                </span>
              </div>

              <div className="space-y-2">
                {activeMission.proposedActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-3 rounded-lg bg-black/50 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            action.riskLevel === 'high' || action.riskLevel === 'critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {action.riskLevel} Risk
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: {action.targetSystem}</span>
                      </div>
                      <h5 className="text-xs font-medium text-slate-200">{action.title}</h5>
                      {action.description && (
                        <p className="text-[11px] text-slate-400">{action.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => onExecuteAction(action)}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Authorize & Execute</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-12 text-slate-500 font-mono text-xs">
            Select a mission from the roster to inspect execution telemetry.
          </div>
        )}
      </div>

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-xl bg-[#0c111d] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">Launch New Autonomous Mission</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Mission Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Q4 Enterprise Margin Preservation Sprint"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Objective / Target</label>
                <textarea
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Clearly describe the business intent or problem to investigate..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Lead Autonomous Agent</label>
                <select
                  value={newLeadAgent}
                  onChange={(e) => setNewLeadAgent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="CEO Agent">CEO Agent (Strategic Alignment)</option>
                  <option value="Finance Agent">Finance Agent (Unit Economics & Runway)</option>
                  <option value="Sales Agent">Sales Agent (Enterprise Pipeline)</option>
                  <option value="Operations Agent">Operations Agent (Infrastructure & SLA)</option>
                  <option value="Customer Agent">Customer Agent (Retention & NRR)</option>
                  <option value="Security Agent">Security Agent (SOC2 & Zero-Trust)</option>
                  <option value="Research Agent">Research Agent (Market Intelligence)</option>
                  <option value="Marketing Agent">Marketing Agent (Growth & Demand)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                >
                  Dispatch Agents
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
