import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Activity,
  ShieldCheck,
  Globe,
  Radio,
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  AlertTriangle,
  Play,
  RotateCw,
  Sliders,
  ChevronRight,
  Maximize2,
  Lock,
} from 'lucide-react';
import {
  BusinessMetric,
  BusinessAnomaly,
  WorldNode,
  ProposedAction,
  ExecutionRecord,
  HierarchyEntity,
  TemporalEpoch,
} from '../types';

interface CyberHUDViewProps {
  metrics: BusinessMetric[];
  anomalies: BusinessAnomaly[];
  nodes: WorldNode[];
  selectedNode: WorldNode | null;
  onSelectNode: (node: WorldNode) => void;
  pendingActions: ProposedAction[];
  executionRecords: ExecutionRecord[];
  onExecuteAction: (action: ProposedAction) => void;
  onOpenFocusMode?: (objectiveId: string) => void;
  currentEpoch?: TemporalEpoch;
  onEpochChange?: (epoch: TemporalEpoch) => void;
  onOpenCommandCore?: () => void;
  onSelectSpatialEntity?: (entity: HierarchyEntity) => void;
}

export const CyberHUDView: React.FC<CyberHUDViewProps> = ({
  metrics,
  anomalies,
  nodes,
  selectedNode,
  onSelectNode,
  pendingActions,
  executionRecords,
  onExecuteAction,
  onOpenFocusMode,
  currentEpoch = 'NOW',
  onEpochChange,
  onOpenCommandCore,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'swarm' | 'telemetry'>('matrix');
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [selectedConstellationNode, setSelectedConstellationNode] = useState<number>(1);
  const [simulatedLoad, setSimulatedLoad] = useState<number>(78);
  const [audioOscillation, setAudioOscillation] = useState<number[]>([
    12, 28, 45, 82, 35, 95, 60, 42, 88, 70, 30, 92, 55, 38, 76, 22,
  ]);
  const [isEngaged, setIsEngaged] = useState<boolean>(false);
  const [hudNotice, setHudNotice] = useState<string | null>(null);

  // Periodic heartbeat animation & dynamic waveforms
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 360);
      setAudioOscillation((prev) =>
        prev.map(() => Math.floor(Math.random() * 75) + 20)
      );
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const triggerPillNotice = (msg: string) => {
    setHudNotice(msg);
    setTimeout(() => setHudNotice(null), 3500);
  };

  const handleSimulateClick = () => {
    setIsEngaged(!isEngaged);
    setSimulatedLoad((prev) => (prev === 78 ? 94 : 78));
    triggerPillNotice(
      isEngaged
        ? 'SWARM SIMULATION RE-STABILIZED // CRITICAL PATH SECURE'
        : 'AUTONOMOUS SWARM SIMULATION ENGAGED // +€2.4M CAPITAL VECTOR PROJECTED'
    );
  };

  const handleAuthorizeClick = () => {
    if (pendingActions.length > 0) {
      onExecuteAction(pendingActions[0]);
      triggerPillNotice(`POLICY GATE: AUTHORIZING "${pendingActions[0].title}"`);
    } else {
      triggerPillNotice('POLICY GATE // ALL POLICIES COMPLIANT & ENFORCED');
    }
  };

  // 3D Wireframe Constellation vertices (UAE Digital Twin nodes)
  const constellationNodes = [
    { id: 0, x: 28, y: 35, name: 'Abu Dhabi HQ', label: 'AUH' },
    { id: 1, x: 70, y: 22, name: 'Dubai Global Port', label: 'DXB' },
    { id: 2, x: 88, y: 65, name: 'Sharjah Industrial', label: 'SHJ' },
    { id: 3, x: 45, y: 82, name: 'Masdar Solar Grid', label: 'MSD' },
    { id: 4, x: 18, y: 62, name: 'Jebel Ali Logistics', label: 'JAF' },
    { id: 5, x: 55, y: 48, name: 'Sovereign AI Core', label: 'AIOS' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Outer Cyber Chassis Frame directly matching uploaded image */}
      <div className="cyber-hud-frame rounded-2xl p-4 sm:p-6 text-white select-none overflow-hidden relative">
        {/* Exterior Circuit Trace Lines with Corner Node Dots */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[#00f0ff] opacity-80 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
          <div className="w-16 h-[1.5px] bg-[#00f0ff]" />
          <div className="w-1 h-1 rounded-full bg-[#00f0ff]" />
        </div>

        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[#ff007a] opacity-80 pointer-events-none">
          <div className="w-1 h-1 rounded-full bg-[#ff007a]" />
          <div className="w-20 h-[1.5px] bg-[#ff007a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff007a] shadow-[0_0_8px_#ff007a]" />
        </div>

        <div className="absolute bottom-2 left-6 flex items-center gap-1.5 text-[#ff8800] opacity-80 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#ff8800] shadow-[0_0_8px_#ff8800]" />
          <div className="w-24 h-[1.5px] bg-[#ff8800]" />
        </div>

        <div className="absolute bottom-2 right-6 flex items-center gap-2 pointer-events-none">
          <div className="px-2 py-0.5 rounded-full bg-[#ff007a]/30 border border-[#ff007a] text-[9px] font-mono text-[#ff007a]">
            NODE: UAE-SOVEREIGN-01
          </div>
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* ========================================================
            TOP SECTION: HORIZON COMMAND BANNER & DUAL CONCENTRIC GAUGES
            ======================================================== */}
        <div className="space-y-3 pt-2">
          {/* Top Row: Warning Hazard Pill + Status Readouts */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="cyber-hatch-orange px-3 py-0.5 rounded text-[10px] font-bold tracking-wider text-black uppercase">
                /// AIR-GAPPED IMMUTABLE GATE
              </div>
              <span className="text-[#00f0ff] text-[11px] tracking-widest uppercase hidden sm:inline">
                SYS::AIOS-JARVIS-CORE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                <span className="text-slate-400">STATE:</span>
                <span className="text-[#00f0ff] font-bold">SOVEREIGN VERIFIED</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[10px] text-slate-300">
                p99: 18ms
              </div>
            </div>
          </div>

          {/* Golden-Orange to Magenta Glowing Command Banner with Chamfer Edge */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl cyber-command-banner text-white">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                <Zap className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold tracking-widest text-black/80 bg-white/90 px-1.5 py-0.2 rounded uppercase">
                    JARVIS / AIOS HUD
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-amber-100 font-semibold uppercase">
                    UAE DIGITAL TWIN REASONING ENGINE
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  AUTONOMOUS EXECUTIVE CYBERNETIC COCKPIT
                </h1>
              </div>
            </div>

            {/* Glowing Laser Track Line in Center */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs px-4">
              <div className="w-full h-[2px] bg-white/70 shadow-[0_0_8px_#ffffff] relative">
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
              </div>
            </div>

            {/* Right Action Switchers */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenCommandCore}
                className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/30 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,0,0,0.5)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>COMMAND CORE ⌘K</span>
              </button>
            </div>
          </div>

          {/* Dual Concentric HUD Circular Gauges & Oscilloscope Chamfer Plate */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center pt-1">
            {/* Dual Circular Concentric HUD Radar Dials (Cols 1-5) */}
            <div className="lg:col-span-5 flex items-center justify-center sm:justify-start gap-5 p-3 rounded-xl bg-black/40 border border-cyan-500/30">
              {/* Dial 1: Quantum Synapse Core */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  {/* Outer spinning segmented ring */}
                  <svg className="w-full h-full cyber-spin-cw text-cyan-400" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="18 10 35 15"
                      className="opacity-90"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="34"
                      fill="none"
                      stroke="#ff007a"
                      strokeWidth="2"
                      strokeDasharray="8 6 12 8"
                      className="opacity-70"
                    />
                  </svg>
                  {/* Inner counter-spinning reticle */}
                  <svg
                    className="absolute w-10 h-10 cyber-spin-ccw text-amber-400"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="24 14"
                    />
                  </svg>
                  {/* Glowing center dot */}
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] cyber-pulse-core" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Core Synapse</div>
                  <div className="text-sm font-bold font-mono text-cyan-300">99.8% READY</div>
                  <div className="text-[9px] font-mono text-slate-500">BANDWIDTH: 4.8 TB/s</div>
                </div>
              </div>

              {/* Dial 2: UAE World Model Orbit */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg
                    className="w-full h-full cyber-spin-fast text-[#ff007a]"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="28 12 10 16"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="32"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      strokeDasharray="14 10"
                    />
                  </svg>
                  <div className="w-3 h-3 rounded-full bg-[#ff007a] shadow-[0_0_12px_#ff007a]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">World Model L5</div>
                  <div className="text-sm font-bold font-mono text-[#ff007a]">SYNCHRONIZED</div>
                  <div className="text-[9px] font-mono text-slate-500">ENTITIES: 1,482</div>
                </div>
              </div>
            </div>

            {/* Right: Oscilloscope Waveform Chamfer Box (Cols 6-12) */}
            <div className="lg:col-span-7 p-3 rounded-xl bg-black/40 border border-[#ff007a]/40 flex items-center justify-between gap-4 cyber-chamfer-r relative overflow-hidden">
              <div className="space-y-0.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff007a] animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-[#ff007a] uppercase tracking-wider">
                    TELEMETRY OSCILLOSCOPE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  REAL-TIME EMIRATE DATA HARMONICS // WAVE PATTERN #482
                </div>
              </div>

              {/* Live Oscillating Neon Waveform Graph */}
              <div className="flex items-end gap-1 h-8 w-44 sm:w-60 overflow-hidden pr-4">
                {audioOscillation.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-[#ff007a] via-[#ff8800] to-[#00f0ff] rounded-t transition-all duration-300"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pop-up Notice banner on action triggers */}
        {hudNotice && (
          <div className="my-2 p-2.5 rounded-lg bg-black/80 border border-cyan-400 text-xs font-mono text-cyan-300 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{hudNotice}</span>
            </div>
            <button
              onClick={() => setHudNotice(null)}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================
            MIDDLE SECTION: 3-COLUMN TACTICAL MATRIX
            (Controls & Status Pills | Central Terrain Waveform | Constellation Wireframe)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          {/* ----------------------------------------------------
              LEFT COLUMN: TACTICAL CAPSULE BUTTONS & SECURITY HUB
              ---------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Security Shield Node */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#ff007a]/20 text-[#ff007a] border border-[#ff007a]/40">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Policy Guard</div>
                    <div className="text-xs font-mono font-bold text-white">ENFORCED 100%</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              </div>

              {/* The Two Iconic Capsule Buttons from the User's Image */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="text-[9px] font-mono text-amber-300/80 mb-1 tracking-wider uppercase">
                    AUTONOMOUS DISPATCH TRIGGER
                  </div>
                  <button
                    onClick={handleSimulateClick}
                    className="w-full py-3 px-4 rounded-full cyber-pill-orange text-xs font-mono font-black text-black tracking-wider uppercase flex items-center justify-center gap-2 select-none"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>{isEngaged ? 'SWARM ENGAGED' : 'ENGAGE SWARM SIM'}</span>
                  </button>
                </div>

                <div>
                  <div className="text-[9px] font-mono text-[#ff007a]/80 mb-1 tracking-wider uppercase">
                    SOVEREIGN POLICY GATE
                  </div>
                  <button
                    onClick={handleAuthorizeClick}
                    className="w-full py-3 px-4 rounded-full cyber-pill-magenta text-xs font-mono font-black text-white tracking-wider uppercase flex items-center justify-center gap-2 select-none"
                  >
                    <Lock className="w-4 h-4" />
                    <span>AUTHORIZE & COMMIT</span>
                  </button>
                </div>
              </div>

              {/* Circuit Path Indicator & Status Chips */}
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">IMMUTABLE LOGS</span>
                  <span className="text-emerald-400 font-bold">{executionRecords.length} COMMITTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PENDING GATE</span>
                  <span className="text-amber-400 font-bold">{pendingActions.length} ACTIONS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SWARM CONSENSUS</span>
                  <span className="text-cyan-400 font-bold">DETERMINISTIC</span>
                </div>
              </div>
            </div>

            {/* Stepped Circuit Runner */}
            <div className="pt-2 flex items-center gap-2 text-cyan-400 font-mono text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
              <div className="h-[1px] flex-1 bg-cyan-500/40" />
              <span>TERMINAL SECURE</span>
            </div>
          </div>

          {/* ----------------------------------------------------
              CENTER COLUMN: TACTICAL WAVEFORM & DIGITAL TWIN HORIZON
              ---------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-3">
            {/* Upper Sub-card: Scope Alignment Header */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    SECTOR HORIZON: {selectedNode ? selectedNode.label.toUpperCase() : 'ABU DHABI & DUBAI QUADRANT'}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  Continuous simulation correlating real-world logistics, energy grids, and sovereign financial vectors.
                </p>
              </div>
              <div className="shrink-0 text-right font-mono">
                <div className="text-[10px] text-slate-400">LATENCY</div>
                <div className="text-xs font-bold text-cyan-400">12ms P99</div>
              </div>
            </div>

            {/* Main Energetic Mountain / Waveform Visualization (matching center of uploaded image) */}
            <div className="relative p-5 rounded-xl bg-black/60 border border-cyan-500/40 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 os-grid pointer-events-none opacity-40" />

              {/* Targeting Reticle on Left */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-cyan-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300">TARGET ACQUIRED: UAE-CORE</span>
              </div>

              {/* Mountain Energetic Terrain Gradient Wave (SVG matching image) */}
              <div className="pt-8 pb-3">
                <svg className="w-full h-32" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyberWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff8800" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#ff007a" stopOpacity="0.9" />
                      <stop offset="70%" stopColor="#7928ca" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="cyberFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ff007a" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#7928ca" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area Under Wave */}
                  <path
                    d="M 0 100 Q 60 95, 120 70 T 240 40 T 360 65 T 440 30 T 500 80 L 500 120 L 0 120 Z"
                    fill="url(#cyberFillGrad)"
                  />

                  {/* Primary Luminous Mountain Ridge Curve */}
                  <path
                    d="M 0 100 Q 60 95, 120 70 T 240 40 T 360 65 T 440 30 T 500 80"
                    fill="none"
                    stroke="url(#cyberWaveGrad)"
                    strokeWidth="3.5"
                    filter="drop-shadow(0 0 8px rgba(255, 0, 122, 0.8))"
                  />

                  {/* Secondary High-frequency Baseline */}
                  <path
                    d="M 0 108 L 100 106 L 160 85 L 220 90 L 300 78 L 380 92 L 460 70 L 500 88"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-70"
                  />
                </svg>
              </div>

              {/* Terminal Readout Strip Below Curve */}
              <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="text-cyan-300 font-bold">
                    REASONING SWARM :: RISK INDEX 0.08 (NOMINAL)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    SIMULATED RUNWAY: +€24.84M ARR // CAPITAL PRESERVATION VERIFIED
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    PASSING 8/8 POLICIES
                  </span>
                </div>
              </div>
            </div>

            {/* Stepped Bottom Circuit Line with Terminal Node */}
            <div className="flex items-center gap-2 text-[#ff8800] text-[10px] font-mono pl-2">
              <div className="w-2 h-2 rounded-full bg-[#ff8800] shadow-[0_0_8px_#ff8800]" />
              <div className="h-[1px] w-24 bg-[#ff8800]" />
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-slate-400">FEED: SECURE_SOCKET_10.24.1</span>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN: 3D WIREFRAME CONSTELLATION & METERS
              ---------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            {/* Box 1: 3D Vector Wireframe Spatial Constellation (matching upper right of image) */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-[#ff8800]/40 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                  <Globe className="w-3.5 h-3.5" />
                  <span>SPATIAL CONSTELLATION</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">NODE 0{selectedConstellationNode}</span>
              </div>

              {/* Interactive Vector Node Cluster Mesh */}
              <div className="relative w-full h-36 bg-black/40 rounded-lg border border-white/[0.06] overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                  {/* Connecting Neon Lines between Nodes */}
                  <line x1="28" y1="35" x2="70" y2="22" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="2 2" />
                  <line x1="70" y1="22" x2="88" y2="65" stroke="#ff007a" strokeWidth="1.5" />
                  <line x1="88" y1="65" x2="45" y2="82" stroke="#ff8800" strokeWidth="1.5" />
                  <line x1="45" y1="82" x2="18" y2="62" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="18" y1="62" x2="28" y2="35" stroke="#ff007a" strokeWidth="1.5" />
                  <line x1="28" y1="35" x2="55" y2="48" stroke="#00f0ff" strokeWidth="1.2" />
                  <line x1="70" y1="22" x2="55" y2="48" stroke="#00f0ff" strokeWidth="1.2" />
                  <line x1="88" y1="65" x2="55" y2="48" stroke="#ff8800" strokeWidth="1.2" />
                  <line x1="45" y1="82" x2="55" y2="48" stroke="#ff007a" strokeWidth="1.2" />

                  {/* Pulsing Nodes */}
                  {constellationNodes.map((n) => {
                    const isSel = selectedConstellationNode === n.id;
                    return (
                      <g
                        key={n.id}
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => setSelectedConstellationNode(n.id)}
                      >
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={isSel ? 4.5 : 3}
                          fill={isSel ? '#00f0ff' : '#ff007a'}
                          stroke="#ffffff"
                          strokeWidth={isSel ? '1.5' : '0.8'}
                          className={isSel ? 'shadow-[0_0_10px_#00f0ff]' : ''}
                        />
                        <text
                          x={n.x + 5}
                          y={n.y + 3}
                          fontSize="5"
                          fill={isSel ? '#00f0ff' : '#cbd5e1'}
                          fontFamily="monospace"
                        >
                          {n.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Selected Node Telemetry Badge */}
                <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/40">
                  {constellationNodes[selectedConstellationNode].name}
                </div>
              </div>
            </div>

            {/* Box 2: Horizontal Telemetry Bar Sliders (matching mid-right of image) */}
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2.5">
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                SWARM TELEMETRY METRICS
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-300">COMPUTE CORE ALLOCATION</span>
                    <span className="text-cyan-400 font-bold">{simulatedLoad}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${simulatedLoad}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-300">SWARM CONSENSUS ACCURACY</span>
                    <span className="text-[#ff007a] font-bold">99.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-[#ff007a] to-pink-400 w-[99.4%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-slate-300">POLICY INTEGRITY INDEX</span>
                    <span className="text-amber-400 font-bold">100%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM DECK: DATA LOGS, SOVEREIGN ARC CORE & SPECTRUM BARS
            (translates the bottom row of the image)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 pt-3 border-t border-white/10">
          {/* Deck 1: Live Kernel Telemetry Data Logs (Cols 1-4) */}
          <div className="lg:col-span-4 p-3.5 rounded-xl bg-black/50 border border-[#ff007a]/40 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#ff007a]">
                <Terminal className="w-3.5 h-3.5" />
                <span>IMMUTABLE AIOS AUDIT LOG</span>
              </div>
              <span className="text-[9px] text-slate-400">STREAMING</span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 max-h-24 overflow-y-auto no-scrollbar pr-1">
              <div className="flex items-center gap-2">
                <span className="text-[#ff8800]">04:48:12</span>
                <span className="text-slate-400">→</span>
                <span className="truncate">Model verified: 482 spatial nodes intact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00f0ff]">04:48:24</span>
                <span className="text-slate-400">→</span>
                <span className="truncate">Policy Gate held €2.1M expansion contract</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ff007a]">04:48:38</span>
                <span className="text-slate-400">→</span>
                <span className="truncate">Swarm generated 3 mitigation branches</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">04:48:50</span>
                <span className="text-slate-400">→</span>
                <span className="truncate">Cryptographic signature: 0x8f2d...9a21</span>
              </div>
            </div>
          </div>

          {/* Deck 2: Central Sovereign Arc Reactor Ring Gauge (Cols 5-7) */}
          <div className="lg:col-span-4 p-3.5 rounded-xl bg-black/50 border border-cyan-500/40 flex items-center justify-center gap-4">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              {/* Concentric spinning rings with degree ticks */}
              <svg className="w-full h-full cyber-spin-cw text-cyan-400" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="20 8 40 12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke="#ff007a"
                  strokeWidth="2.5"
                  strokeDasharray="10 6 22 8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="none"
                  stroke="#ff8800"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>
              {/* Counter-spinning tick reticle */}
              <svg
                className="absolute w-16 h-16 cyber-spin-ccw text-white opacity-80"
                viewBox="0 0 100 100"
              >
                <line x1="50" y1="5" x2="50" y2="18" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="82" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
                <line x1="5" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="2" />
                <line x1="82" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
              </svg>
              {/* Pulsing Core */}
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_16px_#00f0ff] cyber-pulse-core flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                SOVEREIGN CORE ENGINE
              </div>
              <div className="text-base font-bold font-mono text-white">ACTIVE CONTINUUM</div>
              <div className="text-[10px] font-mono text-cyan-300">
                AIOS v4.2 // AIR-GAPPED READY
              </div>
            </div>
          </div>

          {/* Deck 3: Telemetry Equalizer Bars & Golden Status Cube (Cols 8-12) */}
          <div className="lg:col-span-4 p-3.5 rounded-xl bg-black/50 border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                SWARM SPECTRUM DENSITY
              </div>
              <div className="text-sm font-bold font-mono text-amber-300">
                16 HARMONIC CHANNELS
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                OPTIMIZED COMPUTATION PEAK
              </div>
            </div>

            {/* Vertical Spectrum Analyzer Bar Array */}
            <div className="flex items-end gap-1.5 h-14 pr-2">
              {[60, 85, 45, 95, 70, 30, 80, 100, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-t transition-all duration-300"
                  style={{
                    height: `${((h + pulseTick * (i + 1)) % 80) + 20}%`,
                    background:
                      i % 3 === 0
                        ? 'linear-gradient(to top, #ff8800, #ffaa00)'
                        : i % 3 === 1
                        ? 'linear-gradient(to top, #ff007a, #ff5599)'
                        : 'linear-gradient(to top, #00f0ff, #38bdf8)',
                  }}
                />
              ))}
            </div>

            {/* Golden Status Cube */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_16px_rgba(255,170,0,0.7)] flex items-center justify-center shrink-0 border border-amber-200">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
