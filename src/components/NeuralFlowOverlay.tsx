import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, FileSearch, LockKeyhole, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { SystemRuntimeState } from '../types';

type NeuralStage = 'neural' | 'command' | 'reasoning' | 'evidence' | 'policy' | 'ledger';

interface NeuralFlowOverlayProps {
  systemState: SystemRuntimeState;
  pendingApprovalsCount: number;
}

interface NeuralFlowEventDetail {
  stage?: NeuralStage;
  label?: string;
  detail?: string;
  requestId?: string;
  stageId?: string;
}

const STAGES: { id: NeuralStage; label: string; icon: React.ElementType }[] = [
  { id: 'neural', label: 'NEURAL', icon: Radio },
  { id: 'command', label: 'COMMAND', icon: Sparkles },
  { id: 'reasoning', label: 'REASONING', icon: Activity },
  { id: 'evidence', label: 'EVIDENCE', icon: FileSearch },
  { id: 'policy', label: 'POLICY GATE', icon: ShieldCheck },
  { id: 'ledger', label: 'LEDGER', icon: LockKeyhole },
];

export const NeuralFlowOverlay: React.FC<NeuralFlowOverlayProps> = ({
  systemState,
  pendingApprovalsCount,
}) => {
  const [eventState, setEventState] = useState<NeuralFlowEventDetail>({ stage: 'neural', label: 'LIVE DIGITAL TWIN', detail: 'Ambient intelligence layer online.' });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleFlow = (event: Event) => {
      const detail = (event as CustomEvent<NeuralFlowEventDetail>).detail || {};
      setEventState((prev) => ({ ...prev, ...detail }));
      setVisible(true);
    };
    window.addEventListener('business-os:neural-flow', handleFlow);
    return () => window.removeEventListener('business-os:neural-flow', handleFlow);
  }, []);

  const derivedStage = useMemo<NeuralStage>(() => {
    if (eventState.stage) return eventState.stage;
    if (systemState === 'major_decision') return 'policy';
    if (systemState === 'mission_executing') return 'ledger';
    if (systemState === 'investigating') return 'evidence';
    return 'neural';
  }, [eventState.stage, systemState]);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 9000);
    return () => window.clearTimeout(timer);
  }, [eventState.stage, eventState.label, eventState.detail]);

  const activeIndex = STAGES.findIndex((stage) => stage.id === derivedStage);

  return (
    <aside className={`neural-flow-overlay ${visible ? 'is-visible' : ''}`} aria-live="polite">
      <div className="neural-flow-header">
        <div>
          <span className="neural-flow-kicker">LIVE AGENT PIPELINE</span>
          <strong>{eventState.label || STAGES[activeIndex]?.label}</strong>
        </div>
        <span className="neural-flow-status"><i /> ONLINE</span>
      </div>

      <div className="neural-flow-track" aria-label="Business OS intelligence pipeline">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const active = index === activeIndex;
          const complete = index < activeIndex;
          return (
            <React.Fragment key={stage.id}>
              <div className={`neural-flow-node ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}>
                <span>{complete ? <CheckCircle2 /> : <Icon />}</span>
                <small>{stage.label}</small>
              </div>
              {index < STAGES.length - 1 && <div className={`neural-flow-connector ${index < activeIndex ? 'is-complete' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="neural-flow-detail">
        <span>
          {eventState.detail || 'Waiting for the next operator intent.'}
          {eventState.stageId && <em className="neural-flow-stage-id">{eventState.stageId}</em>}
        </span>
        {pendingApprovalsCount > 0 && derivedStage === 'policy' && (
          <b>{pendingApprovalsCount} ACTION{pendingApprovalsCount === 1 ? '' : 'S'} AWAITING HUMAN AUTHORIZATION</b>
        )}
      </div>

      <div className="neural-flow-rule">AI DECIDES ≠ AI EXECUTES</div>
    </aside>
  );
};
