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
  ViewMode,
  OperatingMode,
  WorldNode,
  Mission,
  Agent,
  ProposedAction,
  ExecutionRecord,
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('command');
  const [operatingMode, setOperatingMode] = useState<OperatingMode>('executive');

  // Business State Entities
  const [metrics] = useState(initialMetrics);
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

  // Modals & Notifications
  const [approvalAction, setApprovalAction] = useState<ProposedAction | null>(null);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Policy Gate Authorization Handler
  const handleOpenActionApproval = (action: ProposedAction) => {
    setApprovalAction(action);
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

    setApprovalAction(null);
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
    showToast(`Dispatched autonomous mission: "${fullMission.title}"`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Telemetry Header & View Switcher */}
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        operatingMode={operatingMode}
        onOperatingModeChange={setOperatingMode}
        pendingApprovalsCount={pendingActions.length}
        onOpenCommandCore={() => setIsCommandModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeView === 'command' && (
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
        )}

        {activeView === 'world' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">
                  Full Spatial Business World Model
                </h2>
                <p className="text-xs text-slate-400">
                  Interactive relationship mapping across revenue, customers, sales, operations, and autonomous agent swarms.
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
        )}

        {activeView === 'missions' && (
          <MissionsView
            missions={missions}
            selectedMission={selectedMission}
            onSelectMission={setSelectedMission}
            onExecuteAction={handleOpenActionApproval}
            onCreateMission={handleCreateMission}
          />
        )}

        {activeView === 'agents' && (
          <AgentsView
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        )}

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

        {activeView === 'sales' && (
          <SalesView onExecuteAction={handleOpenActionApproval} />
        )}

        {activeView === 'operations' && (
          <OperationsView onExecuteAction={handleOpenActionApproval} />
        )}

        {activeView === 'customers' && (
          <CustomersView onExecuteAction={handleOpenActionApproval} />
        )}

        {activeView === 'research' && <ResearchView />}

        {activeView === 'intelligence' && (
          <IntelligenceFeedView
            events={events}
            onExecuteAction={handleOpenActionApproval}
          />
        )}

        {activeView === 'automations' && (
          <AutomationsView
            pendingActions={pendingActions}
            executionRecords={executionRecords}
            onExecuteAction={handleOpenActionApproval}
            onRollbackAction={handleRollback}
          />
        )}
      </main>

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
        />
      )}

      {/* Policy Gate Action Approval Dialog */}
      <ApprovalModal
        action={approvalAction}
        onConfirm={handleConfirmActionExecution}
        onCancel={() => setApprovalAction(null)}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#0c111d] border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_8px_32px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
