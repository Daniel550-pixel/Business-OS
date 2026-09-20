import React, { useState } from 'react';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize,
  Move,
  Search,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  MoreVertical,
  Activity,
  Layers,
  Sparkles,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Mission, ProposedAction } from '../types';

interface MissionsViewProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
  onExecuteAction: (action: ProposedAction) => void;
  onCreateMission: (newMission: Partial<Mission>) => void;
}

interface MissionNode {
  id: string;
  title: string;
  category?: string;
  progress: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  arrLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  arrImpactVal?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  logs: { time: string; text: string }[];
  assignedAgents?: { name: string; avatarBg: string; initial: string }[];
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  selectedMission,
  onSelectMission,
  onExecuteAction,
  onCreateMission,
}) => {
  const [activeTab, setActiveTab] = useState<'spatial' | 'list'>('spatial');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanningMode, setIsPanningMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('eu_penetration');
  const [showPolicyGateModal, setShowPolicyGateModal] = useState(true);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [isCreatingMission, setIsCreatingMission] = useState(false);

  // New Mission form state
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionImpact, setNewMissionImpact] = useState('$10M');

  // Interactive Spatial Nodes corresponding to screenshot 1
  const [spatialNodes] = useState<MissionNode[]>([
    {
      id: 'global_expansion',
      title: 'GLOBAL MARKET EXPANSION Q3',
      progress: 70,
      riskLevel: 'LOW',
      arrLevel: 'LOW',
      x: 60,
      y: 110,
      width: 250,
      height: 180,
      logs: [
        { time: '10:31 AM - 11 months ago', text: 'GLOBAL MARKET EXPANSION Q3' },
        { time: '09:00 AM - 9 months ago', text: 'REGIONAL COMPLIANCE APPROVED' },
      ],
      assignedAgents: [
        { name: 'Sarah M.', avatarBg: 'bg-emerald-600', initial: 'SM' },
        { name: 'K. Chen', avatarBg: 'bg-cyan-600', initial: 'KC' },
      ],
    },
    {
      id: 'enterprise_strategy',
      title: 'ENTERPRISE STRATEGY',
      progress: 85,
      riskLevel: 'LOW',
      arrLevel: 'HIGH',
      x: 400,
      y: 40,
      width: 170,
      height: 75,
      logs: [],
      assignedAgents: [
        { name: 'Elena V.', avatarBg: 'bg-indigo-600', initial: 'EV' },
        { name: 'Devon B.', avatarBg: 'bg-amber-600', initial: 'DB' },
        { name: 'Marcus R.', avatarBg: 'bg-purple-600', initial: 'MR' },
      ],
    },
    {
      id: 'product_innovation_top',
      title: 'PRODUCT INNOVATION INITIATIVE',
      progress: 70,
      riskLevel: 'HIGH',
      arrLevel: 'HIGH',
      x: 620,
      y: 90,
      width: 240,
      height: 190,
      logs: [
        { time: '10:31 AM - 11 months ago', text: 'GLOBAL MARKET EXPANSION' },
        { time: '05:01 PM - 13 months ago', text: 'PRODUCT MARKET FIT STUDY' },
        { time: '11:32 PM - 12 months ago', text: 'PRODUCT INNOVATION INITIATIVE' },
      ],
      assignedAgents: [
        { name: 'Alex T.', avatarBg: 'bg-rose-600', initial: 'AT' },
      ],
    },
    {
      id: 'product_innovation_mid',
      title: 'PRODUCT INNOVATION INITIATIVE',
      progress: 60,
      riskLevel: 'HIGH',
      arrLevel: 'HIGH',
      x: 380,
      y: 220,
      width: 220,
      height: 140,
      logs: [
        { time: '02:15 PM - 8 months ago', text: 'SYNTHETIC BENCHMARK V2' },
      ],
      assignedAgents: [
        { name: 'Devon B.', avatarBg: 'bg-amber-600', initial: 'DB' },
      ],
    },
    {
      id: 'eu_market_actions',
      title: 'EUROPEAN MARKET ACTIONS',
      progress: 50,
      riskLevel: 'LOW',
      arrLevel: 'LOW',
      arrImpactVal: 'LOW',
      x: 90,
      y: 380,
      width: 240,
      height: 170,
      logs: [
        { time: '10:31 AM - 5 months ago', text: 'GLOBAL MARKET RESEARCH' },
        { time: '10:00 AM - 1 month ago', text: 'INITIATIVE Q3 DISPATCH' },
      ],
      assignedAgents: [
        { name: 'Marcus R.', avatarBg: 'bg-purple-600', initial: 'MR' },
      ],
    },
    {
      id: 'eu_penetration',
      title: 'EUROPEAN MARKET PENETRATION',
      progress: 35,
      riskLevel: 'HIGH',
      arrLevel: 'HIGH',
      arrImpactVal: 'HIGH',
      x: 600,
      y: 360,
      width: 260,
      height: 180,
      logs: [
        { time: '10:30 AM - 3 months ago', text: 'EUROPEAN MARKET PENETRATION' },
        { time: '10:01 PM - 1 month ago', text: 'PRODUCT INNOVATION INITIATIVE' },
      ],
      assignedAgents: [
        { name: 'Sarah M.', avatarBg: 'bg-emerald-600', initial: 'SM' },
        { name: 'Elena V.', avatarBg: 'bg-indigo-600', initial: 'EV' },
        { name: 'Alex T.', avatarBg: 'bg-rose-600', initial: 'AT' },
      ],
    },
  ]);

  const activeSpatialNode = spatialNodes.find((n) => n.id === selectedNodeId) || spatialNodes[5];

  const handleApprovePolicyGate = () => {
    onExecuteAction({
      id: `act_eu_penetration_${Date.now()}`,
      title: 'European Market Penetration Campaign Authorization',
      riskLevel: 'medium',
      targetSystem: 'EMEA Enterprise CRM & Outbound Swarm',
      requiresApproval: true,
      status: 'EXECUTED',
    });
    setShowPolicyGateModal(false);
  };

  const handleDenyPolicyGate = () => {
    setShowPolicyGateModal(false);
  };

  const renderProgressGauge = (percentage: number, color: string = '#06b6d4') => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg className="w-14 h-14 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="3.5"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-mono font-bold text-white">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden os-glass-strong os-cyber-corners border border-white/[0.08] rounded-xl flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-white/[0.08] os-glass px-5 flex items-center justify-between z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 os-live-dot" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-wider text-white uppercase os-mono">MISSIONS</h2>
              <span className="text-[11px] text-slate-400 os-mono tracking-wide">
                ACTIVE ENTERPRISE STRATEGY MISSIONS
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Spatial Canvas / List Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'spatial' ? 'list' : 'spatial')}
            className="px-3 py-1.5 rounded-lg os-surface os-interactive text-xs os-mono text-slate-300 transition-colors flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>SPATIAL CANVAS</span>
          </button>

          {/* New Mission / DOOMTELL Button */}
          <button
            onClick={() => setIsCreatingMission(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs os-mono font-bold text-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>+ MISSION / DOOMTELL</span>
          </button>
        </div>
      </div>

      {/* Workspace Area: Canvas + Floating Windows + Right Drawer */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Floating Zoom & Pan Controls on Left */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#0d121f]/90 border border-white/10 rounded-lg shadow-xl backdrop-blur-md">
            <button
              onClick={() => setIsPanningMode(false)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1.5 transition-colors ${
                !isPanningMode ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3" /> ZOOM
            </button>
            <button
              onClick={() => setIsPanningMode(true)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1.5 transition-colors ${
                isPanningMode ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Move className="w-3 h-3" /> PANNING
            </button>
          </div>

          <div className="flex flex-col gap-1 p-1 bg-[#0d121f]/90 border border-white/10 rounded-lg shadow-xl backdrop-blur-md w-fit">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
              title="Zoom In"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
              title="Zoom Out"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Reset Fit"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Canvas with Grid Background & Splines */}
        <div
          className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0),
              linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 48px 48px, 48px 48px',
          }}
        >
          {/* Zoomable Container */}
          <div
            className="w-full h-full transition-transform duration-100 ease-out origin-top-left"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          >
            {/* SVG Connecting Splines */}
            <svg className="absolute inset-0 w-[1200px] h-[700px] pointer-events-none z-0">
              <defs>
                <linearGradient id="grad-cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="grad-purple-green" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="grad-orange-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Spline: Global Expansion -> European Market Actions */}
              <path
                d="M 180 290 C 180 340, 180 350, 180 380"
                fill="none"
                stroke="url(#grad-cyan-purple)"
                strokeWidth="2.5"
                filter="url(#glow-line)"
              />

              {/* Spline: Global Expansion -> Product Innovation Mid */}
              <path
                d="M 310 200 C 340 200, 360 250, 380 250"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.6"
              />

              {/* Spline: Enterprise Strategy -> Product Innovation Top */}
              <path
                d="M 570 80 C 600 80, 600 110, 620 120"
                fill="none"
                stroke="url(#grad-cyan-purple)"
                strokeWidth="2.5"
                filter="url(#glow-line)"
              />

              {/* Spline: Product Innovation Mid -> Product Innovation Top */}
              <path
                d="M 500 220 C 530 180, 580 180, 620 180"
                fill="none"
                stroke="url(#grad-purple-green)"
                strokeWidth="2.5"
                filter="url(#glow-line)"
              />

              {/* Spline: European Market Actions -> Product Innovation Mid */}
              <path
                d="M 330 430 C 370 430, 370 320, 390 320"
                fill="none"
                stroke="url(#grad-orange-cyan)"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.8"
              />

              {/* Spline: European Market Actions -> European Market Penetration */}
              <path
                d="M 330 460 C 450 460, 480 440, 600 440"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                filter="url(#glow-line)"
              />

              {/* Animated packet along European line */}
              <circle r="4" fill="#34d399">
                <animateMotion
                  path="M 330 460 C 450 460, 480 440, 600 440"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* Render Mission Node Cards */}
            {spatialNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHighRisk = node.riskLevel === 'HIGH';
              const gaugeColor =
                node.progress >= 70 ? '#06b6d4' : node.progress >= 50 ? '#10b981' : '#f59e0b';

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setShowDetailPanel(true);
                  }}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`,
                  }}
                  className={`absolute rounded-xl transition-all cursor-pointer z-10 ${
                    isSelected
                      ? 'bg-[#0e1424]/95 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                      : 'bg-[#0c111d]/90 border border-white/[0.12] hover:border-white/25 hover:bg-[#0f172a]/95'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold font-mono tracking-tight text-white truncate">
                        {node.title}
                      </span>
                    </div>
                    <button className="text-slate-500 hover:text-white p-0.5">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Body with Gauge & Meters */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      {renderProgressGauge(node.progress, gaugeColor)}

                      <div className="flex-1 space-y-1.5 text-left">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>RISK METER</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full ${
                                isHighRisk ? 'bg-gradient-to-r from-amber-500 to-rose-500 w-3/4' : 'bg-cyan-400 w-1/4'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">ARR LEVEL</span>
                          <span className={node.arrLevel === 'HIGH' ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
                            {node.arrLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Logs / Traces */}
                    {node.logs.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-white/[0.06] text-[9px] font-mono">
                        {node.logs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-slate-400 truncate">
                            <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0 mt-0.5" />
                            <span className="text-slate-500 shrink-0">{log.time}</span>
                            <span className="text-slate-300 truncate">{log.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Agent Cluster badge if any */}
                    {node.assignedAgents && node.assignedAgents.length > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <span className="text-[9px] font-mono text-slate-500">TEAM</span>
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {node.assignedAgents.map((ag, idx) => (
                            <div
                              key={idx}
                              className={`inline-block h-5 w-5 rounded-full ring-1 ring-[#090d16] ${ag.avatarBg} text-[9px] font-mono font-bold text-white flex items-center justify-center`}
                              title={ag.name}
                            >
                              {ag.initial}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Floating Policy Gate Approval Modal in Screenshot 1 */}
            {showPolicyGateModal && (
              <div
                style={{ left: '780px', top: '240px' }}
                className="absolute z-30 w-[300px] p-4 rounded-xl bg-[#0e1422]/95 border-2 border-amber-500/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
                      POLICY GATE
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowPolicyGateModal(false)}
                    className="text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase mt-0.5">
                  AWAITING AUTHORIZATION
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CAMPAIGN:</span>
                    <span className="text-slate-200 font-bold">EUROPEAN PENETRATION</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">RISK ASSESSMENT:</span>
                    <span className="text-amber-400 font-bold">MEDIUM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ARR IMPACT:</span>
                    <span className="text-cyan-300 font-bold">HIGH (+$15M)</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mt-2.5 text-center">
                  EXECUTIVE APPROVAL REQUIRED
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleApprovePolicyGate}
                    className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={handleDenyPolicyGate}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-mono font-bold transition-all"
                  >
                    DENY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Contextual Details Panel (Screenshot 1 Right Sidebar) */}
        {showDetailPanel && (
          <aside className="absolute top-0 right-0 bottom-0 w-[360px] border-l border-white/[0.08] bg-[#090d16]/95 backdrop-blur-xl p-5 overflow-y-auto z-30 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    CONTEXTUAL DETAILS
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    HUMAN EXECUTIVE AUTHORIZATION
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailPanel(false)}
                  className="p-1 rounded text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white tracking-wide font-sans">
                  {activeSpatialNode.title}
                </h3>
                <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 uppercase">
                  HIGH-VALUE CAMPAIGN
                </div>
              </div>

              {/* ARR Impact & Confidence Metric */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    EXPECTED ARR IMPACT:
                  </div>
                  <div className="text-lg font-mono font-bold text-cyan-400 mt-1">$15M</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-400 w-4/5" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    CONFIDENCE METRICS:
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">88%</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-5/6" />
                  </div>
                </div>
              </div>

              {/* Key Milestones */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  KEY MILESTONES
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="truncate">European Market Penetration</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    <span className="truncate">Enterprise Target Accounts (42 Active)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    <span className="truncate">Legal & Sovereign Compliance Signoff</span>
                  </div>
                </div>
              </div>

              {/* Resource Allocation */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  RESOURCE ALLOCATION
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">AGENT ARR MILESTONES</span>
                      <span className="text-cyan-300 font-bold">$15M</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 w-3/4" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">RESOURCE ALLOCATED</span>
                      <span className="text-cyan-300 font-bold">$15M</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Action */}
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setShowPolicyGateModal(true)}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <ShieldAlert className="w-4 h-4 text-cyan-300" />
                TRIGGER POLICY GATE REVIEW
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* New Mission Creation Modal */}
      {isCreatingMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0d121f] border border-cyan-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  DISPATCH AUTONOMOUS MISSION
                </h3>
              </div>
              <button onClick={() => setIsCreatingMission(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 uppercase">Mission Title</label>
                <input
                  type="text"
                  placeholder="e.g. North American Enterprise Expansion"
                  value={newMissionTitle}
                  onChange={(e) => setNewMissionTitle(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase">Projected ARR Target</label>
                <input
                  type="text"
                  value={newMissionImpact}
                  onChange={(e) => setNewMissionImpact(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => setIsCreatingMission(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (newMissionTitle) {
                    onCreateMission({
                      title: newMissionTitle,
                      objective: `Autonomous enterprise scaling targeting ${newMissionImpact} ARR.`,
                      priority: 'high',
                    });
                    setIsCreatingMission(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold"
              >
                DISPATCH TO SWARM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
