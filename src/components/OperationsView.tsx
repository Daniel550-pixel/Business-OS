import React from 'react';
import {
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Flame,
  Layers,
} from 'lucide-react';
import { ProposedAction } from '../types';

interface OperationsViewProps {
  onExecuteAction: (action: ProposedAction) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({ onExecuteAction }) => {
  const clusters = [
    {
      name: 'UAE Sovereign Node (me-central-1)',
      location: 'Dubai, UAE',
      status: 'optimal',
      p99: '14ms',
      uptime: '100.00%',
      load: '42%',
      nodes: 32,
      note: 'Sovereign resident data storage active',
    },
    {
      name: 'US-East Production (us-east-1)',
      location: 'Virginia, USA',
      status: 'optimal',
      p99: '18ms',
      uptime: '99.99%',
      load: '68%',
      nodes: 64,
      note: 'Primary enterprise workload compute',
    },
    {
      name: 'EU-Central Edge (eu-central-1)',
      location: 'Frankfurt, Germany',
      status: 'warning',
      p99: '34ms',
      uptime: '99.96%',
      load: '74%',
      nodes: 28,
      note: 'Egress anomaly: uncompressed cross-region backups',
    },
    {
      name: 'AP-Southeast Node (ap-southeast-1)',
      location: 'Singapore',
      status: 'optimal',
      p99: '42ms',
      uptime: '99.98%',
      load: '38%',
      nodes: 24,
      note: 'Asia-Pacific client routing',
    },
  ];

  const handleFixEgress = () => {
    const action: ProposedAction = {
      id: `act_ops_${Date.now()}`,
      title: 'Enable zstd compression on Frankfurt cross-region telemetry streams',
      riskLevel: 'low',
      targetSystem: 'Terraform & Kubernetes Egress Gateway',
      requiresApproval: true,
      status: 'PROPOSED',
      parameters: {
        cluster: 'eu-central-1',
        compressionLevel: 'zstd-3',
        monthlySavings: '$8,400/mo',
      },
    };
    onExecuteAction(action);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Operations Horizon Header */}
      <div className="p-4 lg:p-5 rounded-xl os-glass-strong os-cyber-corners border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] os-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 uppercase">
                SYSTEMS & CLOUD OPERATIONS
              </span>
              <span className="text-xs os-mono text-slate-400">• Fleet Health: 99.98% Global SLA</span>
            </div>
            <h2 className="text-2xl font-bold text-white os-mono">4 Global Edge Regions · 148 Compute Nodes</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Zero active high-severity outages. 1 cost inefficiency anomaly detected in Frankfurt cluster generating $14.2k in excess cross-region bandwidth egress.
            </p>
          </div>

          <div className="flex items-center gap-2 os-mono text-xs">
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Global p99 Latency</div>
              <div className="text-sm font-bold text-cyan-300">22.4ms (Nominal)</div>
            </div>
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Global Error Rate</div>
              <div className="text-sm font-bold text-emerald-400">0.008% (4.8 Nines)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Topology Matrix */}
      <div className="p-4 lg:p-5 rounded-xl os-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase os-mono tracking-wider">
              Distributed Cloud Cluster Topology & Telemetry
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] os-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 os-live-dot" />
            <span>Live heartbeat polling 10s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cluster, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg os-surface os-interactive space-y-3 ${
                cluster.status === 'warning'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cluster.name}</span>
                    <span
                      className={`text-[9px] os-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        cluster.status === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {cluster.status}
                    </span>
                  </div>
                  <div className="text-[11px] os-mono text-slate-400">{cluster.location}</div>
                </div>

                <div className="text-right os-mono text-xs">
                  <div className="text-cyan-300 font-bold">{cluster.p99}</div>
                  <div className="text-[10px] text-slate-500">p99 Latency</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs os-mono py-1 border-y border-white/[0.06]">
                <div>
                  <div className="text-[10px] text-slate-400">Uptime</div>
                  <div className="text-slate-200 font-bold">{cluster.uptime}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Node Load</div>
                  <div className="text-slate-200 font-bold">{cluster.load}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Nodes</div>
                  <div className="text-slate-200 font-bold">{cluster.nodes}</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 os-mono flex items-center gap-1.5">
                <span className="text-cyan-400">›</span>
                <span>{cluster.note}</span>
              </p>

              {cluster.status === 'warning' && (
                <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between">
                  <span className="text-xs os-mono text-amber-300">Excess Egress Waste: $8.4k/mo</span>
                  <button
                    onClick={handleFixEgress}
                    className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold os-mono transition-all shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                  >
                    Propose zstd Fix
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
