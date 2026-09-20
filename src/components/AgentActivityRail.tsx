import React from 'react';
import { Bot, BrainCircuit, CircleDot, Radio } from 'lucide-react';
import { Agent } from '../types';

interface AgentActivityRailProps { agents: Agent[]; }

export const AgentActivityRail: React.FC<AgentActivityRailProps> = ({ agents }) => {
  const active = agents.filter(a => a.status === 'active' || a.status === 'analyzing').slice(0, 5);
  return (
    <div className="absolute left-3 bottom-3 z-30 w-[300px] max-w-[calc(100%-24px)] rounded-xl border border-white/10 bg-[#090d15]/90 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-300"><Radio className="w-3 h-3 text-cyan-400" /> AI activity</div>
        <span className="text-[9px] font-mono text-cyan-300">{active.length} active</span>
      </div>
      <div className="p-2 space-y-1.5">
        {active.map(agent => (
          <div key={agent.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.035]">
            <div className="relative shrink-0"><CircleDot className="w-3.5 h-3.5 text-cyan-400" /><span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30" /></div>
            <div className="min-w-0 flex-1"><div className="text-[10px] text-slate-200 truncate">{agent.name}</div><div className="text-[9px] text-slate-500 truncate">{agent.currentMission || agent.context}</div></div>
            <BrainCircuit className="w-3 h-3 text-slate-600" />
          </div>
        ))}
        {!active.length && <div className="px-2 py-3 text-[10px] text-slate-500 font-mono">No active agent work.</div>}
      </div>
    </div>
  );
};
