import React, { useState, useEffect } from 'react';
import { LivingSystemFlowScene } from './system-flow/LivingSystemFlowScene';
import { LivingFlowControls } from './system-flow/LivingFlowControls';
import {
  INITIAL_FLOW_STAGES,
  FlowStageNode,
  SimulatedSystemEvent,
} from './system-flow/flowModel';

interface LivingSystemFlow3DProps {
  isEmbedded?: boolean;
  onNavigateToView?: (view: any) => void;
  onOpenCommandCore?: () => void;
}

export const LivingSystemFlow3D: React.FC<LivingSystemFlow3DProps> = ({
  isEmbedded = false,
  onNavigateToView,
  onOpenCommandCore,
}) => {
  const [stages, setStages] = useState<FlowStageNode[]>(INITIAL_FLOW_STAGES);
  const [selectedStage, setSelectedStage] = useState<FlowStageNode | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pulseTrigger, setPulseTrigger] = useState<number>(0);
  const [activePerspective, setActivePerspective] = useState<
    'orbit' | 'uae' | 'swarm' | 'verify' | 'panoramic'
  >('orbit');

  const [recentEvents, setRecentEvents] = useState<SimulatedSystemEvent[]>([
    {
      id: 'ev-init-1',
      timestamp: '05:24:12',
      stageId: 'uae-world-model',
      title: 'UAE Digital Twin Synchronized',
      detail: '1,482 entities refreshed across Dubai, Abu Dhabi & Northern Emirates',
      severity: 'success',
    },
  ]);

  // Periodic living event generator simulating the living pulse of AIOS UAE
  useEffect(() => {
    if (isPaused) return;

    const eventPool: Omit<SimulatedSystemEvent, 'id' | 'timestamp'>[] = [
      {
        stageId: 'see-ingest',
        title: 'AIS Vessel Radar Pass',
        detail: 'Real-time telemetry ingested for 84 commercial ships in Strait of Hormuz',
        severity: 'info',
      },
      {
        stageId: 'understand-perception',
        title: 'Causal Correlation Detected',
        detail: 'Hardware delivery schedule delta aligned with EU customs clearance delay',
        severity: 'active',
      },
      {
        stageId: 'reason-cognition',
        title: 'FinSight + GSCIE Swarm Consensus',
        detail: 'Multi-agent consensus achieved on €4.2M working capital buffer reallocation',
        severity: 'info',
      },
      {
        stageId: 'simulate-predict',
        title: '2035 Horizon Stress Test Run',
        detail: 'Monte Carlo trajectory verified under 30% sudden cargo surge (98.8% certainty)',
        severity: 'info',
      },
      {
        stageId: 'verify-prove',
        title: 'Zero-Drift Cryptographic Proof Generated',
        detail: 'Air-gapped enclave verified Ed25519 signature for Sovereign Procurement #11',
        severity: 'success',
      },
      {
        stageId: 'authorized-act',
        title: 'Automated Intermodal Routing Dispatched',
        detail: 'Etihad Rail container freight assigned to Jebel Ali Terminal 2 Yard',
        severity: 'success',
      },
      {
        stageId: 'observe-update',
        title: 'Closed-Loop Telemetry Reconciled',
        detail: 'Physical transit outcome matched prediction within 0.6% deviation bounds',
        severity: 'success',
      },
    ];

    let eventIdx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const nextEv = eventPool[eventIdx % eventPool.length];
      eventIdx++;

      setRecentEvents((prev) => [
        {
          id: `ev-${Date.now()}`,
          timestamp: timeStr,
          ...nextEv,
        },
        ...prev.slice(0, 9),
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTriggerPulse = (scenarioName: string) => {
    setPulseTrigger((prev) => prev + 1);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setRecentEvents((prev) => [
      {
        id: `ev-${Date.now()}`,
        timestamp: timeStr,
        stageId: 'reason-cognition',
        title: `Shockwave Triggered: ${scenarioName}`,
        detail: 'Autonomous cascade pulsing through the entire 8-stage sovereign pipeline',
        severity: 'warning',
      },
      ...prev,
    ]);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_12px_48px_rgba(0,0,0,0.85)] ${
        isEmbedded ? 'h-[82vh] min-h-[580px]' : 'h-[calc(100vh-6.5rem)] min-h-[640px]'
      }`}
    >
      {/* 3D WebGL Planetary Scene */}
      <LivingSystemFlowScene
        stages={stages}
        selectedStageId={selectedStage ? selectedStage.id : null}
        onSelectStage={(st) => setSelectedStage(st)}
        speedMultiplier={speedMultiplier}
        isPaused={isPaused}
        pulseTrigger={pulseTrigger}
        activePerspective={activePerspective}
        onNavigateToView={onNavigateToView}
      />

      {/* Floating HUD Controls & Planetary Inspector */}
      <LivingFlowControls
        stages={stages}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        speedMultiplier={speedMultiplier}
        onSpeedChange={setSpeedMultiplier}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        activePerspective={activePerspective}
        onPerspectiveChange={setActivePerspective}
        onTriggerPulse={handleTriggerPulse}
        recentEvents={recentEvents}
        onNavigateToView={onNavigateToView}
      />
    </div>
  );
};
