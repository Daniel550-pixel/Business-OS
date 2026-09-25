import React, { useCallback, useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { CommandCenter } from './components/CommandCenter';
import { BusinessWorld } from './components/BusinessWorld';
import { CommandCore } from './components/CommandCore';
import { MissionsView } from './components/MissionsView';
import { AgentsView } from './components/AgentsView';
import { FinanceView } from './components/FinanceView';
import { SalesView } from './components/SalesView';
import { OperationsView } from './components/OperationsView';
import { CustomersView } from './components/CustomersView';
import { ResearchView } from './components/ResearchView';
import { IntelligenceFeedView } from './components/IntelligenceFeedView';
import { AutomationsView } from './components/AutomationsView';
import { ApprovalModal } from './components/ApprovalModal';

// Next-Gen Digital Twin & Architecture Extensions
import { SpatialEntityPanel } from './components/SpatialEntityPanel';
import { FocusModeView } from './components/FocusModeView';
import { TemporalTimeline } from './components/TemporalTimeline';
import { ScenarioModelingModal } from './components/ScenarioModelingModal';
import { EvidenceModal } from './components/EvidenceModal';
import { DigitalTwinHierarchy } from './components/DigitalTwinHierarchy';
import { ExecutiveCockpit } from './components/ExecutiveCockpit';
import { AIIntelligenceLayer } from './components/AIIntelligenceLayer';
import { AIActivityStream } from './components/AIActivityStream';
import { SecurityHUD } from './components/SecurityHUD';
import { PlanetHero } from './components/PlanetHero';
import { PlanetaryAtmosphere } from './components/PlanetaryAtmosphere';
import { NeuralFlowOverlay } from './components/NeuralFlowOverlay';

import {
  initialMetrics,
  initialAnomalies,
  initialOpportunities,
  initialMissions,
  initialAgents,
  initialWorldNodes,
  initialEvents,
  initialPendingActions,
  initialExecutionRecords,
  initialAIActivityStreamTicks,
} from './data/mockBusinessState';

import {
  initialHierarchyEntities,
  initialFocusObjectives,
  initialTemporalSnapshots,
} from './data/digitalTwinData';

import {
  ViewMode,
  OperatingMode,
  SystemRuntimeState,
  HierarchyEntity,
  FocusObjective,
  ScenarioModel,
  TemporalEpoch,
  WorldNode,
  Mission,
  Agent,
  ProposedAction,
  ExecutionRecord,
} from './types';

export default function App() {
  useEffect(() => {
    const a = document.getElementById('businessOsBgA') as HTMLVideoElement | null;
    const b = document.getElementById('businessOsBgB') as HTMLVideoElement | null;
    if (!a || !b) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a.removeAttribute('autoplay');
      a.pause(); b.pause();
      try { a.currentTime = 0; } catch {}
      return;
    }

    const FADE = 0.9;
    let cur = a;
    let nxt = b;
    let swapping = false;
    const play = (v: HTMLVideoElement) => {
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const tick = () => {
      if (swapping || !cur.duration) return;
      if (cur.duration - cur.currentTime > FADE) return;
      swapping = true;
      const out = cur;
      try { nxt.currentTime = 0; } catch {}
      play(nxt);
      nxt.classList.add('is-active');
      out.classList.remove('is-active');
      [cur, nxt] = [nxt, cur];
      window.setTimeout(() => {
        out.pause();
        try { out.currentTime = 0; } catch {}
        swapping = false;
      }, FADE * 1000 + 100);
    };

    a.addEventListener('timeupdate', tick);
    b.addEventListener('timeupdate', tick);
    play(a);
    return () => {
      a.removeEventListener('timeupdate', tick);
      b.removeEventListener('timeupdate', tick);
    };
  }, []);

  const [activeView, setActiveView] = useState<ViewMode>('command-center');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('operate');
  const [systemState, setSystemState] = useState<SystemRuntimeState>('risk_detected');

  // Business State Entities
  const [metrics, setMetrics] = useState(initialMetrics);
  const [anomalies] = useState(initialAnomalies);
  const [opportunities] = useState(initialOpportunities);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(initialMissions[0]);

  const [agents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(initialAgents[0]);

  const [nodes, setNodes] = useState<WorldNode[]>(initialWorldNodes);
  const [selectedNode, setSelectedNode] = useState<WorldNode | null>(initialWorldNodes[0]);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);

  const [events] = useState(initialEvents);
  const [pendingActions, setPendingActions] = useState<ProposedAction[]>(() => {
    try {
      const stored = window.localStorage.getItem('business-os.pending-actions');
      return stored ? JSON.parse(stored) as ProposedAction[] : initialPendingActions;
    } catch {
      return initialPendingActions;
    }
  });
  const [executionRecords, setExecutionRecords] = useState<ExecutionRecord[]>(initialExecutionRecords);
  const [executedActionIds, setExecutedActionIds] = useState<string[]>([]);

  // Digital Twin Hierarchy & Spatial Entities
  const [selectedSpatialEntity, setSelectedSpatialEntity] = useState<HierarchyEntity | null>(null);

  // Focus Mode
  const [activeFocusObjective, setActiveFocusObjective] = useState<FocusObjective | null>(null);

  // Temporal Navigation
  const [currentEpoch, setCurrentEpoch] = useState<TemporalEpoch>('NOW');

  // Modals & Inspection Surfaces
  const [approvalAction, setApprovalAction] = useState<ProposedAction | null>(null);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  // Explain This / Evidence Surface
  const [evidenceData, setEvidenceData] = useState<{
    isOpen: boolean;
    title: string;
    claim: string;
    confidence: number;
    factors?: { name: string; weight: number; impact: string }[];
    metricsEvidence?: {
      transactionsCount?: number;
      crmEventsCount?: number;
      historicalComparisons?: number;
      traces?: { id: string; timestamp: string; text: string }[];
    };
  }>({
    isOpen: false,
    title: '',
    claim: '',
    confidence: 90,
  });

  // AI Activity stream ticks
  const [activityTicks, setActivityTicks] = useState(initialAIActivityStreamTicks);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBackToPlanet, setShowBackToPlanet] = useState(false);

  // The browser keeps only proposal state; the durable execution ledger is server-authoritative.
  useEffect(() => {
    try {
      window.localStorage.setItem('business-os.pending-actions', JSON.stringify(pendingActions));
    } catch {
      // Storage is an optimization; server-side execution remains authoritative.
    }
  }, [pendingActions]);

  useEffect(() => {
    const syncPendingActions = (event: StorageEvent) => {
      if (event.key !== 'business-os.pending-actions') return;
      try {
        setPendingActions(event.newValue ? JSON.parse(event.newValue) as ProposedAction[] : []);
      } catch {
        // Ignore malformed cross-tab state.
      }
    };
    window.addEventListener('storage', syncPendingActions);

    fetch('/api/actions/executions')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Execution ledger unavailable')))
      .then((payload) => {
        if (!payload?.success || !Array.isArray(payload.executionRecords)) return;
        const records: ExecutionRecord[] = payload.executionRecords.map((record: any) => ({
          id: record.executionId,
          actionTitle: record.title,
          targetSystem: record.targetSystem,
          authorizedBy: record.authorizedBy,
          timestamp: record.timestamp,
          status: record.status,
          reversible: record.status === 'COMMITTED',
          parameters: record.parameters || {},
          hash: record.auditHash,
        }));
        setExecutionRecords(records);
        setExecutedActionIds(payload.executionRecords.map((record: any) => record.actionId).filter(Boolean));
      })
      .catch(() => {
        // Keep the local mock ledger visible if the server is unavailable.
      });

    return () => window.removeEventListener('storage', syncPendingActions);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToPlanet(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToDashboard = () => {
    const el = document.getElementById('dashboard-viewport');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 780, behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Policy Gate Authorization Handler
  const handleOpenActionApproval = (action: ProposedAction) => {
    setApprovalAction(action);
    setSystemState('major_decision');
  };

  const handleConfirmActionExecution = async (action: ProposedAction) => {
    try {
      const response = await fetch('/api/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: action.id,
          title: action.title,
          targetSystem: action.targetSystem,
          authorizedBy: 'Executive Operator (You)',
          parameters: action.parameters || {},
          requiresApproval: action.requiresApproval,
          riskLevel: action.riskLevel,
          humanApproval: true,
          idempotencyKey: `${action.id}:${JSON.stringify(action.parameters || {})}`,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.executionRecord) {
        throw new Error(payload.error || 'Policy Gate execution failed');
      }

      const serverRecord = payload.executionRecord;
      const newRecord: ExecutionRecord = {
        id: serverRecord.executionId,
        actionTitle: serverRecord.title,
        targetSystem: serverRecord.targetSystem,
        authorizedBy: serverRecord.authorizedBy,
        timestamp: serverRecord.timestamp,
        status: serverRecord.status,
        reversible: true,
        parameters: serverRecord.parameters || action.parameters || {},
        hash: serverRecord.auditHash,
      };

      setPendingActions((prev) => prev.filter((a) => a.id !== action.id));
      setExecutedActionIds((prev) => [...new Set([...prev, action.id])]);
      setExecutionRecords((prev) => [newRecord, ...prev]);
      setActivityTicks((prev) => [
        {
          id: `tick_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agentName: 'POLICY GATE',
          agentRole: 'Cryptographic Authorizer',
          action: `authorized and verified external mutation: "${action.title}"`,
          target: action.targetSystem,
          category: 'policy_gate',
          confidence: 100,
          entityId: typeof action.parameters?.worldEntity === 'string' ? action.parameters.worldEntity : undefined,
        },
        ...prev,
      ]);
      setApprovalAction(null);
      setSystemState('mission_executing');
      window.dispatchEvent(new CustomEvent('business-os:neural-flow', { detail: { stage: 'ledger',
    stageId: 'authorized-act', label: 'EXECUTION LEDGER', detail: 'Server-authoritative execution record committed and reconciled.' } }));
      showToast(`Verified external mutation: "${action.title}" via Policy Gate`);
    } catch (error) {
      console.error('Policy Gate execution failed:', error);
      showToast('Policy Gate rejected the execution. No mutation was committed.');
    }
  };

  const handleRollback = async (recordId: string) => {
    try {
      const response = await fetch('/api/actions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executionId: recordId, humanApproval: true }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.executionRecord) {
        throw new Error(payload.error || 'Rollback failed');
      }
      setExecutionRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, status: 'ROLLED_BACK', reversible: false, hash: payload.executionRecord.auditHash }
            : record
        )
      );
      setSystemState('investigating');
      setActivityTicks((prev) => [{
        id: `rollback_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentName: 'POLICY GATE',
        agentRole: 'Cryptographic Authorizer',
        action: 'verified rollback and reconciled execution state',
        target: 'Execution Ledger',
        category: 'policy_gate',
        confidence: 100,
      }, ...prev]);
      showToast('State reconciled: rollback verified by Policy Gate.');
    } catch (error) {
      console.error('Rollback failed:', error);
      showToast('Rollback rejected. The committed execution record was not changed.');
    }
  };

  const handleCreateMission = (newMission: Partial<Mission>) => {
    const fullMission: Mission = {
      id: `miss_${Date.now()}`,
      title: newMission.title || 'Untitled Autonomous Mission',
      objective: newMission.objective || '',
      status: 'active',
      leadAgent: newMission.leadAgent || 'CEO Agent',
      collaboratingAgents: newMission.collaboratingAgents || ['Finance Agent'],
      progress: newMission.progress || 10,
      startedAt: 'Just now',
      priority: newMission.priority || 'high',
      steps: newMission.steps || [],
      findings: newMission.findings || [],
      recommendations: newMission.recommendations || [],
      proposedActions: newMission.proposedActions || [],
    };
    setMissions((prev) => [fullMission, ...prev]);
    setSelectedMission(fullMission);
    setSystemState('mission_executing');
    showToast(`Dispatched autonomous mission: "${fullMission.title}"`);
  };

  // Open Focus Mode for a specific objective
  const handleTriggerFocus = (objectiveId: string) => {
    const obj = initialFocusObjectives.find((o) => o.id === objectiveId) || initialFocusObjectives[0];
    setActiveFocusObjective(obj);
    setSystemState('investigating');
  };

  // Open "Explain This" Evidence Surface
  const handleOpenEvidence = (
    title: string,
    claim: string,
    confidence: number,
    factors?: { name: string; weight: number; impact: string }[],
    metricsEvidence?: {
      transactionsCount?: number;
      crmEventsCount?: number;
      historicalComparisons?: number;
      traces?: { id: string; timestamp: string; text: string }[];
    }
  ) => {
    setEvidenceData({
      isOpen: true,
      title,
      claim,
      confidence,
      factors,
      metricsEvidence,
    });
  };

  // Handle temporal epoch switch
  const handleEpochChange = useCallback((epoch: TemporalEpoch) => {
    setCurrentEpoch(epoch);
    const snap = initialTemporalSnapshots[epoch];
    // Morph active metric for display
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === 'arr'
          ? { ...m, value: snap.arr }
          : m
      )
    );
    showToast(`Temporal Scrub: ${epoch} — ARR: ${snap.arr} (${snap.keyEvent})`);
  }, []);

  // State-aware dynamic border/glow class
  const getContainerStateClass = () => {
    switch (systemState) {
      case 'risk_detected':
        return 'ring-1 ring-rose-500/20';
      case 'investigating':
        return 'ring-1 ring-cyan-500/25';
      case 'major_decision':
        return 'ring-2 ring-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)]';
      case 'mission_executing':
        return 'ring-1 ring-purple-500/25';
      default:
        return '';
    }
  };

  return (
    <div className={`business-os-shell min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 transition-all duration-300 ${getContainerStateClass()}`}>
      <PlanetaryAtmosphere />
      <div className="business-os-cinematic-bg" aria-hidden="true">
        <video id="businessOsBgA" className="business-os-bg-video is-active" autoPlay muted loop playsInline preload="auto" disablePictureInPicture poster="https://d2ol7oe51mr4n9cf9b4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4" type="video/mp4" />
        </video>
        <video id="businessOsBgB" className="business-os-bg-video" muted loop playsInline preload="auto" disablePictureInPicture poster="https://d2ol7oe51mr4n9cf9b4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4" type="video/mp4" />
        </video>
        <div className="business-os-cinematic-veil" />
      </div>
      <NeuralFlowOverlay systemState={systemState} pendingApprovalsCount={pendingActions.length} />

      {/* Telemetry Header & View Switcher */}
      <Navigation
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setActiveFocusObjective(null);
        }}
        operatingMode={operatingMode}
        onOperatingModeChange={setOperatingMode}
        systemState={systemState}
        onSystemStateChange={setSystemState}
        pendingApprovalsCount={pendingActions.length}
        onOpenCommandCore={() => {
          setIsCommandModalOpen(true);
          window.dispatchEvent(new CustomEvent('business-os:neural-flow', { detail: { stage: 'command',
    stageId: 'understand-perception', label: 'COMMAND CORE', detail: 'Operator intent channel opened. Awaiting analysis input.' } }));
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full min-w-0 p-3 sm:p-4 lg:p-5 space-y-5 os-grid os-scanlines">
        {/* If Executive Mode is explicitly toggled, present the High-Density Executive Cockpit */}
        {operatingMode === 'executive' ? (
          <ExecutiveCockpit
            onAuthorizeAction={handleOpenActionApproval}
            onFocusObjective={handleTriggerFocus}
            onExplainEvidence={(headline, claim, conf) => handleOpenEvidence(headline, claim, conf)}
            onSwitchToOperate={() => setOperatingMode('operate')}
          />
        ) : activeFocusObjective ? (
          /* FOCUS MODE: When user selects an active objective, interface reconfigures around it */
          <FocusModeView
            objective={activeFocusObjective}
            onExitFocus={() => setActiveFocusObjective(null)}
            onLaunchMission={(obj) => {
              handleCreateMission({
                title: `Mission: Mitigate ${obj.title}`,
                objective: obj.recommendation,
                leadAgent: 'Sales Agent',
                collaboratingAgents: ['Finance Agent', 'Operations Agent'],
                proposedActions: [obj.proposedAction],
                priority: 'urgent',
              });
              setActiveFocusObjective(null);
              setActiveView('missions');
            }}
            onAuthorizeAction={handleOpenActionApproval}
            onExplainEvidence={(headline, claim, conf) => handleOpenEvidence(headline, claim, conf)}
          />
        ) : (
          <>
            {/* Open Planet UI: Expansive, unobstructed hero showcasing the celestial 3D world */}
            {(activeView === 'command-center' || activeView === 'command') && (
              <PlanetHero
                onScrollToDashboard={handleScrollToDashboard}
                onOpenCommandCore={() => {
                  setIsCommandModalOpen(true);
                  window.dispatchEvent(new CustomEvent('business-os:neural-flow', { detail: { stage: 'command', label: 'COMMAND CORE', detail: 'Operator intent channel opened. Awaiting analysis input.' } }));
                }}
                onNavigateToView={(v) => {
                  setActiveView(v);
                  setActiveFocusObjective(null);
                }}
                systemState={systemState}
                pendingApprovalsCount={pendingActions.length}
                activeMissionsCount={missions.length}
              />
            )}

            {/* Dashboard Container: Smoothly scrolled to from the Planet UI */}
            <div id="dashboard-viewport" className="space-y-6 scroll-mt-14">
              {/* Persistent AI Intelligence Presence Loop (Top of Command & Business World) */}
              {(activeView === 'command-center' || activeView === 'command' || activeView === 'business-world') && (
                <AIIntelligenceLayer
                  systemState={systemState}
                  onSelectStep={(step) => showToast(`Selected Reasoning Stage: ${step}`)}
                  onOpenFocus={(objId) => handleTriggerFocus(objId)}
                />
              )}

              {/* View: Command Center */}
              {(activeView === 'command-center' || activeView === 'command') && (
                <div className="space-y-6">
                  <CommandCenter
                    metrics={metrics}
                    anomalies={anomalies}
                    opportunities={opportunities}
                    missions={missions}
                    agents={agents}
                    nodes={nodes}
                    selectedNode={selectedNode}
                    onSelectNode={setSelectedNode}
                    events={events}
                    pendingActions={pendingActions}
                    recentExecutions={executionRecords}
                    activityTicks={activityTicks}
                    onExecuteAction={handleOpenActionApproval}
                    onSelectMission={(m) => {
                      setSelectedMission(m);
                      setActiveView('missions');
                    }}
                    onSelectAgent={(ag) => {
                      setSelectedAgent(ag);
                      setActiveView('agents');
                    }}
                    onNavigateToView={setActiveView}
                  />

                  {/* AI Live Activity Stream */}
                  <AIActivityStream
                    ticks={activityTicks}
                    onSelectEntity={(entityId) => {
                      const match = initialHierarchyEntities.find((e) => e.id === entityId);
                      if (match) setSelectedSpatialEntity(match);
                    }}
                    onOpenApproval={() => {
                      if (pendingActions.length > 0) {
                        handleOpenActionApproval(pendingActions[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* View: Security Layer — authoritative security telemetry surface */}
            {activeView === 'cyber-hud' && <SecurityHUD />}

            {/* View: Business World & Digital Twin Hierarchy */}
            {(activeView === 'business-world' || activeView === 'world') && (
              <div className="space-y-6">
                <DigitalTwinHierarchy
                  onSelectEntity={(entity) => setSelectedSpatialEntity(entity)}
                  onExplainEvidence={(entity) => {
                    if (entity.evidence) {
                      handleOpenEvidence(
                        `${entity.name} Telemetry Evidence`,
                        entity.summary,
                        entity.healthScore,
                        entity.evidence.primaryFactors,
                        {
                          transactionsCount: entity.evidence.transactionsCount,
                          crmEventsCount: entity.evidence.crmEventsCount,
                          historicalComparisons: entity.evidence.historicalComparisons,
                          traces: entity.evidence.traces,
                        }
                      );
                    }
                  }}
                  onInvestigateEntity={(entity) => {
                    showToast(`Launching autonomous agent investigation into ${entity.name}`);
                    setSystemState('investigating');
                  }}
                />

                {/* Spatial Topology Graph */}
                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono">
                        Spatial Relationship Topology Network
                      </h3>
                      <p className="text-xs text-slate-400">
                        Interactive relationship mapping across revenue, customers, sales, operations, and autonomous swarms.
                      </p>
                    </div>
                  </div>

                  <BusinessWorld
                    nodes={nodes}
                    selectedNode={selectedNode}
                    onSelectNode={setSelectedNode}
                    highlightedNodeIds={highlightedNodeIds}
                    hierarchyEntities={initialHierarchyEntities}
                    systemState={systemState}
                    activityTicks={activityTicks}
                    currentEpoch={currentEpoch}
                    onEpochChange={handleEpochChange}
                    executionRecords={executionRecords}
                    onExecutePolicyAction={handleOpenActionApproval}
                    onQuickInspectNode={(nodeId) => {
                      if (nodeId === 'sales') setActiveView('sales');
                      else if (nodeId === 'revenue') setActiveView('finance');
                      else if (nodeId === 'operations') setActiveView('operations');
                      else if (nodeId === 'customers') setActiveView('customers');
                    }}
                  />
                </div>
              </div>
            )}

            {/* View: Missions */}
            {activeView === 'missions' && (
              <MissionsView
                missions={missions}
                selectedMission={selectedMission}
                onSelectMission={setSelectedMission}
                onExecuteAction={handleOpenActionApproval}
                onCreateMission={handleCreateMission}
              />
            )}

            {/* View: Agents */}
            {activeView === 'agents' && (
              <AgentsView
                agents={agents}
                selectedAgent={selectedAgent}
                onSelectAgent={setSelectedAgent}
              />
            )}

            {/* View: Finance */}
            {activeView === 'finance' && (
              <FinanceView
                metrics={metrics}
                onTriggerAction={(title) => {
                  handleOpenActionApproval({
                    id: `act_fin_${Date.now()}`,
                    title: `Deploy ${title} via Stripe Billing`,
                    riskLevel: 'low',
                    targetSystem: 'Stripe Billing & NetSuite ERP',
                    requiresApproval: true,
                    status: 'PROPOSED',
                  });
                }}
              />
            )}

            {/* View: Sales */}
            {activeView === 'sales' && (
              <SalesView onExecuteAction={handleOpenActionApproval} />
            )}

            {/* View: Operations */}
            {activeView === 'operations' && (
              <OperationsView onExecuteAction={handleOpenActionApproval} />
            )}

            {/* View: Customers */}
            {activeView === 'customers' && (
              <CustomersView onExecuteAction={handleOpenActionApproval} />
            )}

            {/* View: Research */}
            {activeView === 'research' && <ResearchView />}

            {/* View: Live Stream / Intelligence */}
            {activeView === 'intelligence' && (
              <div className="space-y-6">
                <AIActivityStream
                  ticks={activityTicks}
                  onSelectEntity={(entityId) => {
                    const match = initialHierarchyEntities.find((e) => e.id === entityId);
                    if (match) setSelectedSpatialEntity(match);
                  }}
                  onOpenApproval={() => {
                    if (pendingActions.length > 0) {
                      handleOpenActionApproval(pendingActions[0]);
                    }
                  }}
                />
                <IntelligenceFeedView
                  events={events}
                  onExecuteAction={handleOpenActionApproval}
                />
              </div>
            )}

            {/* View: Automations & Audit Ledger */}
            {activeView === 'automations' && (
              <AutomationsView
                pendingActions={pendingActions}
                executionRecords={executionRecords}
                onExecuteAction={handleOpenActionApproval}
                onRollbackAction={handleRollback}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Temporal Timeline Scrubber at Bottom */}
      <TemporalTimeline
        currentEpoch={currentEpoch}
        onEpochChange={handleEpochChange}
        onOpenScenarioModeling={() => setIsScenarioModalOpen(true)}
      />

      {/* Floating Spatial Entity Inspector Panel */}
      <SpatialEntityPanel
        entity={selectedSpatialEntity}
        onClose={() => setSelectedSpatialEntity(null)}
        onInvestigate={(entity) => {
          showToast(`Autonomous Swarm investigating ${entity.name}`);
          setSystemState('investigating');
          setSelectedSpatialEntity(null);
          handleTriggerFocus('focus_revenue_anomaly');
        }}
        onExplainEvidence={(entity) => {
          if (entity.evidence) {
            handleOpenEvidence(
              `${entity.name} Reasoning Evidence`,
              entity.summary,
              entity.healthScore,
              entity.evidence.primaryFactors,
              {
                transactionsCount: entity.evidence.transactionsCount,
                crmEventsCount: entity.evidence.crmEventsCount,
                historicalComparisons: entity.evidence.historicalComparisons,
                traces: entity.evidence.traces,
              }
            );
          }
        }}
        onQuickAction={(title) => {
          handleOpenActionApproval({
            id: `act_spatial_${Date.now()}`,
            title,
            riskLevel: 'medium',
            targetSystem: 'Salesforce & Google Calendar API',
            requiresApproval: true,
            status: 'PROPOSED',
          });
        }}
      />

      {/* "Explain This" / Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceData.isOpen}
        onClose={() => setEvidenceData((prev) => ({ ...prev, isOpen: false }))}
        title={evidenceData.title}
        claim={evidenceData.claim}
        confidence={evidenceData.confidence}
        factors={evidenceData.factors}
        metricsEvidence={evidenceData.metricsEvidence}
        onInvestigateFurther={() => {
          handleTriggerFocus('focus_revenue_anomaly');
        }}
      />

      {/* Future Scenario Modeling Modal */}
      <ScenarioModelingModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onApplyScenario={(scenario) => {
          showToast(`Applied Simulation Scenario: ${scenario.name} (${scenario.projectedArr} projected ARR)`);
          setCurrentEpoch('SIM_3M');
        }}
      />

      {/* Global AI Command Core Modal */}
      {isCommandModalOpen && (
        <CommandCore
          isOpenAsModal={true}
          onCloseModal={() => {
            setIsCommandModalOpen(false);
            window.dispatchEvent(new CustomEvent('business-os:neural-flow', { detail: { stage: 'neural', label: 'NEURAL FIELD', detail: 'Command surface closed. Live planetary intelligence remains active.' } }));
          }}
          onExecuteAction={handleOpenActionApproval}
          onOpenMission={(newM) => {
            handleCreateMission(newM);
            setIsCommandModalOpen(false);
            setActiveView('missions');
          }}
          onHighlightNodes={(nodeIds) => {
            setHighlightedNodeIds(nodeIds);
          }}
          onOpenFocus={(objId) => {
            handleTriggerFocus(objId);
          }}
          onSetEpoch={handleEpochChange}
          onOpenScenarioModeling={() => setIsScenarioModalOpen(true)}
          onSelectEntityId={(id) => {
            const match = initialHierarchyEntities.find((e) => e.id === id);
            if (match) setSelectedSpatialEntity(match);
          }}
          onNavigateToView={setActiveView}
          onSetOperatingMode={setOperatingMode}
        />
      )}

      {/* Policy Gate Action Approval Dialog */}
      <ApprovalModal
        action={approvalAction}
        onConfirm={handleConfirmActionExecution}
        onCancel={() => {
          setApprovalAction(null);
          setSystemState('risk_detected');
        }}
      />

      {/* Floating Return to Planet UI button */}
      {showBackToPlanet && (activeView === 'command-center' || activeView === 'command') && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-black/70 hover:bg-black/90 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs flex items-center gap-2 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,240,255,0.3)] hover:border-cyan-400 transition-all animate-in fade-in cursor-pointer group"
          title="Return to Planet View"
        >
          <span className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform font-bold">↑</span>
          <span className="text-[11px] tracking-wider uppercase font-bold">PLANET UI</span>
        </button>
      )}

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-16 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#0c111d] border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_8px_32px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
