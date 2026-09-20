import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Command,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
  ArrowDown,
  TrendingUp,
  Layers,
  Crosshair,
  Compass,
} from 'lucide-react';
import { ViewMode, SystemRuntimeState } from '../types';

interface PlanetHeroProps {
  onScrollToDashboard: () => void;
  onOpenCommandCore: () => void;
  onNavigateToView: (view: ViewMode) => void;
  systemState?: SystemRuntimeState;
  pendingApprovalsCount?: number;
  activeMissionsCount?: number;
}

export const PlanetHero: React.FC<PlanetHeroProps> = ({
  onScrollToDashboard,
  onOpenCommandCore,
  onNavigateToView,
  systemState = 'risk_detected',
  pendingApprovalsCount = 0,
  activeMissionsCount = 4,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandCore();
  };

  return (
    <section className="relative w-full min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-10 pt-6 pb-10 text-white select-none">
      {/* Top Floating Telemetry Rail */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-300 font-bold uppercase tracking-widest">
            AIOS UAE // PLANET SURFACE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">GEO-STATIONARY ORBIT (420 KM)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AIR-GAPPED SOVEREIGN</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LATENCY: 12ms P99</span>
          </div>
        </div>
      </div>

      {/* Center Open Viewport Framing the Planet */}
      <div className="w-full max-w-4xl mx-auto my-auto text-center space-y-6 py-8">
        {/* Subtle Pill Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-2xl text-xs font-mono tracking-wider text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-slate-300">SEE → UNDERSTAND → REASON → SIMULATE → ACT</span>
        </div>

        {/* Hero Title with Generous Letter Spacing & Fashion Contrast */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            THE AUTONOMOUS <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              OPERATING ENVIRONMENT
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/90 font-sans font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            A unified visual intelligence and cognitive digital twin continuously simulating reality
            across the UAE and enterprise operational core.
          </p>
        </div>

        {/* Floating AI Command Input Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center p-1.5 rounded-2xl bg-black/50 border border-white/20 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/50 transition-all duration-300 group"
          >
            <div className="pl-3.5 text-cyan-400 group-hover:scale-110 transition-transform">
              <Command className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Business-OS anything or command swarm... (⌘K)"
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
              onClick={onOpenCommandCore}
            />
            <button
              type="button"
              onClick={onOpenCommandCore}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>COMMAND CORE</span>
              <kbd className="text-[10px] bg-black/40 px-1 py-0.5 rounded text-slate-300">⌘K</kbd>
            </button>
          </form>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] font-mono text-slate-300">
            <button
              onClick={onOpenCommandCore}
              className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/10 transition-colors"
            >
              Simulate 2035 Growth
            </button>
            <button
              onClick={() => onNavigateToView('cyber-hud')}
              className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/10 transition-colors text-amber-300"
            >
              Cyber HUD Cockpit
            </button>
            <button
              onClick={() => onNavigateToView('business-world')}
              className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/10 transition-colors text-cyan-300"
            >
              Digital Twin (L1-L5)
            </button>
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onScrollToDashboard}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_28px_rgba(6,182,212,0.5)] hover:shadow-[0_0_36px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>ENTER DASHBOARD</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={() => onNavigateToView('cyber-hud')}
            className="px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-xl shadow-[0_0_20px_rgba(255,170,0,0.2)] hover:border-amber-400 transition-all duration-200"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>CYBER HUD DECK</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Scroll Cue */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-2 pt-4">
        {/* Sleek Floating Telemetry Cards Array */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left font-mono">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-0.5">
            <div className="text-[9px] text-slate-400 uppercase">CAPITAL VECTOR</div>
            <div className="text-sm font-bold text-emerald-400">€24.84M ARR</div>
            <div className="text-[9px] text-slate-500">+18.4% YOY</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-0.5">
            <div className="text-[9px] text-slate-400 uppercase">REASONING AGENTS</div>
            <div className="text-sm font-bold text-cyan-300">8 SPECIALIZED</div>
            <div className="text-[9px] text-slate-500">AUTONOMOUS CONSENSUS</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-0.5">
            <div className="text-[9px] text-slate-400 uppercase">POLICY GATES</div>
            <div className="text-sm font-bold text-amber-300">
              {pendingApprovalsCount > 0 ? `${pendingApprovalsCount} AWAITING` : '100% ENFORCED'}
            </div>
            <div className="text-[9px] text-slate-500">IMMUTABLE AUDIT LOG</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-0.5">
            <div className="text-[9px] text-slate-400 uppercase">DIGITAL TWIN</div>
            <div className="text-sm font-bold text-indigo-300">1,482 NODES</div>
            <div className="text-[9px] text-slate-500">L1-L5 RESOLUTION</div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator Pill */}
        <button
          onClick={onScrollToDashboard}
          className="mt-3 group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 hover:border-cyan-400/50 backdrop-blur-xl text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          title="Scroll down to operational dashboard"
        >
          <span className="text-[10px] tracking-widest uppercase">
            SCROLL DOWN FOR OPERATIONAL DASHBOARD
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform animate-bounce" />
        </button>
      </div>
    </section>
  );
};
