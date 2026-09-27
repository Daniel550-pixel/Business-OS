import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Command,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
  ArrowDown,
  TrendingUp,
  Maximize2,
  Compass,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';
import { ViewMode, SystemRuntimeState } from '../types';
import { LivingSystemFlow3D } from './LivingSystemFlow3D';
import { CelestialStarfieldCanvas } from './CelestialStarfieldCanvas';

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
  activeMissionsCount = 3,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroMode, setHeroMode] = useState<'3d-flow' | 'planet-orbit'>('3d-flow');

  useEffect(() => {
    const hero = document.querySelector('.cinematic-business-hero');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent('business-os:planetary-visibility', {
            detail: { visible: entry.isIntersecting, ratio: entry.intersectionRatio },
          })
        );
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandCore();
  };

  return (
    <section
      className="cinematic-business-hero relative w-full flex flex-col justify-start items-center px-3 sm:px-6 lg:px-8 pt-6 pb-12 text-white select-none space-y-6"
      aria-label="JARVIS AIOS UAE Planetary Starting Screen"
    >
      {/* Centered System Title Header: Main Starting Screen */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-3 z-10 cinematic-business-hero-copy">
        <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-xl text-[11px] font-mono tracking-widest text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold uppercase tracking-wider">AIOS UAE // SOVEREIGN AI OPERATING ENVIRONMENT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-mono text-white text-center leading-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]">
          JARVIS <span className="text-cyan-400 font-light">/</span> AIOS
        </h1>

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono tracking-widest text-slate-300 font-medium uppercase">
          <span>THE AUTONOMOUS OPERATING ENVIRONMENT</span>
          <span className="text-cyan-500">•</span>
          <span className="text-cyan-400 font-bold">UAE WORLD MODEL</span>
        </div>

        {/* Vision-First Canonical Cognitive Loop */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
          <span className="text-cyan-300 font-semibold">SEE</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">UNDERSTAND</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">REASON</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">SIMULATE</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">PREDICT</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-semibold">VERIFY</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400 font-bold">ACT</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-300">OBSERVE</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-300">UPDATE</span>
        </div>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300/90 font-sans font-light leading-relaxed text-center">
          A unified visual intelligence and cognitive digital twin continuously simulating reality
          across the UAE and enterprise operational core.
        </p>
      </div>

      {/* Floating Mode Selector Rail centered above Planet */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono z-10 cinematic-hero-rail px-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            PLANETARY RUNTIME FIELD
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">REALITY → AGENT SWARM</span>
        </div>

        {/* Hero Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 border border-cyan-500/30 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setHeroMode('3d-flow')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              heroMode === '3d-flow'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-200" />
            <span>3D LIVING FLOW</span>
          </button>
          <button
            onClick={() => setHeroMode('planet-orbit')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              heroMode === 'planet-orbit'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>CELESTIAL ORBIT</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToView('system-flow')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all text-xs font-mono"
            title="Expand into full-screen 3D operating environment"
          >
            <Maximize2 className="w-3 h-3 text-cyan-400" />
            <span>FULL 3D COCKPIT</span>
          </button>
        </div>
      </div>

      {/* Main Centered Planet UI: 3D Living System Flow or Celestial Starfield */}
      <div className="w-full max-w-6xl mx-auto relative my-1 cinematic-hero-scene">
        {heroMode === '3d-flow' ? (
          <LivingSystemFlow3D
            isEmbedded={true}
            onNavigateToView={onNavigateToView}
            onOpenCommandCore={onOpenCommandCore}
          />
        ) : (
          <div className="relative w-full h-[82vh] min-h-[580px] rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_12px_48px_rgba(0,0,0,0.85)] bg-[#03060f] flex flex-col items-center justify-center p-6">
            <CelestialStarfieldCanvas systemState={systemState} />
            
            {/* Center glowing celestial orb graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 max-w-xl">
              <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-cyan-400/40 bg-gradient-to-b from-cyan-500/20 via-blue-900/30 to-black shadow-[0_0_80px_rgba(6,182,212,0.35)] backdrop-blur-sm animate-pulse">
                <Globe className="w-24 h-24 text-cyan-300/80 stroke-[1.2]" />
                <div className="absolute inset-0 rounded-full border border-white/20" />
                <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '40s' }} />
                
                {/* Coordinates Tag */}
                <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-black/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                  UAE 24.4539° N, 54.3773° E
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-mono text-white tracking-wide">
                  CELESTIAL DIGITAL TWIN PERSPECTIVE
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Real-time high-orbit telemetry synched across maritime corridors, sovereign compute clusters, and clean energy dispatch nodes.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setHeroMode('3d-flow')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SWITCH TO 3D LIVING FLOW</span>
                </button>
                <button
                  onClick={() => onNavigateToView('system-flow')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-mono text-xs transition-all"
                >
                  EXPAND FULL COCKPIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Centered Command Bar right below Planet Canvas */}
        <div className="w-full max-w-3xl mx-auto pt-4 cinematic-hero-actions">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center p-2 rounded-2xl bg-black/60 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] hover:border-cyan-400/60 transition-all duration-300 group"
          >
            <div className="pl-3.5 text-cyan-400 group-hover:scale-110 transition-transform">
              <Command className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask AIOS anything or issue operator intent... (⌘K)"
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
              onClick={onOpenCommandCore}
            />
            <button
              type="button"
              onClick={onOpenCommandCore}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMAND CORE</span>
              <kbd className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-cyan-100 ml-1">⌘K</kbd>
            </button>
          </form>
        </div>
      </div>

      {/* Centered Operational Telemetry Grid Cards */}
      <div className="w-full max-w-5xl mx-auto cinematic-hero-telemetry pt-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left font-mono">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>CAPITAL VECTOR</span>
              <span className="text-emerald-400 font-bold">+18.6%</span>
            </div>
            <div className="text-lg font-bold text-white">$24.84M ARR</div>
            <div className="text-[10px] text-slate-500 truncate">Trailing 12-Month Run-Rate</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>AUTONOMOUS RUNWAY</span>
              <span className="text-cyan-400 font-bold">SURPLUS</span>
            </div>
            <div className="text-lg font-bold text-white">22.4 MOS</div>
            <div className="text-[10px] text-slate-500 truncate">Capital Efficiency Target</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>POLICY GATE</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400">100% VERIFIED</div>
            <div className="text-[10px] text-slate-500 truncate">Zero Unverified Mutations</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>CLEAN ENERGY DISPATCH</span>
              <span className="text-cyan-400 font-bold">+4.8%</span>
            </div>
            <div className="text-lg font-bold text-white">94.2% OPTIMAL</div>
            <div className="text-[10px] text-slate-500 truncate">Masdar Solar Grid Telemetry</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar directly connecting to the Operational Workspace */}
      <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onScrollToDashboard}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>ENTER OPERATIONAL WORKSPACE</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>

        <button
          onClick={onOpenCommandCore}
          className="px-5 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span>OPEN COMMAND PALETTE (⌘K)</span>
        </button>

        <button
          onClick={() => onNavigateToView('missions')}
          className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>MISSIONS ({activeMissionsCount})</span>
        </button>
      </div>
    </section>
  );
};
