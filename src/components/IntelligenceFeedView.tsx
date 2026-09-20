import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { IntelligenceEvent, ProposedAction } from '../types';

interface IntelligenceFeedViewProps {
  events: IntelligenceEvent[];
  onExecuteAction: (action: ProposedAction) => void;
}

export const IntelligenceFeedView: React.FC<IntelligenceFeedViewProps> = ({
  events,
  onExecuteAction,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [activeEvent, setActiveEvent] = useState<IntelligenceEvent | null>(events[0] || null);

  const filteredEvents = events.filter((ev) => {
    const domainMatch = selectedDomain === 'all' || ev.domain === selectedDomain;
    const severityMatch = selectedSeverity === 'all' || ev.severity === selectedSeverity;
    return domainMatch && severityMatch;
  });

  const getDomainIcon = (domain?: string) => {
    switch (domain) {
      case 'sales':
        return <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
      case 'operations':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'customers':
        return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      case 'finance':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'security':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  const handleRunEventMitigation = (ev: IntelligenceEvent) => {
    if (!ev.recommendedAction) return;
    const action: ProposedAction = {
      id: `act_ev_${Date.now()}`,
      title: ev.recommendedAction,
      riskLevel: ev.severity === 'critical' ? 'high' : 'medium',
      targetSystem: `${ev.source} Integration Layer`,
      requiresApproval: true,
      status: 'PROPOSED',
      parameters: {
        eventId: ev.id,
        summary: ev.summary,
        entityId: ev.entityId,
      },
    };
    onExecuteAction(action);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Horizon Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b101c] to-[#121626] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                LIVE CORPORATE INTELLIGENCE STREAM
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Event Ingestion, Anomaly Sensing & Risk Detection</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Real-time multi-system telemetry aggregated across Stripe, Salesforce, Datadog, AWS, Okta, and GitHub.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              <option value="all">All Domains</option>
              <option value="sales">Sales &amp; Pipeline</option>
              <option value="operations">Cloud Operations</option>
              <option value="customers">Customers</option>
              <option value="finance">Finance</option>
              <option value="security">Security &amp; IAM</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info / Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Stream & Inspection Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Ingestion Feed */}
        <div className="lg:col-span-6 space-y-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Chronological Events Stream ({filteredEvents.length})
          </span>

          <div className="space-y-2">
            {filteredEvents.map((ev) => {
              const isSelected = activeEvent?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setActiveEvent(ev)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_16px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0b0f19] border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-black/40 border border-white/10">
                        {getDomainIcon(ev.domain)}
                      </div>
                      <span className="text-xs font-bold text-white">{ev.summary}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                        ev.severity === 'critical' || ev.severity === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : ev.severity === 'warning' || ev.severity === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {ev.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{ev.details}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/[0.04]">
                    <span>Source: {ev.source}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Columns: Deep Telemetry Inspector & Direct Mitigation */}
        {activeEvent && (
          <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-[#0b0f19] border border-white/[0.08]">
            <div className="space-y-2 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    activeEvent.severity === 'critical' || activeEvent.severity === 'high'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : activeEvent.severity === 'warning' || activeEvent.severity === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {activeEvent.severity} Severity
                </span>
                <span className="text-xs font-mono text-slate-500">{activeEvent.timestamp}</span>
              </div>
              <h3 className="text-base font-bold text-white">{activeEvent.summary}</h3>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Event Forensic Trace
              </span>
              <p className="text-xs text-slate-200 leading-relaxed p-3.5 rounded-xl bg-black/40 border border-white/[0.06] font-mono">
                {activeEvent.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                <div className="text-[10px] text-slate-500 uppercase">Origin Source</div>
                <div className="text-slate-200 font-bold mt-0.5">{activeEvent.source}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                <div className="text-[10px] text-slate-500 uppercase">Target Entity</div>
                <div className="text-cyan-300 font-bold mt-0.5">{activeEvent.entityId}</div>
              </div>
            </div>

            {/* AI Agent Recommendation & Policy Gate Trigger */}
            {activeEvent.recommendedAction && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#121826] to-[#0c1017] border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Agent Mitigation Proposal</span>
                </div>
                <p className="text-xs text-slate-200">{activeEvent.recommendedAction}</p>
                <button
                  onClick={() => handleRunEventMitigation(activeEvent)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Submit to Policy Gate for Execution</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
