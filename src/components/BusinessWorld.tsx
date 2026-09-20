import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  TrendingUp,
  Users,
  Server,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lock,
  Search,
  Sliders,
  Sparkles,
  X,
  Play,
  Pause,
  RotateCcw,
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

interface IsometricNode {
  id: string;
  label: string;
  subLabel: string;
  metric: string;
  secondaryMetric?: string;
  deltaPrimary: { val: string; isPositive: boolean };
  deltaSecondary: { val: string; isPositive: boolean };
  isoX: number; // Isometric X on canvas
  isoY: number; // Isometric Y on canvas
  type: 'revenue' | 'finance' | 'sales' | 'customers' | 'operations' | 'core';
  confidence: number;
  findings: string[];
  evidenceLogs: string[];
  proposedAction: {
    title: string;
    target: string;
    impact: string;
  };
}

export const BusinessWorld: React.FC<BusinessWorldProps> = ({
  onQuickInspectNode,
  onExecutePolicyAction,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('revenue');
  const [timelineVal, setTimelineVal] = useState<number>(50); // 50 is NOW
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [showLogsAccordion, setShowLogsAccordion] = useState<boolean>(true);
  const [showPolicyGateAccordion, setShowPolicyGateAccordion] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  // Digital Twin Isometric Nodes corresponding to Screenshot 2
  const isoNodes: IsometricNode[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      subLabel: 'ARR ENGINE',
      metric: '$4.82M',
      secondaryMetric: 'ARR',
      deltaPrimary: { val: '+33%', isPositive: true },
      deltaSecondary: { val: '+125%', isPositive: true },
      isoX: 230,
      isoY: 280,
      type: 'revenue',
      confidence: 94,
      findings: [
        'AI ARM recommended low increase enterprise pricing by 7% ARR.',
        'AI agent evaluated an increase customizable lines pricing by 7%.',
        'Sales targets marketing account customize pricing nodes advance.',
      ],
      evidenceLogs: [
        'Log Business-OS ARR: Increase enterprise pricing by 7% ARR...',
        'Log evidence logs: API proposed enterprise pricing for 15 accounts...',
        'Log evidence logs: Represent customers and days for 44.08...',
        'Recent evidence log: Automated sovereign validation completed.',
      ],
      proposedAction: {
        title: 'Increase enterprise pricing by 7%',
        target: 'Enterprise Billing & Stripe Gateway',
        impact: '+$340K ARR',
      },
    },
    {
      id: 'core',
      label: 'Core Router',
      subLabel: 'ORCHESTRATION',
      metric: '99.99%',
      secondaryMetric: 'HEALTH',
      deltaPrimary: { val: '0ms', isPositive: true },
      deltaSecondary: { val: 'SYNC', isPositive: true },
      isoX: 450,
      isoY: 150,
      type: 'core',
      confidence: 98,
      findings: [
        'Multi-agent consensus protocol executing at nominal 42ms latency.',
        'Zero cryptographic packet drop across regional edge relays.',
      ],
      evidenceLogs: [
        'Consensus heartbeat validated with Frankfurt and Dublin relays.',
        'Immutable policy check passed for all autonomous agent tools.',
      ],
      proposedAction: {
        title: 'Rebalance Edge Cache Allocations',
        target: 'Global Relay Network',
        impact: '-18% compute costs',
      },
    },
    {
      id: 'finance',
      label: 'Finance',
      subLabel: 'TREASURY & CAPEX',
      metric: '$2.37M',
      secondaryMetric: 'ARR',
      deltaPrimary: { val: '+20%', isPositive: true },
      deltaSecondary: { val: '-5.6%', isPositive: false },
      isoX: 680,
      isoY: 290,
      type: 'finance',
      confidence: 91,
      findings: [
        'Treasury pacing 22.4 months runway with automated yield allocation.',
        'Capex variance detected in cloud GPU reservation schedule.',
      ],
      evidenceLogs: [
        'NetSuite sync verified: Q3 operating expense $780k.',
        'Cross-referenced historical budget deviations with CFO policies.',
      ],
      proposedAction: {
        title: 'Authorize AWS Reserved Instance Commitments',
        target: 'Finance Treasury & AWS Billing',
        impact: '$52,000 savings',
      },
    },
    {
      id: 'sales',
      label: 'Sales',
      subLabel: 'PIPELINE DRIFT',
      metric: 'METRIC',
      secondaryMetric: 'EMEA',
      deltaPrimary: { val: '+13.8%', isPositive: true },
      deltaSecondary: { val: '+6.0%', isPositive: true },
      isoX: 460,
      isoY: 410,
      type: 'sales',
      confidence: 89,
      findings: [
        'Enterprise pipeline weighted value reached €14.8M.',
        'Contract closure cycle compressed from 54 to 38 days with AI assist.',
      ],
      evidenceLogs: [
        'Salesforce deal velocity audit refreshed 4 minutes ago.',
        'Legal compliance review accelerated for Siemens AG contract.',
      ],
      proposedAction: {
        title: 'Fast-track Siemens AG Sovereign Addendum',
        target: 'Salesforce & DocuSign API',
        impact: '+$1.8M ARR',
      },
    },
    {
      id: 'customers',
      label: 'Customers',
      subLabel: 'HEALTH & EXPANSION',
      metric: 'METRIC',
      secondaryMetric: 'RETENTION',
      deltaPrimary: { val: '-3.8%', isPositive: false },
      deltaSecondary: { val: '+67%', isPositive: true },
      isoX: 240,
      isoY: 530,
      type: 'customers',
      confidence: 87,
      findings: [
        'Net Revenue Retention at 124% with strong expansion in Tier-1.',
        'Seat utilization contraction warning triggered for Global Freight.',
      ],
      evidenceLogs: [
        'Telemetry heartbeat shows -42 seats inactive over 14 days.',
        'CS Agent automatically drafted executive mitigation brief.',
      ],
      proposedAction: {
        title: 'Schedule Executive Review with Global Freight',
        target: 'Intercom & Outlook Calendar API',
        impact: 'Safeguard $240K ARR',
      },
    },
    {
      id: 'operations',
      label: 'Operations',
      subLabel: 'INFRASTRUCTURE',
      metric: 'METRIC',
      secondaryMetric: 'NODES',
      deltaPrimary: { val: '-7.3%', isPositive: false },
      deltaSecondary: { val: '+0.8%', isPositive: true },
      isoX: 670,
      isoY: 520,
      type: 'operations',
      confidence: 96,
      findings: [
        'Frankfurt cluster (fra-01) vector egress throughput normalized.',
        'Zero-trust cryptographic attestations refreshed on all clusters.',
      ],
      evidenceLogs: [
        'Cluster telemetry: CPU 44%, Memory 61%, P99 Latency 14ms.',
        'Autonomous microservice scale-down executed at 04:00 UTC.',
      ],
      proposedAction: {
        title: 'Purge Idle Kubernetes Compute Pools',
        target: 'Kubernetes Cluster fra-01',
        impact: '-$12,400 monthly opex',
      },
    },
  ];

  const activeNode = isoNodes.find((n) => n.id === selectedNodeId) || isoNodes[0];

  // Timeline scrubber playback
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setTimelineVal((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  const handleAuthorize = () => {
    if (onExecutePolicyAction) {
      onExecutePolicyAction({
        id: `act_${activeNode.id}_${Date.now()}`,
        title: activeNode.proposedAction.title,
        riskLevel: 'medium',
        targetSystem: activeNode.proposedAction.target,
        requiresApproval: true,
        status: 'EXECUTED',
      });
    }
    setIsAuthorized(true);
    setTimeout(() => setIsAuthorized(false), 4000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-100px)] min-h-[640px] os-cyber-corners bg-[#0A0C10] border border-white/[0.07] rounded-xl overflow-hidden os-scanlines flex flex-col font-sans select-none">
      {/* Top Telemetry & Status Bar (Screenshot 2) */}
      <div className="h-14 border-b border-white/[0.07] bg-[#0B0E14]/90 os-glass-strong px-5 flex items-center justify-between z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              INVESTIGATING
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Metric Telemetry Tickers */}
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">||</span>
              <strong className="text-white">113M</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1">
              <strong className="text-cyan-400">4.82M</strong>
              <span className="text-slate-500">ARR</span>
            </span>
          </div>
        </div>

        {/* Global Search Input (Screenshot 2) */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 lg:w-80">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Ask Business-OS anything..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 placeholder-slate-500 focus:outline-none cursor-pointer"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-400">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: 3D Isometric Topology + Right Contextual Intelligence */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Central Spatial Digital Twin Canvas */}
        <div
          className="relative flex-1 h-full overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, #0d1527 0%, #080c14 65%, #05070a 100%)',
          }}
        >
          {/* Subtle Isometric Background Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(60deg, rgba(6,182,212,0.15) 1px, transparent 1px),
                linear-gradient(-60deg, rgba(6,182,212,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '80px 138.56px',
            }}
          />

          {/* SVG Connection Highways & Animated Couriers */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="cyber-line-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <filter id="iso-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Highway: Core -> Revenue */}
            <path
              d="M 450 170 C 350 200, 260 220, 250 260"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.4"
              filter="url(#iso-glow)"
            />

            {/* Highway: Core -> Finance */}
            <path
              d="M 480 170 C 580 200, 660 220, 680 270"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.4"
              filter="url(#iso-glow)"
            />

            {/* Highway: Revenue -> Sales */}
            <path
              d="M 280 320 C 350 350, 400 370, 430 390"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeOpacity="0.6"
              filter="url(#iso-glow)"
            />

            {/* Highway: Finance -> Sales */}
            <path
              d="M 640 320 C 580 350, 520 370, 480 390"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeOpacity="0.6"
              filter="url(#iso-glow)"
            />

            {/* Highway: Sales -> Customers */}
            <path
              d="M 430 430 C 370 460, 310 480, 270 510"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.5"
            />

            {/* Highway: Sales -> Operations */}
            <path
              d="M 490 430 C 550 460, 610 480, 650 510"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.5"
            />

            {/* Highway: Revenue -> Customers */}
            <path
              d="M 230 340 L 240 480"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.3"
            />

            {/* Highway: Finance -> Operations */}
            <path
              d="M 680 340 L 670 480"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.3"
            />

            {/* Animated Packet Drone from Revenue to Sales */}
            <g>
              <circle r="4.5" fill="#38bdf8" filter="url(#iso-glow)">
                <animateMotion
                  path="M 280 320 C 350 350, 400 370, 430 390"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Animated Packet Drone from Sales to Finance */}
            <g>
              <circle r="4.5" fill="#34d399" filter="url(#iso-glow)">
                <animateMotion
                  path="M 480 390 C 520 370, 580 350, 640 320"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>

            {/* Animated Packet Drone from Core to Revenue */}
            <g>
              <circle r="3.5" fill="#f59e0b" filter="url(#iso-glow)">
                <animateMotion
                  path="M 450 170 C 350 200, 260 220, 250 260"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>

          {/* Render Isometric Platform Nodes (Screenshot 2) */}
          {isoNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  if (onQuickInspectNode) onQuickInspectNode(node.id);
                }}
                style={{
                  left: `${node.isoX}px`,
                  top: `${node.isoY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute group cursor-pointer z-10"
              >
                {/* 3D Platform Base & Cybernetic Hologram */}
                <div className="relative flex flex-col items-center">
                  {/* Holographic 3D Structure Graphic */}
                  <div className="relative w-24 h-24 mb-1 flex items-center justify-center">
                    {/* Pulsing ring underneath */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        isSelected
                          ? 'bg-cyan-500/25 border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.6)] scale-110'
                          : 'bg-black/60 border border-cyan-500/30 group-hover:border-cyan-400/60'
                      }`}
                      style={{
                        transform: 'rotateX(55deg) rotateZ(-45deg)',
                      }}
                    />

                    {/* Cybernetic Volumetric Representation */}
                    {node.type === 'core' && (
                      <div className="relative w-12 h-12 flex items-center justify-center animate-bounce">
                        <div className="w-9 h-9 border border-cyan-300 bg-cyan-500/30 rounded-lg shadow-[0_0_25px_rgba(6,182,212,0.8)] backdrop-blur-md transform rotate-45" />
                        <div className="absolute w-5 h-5 bg-white/80 rounded transform rotate-12" />
                      </div>
                    )}

                    {node.type === 'revenue' && (
                      <div className="flex items-end gap-1 pb-2">
                        <div className="w-3 h-10 bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                        <div className="w-3.5 h-14 bg-gradient-to-t from-cyan-900 to-cyan-300 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.7)]" />
                        <div className="w-3 h-8 bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                      </div>
                    )}

                    {node.type === 'finance' && (
                      <div className="flex flex-col items-center justify-center pb-2">
                        <div className="w-12 h-6 border-t-2 border-emerald-400 bg-emerald-500/20 rounded-t-full shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                        <div className="w-14 h-1 bg-emerald-400/80 rounded" />
                      </div>
                    )}

                    {node.type === 'sales' && (
                      <div className="flex items-end gap-1.5 pb-2">
                        <div className="w-4 h-8 bg-gradient-to-t from-blue-900 to-blue-400 rounded-sm" />
                        <div className="w-5 h-12 bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                        <div className="w-4 h-6 bg-gradient-to-t from-blue-900 to-blue-400 rounded-sm" />
                      </div>
                    )}

                    {node.type === 'customers' && (
                      <div className="grid grid-cols-2 gap-1 pb-2">
                        <div className="w-4 h-8 bg-gradient-to-t from-indigo-900 to-indigo-400 rounded-sm" />
                        <div className="w-4 h-10 bg-gradient-to-t from-indigo-900 to-indigo-300 rounded-sm" />
                        <div className="w-4 h-6 bg-gradient-to-t from-indigo-900 to-indigo-400 rounded-sm" />
                        <div className="w-4 h-7 bg-gradient-to-t from-indigo-900 to-indigo-300 rounded-sm" />
                      </div>
                    )}

                    {node.type === 'operations' && (
                      <div className="flex items-center justify-center pb-2">
                        <div className="w-10 h-10 border-2 border-amber-400/80 bg-amber-500/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                          <Server className="w-5 h-5 text-amber-300" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attached Node Metric Label Card (Screenshot 2) */}
                  <div
                    className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all text-center min-w-[125px] ${
                      isSelected
                        ? 'bg-[#0f172a]/95 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                        : 'bg-[#090d16]/85 border-white/10 group-hover:border-white/30 group-hover:bg-[#0c1220]/95'
                    }`}
                  >
                    <div className="text-xs font-bold text-white font-sans">{node.label}</div>
                    <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                      {node.metric}{' '}
                      <span className="text-[10px] text-slate-400">{node.secondaryMetric}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-mono">
                      <span
                        className={
                          node.deltaPrimary.isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                        }
                      >
                        {node.deltaPrimary.val}
                      </span>
                      <span
                        className={
                          node.deltaSecondary.isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                        }
                      >
                        {node.deltaSecondary.val}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Timeline Scrubber (Screenshot 2) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[min(540px,calc(100%-40px))] p-3 rounded-xl os-surface/90 os-glass-strong border border-white/[0.12] shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-[11px] font-mono mb-2">
              <span className="text-slate-500 uppercase tracking-wider">PAST</span>
              <span className="text-cyan-300 font-bold tracking-wider">
                {timelineVal < 40 ? '24H AGO' : timelineVal <= 60 ? '24H AGO - NOW - FUTURE' : '+24H PREDICTED'}
              </span>
              <span className="text-slate-500 uppercase tracking-wider">PREDICTED</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                title={isPlayingTimeline ? 'Pause' : 'Play Timeline'}
              >
                {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={timelineVal}
                onChange={(e) => setTimelineVal(Number(e.target.value))}
                className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <button
                onClick={() => setTimelineVal(50)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                title="Reset to NOW"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Contextual Intelligence (Screenshot 2) */}
        <aside className="w-[360px] border-l border-white/[0.07] bg-[#090d16]/95 backdrop-blur-xl p-5 overflow-y-auto z-20 flex flex-col justify-between shrink-0 shadow-2xl">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div>
                <div className="text-xs font-bold font-mono text-white tracking-wider uppercase">
                  CONTEXTUAL INTELLIGENCE
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Active Node Metric Banner */}
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">{activeNode.label}</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                {activeNode.metric}{' '}
                <span className="text-xs font-mono text-cyan-400">{activeNode.secondaryMetric}</span>
              </div>
            </div>

            {/* AI Findings Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">AI FINDINGS</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                  {activeNode.confidence}% confidence
                </span>
              </div>

              <div className="space-y-2">
                {activeNode.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.05] text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Evidence Logs Accordion */}
            <div className="border border-white/[0.07] rounded-xl bg-black/40 overflow-hidden">
              <button
                onClick={() => setShowLogsAccordion(!showLogsAccordion)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-300 hover:text-white"
              >
                <span>RECENT EVIDENCE LOGS</span>
                {showLogsAccordion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showLogsAccordion && (
                <div className="p-3 border-t border-white/[0.06] space-y-2 text-[10px] font-mono text-slate-400">
                  {activeNode.evidenceLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
                      <span className="truncate">{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Policy Gate Section (Screenshot 2) */}
            <div className="border-2 border-amber-500/30 rounded-xl bg-[#0e1422]/90 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  POLICY GATE
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">PROPOSED ACTION:</div>
                <div className="text-xs font-bold text-slate-100 font-sans">
                  {activeNode.proposedAction.title}
                </div>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>AWAITING HUMAN AUTHORIZATION</span>
              </div>

              {isAuthorized ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center text-xs font-mono font-bold text-emerald-300 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> ACTION COMMITTED TO LEDGER
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => alert(`Reviewing evidence trace for ${activeNode.label}`)}
                    className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 transition-colors"
                  >
                    REVIEW EVIDENCE
                  </button>
                  <button
                    onClick={handleAuthorize}
                    className="py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    AUTHORIZE
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
