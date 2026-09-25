import React, { useEffect, useState } from 'react';
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
  Maximize2,
  Activity,
} from 'lucide-react';
import { ViewMode, SystemRuntimeState } from '../types';
import { LivingSystemFlow3D } from './LivingSystemFlow3D';
import { NeuralFlowOverlay } from './NeuralFlowOverlay';

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
  const [heroMode, setHeroMode] = useState<'3d-flow' | 'planet-orbit'>('3d-flow');

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('.business-neural-art');
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!video || !query) return;
    const sync = () => {
      if (query.matches) video.pause();
      else video.play().catch(() => undefined);
    };
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandCore();
  };

  const neuralVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4';
  const neuralPoster = 'https://d2ol7oe51mr4n9cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg';

  return (
    <section className="cinematic-business-hero relative w-full flex flex-col justify-between items-center px-2 sm:px-4 lg:px-8 pt-4 pb-8 text-white select-none space-y-4">
      <video className="business-neural-art" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster={neuralPoster} src={neuralVideo} />
      <div className="business-neural-veil" aria-hidden="true" />
      <NeuralFlowOverlay systemState={systemState} pendingApprovalsCount={pendingApprovalsCount} />
      <div className="cinematic-business-hero-copy" aria-label="Business OS introduction">
        <span className="cinematic-business-eyebrow">BUSINESS OS // INTELLIGENCE OPERATING ENVIRONMENT</span>
        <h1>See the business.<br /><em>Reason through the unknown.</em></h1>
        <p>Continuous digital-twin intelligence, policy-gated reasoning and verified execution — without replacing the operational cockpit you already use.</p>
      </div>
      {/* Top Floating Telemetry & Mode Selector Rail */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono z-10 cinematic-hero-rail">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-300 font-bold uppercase tracking-widest">
            AIOS UAE // LIVING INTERFACE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">CONTINUOUS 3D SOVEREIGN LOOP</span>
        </div>

        {/* Hero Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 border border-cyan-500/30 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setHeroMode('3d-flow')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all text-xs font-mono"
            title="Expand into full-screen 3D operating environment"
          >
            <Maximize2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">FULL COCKPIT</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LATENCY: 12ms P99</span>
          </div>
        </div>
      </div>

      {/* Main Hero Container: Living 3D Scene or Minimal Celestial View */}
      {heroMode === '3d-flow' ? (
        <div className="w-full max-w-7xl relative my-1 cinematic-hero-scene">
          <LivingSystemFlow3D
            isEmbedded={true}
            onNavigateToView={onNavigateToView}
            onOpenCommandCore={onOpenCommandCore}
          />

          {/* Quick Action Dock Below 3D Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 px-2 cinematic-hero-actions">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCommandCore}
                className="px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 backdrop-blur-xl transition-all"
              >
                <Command className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMMAND CORE (⌘K)</span>
              </button>

              <button
                onClick={() => onNavigateToView('system-flow')}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 backdrop-blur-xl transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPAND FULL 3D COCKPIT</span>
              </button>
            </div>

            <button
              onClick={onScrollToDashboard}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>ENTER OPERATIONAL DASHBOARD</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </div>
      ) : (
        /* Minimal Celestial Viewport */
        <div className="w-full max-w-4xl mx-auto my-auto text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-2xl text-xs font-mono tracking-wider text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-slate-300">SEE → UNDERSTAND → REASON → SIMULATE → ACT</span>
          </div>

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
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setHeroMode('3d-flow')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_28px_rgba(6,182,212,0.5)] hover:shadow-[0_0_36px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>LAUNCH 3D LIVING FLOW</span>
            </button>

            <button
              onClick={onScrollToDashboard}
              className="px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-slate-200 hover:text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-xl transition-all duration-200 cursor-pointer"
            >
              <span>OPERATIONAL DASHBOARD</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Telemetry Cards Array */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-2 pt-2 cinematic-hero-telemetry">
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
          className="mt-2 group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 hover:border-cyan-400/50 backdrop-blur-xl text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
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

