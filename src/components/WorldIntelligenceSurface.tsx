import React from 'react';
import { Activity, ArrowUpRight, Bot, CircleAlert, Database, Gauge, ShieldCheck, Target, X } from 'lucide-react';
import { Agent, WorldNode } from '../types';

interface WorldIntelligenceSurfaceProps {
  node: WorldNode | null;
  agents: Agent[];
  onClose: () => void;
  onDrillIn?: (nodeId: string) => void;
}

export const WorldIntelligenceSurface: React.FC<WorldIntelligenceSurfaceProps> = ({
  node,
  agents,
  onClose,
  onDrillIn,
}) => {
  if (!node) return null;

  const relatedAgents = agents.filter((agent) =>
    agent.domain.toLowerCase().includes(node.type) ||
    agent.currentMission?.toLowerCase().includes(node.label.toLowerCase())
  ).slice(0, 3);

  return (
    <aside className="absolute top-3 right-3 bottom-3 z-40 w-[min(390px,calc(100%-24px))] rounded-2xl border border-white/10 bg-[#090d15]/96 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,.65)] overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-white/[0.07] flex items-start justify-between">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[.22em] text-cyan-400">Context surface</div>
          <h3 className="mt-1 text-base font-semibold text-white">{node.label}</h3>
          <div className="mt-1 text-[11px] font-mono text-slate-400">{node.type.toUpperCase()} · {node.metric}</div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <div className="mt-2 text-[9px] uppercase font-mono text-slate-500">State</div>
            <div className="text-xs text-slate-200">{node.status}</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
            <CircleAlert className="w-3.5 h-3.5 text-amber-400" />
            <div className="mt-2 text-[9px] uppercase font-mono text-slate-500">Anomalies</div>
            <div className="text-xs text-slate-200">{node.details.activeAnomalies}</div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div className="mt-2 text-[9px] uppercase font-mono text-slate-500">Risk</div>
            <div className="text-xs text-slate-200">{node.details.riskScore}/100</div>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400"><Activity className="w-3.5 h-3.5 text-cyan-400" /> Intelligence</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{node.description}</p>
        </section>

        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400"><Target className="w-3.5 h-3.5 text-cyan-400" /> Key drivers</div>
          <div className="mt-2 space-y-1.5">
            {node.details.keyDrivers.map((driver) => (
              <div key={driver} className="flex items-center gap-2 text-[11px] text-slate-300"><span className="w-1 h-1 rounded-full bg-cyan-400" />{driver}</div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400"><Bot className="w-3.5 h-3.5 text-cyan-400" /> Active intelligence</div>
          <div className="mt-2 space-y-2">
            {(relatedAgents.length ? relatedAgents : agents.filter(a => a.status === 'active' || a.status === 'analyzing').slice(0, 3)).map((agent) => (
              <div key={agent.id} className="rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-200">{agent.name}</span>
                  <span className="text-[9px] font-mono text-cyan-300">{agent.status}</span>
                </div>
                <div className="mt-1 text-[10px] text-slate-500 truncate">{agent.currentMission || agent.context}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.035] p-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300"><Database className="w-3.5 h-3.5" /> OWNER AGENT</div>
          <div className="mt-1 text-xs text-slate-200">{node.details.ownerAgent}</div>
          <div className="mt-1 text-[10px] text-slate-500">{node.details.headcountOrCapacity}</div>
        </div>
      </div>

      {onDrillIn && (
        <div className="mt-auto p-3 border-t border-white/[0.07]">
          <button onClick={() => onDrillIn(node.id)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 py-2.5 text-xs font-semibold transition-colors">
            Open domain telemetry <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
