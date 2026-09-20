import React, { useEffect, useState } from 'react';
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
  Sparkles,
  MoreHorizontal,
  ChevronDown,
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
  const [time, setTime] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
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

  const primaryItems: {
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'command-center', label: 'Command', icon: <Command className="w-3.5 h-3.5" /> },
    { id: 'business-world', label: 'Digital Twin', icon: <Globe className="w-3.5 h-3.5" />, badge: criticalAnomaliesCount > 0 ? criticalAnomaliesCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { id: 'missions', label: 'Missions', icon: <Compass className="w-3.5 h-3.5" />, badge: activeMissionsCount, badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
    { id: 'agents', label: 'Agents', icon: <Cpu className="w-3.5 h-3.5" />, badge: 8, badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'intelligence', label: 'Intelligence', icon: <Radio className="w-3.5 h-3.5" />, badge: criticalAnomaliesCount, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  ];

  const secondaryItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'cyber-hud', label: 'Cyber HUD', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, badge: undefined },
    { id: 'sales', label: 'Sales', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'operations', label: 'Operations', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'automations', label: 'Policy & Audit', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: pendingApprovalsCount, badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40' },
  ];

  const isViewActive = (id: ViewMode) =>
    activeCurrentView === id ||
    (id === 'command-center' && activeCurrentView === 'command') ||
    (id === 'business-world' && activeCurrentView === 'world');

  const selectView = (id: ViewMode) => {
    onViewChange(id);
    setMoreOpen(false);
  };

  const getSystemStateBadge = () => {
    switch (systemState) {
      case 'calm':
        return { label: 'NORMAL', color: 'bg-slate-800/80 text-slate-300 border-slate-700/50' };
      case 'investigating':
        return { label: 'INVESTIGATING', color: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40' };
      case 'risk_detected':
        return { label: 'RISK DETECTED', color: 'bg-rose-950/70 text-rose-300 border-rose-500/40' };
      case 'mission_executing':
        return { label: 'EXECUTING', color: 'bg-purple-950/70 text-purple-300 border-purple-500/40' };
      case 'major_decision':
        return { label: 'DECISION REQUIRED', color: 'bg-amber-950/70 text-amber-300 border-amber-500/40' };
    }
  };

  const stateBadge = getSystemStateBadge();

  return (
    <header className="sticky top-0 z-50 w-full os-glass-strong bg-[#080B10]/88 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="flex items-center justify-between gap-4 px-3 sm:px-4 lg:px-6 h-12">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300">
              <Zap className="w-3.5 h-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
            </div>
            <div className="hidden sm:flex items-baseline gap-2">
              <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">BUSINESS OS</span>
              <span className="text-[9px] font-mono tracking-wider text-cyan-300/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">RUNTIME</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono">
            {onSystemStateChange ? (
              <select
                value={systemState}
                onChange={(e) => onSystemStateChange(e.target.value as SystemRuntimeState)}
                aria-label="System Runtime State"
                className={`px-2 py-1 rounded-md border font-bold uppercase transition-all bg-black/35 focus:outline-none cursor-pointer ${stateBadge.color}`}
              >
                <option value="calm">Normal</option>
                <option value="investigating">Investigating</option>
                <option value="risk_detected">Risk Detected</option>
                <option value="mission_executing">Executing</option>
                <option value="major_decision">Decision Required</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded-md border font-bold uppercase ${stateBadge.color}`}>{stateBadge.label}</span>
            )}
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{time || '00:00:00 UTC'}</span>
            <span className="text-slate-600">p99 42ms</span>
          </div>
        </div>

        <button
          onClick={handleOpenPrompt}
          className="group flex items-center gap-2 min-w-0 w-[min(42vw,430px)] px-3 py-1.5 rounded-xl bg-white/[0.035] hover:bg-white/[0.065] border border-white/[0.08] hover:border-cyan-400/30 text-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-slate-400 truncate">Ask Command Core...</span>
          <kbd className="hidden sm:inline-flex ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-500">⌘K</kbd>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono">
            <button onClick={() => onOperatingModeChange('executive')} className={`px-2.5 py-1 rounded-md transition-all ${operatingMode === 'executive' ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}>Executive</button>
            <button onClick={() => onOperatingModeChange('operate')} className={`px-2.5 py-1 rounded-md transition-all ${operatingMode !== 'executive' ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}>Operate</button>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.025] border border-white/[0.06] text-[10px] font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${geminiActive ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
            <span className="text-slate-300">{geminiActive ? 'AI Core' : 'AIOS Core'}</span>
          </div>
        </div>
      </div>

      <div className="relative flex items-center px-3 sm:px-4 lg:px-6 overflow-x-auto os-grid no-scrollbar gap-1 py-1.5 border-t border-white/[0.025]">
        {primaryItems.map((item) => {
          const active = isViewActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => selectView(item.id)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap font-medium transition-all ${active ? 'text-white bg-white/[0.08] border border-white/[0.11]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.035] border border-transparent'}`}
            >
              <span className={active ? 'text-cyan-300' : 'text-slate-500'}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge !== undefined && <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>{item.badge}</span>}
              {active && <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />}
            </button>
          );
        })}

        <div className="relative ml-auto shrink-0">
          <button
            onClick={() => setMoreOpen((value) => !value)}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] border transition-all ${moreOpen || secondaryItems.some((item) => isViewActive(item.id)) ? 'text-white bg-white/[0.08] border-white/[0.11]' : 'text-slate-400 hover:text-white border-transparent hover:bg-white/[0.035]'}`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            <span>More</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
          </button>

          {moreOpen && (
            <div role="menu" className="absolute right-0 top-[calc(100%+8px)] w-52 p-1.5 rounded-xl os-glass-strong bg-[#0B0E14]/96 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,.55)]">
              <div className="px-2.5 py-2 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-600">Operational surfaces</div>
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  role="menuitem"
                  onClick={() => selectView(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${isViewActive(item.id) ? 'bg-cyan-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}
                >
                  <span className={isViewActive(item.id) ? 'text-cyan-300' : 'text-slate-500'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>{item.badge}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
