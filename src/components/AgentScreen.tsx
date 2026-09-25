import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  LockKeyhole,
  Network,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react';
import { Agent, ExecutionRecord, Mission, ProposedAction, SystemRuntimeState, WorldNode } from '../types';

interface AgentScreenProps {
  systemState: SystemRuntimeState;
  agents: Agent[];
  missions: Mission[];
  nodes: WorldNode[];
  selectedNode: WorldNode | null;
  pendingActions: ProposedAction[];
  executionRecords: ExecutionRecord[];
  activityTicks: any[];
  metrics: any[];
  onSelectNode: (node: WorldNode) => void;
  onExecuteAction: (action: ProposedAction) => void;
  onOpenCommandCore: () => void;
  onOpenEvidence: (title: string, claim: string, confidence: number) => void;
  onNavigateToView: (view: any) => void;
}

type Stage = 'command' | 'reasoning' | 'evidence' | 'policy' | 'ledger';

const STAGES: { id: Stage; label: string; icon: React.ElementType }[] = [
  { id: 'command', label: 'COMMAND', icon: Sparkles },
  { id: 'reasoning', label: 'REASONING', icon: BrainCircuit },
  { id: 'evidence', label: 'EVIDENCE', icon: FileSearch },
  { id: 'policy', label: 'POLICY GATE', icon: ShieldCheck },
  { id: 'ledger', label: 'LEDGER', icon: LockKeyhole },
];

export const AgentScreen: React.FC<AgentScreenProps> = ({
  systemState,
  agents,
  missions,
  nodes,
  selectedNode,
  pendingActions,
  executionRecords,
  activityTicks,
  metrics,
  onSelectNode,
  onExecuteAction,
  onOpenCommandCore,
  onOpenEvidence,
  onNavigateToView,
}) => {
  const [stage, setStage] = useState<Stage>('command');
  const [intent, setIntent] = useState('');
  const [activeAgentId, setActiveAgentId] = useState(agents[0]?.id || '');
  const [selectedAction, setSelectedAction] = useState<ProposedAction | null>(pendingActions[0] || null);

  useEffect(() => {
    const handleFlow = (event: Event) => {
      const detail = (event as CustomEvent<{ stage?: string }>).detail || {};
      const next = detail.stage as Stage;
      if (STAGES.some((item) => item.id === next)) setStage(next);
    };
    window.addEventListener('business-os:neural-flow', handleFlow);
    return () => window.removeEventListener('business-os:neural-flow', handleFlow);
  }, []);

  useEffect(() => {
    if (!selectedAction && pendingActions[0]) setSelectedAction(pendingActions[0]);
  }, [pendingActions, selectedAction]);

  const activeAgent = agents.find((agent) => agent.id === activeAgentId) || agents[0];
  const activeIndex = STAGES.findIndex((item) => item.id === stage);

  const currentMetric = useMemo(
    () => metrics.find((metric) => metric.id === 'arr') || metrics[0],
    [metrics],
  );

  const submitIntent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!intent.trim()) {
      onOpenCommandCore();
      return;
    }
    setStage('reasoning');
    window.dispatchEvent(new CustomEvent('business-os:neural-flow', {
      detail: {
        stage: 'command',
        stageId: 'understand-perception',
        label: 'AGENT COMMAND',
        detail: 'Operator intent captured and routed into the reasoning runtime.',
      },
    }));
    onOpenCommandCore();
  };

  const inspectNode = (node: WorldNode) => {
    onSelectNode(node);
    setStage('evidence');
    window.dispatchEvent(new CustomEvent('business-os:neural-flow', {
      detail: {
        stage: 'evidence',
        stageId: 'simulate-predict',
        label: 'BUSINESS EVIDENCE',
        detail: `Agent is correlating live business topology around ${node.name}.`,
      },
    }));
  };

  return (
    <section className="agent-screen min-h-[calc(100vh-120px)] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05070b]/90 shadow-[0_24px_100px_rgba(0,0,0,.45)]">
      <div className="flex min-h-[calc(100vh-120px)] flex-col">
        <header className="border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                <Workflow className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.24em] text-cyan-300">BUSINESS-OS // AGENT OPERATING SCREEN</div>
                <h1 className="text-sm font-semibold text-white sm:text-base">One intelligence surface for business reality and agent execution</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Runtime online</span>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-400">{pendingActions.length} pending</span>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="border-b border-white/10 bg-black/20 lg:border-b-0 lg:border-r">
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-slate-500">AGENT SWARM</span>
                <Network className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="space-y-1.5">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgentId(agent.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${activeAgentId === agent.id ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/5 bg-white/[0.02] hover:border-white/15'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${activeAgentId === agent.id ? 'bg-cyan-300' : 'bg-slate-600'}`} />
                      <span className="truncate text-xs font-medium text-slate-200">{agent.name}</span>
                    </div>
                    <div className="mt-1 truncate font-mono text-[9px] text-slate-500">{agent.role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 font-mono text-[10px] tracking-widest text-slate-500">ACTIVE MISSIONS</div>
              <div className="space-y-2">
                {missions.slice(0, 4).map((mission) => (
                  <button key={mission.id} onClick={() => onNavigateToView('missions')} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="truncate text-slate-300">{mission.title}</span>
                      <span className="text-cyan-300">{mission.progress}%</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-cyan-400/70" style={{ width: `${mission.progress}%` }} /></div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="border-b border-white/10 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-slate-500">ACTIVE AGENT</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white"><Sparkles className="h-4 w-4 text-cyan-300" />{activeAgent?.name || 'Executive Agent'}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px] text-slate-500">SYSTEM STATE</div>
                  <div className="text-xs font-semibold uppercase text-cyan-300">{systemState.replace('_', ' ')}</div>
                </div>
              </div>

              <form onSubmit={submitIntent} className="flex gap-2 rounded-2xl border border-cyan-400/20 bg-black/40 p-2 shadow-[0_0_40px_rgba(34,211,238,.06)]">
                <input
                  value={intent}
                  onChange={(event) => setIntent(event.target.value)}
                  onFocus={() => setStage('command')}
                  placeholder="Give the agent an objective, question, investigation or action..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-600"
                />
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-cyan-400/15 px-3 py-2 font-mono text-[10px] font-bold text-cyan-200 hover:bg-cyan-400/25">
                  <Send className="h-3.5 w-3.5" /> RUN
                </button>
              </form>
            </div>

            <div className="grid min-h-[330px] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div className="border-b border-white/10 p-4 sm:p-5 xl:border-b-0 xl:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest text-slate-500">UNIFIED AGENT PIPELINE</div>
                    <div className="mt-1 text-sm text-white">{STAGES[activeIndex]?.label} active</div>
                  </div>
                  <Activity className="h-4 w-4 text-cyan-300" />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {STAGES.map((item, index) => {
                    const Icon = item.icon;
                    const active = index === activeIndex;
                    const complete = index < activeIndex;
                    return (
                      <React.Fragment key={item.id}>
                        <button onClick={() => setStage(item.id)} className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-2 font-mono text-[9px] ${active ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : complete ? 'border-emerald-400/20 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                          {complete ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                          {item.label}
                        </button>
                        {index < STAGES.length - 1 && <span className="text-slate-700">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3"><div className="font-mono text-[9px] text-slate-500">BUSINESS ARR</div><div className="mt-1 text-sm font-semibold text-white">{currentMetric?.value ?? '—'}</div></div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3"><div className="font-mono text-[9px] text-slate-500">AGENTS</div><div className="mt-1 text-sm font-semibold text-white">{agents.length}</div></div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3"><div className="font-mono text-[9px] text-slate-500">MISSIONS</div><div className="mt-1 text-sm font-semibold text-white">{missions.length}</div></div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3"><div className="font-mono text-[9px] text-slate-500">NODES</div><div className="mt-1 text-sm font-semibold text-white">{nodes.length}</div></div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-slate-500">BUSINESS REALITY FIELD</span>
                    <span className="text-[10px] text-slate-500">Select a node to feed evidence into the agent</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {nodes.slice(0, 9).map((node) => (
                      <button key={node.id} onClick={() => inspectNode(node)} className={`rounded-xl border p-3 text-left transition ${selectedNode?.id === node.id ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/5 bg-white/[0.02] hover:border-white/15'}`}>
                        <div className="flex items-center justify-between gap-2"><span className="truncate text-xs text-slate-200">{node.name}</span><Target className="h-3 w-3 text-slate-600" /></div>
                        <div className="mt-1 font-mono text-[9px] uppercase text-slate-500">{node.type || 'entity'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-3 font-mono text-[10px] tracking-widest text-slate-500">LIVE AGENT TRACE</div>
                <div className="space-y-2">
                  {activityTicks.slice(0, 7).map((tick) => (
                    <button key={tick.id} onClick={() => { setStage(tick.category === 'policy_gate' ? 'policy' : 'reasoning'); }} className="w-full rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-left hover:border-cyan-400/20">
                      <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] text-cyan-300">{tick.timestamp}</span><span className="font-mono text-[8px] text-slate-600">{tick.confidence}%</span></div>
                      <div className="mt-1 text-[10px] leading-relaxed text-slate-300">{tick.action}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <button onClick={() => { setStage('evidence'); onOpenEvidence('Agent Evidence Review', selectedNode ? `${selectedNode.name} is the current business reality focus.` : 'The agent is reviewing current business telemetry.', 92); }} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:border-cyan-400/30">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white"><FileSearch className="h-4 w-4 text-cyan-300" />Inspect evidence</div>
                  <div className="mt-1 text-[10px] text-slate-500">Open traceable evidence behind the active reasoning state.</div>
                </button>
                <button onClick={() => setStage('policy')} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] p-3 text-left hover:border-amber-400/30">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white"><ShieldCheck className="h-4 w-4 text-amber-300" />Policy gate</div>
                  <div className="mt-1 text-[10px] text-slate-500">{pendingActions.length ? `${pendingActions.length} proposed action(s) require human authorization.` : 'No pending external mutation is awaiting authorization.'}</div>
                </button>
                <button onClick={() => setStage('ledger')} className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-3 text-left hover:border-emerald-400/30">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white"><LockKeyhole className="h-4 w-4 text-emerald-300" />Execution ledger</div>
                  <div className="mt-1 text-[10px] text-slate-500">{executionRecords.length} server-authoritative execution record(s).</div>
                </button>
              </div>

              {selectedAction && pendingActions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3">
                  <div>
                    <div className="font-mono text-[9px] tracking-widest text-amber-300">PROPOSED ACTION</div>
                    <div className="mt-1 text-xs text-white">{selectedAction.title}</div>
                    <div className="mt-1 text-[9px] text-slate-500">{selectedAction.targetSystem} · risk {selectedAction.riskLevel}</div>
                  </div>
                  <button onClick={() => onExecuteAction(selectedAction)} className="flex items-center gap-2 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 font-mono text-[10px] font-bold text-amber-200 hover:bg-amber-300/20">
                    <Play className="h-3.5 w-3.5" /> OPEN AUTHORIZATION
                  </button>
                </div>
              )}
            </div>
          </main>

          <aside className="border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0">
            <div className="p-4">
              <div className="mb-3 font-mono text-[10px] tracking-widest text-slate-500">ACTIVE CONTEXT</div>
              {selectedNode ? (
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-3">
                  <div className="text-sm font-semibold text-white">{selectedNode.name}</div>
                  <div className="mt-1 font-mono text-[9px] uppercase text-cyan-300">{selectedNode.type || 'business entity'}</div>
                  <div className="mt-3 text-[10px] leading-relaxed text-slate-400">This business-world entity is directly connected to the active agent reasoning surface. Selecting it changes the evidence context rather than opening a separate planet or world interface.</div>
                </div>
              ) : <div className="text-xs text-slate-500">No business entity selected.</div>}

              <div className="mt-4 font-mono text-[10px] tracking-widest text-slate-500">RUNTIME CONTRACT</div>
              <div className="mt-2 space-y-2 text-[10px] leading-relaxed text-slate-400">
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />Agent reasons over business telemetry.</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />Evidence stays attached to the decision.</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />Policy Gate controls external mutation.</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />Ledger records authorized execution.</div>
              </div>
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="font-mono text-[10px] tracking-widest text-slate-500">QUICK NAVIGATION</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => onNavigateToView('missions')} className="rounded-lg border border-white/10 px-2 py-2 text-[9px] text-slate-400 hover:text-white">MISSIONS</button>
                <button onClick={() => onNavigateToView('agents')} className="rounded-lg border border-white/10 px-2 py-2 text-[9px] text-slate-400 hover:text-white">AGENTS</button>
                <button onClick={() => onNavigateToView('intelligence')} className="rounded-lg border border-white/10 px-2 py-2 text-[9px] text-slate-400 hover:text-white">INTELLIGENCE</button>
                <button onClick={() => onNavigateToView('automations')} className="rounded-lg border border-white/10 px-2 py-2 text-[9px] text-slate-400 hover:text-white">LEDGER</button>
              </div>
            </div>
          </aside>
        </div>

        <footer className="border-t border-white/10 bg-black/30 px-4 py-2.5 text-center font-mono text-[9px] tracking-[0.18em] text-slate-600">
          AI DECIDES ≠ AI EXECUTES · BUSINESS REALITY → AGENT REASONING → EVIDENCE → POLICY GATE → EXECUTION LEDGER
        </footer>
      </div>
    </section>
  );
};
