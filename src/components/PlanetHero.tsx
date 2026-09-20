import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Command,
  Zap,
  ShieldCheck,
  ArrowDown,
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
  pendingApprovalsCount = 0,
  activeMissionsCount = 4,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandCore();
  };

  return (
    <section className="relative w-full min-h-[78vh] lg:min-h-[82vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-10 pt-5 pb-8 text-white select-none">
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]" />
          <span className="text-slate-300 font-bold uppercase tracking-[0.16em]">BUSINESS OS // PLANET SURFACE</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300/80">RUNTIME ORBIT</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>POLICY-GATED</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-xl text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SIMULATION MODE</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto my-auto text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.035] border border-white/12 backdrop-blur-2xl text-[10px] font-mono tracking-[0.12em] text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>SEE → UNDERSTAND → REASON → SIMULATE → ACT</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            THE AUTONOMOUS
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent"> OPERATING ENVIRONMENT</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/90 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            One operational surface for business state, intelligence, digital twins, agent reasoning,
            simulation and policy-gated execution.
          </p>
        </div>

        <div className="max-w-xl mx-auto pt-1">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center p-1.5 rounded-2xl bg-black/50 border border-white/18 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/45 transition-all duration-300 group"
          >
            <div className="pl-3.5 text-cyan-300 group-hover:scale-110 transition-transform">
              <Command className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Command Core or describe an objective..."
              className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
              onClick={onOpenCommandCore}
            />
            <button
              type="button"
              onClick={onOpenCommandCore}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/15 text-[10px] font-mono font-bold text-white transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>COMMAND CORE</span>
              <kbd className="hidden sm:inline text-[9px] bg-black/40 px-1 py-0.5 rounded text-slate-400">⌘K</kbd>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[10px] font-mono">
            <button onClick={onOpenCommandCore} className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
              Simulate growth
            </button>
            <button onClick={() => onNavigateToView('cyber-hud')} className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-amber-400/15 text-amber-300 transition-colors">
              Cyber HUD
            </button>
            <button onClick={() => onNavigateToView('business-world')} className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-cyan-400/15 text-cyan-300 transition-colors">
              Digital Twin
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onScrollToDashboard}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-bold text-[10px] uppercase tracking-[0.12em] flex items-center gap-2.5 shadow-[0_0_28px_rgba(6,182,212,0.42)] hover:shadow-[0_0_36px_rgba(6,182,212,0.62)] hover:scale-[1.03] active:scale-[.98] transition-all duration-200"
          >
            <span>ENTER DASHBOARD</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateToView('cyber-hud')}
            className="px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 border border-amber-500/35 text-amber-300 font-mono font-bold text-[10px] uppercase tracking-[0.12em] flex items-center gap-2 backdrop-blur-xl transition-all duration-200"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>CYBER HUD</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-2 pt-4">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5 text-left font-mono">
          <div className="p-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-xl">
            <div className="text-[9px] text-slate-500 uppercase">CAPITAL VECTOR</div>
            <div className="text-sm font-bold text-emerald-400">€24.84M ARR</div>
            <div className="text-[9px] text-slate-500">+18.4% YOY • SIMULATED</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-xl">
            <div className="text-[9px] text-slate-500 uppercase">REASONING AGENTS</div>
            <div className="text-sm font-bold text-cyan-300">8 SPECIALIZED</div>
            <div className="text-[9px] text-slate-500">CONSENSUS LAYER</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-xl">
            <div className="text-[9px] text-slate-500 uppercase">POLICY GATES</div>
            <div className="text-sm font-bold text-amber-300">{pendingApprovalsCount > 0 ? `${pendingApprovalsCount} AWAITING` : '100% ENFORCED'}</div>
            <div className="text-[9px] text-slate-500">HUMAN APPROVAL REQUIRED</div>
          </div>
          <div className="p-2.5 rounded-xl bg-black/35 border border-white/10 backdrop-blur-xl">
            <div className="text-[9px] text-slate-500 uppercase">DIGITAL TWIN</div>
            <div className="text-sm font-bold text-indigo-300">1,482 NODES</div>
            <div className="text-[9px] text-slate-500">L1-L5 RESOLUTION</div>
          </div>
        </div>

        <button
          onClick={onScrollToDashboard}
          className="mt-3 group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 hover:bg-black/75 border border-white/12 hover:border-cyan-400/45 backdrop-blur-xl text-[10px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Scroll down to operational dashboard"
        >
          <span className="tracking-[0.16em] uppercase">Operational dashboard</span>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
