import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Radio,
  Sparkles,
  Layers,
  DollarSign,
  Activity,
  Users,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  BusinessMetric,
  BusinessAnomaly,
  BusinessOpportunity,
  Mission,
  Agent,
  WorldNode,
  IntelligenceEvent,
  ProposedAction,
  ExecutionRecord,
} from '../types';
import { BusinessWorld } from './BusinessWorld';
import { CommandCore } from './CommandCore';

interface CommandCenterProps {
  metrics: BusinessMetric[];
  anomalies: BusinessAnomaly[];
  opportunities: BusinessOpportunity[];
  missions: Mission[];
  agents: Agent[];
  nodes: WorldNode[];
  selectedNode: WorldNode | null;
  onSelectNode: (node: WorldNode) => void;
  events: IntelligenceEvent[];
  pendingActions: ProposedAction[];
  recentExecutions: ExecutionRecord[];
  onExecuteAction: (action: ProposedAction) => void;
  onSelectMission: (mission: Mission) => void;
  onSelectAgent: (agent: Agent) => void;
  onNavigateToView: (view: any) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  metrics,
  anomalies,
  opportunities,
  missions,
  agents,
  nodes,
  selectedNode,
  onSelectNode,
  events,
  pendingActions,
  recentExecutions,
  onExecuteAction,
  onSelectMission,
  onSelectAgent,
  onNavigateToView,
}) => {
  const criticalAnomalies = anomalies.filter((a) => a.significance === 'critical' || a.significance === 'warning');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. EXECUTIVE HORIZON: Visual Hierarchy & Living Pulse */}
      <div className="p-4 lg:p-5 rounded-xl os-glass-strong os-cyber-corners border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          {/* Executive Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] os-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 uppercase">
                EXECUTIVE INTELLIGENCE SYNTHESIS
              </span>
              <span className="text-xs os-mono text-slate-500">•</span>
              <span className="text-xs os-mono text-slate-400">Quarterly Trajectory: On Target</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white os-mono">
                $24.84M <span className="text-sm font-normal text-slate-400">ARR Run-Rate</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-xs os-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                <TrendingUp className="w-3.5 h-3.5" /> +28.4% YoY
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Company operational momentum is <strong className="text-white">Robust (92/100 Composite Score)</strong>. Core self-serve SaaS and developer usage remain strong (+34% MoM). 1 critical bottleneck detected in enterprise procurement cycle requiring immediate executive sponsor touchpoints.
            </p>
          </div>

          {/* Key Metric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg os-surface os-interactive">
              <div className="text-[10px] os-mono uppercase text-slate-400">Cash Runway</div>
              <div className="text-base font-bold os-mono text-white mt-0.5">22.4 Mos</div>
              <div className="text-[10px] os-mono text-slate-400">$4.1M in treasury</div>
            </div>

            <div className="p-3 rounded-lg os-surface os-interactive">
              <div className="text-[10px] os-mono uppercase text-slate-400">Gross Margin</div>
              <div className="text-base font-bold os-mono text-emerald-400 mt-0.5">79.6%</div>
              <div className="text-[10px] os-mono text-slate-400">+2.8% QoQ efficiency</div>
            </div>

            <div className="p-3 rounded-lg os-surface os-interactive">
              <div className="text-[10px] os-mono uppercase text-slate-400">Net Retention</div>
              <div className="text-base font-bold os-mono text-amber-300 mt-0.5">118.2%</div>
              <div className="text-[10px] os-mono text-slate-400">Target: &gt;120%</div>
            </div>

            <div className="p-3 rounded-lg os-surface os-interactive">
              <div className="text-[10px] os-mono uppercase text-slate-400">Active Orgs</div>
              <div className="text-base font-bold os-mono text-cyan-300 mt-0.5">1,428</div>
              <div className="text-[10px] os-mono text-slate-400">88 Enterprise accounts</div>
            </div>
          </div>
        </div>

        {/* PENDING APPROVAL NOTIFICATION STRIP (AI DECIDES != AI EXECUTES) */}
        {pendingActions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-lg bg-amber-950/25 border border-amber-500/40">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-300 os-mono">
                  {pendingActions.length} PROPOSED ACTIONS IN POLICY GATE
                </span>
                <p className="text-[11px] text-slate-300">
                  Autonomous agents have formulated actionable mitigation steps requiring Human Executive Authorization.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToView('automations')}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_14px_rgba(245,158,11,0.35)] shrink-0 os-mono"
            >
              <span>Review in Policy Gate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CYBER HUD QUICK-ACCESS RUNTIME BANNER */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl cyber-command-banner text-white overflow-hidden shadow-[0_0_25px_rgba(255,119,0,0.35)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            <Zap className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold tracking-widest text-black bg-white/90 px-1.5 py-0.2 rounded uppercase">
                CYBERNETIC COCKPIT ACTIVE
              </span>
              <span className="text-[11px] font-mono tracking-wider text-amber-100 font-semibold uppercase hidden md:inline">
                AIR-GAPPED IMMUTABLE GATE // DEFCON 1
              </span>
            </div>
            <div className="text-sm font-bold font-mono text-white">
              Launch High-Fidelity Cyber HUD Reasoning & Tactical Waveform Deck
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigateToView('cyber-hud')}
            className="w-full sm:w-auto px-4 py-2 rounded-full cyber-pill-orange text-xs font-mono font-black text-black tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(255,136,0,0.6)]"
          >
            <span>ENTER CYBER HUD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. PERSISTENT AI COMMAND CORE (Directly on Command Center) */}
      <CommandCore
        onExecuteAction={onExecuteAction}
        onOpenMission={onSelectMission}
      />

      {/* 3. CORE TWO-COLUMN OPERATIONAL SURFACE: Business World & Active Missions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Columns: Living Business World Model */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider os-mono">
                Live Business World Model
              </h3>
            </div>
            <span className="text-[11px] os-mono text-slate-400">
              Interactive visual graph • Click node to inspect
            </span>
          </div>

          {/* Interactive World Canvas */}
          <BusinessWorld
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
            onQuickInspectNode={(nodeId) => {
              if (nodeId === 'sales') onNavigateToView('sales');
              else if (nodeId === 'revenue') onNavigateToView('finance');
              else if (nodeId === 'operations') onNavigateToView('operations');
              else if (nodeId === 'customers') onNavigateToView('customers');
            }}
          />

          {/* Detected Anomalies Deck */}
          <div className="p-4 rounded-xl os-glass space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider os-mono">
                  Live Detected Anomalies & Bottlenecks ({criticalAnomalies.length})
                </h4>
              </div>
              <button
                onClick={() => onNavigateToView('intelligence')}
                className="text-[11px] os-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>All telemetry</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {criticalAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-3 rounded-lg os-surface os-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] os-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          anomaly.significance === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {anomaly.significance}
                      </span>
                      <span className="text-xs font-semibold text-white">{anomaly.metric}</span>
                      <span className="text-xs os-mono font-bold text-rose-400">{anomaly.delta}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{anomaly.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] os-mono text-slate-400">{anomaly.detectedAt}</span>
                    <button
                      onClick={() => onNavigateToView('missions')}
                      className="px-2.5 py-1 rounded os-surface hover:border-cyan-500/40 text-xs text-slate-200 hover:text-cyan-300 border border-white/10 transition-all os-mono"
                    >
                      Investigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Active Missions & High-Value Opportunities */}
        <div className="xl:col-span-5 space-y-4">
          {/* Active Missions Card */}
          <div className="p-4 rounded-xl os-glass space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider os-mono">
                  Autonomous Missions ({missions.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateToView('missions')}
                className="text-[11px] os-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Mission Engine</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => onSelectMission(mission)}
                  className="p-3.5 rounded-lg os-surface os-interactive cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] os-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            mission.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {mission.priority}
                        </span>
                        <span className="text-[10px] os-mono text-slate-400">Lead: {mission.leadAgent}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {mission.title}
                      </h4>
                    </div>
                    <span className="text-xs os-mono font-bold text-cyan-400">{mission.progress}%</span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{mission.objective}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#00f0ff]"
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] os-mono text-slate-400 pt-1">
                    <span>{mission.steps.filter((s) => s.status === 'completed').length} / {mission.steps.length} steps completed</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Value Opportunities Card */}
          <div className="p-4 rounded-xl os-glass space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider os-mono">
                  Expansion & Savings Opportunities
                </h4>
              </div>
            </div>

            <div className="space-y-2.5">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-lg os-surface os-interactive space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-semibold text-white">{opp.title}</h5>
                    <span className="text-xs os-mono font-bold text-emerald-400">{opp.estimatedValue}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{opp.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] os-mono text-slate-400 border-t border-white/[0.04]">
                    <span>Agent: {opp.recommendedAgent}</span>
                    <span className="text-cyan-300">Confidence: {opp.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active AI Agent Swarm Mini-Matrix */}
          <div className="p-4 rounded-xl os-glass space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider os-mono">
                AI Agent Fleet (8 Active)
              </span>
              <button
                onClick={() => onNavigateToView('agents')}
                className="text-[11px] os-mono text-cyan-400 hover:text-cyan-300"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {agents.slice(0, 4).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => onSelectAgent(ag)}
                  className="p-2.5 rounded-lg os-surface os-interactive cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{ag.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 os-live-dot" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{ag.role}</div>
                  <div className="text-[10px] os-mono text-cyan-300 font-medium">Confidence: {ag.confidence}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
