import React, { useState } from 'react';
import {
  Cpu,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  X,
  Plus,
  Compass,
  Sparkles,
  GitFork,
  ArrowRight,
  Search,
  Zap,
} from 'lucide-react';
import { Agent, ProposedAction } from '../types';

interface AgentsViewProps {
  agents?: Agent[];
  selectedAgent?: Agent | null;
  onSelectAgent?: (agent: Agent) => void;
  onExecuteAction?: (action: ProposedAction) => void;
}

interface SwarmAgentNode {
  id: string;
  code: string;
  name: string;
  role: string;
  iconType: 'revenue' | 'customer' | 'finance' | 'operations';
  color: string;
  ringColor: string;
  accentColor: string;
  activity: string;
  timeAgo: string;
  statusText: 'Processing' | 'Analysing' | 'Waiting for Approval' | 'Pending';
  statusBadgeColor: string;
  confidence: number;
  reasoningTrace: {
    title: string;
    subItems: string[];
  };
  pendingApproval?: {
    action: string;
    status: 'PENDING' | 'APPROVED' | 'DENIED';
    requestedBy: string;
    policy: string;
    approvers: string;
  };
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onExecuteAction }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('finance');
  const [isReasoningTraceOpen, setIsReasoningTraceOpen] = useState<boolean>(true);
  const [approvalDecision, setApprovalDecision] = useState<'PENDING' | 'APPROVED' | 'DENIED'>('PENDING');

  // Multi-Agent Swarm Constellation Data (Screenshot 3)
  const swarmAgents: SwarmAgentNode[] = [
    {
      id: 'revenue',
      code: 'A-01',
      name: 'Revenue Agent',
      role: 'Pipeline & Pricing Optimization',
      iconType: 'revenue',
      color: '#f59e0b',
      ringColor: 'border-amber-500/80',
      accentColor: 'text-amber-400',
      activity: 'INVESTIGATING pipeline anomalies',
      timeAgo: '3m ago',
      statusText: 'Processing',
      statusBadgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
      confidence: 94,
      reasoningTrace: {
        title: 'Anomaly Detected in EMEA Mid-Market Pipeline',
        subItems: [
          'Evaluated discount velocity across 42 active negotiations',
          'Cross-referenced win-loss telemetry against competitor models',
          'Identified pricing elasticity headroom of +7%',
          'Prepared dynamic discounting envelope for executive approval',
        ],
      },
      pendingApproval: {
        action: 'Activate 7% Price Realization Envelope',
        status: 'PENDING',
        requestedBy: 'A-01',
        policy: 'Commercial Pricing Policy v3.4',
        approvers: 'S. Vance (CRO), E. Taylor (VP RevOps)',
      },
    },
    {
      id: 'customer',
      code: 'A-02',
      name: 'Customer Agent',
      role: 'Retention & Account Telemetry',
      iconType: 'customer',
      color: '#06b6d4',
      ringColor: 'border-cyan-500/80',
      accentColor: 'text-cyan-400',
      activity: 'ANALYZING churn predictions',
      timeAgo: '1m ago',
      statusText: 'Analysing',
      statusBadgeColor: 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40',
      confidence: 88,
      reasoningTrace: {
        title: 'Churn Risk Flagged on Tier-1 Account',
        subItems: [
          'Logged 32% decline in weekly active user sessions for Global Freight',
          'Analyzed support ticket sentiment drift over past 21 days',
          'Determined primary risk factor: SSO migration latency',
          'Triggered automated outreach proposal for CS Director',
        ],
      },
      pendingApproval: {
        action: 'Dispatch Executive Intervention Protocol',
        status: 'PENDING',
        requestedBy: 'A-02',
        policy: 'Customer Success SLA v1.8',
        approvers: 'L. Gomez (Head of CS)',
      },
    },
    {
      id: 'finance',
      code: 'A-04',
      name: 'Finance Agent',
      role: 'Treasury & Forecast Integrity',
      iconType: 'finance',
      color: '#10b981',
      ringColor: 'border-emerald-500/80',
      accentColor: 'text-emerald-400',
      activity: 'WAITING FOR APPROVAL - Q3 Budget adjustment',
      timeAgo: 'Just now',
      statusText: 'Processing',
      statusBadgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
      confidence: 91,
      reasoningTrace: {
        title: 'Anomaly Detected in Q3 Forecast',
        subItems: [
          'Correlated with Supplier cost increase',
          'Cross-referenced historical budget deviations',
          'Generated proposed budget adjustment',
          'Triggered Policy Gate: Budget > $50K',
        ],
      },
      pendingApproval: {
        action: 'Approve Budget Adjustment (>$50K)',
        status: 'PENDING',
        requestedBy: 'A-04',
        policy: 'Financial Oversight Policy v2.1',
        approvers: 'C. Davis (Finance VP), M. Chen (CFO)',
      },
    },
    {
      id: 'operations',
      code: 'A-03',
      name: 'Operations Agent',
      role: 'Infrastructure & Edge Optimization',
      iconType: 'operations',
      color: '#a855f7',
      ringColor: 'border-purple-500/80',
      accentColor: 'text-purple-400',
      activity: 'PROCESSING supply chain data',
      timeAgo: '2m ago',
      statusText: 'Pending',
      statusBadgeColor: 'bg-purple-950/80 text-purple-300 border border-purple-500/40',
      confidence: 96,
      reasoningTrace: {
        title: 'Egress Traffic Surge on Frankfurt Node (fra-01)',
        subItems: [
          'Vector database replication spike detected at 03:40 UTC',
          'Verified no security breaches or unauthorized exfiltration',
          'Synthesized bandwidth compression policy',
          'Queued automated gateway routing change',
        ],
      },
      pendingApproval: {
        action: 'Apply Network Egress Traffic Compression',
        status: 'PENDING',
        requestedBy: 'A-03',
        policy: 'Infrastructure Security & Cost v4.0',
        approvers: 'J. Becker (VP Infrastructure)',
      },
    },
  ];

  const activeAgent = swarmAgents.find((a) => a.id === selectedAgentId) || swarmAgents[2];

  const handleApprove = () => {
    setApprovalDecision('APPROVED');
    if (onExecuteAction && activeAgent.pendingApproval) {
      onExecuteAction({
        id: `act_${activeAgent.id}_${Date.now()}`,
        title: activeAgent.pendingApproval.action,
        riskLevel: 'medium',
        targetSystem: `Agent Swarm Orchestrator (${activeAgent.code})`,
        requiresApproval: true,
        status: 'EXECUTED',
      });
    }
  };

  const handleDeny = () => {
    setApprovalDecision('DENIED');
  };

  return (
    <div className="relative w-full h-[calc(100vh-100px)] min-h-[650px] bg-[#07090e] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col font-sans select-none">
      {/* Top Header Bar (Screenshot 3) */}
      <div className="h-14 border-b border-white/[0.08] bg-[#090d16]/90 px-5 flex items-center justify-between z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold tracking-wider text-white font-mono uppercase">
              Business-OS
            </h2>
            <span className="text-slate-500 font-mono text-xs">//</span>
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-bold">
              ORCHESTRATION LAYER
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Telemetry Clock & Swarm Counter */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>UTC 14:32:56</span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Active Agents: <strong className="text-white">4/4</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Badge */}
          <div className="w-7 h-7 rounded-full bg-blue-600 text-[11px] font-bold text-white flex items-center justify-center font-mono">
            AL
          </div>

          {/* Search Input */}
          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Global Search"
              className="w-full pl-9 pr-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 placeholder-slate-500 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Canvas + Right Inspector Split */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Orbital Swarm Deep Space Canvas */}
        <div
          className="relative flex-1 h-full overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #0c1427 0%, #080d19 50%, #05070d 100%)',
          }}
        >
          {/* Stars & Cosmic Texture */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 25px 35px, #ffffff 100%, transparent),
                radial-gradient(1px 1px at 85px 120px, #38bdf8 100%, transparent),
                radial-gradient(1.5px 1.5px at 190px 80px, #a855f7 100%, transparent),
                radial-gradient(1px 1px at 320px 240px, #ffffff 100%, transparent),
                radial-gradient(1px 1px at 510px 180px, #f59e0b 100%, transparent),
                radial-gradient(1.5px 1.5px at 640px 90px, #34d399 100%, transparent),
                radial-gradient(1px 1px at 450px 380px, #ffffff 100%, transparent),
                radial-gradient(1px 1px at 150px 420px, #06b6d4 100%, transparent)
              `,
              backgroundSize: '350px 350px',
            }}
          />

          {/* Top Canvas Bar (Screenshot 3) */}
          <div className="absolute top-4 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
            <h3 className="text-base font-bold font-mono text-white tracking-wider uppercase">
              AGENTS
            </h3>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-mono font-bold text-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Plus className="w-3.5 h-3.5 text-cyan-300" />
                <span>New Actions</span>
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer">
                <span>Multi-Agent Swarm</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Left Canvas Controls (+, -, fit, edit) */}
          <div className="absolute top-16 left-5 z-20 flex flex-col gap-1 p-1 bg-[#0d121f]/90 border border-white/10 rounded-lg shadow-xl backdrop-blur-md">
            <button className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors">
              <span className="text-xs font-bold font-mono">−</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors">
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Orbital Geometry & Animated Particle Tracks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric Celestial Orbit Rings */}
            <ellipse
              cx="50%"
              cy="52%"
              rx="280"
              ry="210"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            <ellipse
              cx="50%"
              cy="52%"
              rx="200"
              ry="150"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.25"
            />
            <ellipse
              cx="50%"
              cy="52%"
              rx="120"
              ry="90"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.2"
              strokeOpacity="0.3"
            />

            {/* Glowing Interconnection Curves between Agents */}
            {/* Revenue -> Customer (Top-left to Top-right) */}
            <path
              d="M 280 230 C 350 180, 450 180, 520 230"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            {/* Customer -> Operations (Top-right to Bottom-right) */}
            <path
              d="M 540 270 C 580 340, 580 400, 540 470"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            {/* Operations -> Finance (Bottom-right to Bottom-left) */}
            <path
              d="M 520 500 C 450 550, 350 550, 280 500"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
            {/* Finance -> Revenue (Bottom-left to Top-left) */}
            <path
              d="M 260 470 C 220 400, 220 340, 260 270"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Radial Lines to Central Core Objectives */}
            <line x1="280" y1="230" x2="380" y2="340" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
            <line x1="520" y1="230" x2="420" y2="340" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
            <line x1="280" y1="500" x2="380" y2="380" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
            <line x1="520" y1="500" x2="420" y2="380" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />

            {/* Animated Tokens circulating along orbital lines */}
            <circle r="4" fill="#f59e0b">
              <animateMotion
                path="M 280 230 C 350 180, 450 180, 520 230"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            <circle r="4" fill="#06b6d4">
              <animateMotion
                path="M 540 270 C 580 340, 580 400, 540 470"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>

            <circle r="4" fill="#10b981">
              <animateMotion
                path="M 280 500 C 380 380, 380 380, 380 380"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Central Core: CORE OBJECTIVES (Screenshot 3) */}
          <div
            className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
            style={{
              left: '50%',
              top: '52%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative w-28 h-28 rounded-full bg-[#0a1020]/90 border-2 border-cyan-400/50 shadow-[0_0_45px_rgba(6,182,212,0.4)] flex flex-col items-center justify-center p-3 text-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)] mb-1.5 animate-ping" />
              <span className="text-[11px] font-bold font-mono text-white uppercase tracking-wider leading-tight">
                CORE
                <br />
                OBJECTIVES
              </span>
            </div>
          </div>

          {/* 4 Orbiting Swarm Agents (Screenshot 3) */}
          {/* 1. Revenue Agent (Top Left, Amber) */}
          <div
            onClick={() => setSelectedAgentId('revenue')}
            style={{ left: '22%', top: '30%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer group transition-all`}
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-[#0b101c]/95 border-2 ${
                selectedAgentId === 'revenue'
                  ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] scale-105'
                  : 'border-amber-500/50 group-hover:border-amber-400'
              } flex items-center justify-center shrink-0 transition-all`}
            >
              <span className="text-xl font-bold font-mono text-amber-400">$</span>
            </div>

            <div
              className={`p-3 rounded-xl border backdrop-blur-md transition-all w-52 ${
                selectedAgentId === 'revenue'
                  ? 'bg-[#0f172a]/95 border-amber-400/70 shadow-lg'
                  : 'bg-[#0b101c]/80 border-white/10 group-hover:border-white/25'
              }`}
            >
              <div className="text-xs font-bold text-white">Revenue Agent</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                INVESTIGATING pipeline anomalies (3m ago)
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  Processing
                </span>
              </div>
            </div>
          </div>

          {/* 2. Customer Agent (Top Right, Cyan) */}
          <div
            onClick={() => setSelectedAgentId('customer')}
            style={{ left: '78%', top: '30%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer group transition-all`}
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-[#0b101c]/95 border-2 ${
                selectedAgentId === 'customer'
                  ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] scale-105'
                  : 'border-cyan-500/50 group-hover:border-cyan-400'
              } flex items-center justify-center shrink-0 transition-all`}
            >
              <Users className="w-6 h-6 text-cyan-400" />
            </div>

            <div
              className={`p-3 rounded-xl border backdrop-blur-md transition-all w-52 ${
                selectedAgentId === 'customer'
                  ? 'bg-[#0f172a]/95 border-cyan-400/70 shadow-lg'
                  : 'bg-[#0b101c]/80 border-white/10 group-hover:border-white/25'
              }`}
            >
              <div className="text-xs font-bold text-white">Customer Agent</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                ANALYZING churn predictions (1m ago)
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  Analysing
                </span>
              </div>
            </div>
          </div>

          {/* 3. Finance Agent (Bottom Left, Green) */}
          <div
            onClick={() => setSelectedAgentId('finance')}
            style={{ left: '22%', top: '74%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer group transition-all`}
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-[#0b101c]/95 border-2 ${
                selectedAgentId === 'finance'
                  ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-105'
                  : 'border-emerald-500/50 group-hover:border-emerald-400'
              } flex items-center justify-center shrink-0 transition-all`}
            >
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>

            <div
              className={`p-3 rounded-xl border backdrop-blur-md transition-all w-52 ${
                selectedAgentId === 'finance'
                  ? 'bg-[#0f172a]/95 border-emerald-400/70 shadow-lg'
                  : 'bg-[#0b101c]/80 border-white/10 group-hover:border-white/25'
              }`}
            >
              <div className="text-xs font-bold text-white">Finance Agent</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                WAITING FOR APPROVAL - Q3 Budget adjustment
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  Processing
                </span>
              </div>
            </div>
          </div>

          {/* 4. Operations Agent (Bottom Right, Purple) */}
          <div
            onClick={() => setSelectedAgentId('operations')}
            style={{ left: '78%', top: '74%' }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 cursor-pointer group transition-all`}
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-[#0b101c]/95 border-2 ${
                selectedAgentId === 'operations'
                  ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-105'
                  : 'border-purple-500/50 group-hover:border-purple-400'
              } flex items-center justify-center shrink-0 transition-all`}
            >
              <Activity className="w-6 h-6 text-purple-400" />
            </div>

            <div
              className={`p-3 rounded-xl border backdrop-blur-md transition-all w-52 ${
                selectedAgentId === 'operations'
                  ? 'bg-[#0f172a]/95 border-purple-400/70 shadow-lg'
                  : 'bg-[#0b101c]/80 border-white/10 group-hover:border-white/25'
              }`}
            >
              <div className="text-xs font-bold text-white">Operations Agent</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                PROCESSING supply chain data
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: AGENT INSIGHTS (Screenshot 3) */}
        <aside className="w-[380px] border-l border-white/[0.08] bg-[#090d16]/95 backdrop-blur-xl p-5 overflow-y-auto z-20 flex flex-col justify-between shrink-0 shadow-2xl">
          <div className="space-y-5">
            {/* Header with Agent Name & Status */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    {activeAgent.name} [{activeAgent.code}]
                  </h3>
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wide mt-0.5">
                    WAITING FOR APPROVAL
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="text-slate-500 hover:text-white p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Confidence Score with Circular Dial */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  CONFIDENCE SCORE
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">
                  {activeAgent.confidence}%
                </div>
              </div>

              {/* Radial Meter */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="3.5" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - activeAgent.confidence / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* REASONING TRACE (Collapsible Accordion) */}
            <div className="border border-white/[0.08] rounded-xl bg-black/30 overflow-hidden">
              <button
                onClick={() => setIsReasoningTraceOpen(!isReasoningTraceOpen)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-300 hover:text-white"
              >
                <span>REASONING TRACE</span>
                {isReasoningTraceOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {isReasoningTraceOpen && (
                <div className="p-3 border-t border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-mono text-cyan-300 text-[11px] font-bold">
                    <span>▼</span>
                    <span>{activeAgent.reasoningTrace.title}</span>
                  </div>

                  <div className="pl-4 border-l border-white/10 space-y-1.5 text-[11px] text-slate-300 leading-relaxed font-sans">
                    {activeAgent.reasoningTrace.subItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-500 font-mono">-</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NEURAL PATH GRAPH Visual Widget */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                NEURAL PATH GRAPH
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-center">
                {/* Mini Network Graph Representation */}
                <svg className="w-full h-16" viewBox="0 0 240 60">
                  <path d="M 20 20 L 70 30 L 130 15 L 180 30 L 220 30" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7" />
                  <path d="M 20 40 L 70 30 L 130 45 L 180 30" stroke="#a855f7" strokeWidth="1.5" fill="none" opacity="0.7" />
                  <circle cx="20" cy="20" r="5" fill="#0284c7" />
                  <circle cx="20" cy="40" r="5" fill="#7c3aed" />
                  <circle cx="70" cy="30" r="6" fill="#06b6d4" />
                  <circle cx="130" cy="15" r="5" fill="#10b981" />
                  <circle cx="130" cy="45" r="5" fill="#f59e0b" />
                  <circle cx="180" cy="30" r="6" fill="#38bdf8" />
                  <rect x="210" y="22" width="22" height="16" rx="3" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
                </svg>
              </div>
            </div>

            {/* PENDING POLICY GATE APPROVALS (Screenshot 3) */}
            {activeAgent.pendingApproval && (
              <div className="border border-white/[0.1] rounded-xl bg-[#0e1422]/90 p-4 space-y-3">
                <div className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  PENDING POLICY GATE APPROVALS
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Action:</span>
                    <span className="text-slate-200 font-bold text-right truncate pl-2">
                      {activeAgent.pendingApproval.action}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-amber-400 font-bold">
                      {approvalDecision}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Requested by:</span>
                    <span className="text-slate-300">{activeAgent.pendingApproval.requestedBy}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Policy:</span>
                    <span className="text-slate-300 truncate pl-2">{activeAgent.pendingApproval.policy}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Approvers:</span>
                    <span className="text-slate-300 truncate pl-2">{activeAgent.pendingApproval.approvers}</span>
                  </div>
                </div>

                {/* Big Action Buttons */}
                {approvalDecision === 'PENDING' ? (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={handleApprove}
                      className="py-2 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={handleDeny}
                      className="py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-950/60 border-2 border-rose-500/70 text-rose-300 text-xs font-mono font-bold transition-all"
                    >
                      DENY
                    </button>
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-lg text-center text-xs font-mono font-bold ${
                    approvalDecision === 'APPROVED' ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border border-rose-500 text-rose-300'
                  }`}>
                    {approvalDecision === 'APPROVED' ? '✓ POLICY APPROVED & DISPATCHED' : '✗ POLICY ACTION DENIED'}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
