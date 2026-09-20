import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Server,
  Users,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
} from 'lucide-react';
import { HierarchyEntity, HierarchyLevel } from '../types';
import { initialHierarchyEntities } from '../data/digitalTwinData';

interface DigitalTwinHierarchyProps {
  onSelectEntity: (entity: HierarchyEntity) => void;
  onExplainEvidence: (entity: HierarchyEntity) => void;
  onInvestigateEntity: (entity: HierarchyEntity) => void;
}

export const DigitalTwinHierarchy: React.FC<DigitalTwinHierarchyProps> = ({
  onSelectEntity,
  onExplainEvidence,
  onInvestigateEntity,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel>('company');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const levels: { id: HierarchyLevel; num: string; label: string; desc: string }[] = [
    { id: 'company', num: 'L1', label: 'Company Overview', desc: 'Consolidated macro run-rate & global autonomous posture' },
    { id: 'division', num: 'L2', label: 'Divisions', desc: 'Enterprise, Cloud Platform, Mid-Market PLG, Sovereign' },
    { id: 'operation', num: 'L3', label: 'Operations', desc: 'EMEA Pipeline, Frankfurt Cluster, Billing Reconciler' },
    { id: 'customer', num: 'L4', label: 'Customers', desc: 'Siemens AG, Acme Corp, Standard Chartered, Global Freight' },
    { id: 'transaction', num: 'L5', label: 'Transactions & Traces', desc: 'Contract #OPP-8921, Telemetry Egress Stream, Okta Drift' },
  ];

  const currentLevelEntities = initialHierarchyEntities.filter((entity) => {
    // If search is active, match anywhere
    if (searchQuery.trim()) {
      return (
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedParentId) {
      return entity.parentId === selectedParentId && entity.level === selectedLevel;
    }

    return entity.level === selectedLevel;
  });

  // Helper for breadcrumbs
  const selectedParentEntity = initialHierarchyEntities.find((e) => e.id === selectedParentId);

  return (
    <div className="space-y-6">
      {/* Hierarchy Navigation Header */}
      <div className="rounded-2xl bg-[#080b12] border border-white/[0.08] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                <ZoomIn className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                Navigable Computational Model of Business
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-mono">
              Digital Twin 5-Level Zoom Hierarchy
            </h2>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search entities, codes, traces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* 5-Level Depth Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.id && !searchQuery;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id);
                  setSearchQuery('');
                  setSelectedParentId(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {lvl.num}
                  </span>
                </div>
                <div className="text-xs font-bold font-mono text-white mt-2">{lvl.label}</div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">{lvl.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
          <span>Active Scope:</span>
          <button
            onClick={() => {
              setSelectedLevel('company');
              setSelectedParentId(null);
            }}
            className="hover:text-cyan-400 transition-colors"
          >
            Company
          </button>
          {selectedParentEntity && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-bold">{selectedParentEntity.name}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-bold">Search: "{searchQuery}"</span>
            </>
          )}
        </div>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentLevelEntities.map((entity) => {
          const isWarning = entity.status === 'warning';
          const isCritical = entity.status === 'critical';

          return (
            <div
              key={entity.id}
              className={`rounded-2xl border bg-[#0a0d16] p-5 space-y-4 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.8)] ${
                isCritical
                  ? 'border-rose-500/50 hover:border-rose-500'
                  : isWarning
                  ? 'border-amber-500/40 hover:border-amber-500/70'
                  : 'border-white/[0.08] hover:border-cyan-500/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 font-bold uppercase">
                      {entity.code}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCritical ? 'bg-rose-400 animate-ping' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <h3 className="text-base font-bold text-white font-mono truncate">{entity.name}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    {entity.revenueOrMetric}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{entity.metricLabel}</span>
                </div>
              </div>

              {/* Health Score & Visual Bar */}
              <div className="space-y-1.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Health / Operational Fidelity</span>
                  <span className="font-bold text-white">{entity.healthScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      entity.healthScore >= 80
                        ? 'bg-emerald-400'
                        : entity.healthScore >= 65
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${entity.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                {entity.summary}
              </p>

              {/* Signals */}
              {entity.signals && entity.signals.length > 0 && (
                <div className="space-y-1">
                  {entity.signals.slice(0, 2).map((sig, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-2 py-1 rounded bg-white/[0.02]"
                    >
                      <span className="truncate pr-2">{sig.label}</span>
                      {sig.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : sig.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {/* Card Actions */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectEntity(entity)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors"
                >
                  Spatial Inspector
                </button>

                <div className="flex items-center gap-1.5">
                  {entity.evidence && (
                    <button
                      onClick={() => onExplainEvidence(entity)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04]"
                      title="Explain Evidence"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  )}

                  {entity.childrenCount !== undefined && entity.childrenCount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedParentId(entity.id);
                        if (entity.level === 'company') setSelectedLevel('division');
                        if (entity.level === 'division') setSelectedLevel('operation');
                        if (entity.level === 'operation') setSelectedLevel('customer');
                        if (entity.level === 'customer') setSelectedLevel('transaction');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center gap-1 transition-all"
                    >
                      <span>Drill In ({entity.childrenCount})</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
