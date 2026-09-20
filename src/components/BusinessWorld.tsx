import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Bot,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Layers3,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Scan,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import { WorldNode, ProposedAction } from '../types';

interface BusinessWorldProps {
  nodes?: WorldNode[];
  selectedNode?: WorldNode | null;
  onSelectNode?: (node: WorldNode) => void;
  highlightedNodeIds?: string[];
  onQuickInspectNode?: (nodeId: string) => void;
  onExecutePolicyAction?: (action: ProposedAction) => void;
}

type Camera = { yaw: number; pitch: number; zoom: number; x: number; y: number };
type WorldEntity = {
  id: string;
  label: string;
  type: WorldNode['type'];
  metric: string;
  subMetric: string;
  status: WorldNode['status'];
  x: number;
  y: number;
  z: number;
  description: string;
};

const FALLBACK_ENTITIES: WorldEntity[] = [
  { id: 'revenue', label: 'Revenue', type: 'revenue', metric: '$4.82M', subMetric: 'ARR', status: 'optimal', x: -34, y: 0, z: -18, description: 'Primary ARR generation and pricing intelligence.' },
  { id: 'sales', label: 'Sales Pipeline', type: 'sales', metric: '$14.8M', subMetric: 'PIPELINE', status: 'active', x: 2, y: 0, z: -28, description: 'Enterprise pipeline, deal velocity and conversion.' },
  { id: 'customers', label: 'Customers', type: 'customers', metric: '124%', subMetric: 'NRR', status: 'warning', x: 34, y: 0, z: -15, description: 'Retention, expansion and customer health.' },
  { id: 'operations', label: 'Operations', type: 'operations', metric: '99.99%', subMetric: 'HEALTH', status: 'optimal', x: 34, y: 0, z: 19, description: 'Infrastructure, capacity and service reliability.' },
  { id: 'finance', label: 'Finance', type: 'finance', metric: '$2.37M', subMetric: 'LIQUIDITY', status: 'optimal', x: -32, y: 0, z: 22, description: 'Treasury, cash position and capital allocation.' },
  { id: 'core', label: 'Business Core', type: 'systems', metric: '42ms', subMetric: 'LATENCY', status: 'active', x: 0, y: 0, z: 5, description: 'Central orchestration, policy and decision runtime.' },
];

const AGENTS = [
  { id: 'revenue-agent', name: 'Revenue Agent', from: 'revenue', to: 'core', color: 'cyan' },
  { id: 'finance-agent', name: 'Finance Agent', from: 'finance', to: 'core', color: 'emerald' },
  { id: 'customer-agent', name: 'Customer Agent', from: 'customers', to: 'sales', color: 'violet' },
  { id: 'ops-agent', name: 'Ops Agent', from: 'operations', to: 'core', color: 'amber' },
];

const statusClass: Record<string, string> = {
  optimal: 'border-emerald-400/40 text-emerald-300',
  active: 'border-cyan-400/40 text-cyan-300',
  warning: 'border-amber-400/40 text-amber-300',
  critical: 'border-rose-400/40 text-rose-300',
};

export const BusinessWorld: React.FC<BusinessWorldProps> = ({
  nodes = [],
  selectedNode,
  onSelectNode,
  highlightedNodeIds = [],
  onQuickInspectNode,
  onExecutePolicyAction,
}) => {
  const [camera, setCamera] = useState<Camera>({ yaw: -24, pitch: 56, zoom: 1, x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(selectedNode?.id || 'core');
  const [playing, setPlaying] = useState(true);
  const [simulation, setSimulation] = useState(false);
  const [tick, setTick] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number; mode: 'orbit' | 'pan' } | null>(null);

  const entities = useMemo<WorldEntity[]>(() => {
    if (!nodes.length) return FALLBACK_ENTITIES;
    const positions: Record<string, [number, number, number]> = {
      revenue: [-34, 0, -18], sales: [2, 0, -28], customers: [34, 0, -15],
      operations: [34, 0, 19], finance: [-32, 0, 22], core: [0, 0, 5],
    };
    return nodes.slice(0, 12).map((n, i) => {
      const p = positions[n.id] || [((i % 4) - 1.5) * 24, 0, Math.floor(i / 4) * 24 - 10];
      return {
        id: n.id, label: n.label, type: n.type, metric: n.metric, subMetric: n.subMetric,
        status: n.status, x: p[0], y: p[1], z: p[2], description: n.description,
      };
    });
  }, [nodes]);

  const active = entities.find(e => e.id === selectedId) || entities[0];
  const lookup = useMemo(() => new Map(entities.map(e => [e.id, e])), [entities]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTick(t => t + 1), 80);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (selectedNode?.id) setSelectedId(selectedNode.id);
  }, [selectedNode?.id]);

  const select = (entity: WorldEntity) => {
    setSelectedId(entity.id);
    const source = nodes.find(n => n.id === entity.id);
    if (source) onSelectNode?.(source);
    onQuickInspectNode?.(entity.id);
  };

  const resetCamera = () => setCamera({ yaw: -24, pitch: 56, zoom: 1, x: 0, y: 0 });

  const policyAction = () => {
    if (!active) return;
    onExecutePolicyAction?.({
      id: `world_${active.id}_${Date.now()}`,
      title: `Optimize ${active.label} operating policy`,
      description: `AI-proposed mutation for the ${active.label} domain.`,
      riskLevel: 'medium',
      targetSystem: active.label,
      requiresApproval: true,
      status: 'PROPOSED',
      parameters: { simulation, worldEntity: active.id },
    });
  };

  const startDrag = (e: React.PointerEvent, mode: 'orbit' | 'pan') => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, yaw: camera.yaw, pitch: camera.pitch, mode };
  };

  const moveDrag = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (drag.current.mode === 'orbit') {
      setCamera(c => ({ ...c, yaw: drag.current!.yaw + dx * 0.35, pitch: Math.max(28, Math.min(78, drag.current!.pitch - dy * 0.2)) }));
    } else {
      setCamera(c => ({ ...c, x: drag.current!.x + dx * 0.08, y: drag.current!.y - dy * 0.08 }));
    }
  };

  const stopDrag = () => { drag.current = null; };

  const edges = [
    ['core', 'revenue'], ['core', 'finance'], ['core', 'sales'], ['core', 'operations'],
    ['sales', 'customers'], ['revenue', 'customers'], ['finance', 'operations'],
  ];

  return (
    <section className="relative w-full min-h-[720px] h-[calc(100vh-235px)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070a10] os-cyber-corners os-scanlines">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,240,255,0.08),transparent_34%),radial-gradient(circle_at_75%_65%,rgba(168,85,247,0.07),transparent_30%)] pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 z-30 h-14 px-4 flex items-center justify-between border-b border-white/[0.07] bg-[#090d15]/85 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Layers3 className="w-4 h-4 text-cyan-300" />
            BUSINESS WORLD
          </div>
          <span className="text-[10px] font-mono text-slate-500">SPATIAL DIGITAL TWIN / LIVE</span>
          <span className={`px-2 py-0.5 rounded border text-[9px] font-mono ${simulation ? 'border-violet-400/50 text-violet-300 bg-violet-500/10' : 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'}`}>
            {simulation ? 'FUTURE SIMULATION' : 'LIVE TELEMETRY'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPlaying(v => !v)} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title={playing ? 'Pause telemetry' : 'Resume telemetry'}>{playing ? <Pause size={15}/> : <Play size={15}/>}</button>
          <button onClick={() => setSimulation(v => !v)} className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono ${simulation ? 'border-violet-400/40 text-violet-300' : 'border-white/10 text-slate-400'}`}>SIM</button>
          <button onClick={resetCamera} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title="Reset camera"><RotateCcw size={15}/></button>
        </div>
      </header>

      <div
        className="absolute inset-0 pt-14"
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={e => {
          e.preventDefault();
          setCamera(c => ({ ...c, zoom: Math.max(0.55, Math.min(1.65, c.zoom - e.deltaY * 0.001)) }));
        }}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-0 overflow-hidden [perspective:1100px]">
          <div
            className="absolute left-1/2 top-[52%] w-[1100px] h-[700px] transition-transform duration-100"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate(-50%,-50%) translate3d(${camera.x * camera.zoom}px,${camera.y * camera.zoom}px,0) rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg) scale(${camera.zoom})`,
            }}
            onPointerDown={e => startDrag(e, e.shiftKey ? 'pan' : 'orbit')}
          >
            <div
              className="absolute inset-0 rounded-full opacity-70"
              style={{
                transform: 'rotateX(90deg) translateZ(-4px)',
                backgroundImage: 'linear-gradient(rgba(0,240,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.09) 1px,transparent 1px)',
                backgroundSize: '44px 44px',
                boxShadow: '0 0 100px rgba(0,240,255,.05) inset',
              }}
            />

            {edges.map(([a,b]) => {
              const A = lookup.get(a), B = lookup.get(b);
              if (!A || !B) return null;
              const dx = B.x-A.x, dz = B.z-A.z;
              const len = Math.sqrt(dx*dx+dz*dz);
              const angle = Math.atan2(dz,dx) * 180 / Math.PI;
              return (
                <div key={`${a}-${b}`} className="absolute h-px origin-left bg-cyan-400/20 shadow-[0_0_12px_rgba(0,240,255,.35)]" style={{
                  left: 550+A.x*7.5, top: 340+A.z*7.5, width: len*7.5,
                  transform: `translateZ(2px) rotate(${angle}deg)`,
                }}>
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent animate-[pulse_1.8s_linear_infinite]" />
                </div>
              );
            })}

            {entities.map(entity => {
              const selected = entity.id === selectedId;
              const highlighted = highlightedNodeIds.includes(entity.id);
              const isCore = entity.id === 'core';
              return (
                <button
                  key={entity.id}
                  onClick={e => { e.stopPropagation(); select(entity); }}
                  className="absolute group text-left"
                  style={{ left: 550+entity.x*7.5, top: 340+entity.z*7.5, transform: 'translate(-50%,-50%) translateZ(18px)' }}
                >
                  <div className={`relative w-36 h-24 rounded-xl border backdrop-blur-md transition-all duration-300 ${selected ? 'border-cyan-300 bg-cyan-500/10 shadow-[0_0_45px_rgba(0,240,255,.28)] scale-110' : highlighted ? 'border-violet-400/70 bg-violet-500/10' : 'border-white/10 bg-[#101722]/90 group-hover:border-cyan-400/50'}`}>
                    <div className="absolute -bottom-3 left-3 right-3 h-3 rounded-[50%] bg-cyan-400/10 blur-md" />
                    <div className="p-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-slate-500">{entity.subMetric}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${entity.status === 'critical' ? 'bg-rose-400' : entity.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {isCore ? <Zap size={15} className="text-cyan-300"/> : entity.type === 'customers' ? <Users size={15} className="text-violet-300"/> : entity.type === 'finance' ? <WalletCards size={15} className="text-emerald-300"/> : <Activity size={15} className="text-cyan-300"/>}
                        <span className="text-xs font-semibold text-white">{entity.label}</span>
                      </div>
                      <div className="mt-2 text-base font-mono text-cyan-200">{simulation && entity.id === 'revenue' ? '$5.24M' : entity.metric}</div>
                    </div>
                    {selected && <div className="absolute -inset-2 rounded-2xl border border-cyan-300/20 animate-pulse pointer-events-none" />}
                  </div>
                </button>
              );
            })}

            {AGENTS.map((agent, index) => {
              const from = lookup.get(agent.from), to = lookup.get(agent.to);
              if (!from || !to) return null;
              const t = ((tick * (0.002 + index * 0.00035)) % 1);
              const x = from.x + (to.x-from.x)*t;
              const z = from.z + (to.z-from.z)*t;
              return (
                <div key={agent.id} className="absolute z-20 pointer-events-none" style={{ left: 550+x*7.5, top: 340+z*7.5, transform: 'translate(-50%,-50%) translateZ(45px)' }}>
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
                    <div className="relative w-7 h-7 rounded-full border border-cyan-200/60 bg-[#0b1722] flex items-center justify-center shadow-[0_0_18px_rgba(0,240,255,.7)]"><Bot size={13} className="text-cyan-200"/></div>
                    <div className="absolute left-9 top-1 whitespace-nowrap text-[8px] font-mono text-slate-400 bg-black/50 px-1.5 py-1 rounded">{agent.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute left-4 bottom-4 z-20 flex flex-col gap-1">
          <button onClick={() => setCamera(c => ({...c, zoom: Math.min(1.65,c.zoom+0.1)}))} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Plus size={15}/></button>
          <button onClick={() => setCamera(c => ({...c, zoom: Math.max(.55,c.zoom-.1)}))} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Minus size={15}/></button>
          <button onClick={() => setCamera(c => ({...c, yaw: c.yaw-15}))} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><RotateCcw size={15}/></button>
          <button onClick={() => setCamera(c => ({...c, yaw: c.yaw+15}))} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Scan size={15}/></button>
        </div>

        {showLegend && (
          <div className="absolute left-16 bottom-4 z-20 p-3 rounded-xl border border-white/10 bg-[#0b1018]/90 backdrop-blur-xl text-[9px] font-mono text-slate-400">
            <div className="flex items-center gap-2"><Crosshair size={11} className="text-cyan-300"/> DRAG = ORBIT</div>
            <div className="mt-1 text-slate-600">SHIFT + DRAG = PAN · WHEEL = ZOOM</div>
            <div className="mt-2 flex items-center gap-3"><span className="text-emerald-300">● LIVE</span><span className="text-violet-300">● AI AGENT</span><span className="text-amber-300">● WARNING</span></div>
          </div>
        )}

        <button onClick={() => setShowLegend(v => !v)} className="absolute right-4 bottom-4 z-20 px-2 py-1.5 rounded-lg border border-white/10 bg-[#0b1018]/90 text-[9px] font-mono text-slate-400">
          {showLegend ? 'HIDE LEGEND' : 'SHOW LEGEND'}
        </button>

        {showInspector && active && (
          <aside className="absolute right-4 top-20 z-25 w-72 rounded-2xl border border-white/10 bg-[#0b1018]/92 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-mono text-cyan-300">SPATIAL INSPECTOR</div>
                <div className="text-sm font-semibold text-white mt-0.5">{active.label}</div>
              </div>
              <button onClick={() => setShowInspector(false)} className="text-slate-500 hover:text-white"><X size={15}/></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="text-[8px] font-mono text-slate-500">PRIMARY</div><div className="mt-1 text-sm font-mono text-cyan-200">{active.metric}</div></div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="text-[8px] font-mono text-slate-500">STATE</div><div className={`mt-1 text-[10px] uppercase font-mono ${statusClass[active.status] || 'text-slate-300'}`}>{active.status}</div></div>
              </div>
              <p className="text-[11px] leading-5 text-slate-400">{active.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500"><Activity size={11}/> TELEMETRY <span className="ml-auto text-emerald-300">STREAMING</span></div>
                <div className="h-10 flex items-end gap-1">{Array.from({length:18},(_,i)=><span key={i} className="flex-1 bg-cyan-400/30 rounded-t" style={{height: `${20 + ((i*17+tick)%55)}%`}} />)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onQuickInspectNode?.(active.id)} className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300 hover:border-cyan-400/40">OPEN DOMAIN</button>
                <button onClick={policyAction} className="flex-1 px-3 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-[9px] font-mono text-cyan-200 hover:bg-cyan-400/20 flex items-center justify-center gap-1"><ShieldCheck size={11}/> POLICY</button>
              </div>
            </div>
          </aside>
        )}

        {!showInspector && active && (
          <button onClick={() => setShowInspector(true)} className="absolute right-4 top-20 z-20 p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300"><ChevronDown size={15}/></button>
        )}
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-30 h-10 px-4 flex items-center justify-between border-t border-white/[0.07] bg-[#090d15]/90 backdrop-blur-xl text-[9px] font-mono">
        <div className="flex items-center gap-4 text-slate-500">
          <span>ENTITIES <b className="text-slate-300">{entities.length}</b></span>
          <span>AI AGENTS <b className="text-cyan-300">{AGENTS.length}</b></span>
          <span>TELEMETRY <b className="text-emerald-300">LIVE</b></span>
          {simulation && <span className="text-violet-300">SIMULATION DELTA: +8.7% ARR</span>}
        </div>
        <div className="flex items-center gap-2 text-slate-500"><Target size={11}/> TICK {String(tick).padStart(6,'0')} <Sparkles size={11} className="text-cyan-300"/></div>
      </footer>
    </section>
  );
};
