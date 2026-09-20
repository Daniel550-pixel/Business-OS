import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  X,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { ProposedAction, AICommandResponse, Mission, TemporalEpoch, ViewMode, OperatingMode } from '../types';

interface CommandCoreProps {
  onExecuteAction: (action: ProposedAction) => void;
  onOpenMission: (mission: Mission) => void;
  onHighlightNodes?: (nodes: string[]) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
  onOpenFocus?: (objectiveId: string) => void;
  onSetEpoch?: (epoch: TemporalEpoch) => void;
  onOpenScenarioModeling?: () => void;
  onSelectEntityId?: (entityId: string) => void;
  onNavigateToView?: (view: ViewMode) => void;
  onSetOperatingMode?: (mode: OperatingMode) => void;
}

export const CommandCore: React.FC<CommandCoreProps> = ({
  onExecuteAction,
  onOpenMission,
  onHighlightNodes,
  isOpenAsModal = false,
  onCloseModal,
  onOpenFocus,
  onSetEpoch,
  onOpenScenarioModeling,
  onSelectEntityId,
  onNavigateToView,
  onSetOperatingMode,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [result, setResult] = useState<AICommandResponse | null>(null);
  const [executedActionIds, setExecutedActionIds] = useState<string[]>([]);

  const sampleQueries = [
    'Investigate the enterprise revenue anomaly and cause analysis.',
    'Compare our current operating state with six months ago.',
    'Show me customers with declining activity and seat contraction.',
    'Simulate future scenarios if enterprise growth slows down.',
    'Switch to executive cockpit mode with top decisions.',
  ];

  const handleRunCommand = async (queryToRun?: string) => {
    const query = queryToRun || inputQuery;
    if (!query.trim()) return;

    const lower = query.toLowerCase();

    // Natural language navigation triggers
    if (lower.includes('investigate') && (lower.includes('revenue') || lower.includes('anomaly')) && onOpenFocus) {
      if (onCloseModal) onCloseModal();
      onOpenFocus('focus_revenue_anomaly');
      return;
    }
    if ((lower.includes('six months ago') || lower.includes('january') || lower.includes('historical')) && onSetEpoch) {
      onSetEpoch('JAN');
      if (onCloseModal) onCloseModal();
      return;
    }
    if ((lower.includes('simulate') || lower.includes('scenario') || lower.includes('what would happen')) && onOpenScenarioModeling) {
      if (onCloseModal) onCloseModal();
      onOpenScenarioModeling();
      return;
    }
    if ((lower.includes('declining') || lower.includes('customer') || lower.includes('freight')) && onSelectEntityId) {
      if (onCloseModal) onCloseModal();
      onSelectEntityId('cust_globalfreight');
      return;
    }
    if ((lower.includes('executive mode') || lower.includes('executive cockpit')) && onSetOperatingMode) {
      if (onCloseModal) onCloseModal();
      onSetOperatingMode('executive');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setAnalysisSteps([]);

    // Step-by-step visual stream of intelligence
    const stepSequence = [
      'Ingesting Stripe, Salesforce & telemetry telemetry...',
      'Synthesizing customer activity & workspace seat utilization...',
      'Auditing enterprise sales pipeline velocity & contract stages...',
      'Correlating cloud infrastructure egress & cluster latency metrics...',
      'Synthesizing agent recommendations and policy constraints...',
    ];

    for (let i = 0; i < stepSequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 260));
      setAnalysisSteps((prev) => [...prev, stepSequence[i]]);
    }

    try {
      const response = await fetch('/api/gemini/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: query,
          businessContext: {
            arr: '$24.84M',
            runway: '22.4 mos',
            nrr: '118.2%',
            pipeline: '$14.2M',
            activeOrgs: 1428,
          },
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
        if (json.data.affectedNodes && onHighlightNodes) {
          onHighlightNodes(json.data.affectedNodes);
        }
      }
    } catch (err) {
      console.error('Command API error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuthorizeAction = (action: ProposedAction) => {
    onExecuteAction(action);
    setExecutedActionIds((prev) => [...prev, action.id]);
  };

  const handlePromoteToMission = () => {
    if (!result) return;
    const newMission: Mission = {
      id: `miss_${Date.now()}`,
      title: result.mission.title,
      objective: result.mission.objective,
      status: 'active',
      leadAgent: result.mission.leadAgent || 'Sales Agent',
      collaboratingAgents: result.mission.collaboratingAgents || ['Finance Agent'],
      progress: 25,
      startedAt: 'Just now',
      priority: 'urgent',
      steps: result.mission.steps.map((s, idx) => ({
        id: `s_${idx}`,
        title: s,
        status: idx === 0 ? 'in_progress' : 'pending',
        assignedAgent: result.mission.leadAgent,
      })),
      findings: result.anomalies.map((a) => `${a.metric} (${a.delta}): ${a.description}`),
      recommendations: result.recommendations,
      proposedActions: result.proposedActions,
    };
    onOpenMission(newMission);
  };

  const containerContent = (
    <div className="w-full rounded-xl bg-[#0b0f19]/90 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-950/30 via-transparent to-blue-950/20 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-slate-100 uppercase">AI Command Core</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                INTENT REASONING
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Natural-language business intelligence & policy-gated action proposal</p>
          </div>
        </div>

        {isOpenAsModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Prompt Form */}
      <div className="p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunCommand();
          }}
          className="relative flex items-center"
        >
          <input
            id="command-core-input"
            name="command"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type business intent: 'Analyze why revenue dropped this week and what we should investigate'..."
            className="w-full pl-4 pr-24 py-3 rounded-lg bg-black/40 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-mono transition-all"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputQuery.trim()}
            className="absolute right-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Reasoning</span>
              </>
            ) : (
              <>
                <span>Execute</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> Prompts:
          </span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputQuery(q);
                handleRunCommand(q);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors truncate max-w-[280px]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Stream of Analysis Steps during processing */}
      {isProcessing && (
        <div className="px-4 pb-4">
          <div className="p-3 rounded-lg bg-black/30 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Agent Swarm Reasoning in Progress...</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              {analysisSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Output Panel: User Request -> Analysis -> Anomalies -> Recommendation -> Proposed Action -> Execution */}
      {result && (
        <div className="px-4 pb-5 space-y-4 border-t border-white/[0.06] pt-4">
          {/* Mission Created Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-300 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  INTELLIGENCE SYNTHESIS READY
                </span>
                <h4 className="text-sm font-semibold text-white">{result.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                  <span>Confidence: <span className="text-cyan-300">{result.confidence}%</span></span>
                  <span>•</span>
                  <span>Lead: <span className="text-slate-200">{result.mission.leadAgent}</span></span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePromoteToMission}
              className="px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0"
            >
              <span>Promote to Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Analysis Narrative */}
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="uppercase tracking-wider text-slate-300 font-semibold">AI Business Analysis</span>
              <span className="text-slate-500">Autonomous synthesis</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{result.analysis}</p>
          </div>

          {/* Quantified Anomalies Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{result.anomalies.length} Critical Deviations Detected</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {result.anomalies.map((anom, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border ${
                    anom.significance === 'critical'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : anom.significance === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-cyan-950/20 border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{`0${idx + 1}`}</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        anom.significance === 'critical'
                          ? 'text-rose-400'
                          : anom.significance === 'warning'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {anom.delta}
                    </span>
                  </div>
                  <h5 className="text-xs font-medium text-slate-200 mt-0.5">{anom.metric}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{anom.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-300">Agent Recommendations</h5>
            <ul className="space-y-1 text-xs text-slate-300">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono mt-0.5">›</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* POLICY GATE: AI DECIDES != AI EXECUTES */}
          <div className="p-3.5 rounded-lg bg-gradient-to-br from-[#121826] to-[#0c1017] border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold tracking-wider text-slate-100 uppercase font-mono">
                  POLICY GATE: PROPOSED ACTIONS
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                HUMAN AUTHORIZATION REQUIRED
              </span>
            </div>

            <div className="space-y-2.5">
              {result.proposedActions.map((action) => {
                const isExecuted = executedActionIds.includes(action.id);
                return (
                  <div
                    key={action.id}
                    className="p-3 rounded-md bg-black/40 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            action.riskLevel === 'critical' || action.riskLevel === 'high'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : action.riskLevel === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {action.riskLevel} Risk
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: {action.targetSystem}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-200">{action.title}</p>
                      {action.parameters && (
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-md">
                          Params: {JSON.stringify(action.parameters)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExecuted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          COMMITTED
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAuthorizeAction(action)}
                          className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Authorize & Execute</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
};
