import React, { useState } from 'react';
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
} from './data/mockBusinessState';

import {
  initialHierarchyEntities,
  initialFocusObjectives,
  initialAIActivityStreamTicks,
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
  const [pendingActions, setPendingActions] = useState<ProposedAction[]>(initialPendingActions);
  const [executionRecords, setExecutionRecords] = useState<ExecutionRecord[]>(initialExecutionRecords);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Policy Gate Authorization Handler
  const handleOpenActionApproval = (action: ProposedAction) => {
    setApprovalAction(action);
    setSystemState('major_decision');
  };

  const handleConfirmActionExecution = (action: ProposedAction) => {
    // 1. Remove from pending actions
    setPendingActions((prev) => prev.filter((a) => a.id !== action.id));

    // 2. Append to immutable execution ledger
    const newRecord: ExecutionRecord = {
      id: `exec_${Date.now()}`,
      actionTitle: action.title,
      targetSystem: action.targetSystem,
      authorizedBy: 'Executive Operator (You)',
      timestamp: 'Just now',
      status: 'COMMITTED',
      reversible: true,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setExecutionRecords((prev) => [newRecord, ...prev]);

    // 3. Log tick to live AI stream
    setActivityTicks((prev) => [
      {
        id: `tick_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentName: 'POLICY GATE',
        agentRole: 'Cryptographic Authorizer',
        action: `authorized and executed immutable mutation: "${action.title}"`,
        target: action.targetSystem,
        category: 'policy_gate',
        confidence: 100,
      },
      ...prev,
    ]);

    setApprovalAction(null);
    setSystemState('mission_executing');
    showToast(`Committed mutation: "${action.title}" via Policy Gate`);
  };

  const handleRollback = (recordId: string) => {
    setExecutionRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'ROLLED_BACK', reversible: false } : r))
    );
    showToast('State reconciled: Rollback snapshot restored successfully.');
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
  const handleEpochChange = (epoch: TemporalEpoch) => {
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
  };

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
    <div className={`min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 transition-all duration-300 ${getContainerStateClass()}`}>
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
        onOpenCommandCore={() => setIsCommandModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
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
          onCloseModal={() => setIsCommandModalOpen(false)}
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

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-16 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#0c111d] border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_8px_32px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
