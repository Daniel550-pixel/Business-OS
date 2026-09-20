import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  ShieldAlert,
  Play,
  Pause,
  Filter,
  ArrowUpRight,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { AIActivityTick } from '../types';

interface AIActivityStreamProps {
  ticks: AIActivityTick[];
  onSelectEntity?: (entityId: string) => void;
  onOpenApproval?: () => void;
}

export const AIActivityStream: React.FC<AIActivityStreamProps> = ({
  ticks,
  onSelectEntity,
  onOpenApproval,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const filteredTicks = ticks.filter((tick) => {
    if (filter === 'all') return true;
    if (filter === 'policy_gate') return tick.category === 'policy_gate';
    if (filter === 'telemetry') return tick.category === 'telemetry';
    if (filter === 'reasoning') return tick.category === 'reasoning' || tick.category === 'comparison';
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'policy_gate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'telemetry':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'reasoning':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'comparison':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'proposal':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-slate-400 bg-white/[0.04] border-white/10';
    }
  };

  return (
    <div className="rounded-xl os-surface border border-white/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.42)] overflow-hidden">
      {/* Stream Header */}
      <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.025]">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-cyan-500/20 text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live AI Activity Stream
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Autonomous multi-agent observation & reasoning bus
            </span>
          </div>
        </div>

        {/* Filter and Pause Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/[0.06] text-[10px] font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded ${
                filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('policy_gate')}
              className={`px-2 py-0.5 rounded ${
                filter === 'policy_gate'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Policy Gate
            </button>
            <button
              onClick={() => setFilter('reasoning')}
              className={`px-2 py-0.5 rounded ${
                filter === 'reasoning'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reasoning
            </button>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title={isPaused ? 'Resume stream' : 'Pause stream'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Stream Ticks List */}
      <div className="p-3 space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
        {filteredTicks.map((tick) => {
          const isPolicyGate = tick.category === 'policy_gate';

          return (
            <div
              key={tick.id}
              className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                isPolicyGate
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
                  : 'bg-white/[0.015] border-white/[0.04] hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-[11px] text-slate-500 shrink-0 font-bold pt-0.5">
                  {tick.timestamp}
                </span>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-xs">{tick.agentName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${getCategoryColor(
                        tick.category
                      )}`}
                    >
                      {tick.category.replace('_', ' ')}
                    </span>
                    {tick.confidence && (
                      <span className="text-[10px] text-slate-500">
                        ({tick.confidence}% conf)
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {tick.action}{' '}
                    {tick.target && (
                      <span className="text-cyan-400/90 font-bold underline decoration-cyan-500/30 underline-offset-2">
                        {tick.target}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                {isPolicyGate ? (
                  <button
                    onClick={onOpenApproval}
                    className="px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center gap-1 transition-all"
                  >
                    <span>Review & Authorize</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                ) : tick.entityId && onSelectEntity ? (
                  <button
                    onClick={() => onSelectEntity(tick.entityId!)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors"
                    title="Inspect Entity"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
