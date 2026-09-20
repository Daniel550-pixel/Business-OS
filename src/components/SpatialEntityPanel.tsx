import React from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Building2,
  Server,
  Layers,
  FileCheck,
  Cpu,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { HierarchyEntity } from '../types';

interface SpatialEntityPanelProps {
  entity: HierarchyEntity | null;
  onClose: () => void;
  onInvestigate: (entity: HierarchyEntity) => void;
  onExplainEvidence: (entity: HierarchyEntity) => void;
  onQuickAction?: (actionTitle: string, entity: HierarchyEntity) => void;
}

export const SpatialEntityPanel: React.FC<SpatialEntityPanelProps> = ({
  entity,
  onClose,
  onInvestigate,
  onExplainEvidence,
  onQuickAction,
}) => {
  if (!entity) return null;

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'company':
        return { label: 'Company Digital Twin', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'division':
        return { label: 'Operating Division', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'operation':
        return { label: 'Operational Subsystem', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'customer':
        return { label: 'Enterprise Account', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'transaction':
        return { label: 'Transaction / Trace', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: level.toUpperCase(), color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  const badge = getLevelBadge(entity.level);

  // Health bar calculations
  const healthBarsTotal = 10;
  const filledBars = Math.round((entity.healthScore / 100) * healthBarsTotal);

  return (
    <aside
      aria-label="Spatial Entity Inspector"
      className="fixed right-4 top-20 bottom-16 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0b0f19]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_12px_48px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-start justify-between bg-white/[0.02]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${badge.color}`}
            >
              {badge.label}
            </span>
            <span className="text-[10px] font-mono text-slate-500">{entity.code}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">{entity.name}</h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Entity Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Metric Contribution Card */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">{entity.metricLabel}</div>
          <div className="text-xl font-bold text-white tracking-tight">{entity.revenueOrMetric}</div>
          <div className="text-[11px] text-slate-400 font-sans">{entity.headcountOrCapacity}</div>
        </div>

        {/* Relationship / Health Index */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Health & Relationship</span>
            <span className="font-bold text-cyan-400">{entity.healthScore}%</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: healthBarsTotal }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm transition-all ${
                  i < filledBars
                    ? entity.healthScore >= 80
                      ? 'bg-emerald-400'
                      : entity.healthScore >= 65
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                    : 'bg-white/[0.08]'
                }`}
              />
            ))}
          </div>
          <div className="text-[10px] text-slate-500">
            {entity.status === 'optimal'
              ? 'Steady state • Low risk trajectory'
              : entity.status === 'warning'
              ? 'Warning • Intervention suggested'
              : 'Critical • Active bottleneck'}
          </div>
        </div>

        {/* Summary Description */}
        <div className="space-y-1 font-sans">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Operational Context</div>
          <p className="text-xs text-slate-300 leading-relaxed">{entity.summary}</p>
        </div>

        {/* Recent Signals & Trends */}
        {entity.signals && entity.signals.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase">Recent Signals</div>
            <div className="space-y-1">
              {entity.signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <span className="text-slate-200">{sig.label}</span>
                  {sig.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : sig.trend === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Autonomous Agents Assigned */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-slate-400 uppercase">Active Assigned Agents</div>
          <div className="flex flex-wrap gap-1.5">
            {entity.activeAgents.map((agentName, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] flex items-center gap-1"
              >
                <Cpu className="w-3 h-3 text-indigo-400" />
                <span>{agentName}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Evidence Button */}
        {entity.evidence && (
          <button
            onClick={() => onExplainEvidence(entity)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Inspect Telemetry & Evidence</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-cyan-400">View</span>
          </button>
        )}
      </div>

      {/* Spatial Action Controls */}
      <div className="p-3 border-t border-white/[0.08] bg-black/40 space-y-2">
        <button
          onClick={() => onInvestigate(entity)}
          className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(6,182,212,0.3)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Investigation</span>
        </button>

        {onQuickAction && entity.level === 'customer' && (
          <button
            onClick={() => onQuickAction(`Schedule Executive Concierge Sponsor for ${entity.name}`, entity)}
            className="w-full py-1.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Schedule Executive Touchpoint</span>
          </button>
        )}
      </div>
    </aside>
  );
};
