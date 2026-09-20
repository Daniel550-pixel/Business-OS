import React, { useState, useEffect } from 'react';
import {
  Activity,
  Globe,
  Compass,
  Cpu,
  DollarSign,
  TrendingUp,
  Server,
  Users,
  Search,
  Zap,
  ShieldCheck,
  Command,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { ViewMode, OperatingMode, SystemRuntimeState } from '../types';

interface NavigationProps {
  currentView?: ViewMode;
  activeView?: ViewMode;
  onViewChange: (view: ViewMode) => void;
  operatingMode: OperatingMode;
  onOperatingModeChange: (mode: OperatingMode) => void;
  systemState?: SystemRuntimeState;
  onSystemStateChange?: (state: SystemRuntimeState) => void;
  onOpenCommandPalette?: () => void;
  onOpenCommandCore?: () => void;
  activeMissionsCount?: number;
  criticalAnomaliesCount?: number;
  pendingApprovalsCount?: number;
  geminiActive?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  activeView,
  onViewChange,
  operatingMode,
  onOperatingModeChange,
  systemState = 'risk_detected',
  onSystemStateChange,
  onOpenCommandPalette,
  onOpenCommandCore,
  activeMissionsCount = 3,
  criticalAnomaliesCount = 2,
  pendingApprovalsCount = 3,
  geminiActive = true,
}) => {
  const [time, setTime] = useState<string>('');
  const activeCurrentView = activeView || currentView || 'command-center';
  const handleOpenPrompt = onOpenCommandCore || onOpenCommandPalette || (() => {});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    { id: 'command-center', label: 'Command Center', icon: <Command className="w-3.5 h-3.5" /> },
    { id: 'cyber-hud', label: 'Cyber HUD Deck', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, badge: 'HUD', badgeColor: 'bg-gradient-to-r from-[#ff8800] to-[#ff007a] text-white shadow-[0_0_8px_rgba(255,0,122,0.6)]' },
    { id: 'business-world', label: 'Digital Twin (L1-L5)', icon: <Globe className="w-3.5 h-3.5" />, badge: criticalAnomaliesCount > 0 ? criticalAnomaliesCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'missions', label: 'Missions', icon: <Compass className="w-3.5 h-3.5" />, badge: activeMissionsCount, badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'agents', label: 'AI Agents', icon: <Cpu className="w-3.5 h-3.5" />, badge: 8, badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'sales', label: 'Sales', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'operations', label: 'Operations', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'intelligence', label: 'Live Stream', icon: <Radio className="w-3.5 h-3.5" />, badge: criticalAnomaliesCount, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { id: 'automations', label: 'Policy & Audit', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined, badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40' },
  ];

  const getSystemStateBadge = () => {
    switch (systemState) {
      case 'calm':
        return { label: 'STATE: NORMAL CALM', color: 'bg-slate-800/80 text-slate-300 border-slate-700/50' };
      case 'investigating':
        return { label: 'STATE: INVESTIGATION ACTIVE', color: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 animate-pulse' };
      case 'risk_detected':
        return { label: 'STATE: RISK DETECTED', color: 'bg-rose-950/70 text-rose-300 border-rose-500/40' };
      case 'mission_executing':
        return { label: 'STATE: MISSION EXECUTING', color: 'bg-purple-950/70 text-purple-300 border-purple-500/40' };
      case 'major_decision':
        return { label: 'STATE: MAJOR DECISION REQUIRED', color: 'bg-amber-950/70 text-amber-300 border-amber-500/40' };
    }
  };

  const stateBadge = getSystemStateBadge();

  return (
    <header className="sticky top-0 z-40 w-full os-glass-strong bg-[#0B0E14]/90 os-glass-strong backdrop-blur-xl border-b border-white/[0.07]">
      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-12 border-b border-white/[0.04]">
        {/* Left branding and live pulse */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold tracking-widest text-slate-100 uppercase">BUSINESS OS</span>
              <span className="text-[10px] font-mono tracking-wider text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">AI-NATIVE</span>
            </div>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          {/* System State Awareness Pill */}
          {onSystemStateChange ? (
            <select
              value={systemState}
              onChange={(e) => onSystemStateChange(e.target.value as SystemRuntimeState)}
              aria-label="System Runtime State"
              className={`hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase transition-all bg-black/40 focus:outline-none cursor-pointer ${stateBadge.color}`}
            >
              <option value="calm">Normal (Calm)</option>
              <option value="investigating">AI Investigating</option>
              <option value="risk_detected">Risk Detected</option>
              <option value="mission_executing">Mission Executing</option>
              <option value="major_decision">Major Decision</option>
            </select>
          ) : (
            <span
              className={`hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${stateBadge.color}`}
            >
              {stateBadge.label}
            </span>
          )}

          {/* Live indicator & Clock */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{time || '00:00:00 UTC'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">p99 42ms</span>
          </div>
        </div>

        {/* Center Prompt Trigger Button */}
        <button
          onClick={handleOpenPrompt}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-xs text-slate-300 transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-slate-400 hidden md:inline">Ask AI Command Core...</span>
          <span className="font-mono text-slate-400 md:hidden">Command Core</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Right controls: Operating Mode switcher & Gemini indicator */}
        <div className="flex items-center gap-2.5">
          {/* Executive vs Deep Work Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono">
            <button
              onClick={() => onOperatingModeChange('executive')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                operatingMode === 'executive'
                  ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => onOperatingModeChange('operate')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                operatingMode === 'operate' || operatingMode === 'deep_work' || operatingMode === 'deep-work'
                  ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Operate
            </button>
          </div>

          {/* AI Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.025] border border-white/[0.06] text-[10px] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${geminiActive ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 hidden sm:inline">{geminiActive ? 'Gemini 3.8 Flash' : 'AIOS Core'}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tab Strip */}
      <div className="flex items-center px-4 lg:px-6 overflow-x-auto os-grid no-scrollbar gap-1 py-1.5">
        {navItems.map((item) => {
          const isActive =
            activeCurrentView === item.id ||
            (item.id === 'command-center' && activeCurrentView === 'command') ||
            (item.id === 'business-world' && activeCurrentView === 'world');
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'text-white bg-white/[0.08] shadow-[0_0_12px_rgba(6,182,212,0.15)] border border-white/[0.12]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
