import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, LockKeyhole, Radio, ShieldCheck, XCircle } from 'lucide-react';

type SecurityState =
  | 'SECURE' | 'MONITORING' | 'ANOMALY' | 'POLICY_BLOCK'
  | 'REQUIRES_APPROVAL' | 'INCIDENT' | 'INTEGRITY_FAILURE'
  | 'VERIFICATION_FAILURE' | 'OFFLINE';

type SecurityEvent = {
  eventId: string;
  eventType: string;
  severity: string;
  timestamp: string;
  actorId?: string;
  actionId?: string;
  targetSystem?: string;
  policyDecision?: string;
  verification?: string;
  description: string;
};

type SecurityPayload = {
  status: { state: SecurityState; ledger: { valid: boolean; eventCount: number; latestHash?: string; error?: string } };
  events: SecurityEvent[];
};

const stateMeta: Record<SecurityState, { label: string; icon: React.ReactNode }> = {
  SECURE: { label: 'SECURE', icon: <CheckCircle2 className="h-4 w-4" /> },
  MONITORING: { label: 'MONITORING', icon: <Radio className="h-4 w-4" /> },
  ANOMALY: { label: 'ANOMALY', icon: <AlertTriangle className="h-4 w-4" /> },
  POLICY_BLOCK: { label: 'POLICY BLOCK', icon: <XCircle className="h-4 w-4" /> },
  REQUIRES_APPROVAL: { label: 'REQUIRES APPROVAL', icon: <LockKeyhole className="h-4 w-4" /> },
  INCIDENT: { label: 'INCIDENT', icon: <AlertTriangle className="h-4 w-4" /> },
  INTEGRITY_FAILURE: { label: 'INTEGRITY FAILURE', icon: <XCircle className="h-4 w-4" /> },
  VERIFICATION_FAILURE: { label: 'VERIFICATION FAILURE', icon: <XCircle className="h-4 w-4" /> },
  OFFLINE: { label: 'OFFLINE', icon: <XCircle className="h-4 w-4" /> },
};

const layers = [
  ['L0', 'HOST'],
  ['L1', 'RUNTIME'],
  ['L2', 'APPLICATION'],
  ['L3', 'DATA'],
  ['L4', 'AGENTS'],
  ['L5', 'AI DECISION'],
];

export const SecurityHUD: React.FC = () => {
  const [payload, setPayload] = useState<SecurityPayload | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [operator, setOperator] = useState('Executive Operator');
  const [actionMessage, setActionMessage] = useState('');

  const refresh = async () => {
    try {
      const response = await fetch('/api/security/status');
      if (!response.ok) throw new Error('Security API unavailable');
      setPayload(await response.json());
    } catch {
      setPayload({
        status: { state: 'OFFLINE', ledger: { valid: false, eventCount: 0 } },
        events: [],
      });
    }
  };

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 3000);
    return () => window.clearInterval(id);
  }, []);

  const events = useMemo(() => {
    const source = payload?.events || [];
    return selectedSeverity === 'ALL' ? source : source.filter((event) => event.severity === selectedSeverity);
  }, [payload, selectedSeverity]);

  const state = payload?.status.state || 'OFFLINE';
  const runOperatorAction = async (action: string) => {
    setActionMessage('');
    const response = await fetch('/api/security/operator-action', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ action, authorizedBy:operator, humanApproval:true, targetResource:'security-runtime' }) });
    const data = await response.json();
    setActionMessage(data.success ? action.toUpperCase()+' REQUESTED' : data.error || 'ACTION DENIED');
    refresh();
  };
  const meta = stateMeta[state];

  return (
    <section className="relative min-h-[calc(100vh-112px)] overflow-hidden bg-black text-white border border-white/10 font-mono">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_78%_45%,rgba(0,220,255,.18),transparent_32%),linear-gradient(90deg,transparent_49%,rgba(255,255,255,.04)_50%,transparent_51%)]" />
      <div className="absolute right-0 top-0 h-full w-[46%] bg-gradient-to-l from-cyan-500/[0.08] to-transparent pointer-events-none" />

      <div className="relative z-10 p-5 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <div className="text-[10px] tracking-[.35em] text-cyan-400">BUSINESS OS // SECURITY LAYER</div>
            <h1 className="mt-2 font-sans text-4xl md:text-6xl font-semibold tracking-[-.05em]">SECURITY BUILT INTO<br />EVERY SYSTEM LAYER</h1>
            <p className="mt-4 max-w-xl text-xs md:text-sm text-white/55 font-sans">Authoritative security telemetry, policy enforcement, integrity verification, and operator controls.</p>
          </div>
          <div className="min-w-[220px] border border-white/10 p-4 bg-black/60">
            <div className="text-[9px] tracking-[.28em] text-white/40">CURRENT SECURITY STATE</div>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">{meta.icon}<span className="text-sm tracking-widest">{meta.label}</span></div>
            <div className="mt-3 text-[10px] text-white/45">LEDGER {payload?.status.ledger.valid ? 'VERIFIED' : 'UNVERIFIED'} · {payload?.status.ledger.eventCount ?? 0} EVENTS</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr] mt-6">
          <div className="border border-white/10 bg-white/[.02]">
            <div className="border-b border-white/10 px-4 py-3 text-[10px] tracking-[.24em] text-white/45">SYSTEM SECURITY LAYERS</div>
            {layers.map(([level, name], index) => (
              <div key={level} className="flex items-center justify-between border-b border-white/[.06] px-4 py-4 last:border-0">
                <span className="text-xs text-cyan-400">{level}</span>
                <span className="text-xs tracking-widest">{name}</span>
                <span className="text-[9px] text-emerald-400">{index === 5 ? 'POLICY GATED' : 'MONITORED'}</span>
              </div>
            ))}
          </div>

          <div className="border border-white/10 bg-white/[.02]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <span className="text-[10px] tracking-[.24em] text-white/45">SECURITY EVENT STREAM</span>
              <div className="flex gap-1">
                {['ALL', 'INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((severity) => (
                  <button key={severity} onClick={() => setSelectedSeverity(severity)} className={`border px-2 py-1 text-[9px] tracking-wider ${selectedSeverity === severity ? 'border-cyan-400/50 text-cyan-300 bg-cyan-400/10' : 'border-white/10 text-white/45 hover:text-white'}`}>
                    {severity}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[390px] overflow-auto divide-y divide-white/[.06]">
              {events.length === 0 ? (
                <div className="p-6 text-xs text-white/40">No security events recorded.</div>
              ) : events.slice(0, 80).map((event) => (
                <div key={event.eventId} className="grid gap-2 px-4 py-3 text-[10px] md:grid-cols-[150px_120px_1fr]">
                  <span className="text-white/35">{new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                  <span className={event.severity === 'CRITICAL' || event.severity === 'HIGH' ? 'text-rose-300' : 'text-cyan-300'}>{event.eventType}</span>
                  <div className="text-white/65">
                    <div>{event.description}</div>
                    <div className="mt-1 text-[9px] text-white/35">{event.targetSystem || 'runtime'} · {event.policyDecision || '—'} · {event.verification || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 border border-white/10 bg-white/[.02] p-4">
          <div className="text-[10px] tracking-[.24em] text-white/45">AUTHORIZED OPERATOR CONTROLS</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input value={operator} onChange={(e)=>setOperator(e.target.value)} aria-label="Operator identity" className="border border-white/10 bg-black px-3 py-2 text-[10px] text-white outline-none" />
            {['acknowledge','investigate','revoke','isolate','quarantine','rollback'].map((action)=>(
              <button key={action} onClick={()=>runOperatorAction(action)} className="border border-white/10 px-3 py-2 text-[9px] tracking-wider text-white/60 hover:border-cyan-400/40 hover:text-cyan-300">{action.toUpperCase()}</button>
            ))}
          </div>
          {actionMessage && <div className="mt-3 text-[9px] tracking-wider text-cyan-300">{actionMessage}</div>}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {[
            ['POLICY ENGINE', 'SERVER AUTHORITATIVE'],
            ['IDENTITY', 'REQUIRED'],
            ['INTEGRITY', payload?.status.ledger.valid ? 'VERIFIED' : 'CHECK FAILED'],
            ['EXECUTION', 'POLICY GATED'],
          ].map(([label, value]) => (
            <div key={label} className="bg-black p-4">
              <div className="text-[9px] tracking-[.2em] text-white/35">{label}</div>
              <div className="mt-2 text-xs tracking-wider text-white/80">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
