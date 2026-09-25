import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Zap,
  Volume2,
  VolumeX,
  Globe,
  Cpu,
  ShieldCheck,
  Radio,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  Activity,
  Compass,
  CheckCircle2,
  ExternalLink,
  Mic,
} from 'lucide-react';
import { FlowStageNode, SimulatedSystemEvent } from './flowModel';
import { cyberAudio } from '../../utils/audioSynthesizer';
import { jarvisVoice } from '../../utils/speechEngine';

interface LivingFlowControlsProps {
  stages: FlowStageNode[];
  selectedStage: FlowStageNode | null;
  onSelectStage: (stage: FlowStageNode | null) => void;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  activePerspective: 'orbit' | 'uae' | 'swarm' | 'verify' | 'panoramic';
  onPerspectiveChange: (p: 'orbit' | 'uae' | 'swarm' | 'verify' | 'panoramic') => void;
  onTriggerPulse: (scenarioName: string) => void;
  recentEvents: SimulatedSystemEvent[];
  onNavigateToView?: (view: any) => void;
}

export const LivingFlowControls: React.FC<LivingFlowControlsProps> = ({
  stages,
  selectedStage,
  onSelectStage,
  speedMultiplier,
  onSpeedChange,
  isPaused,
  onTogglePause,
  activePerspective,
  onPerspectiveChange,
  onTriggerPulse,
  recentEvents,
  onNavigateToView,
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(cyberAudio.getMuted());
  const [isVoiceMuted, setIsVoiceMuted] = useState(jarvisVoice.isVoiceMuted());
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isInjectMenuOpen, setIsInjectMenuOpen] = useState(false);
  const [feedStreamIndex, setFeedStreamIndex] = useState(0);

  // Monitor voice speech status
  useEffect(() => {
    const checkVoice = () => {
      setIsVoiceSpeaking(jarvisVoice.isCurrentlySpeaking());
    };
    const timer = setInterval(checkVoice, 200);
    return () => clearInterval(timer);
  }, []);

  // Ticker for live feed data
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedStreamIndex((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleAudioToggle = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleVoiceToggle = () => {
    const muted = jarvisVoice.toggleMute();
    setIsVoiceMuted(muted);
    if (muted) {
      jarvisVoice.stop();
    } else {
      jarvisVoice.speak('JARVIS sovereign speech engine active.');
    }
  };

  const handleSpeakSelectedStage = () => {
    if (!selectedStage) return;
    jarvisVoice.speak(selectedStage.voiceScript);
  };

  const scenarios = [
    {
      id: 'jebel_ali',
      name: 'Simulate Jebel Ali Intermodal Surge',
      desc: '30% freight diversion to Etihad Rail corridor',
    },
    {
      id: 'energy_grid',
      name: 'Barakah Nuclear & Solar Grid Balancing',
      desc: 'Peak load shift with hydrogen storage buffer',
    },
    {
      id: 'policy_zero_drift',
      name: 'Execute Zero-Drift Sovereign Proof',
      desc: 'Formal verification of air-gapped cryptographic enclaves',
    },
    {
      id: 'horizon_2035',
      name: 'Project 2035 Dubai South Urban Horizon',
      desc: 'Autonomous multi-agent simulation across logistics zones',
    },
  ];

  return (
    <>
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: System Flow & Live AI Voice Status */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 border border-cyan-500/30 backdrop-blur-2xl text-white shadow-[0_4px_24px_rgba(0,0,0,0.7)] pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
            AIOS UAE // PLANETARY SYSTEM FLOW
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Animated voice wave indicator */}
          <div className="flex items-center gap-1.5 pl-1">
            <button
              onClick={handleVoiceToggle}
              className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full transition-all ${
                isVoiceSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : isVoiceMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}
              title={isVoiceMuted ? 'Unmute JARVIS Voice' : 'Mute JARVIS Voice'}
            >
              <Mic className="w-3 h-3" />
              <span>{isVoiceSpeaking ? 'VOICE SPEAKING' : isVoiceMuted ? 'VOICE MUTED' : 'VOICE ACTIVE'}</span>
              {isVoiceSpeaking && (
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-emerald-400 animate-pulse" />
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-75" />
                  <span className="w-1 h-4 bg-emerald-400 animate-pulse delay-150" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Planetary Perspective Switcher (UAE Twin, Agent Swarm, Policy Gate, Panoramic) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-2xl pointer-events-auto shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          {/* UAE Digital Twin */}
          <button
            onClick={() => {
              onPerspectiveChange('uae');
              const uae = stages.find((s) => s.id === 'uae-world-model');
              if (uae) onSelectStage(uae);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              activePerspective === 'uae'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_16px_rgba(6,182,212,0.6)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>UAE Twin</span>
          </button>

          {/* Agent Swarm */}
          <button
            onClick={() => {
              onPerspectiveChange('swarm');
              const swarm = stages.find((s) => s.id === 'reason-cognition');
              if (swarm) onSelectStage(swarm);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              activePerspective === 'swarm'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_16px_rgba(168,85,247,0.6)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-300" />
            <span>Agent Swarm</span>
          </button>

          {/* Policy Gate */}
          <button
            onClick={() => {
              onPerspectiveChange('verify');
              const verify = stages.find((s) => s.id === 'verify-prove');
              if (verify) onSelectStage(verify);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              activePerspective === 'verify'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-[0_0_16px_rgba(245,158,11,0.6)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span>Policy Gate</span>
          </button>

          {/* Panoramic System Overview */}
          <button
            onClick={() => onPerspectiveChange('panoramic')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              activePerspective === 'panoramic'
                ? 'bg-gradient-to-r from-cyan-400 to-teal-500 text-black font-bold shadow-[0_0_16px_rgba(6,182,212,0.6)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panoramic</span>
          </button>

          {/* 3D Orbit Track */}
          <button
            onClick={() => onPerspectiveChange('orbit')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activePerspective === 'orbit'
                ? 'bg-white/20 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Celestial Orbit
          </button>
        </div>

        {/* Right: Sound, Speed, Pulse Injection */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Cybernetic Audio Synthesizer */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-full border backdrop-blur-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              !isAudioMuted
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isAudioMuted ? 'Enable Cybernetic FX Audio' : 'Mute Sound FX'}
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Pause / Play Flow */}
          <button
            onClick={onTogglePause}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-slate-200 hover:text-white transition-all backdrop-blur-xl"
            title={isPaused ? 'Resume Planetary Rotation' : 'Pause Flow'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Speed Presets */}
          <div className="flex items-center p-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl text-[10px] font-mono">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded-full transition-all ${
                  speedMultiplier === s
                    ? 'bg-cyan-500/30 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Inject Event Pulse Button */}
          <div className="relative">
            <button
              onClick={() => setIsInjectMenuOpen(!isInjectMenuOpen)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>PULSE SCENARIO</span>
            </button>

            {isInjectMenuOpen && (
              <div className="absolute right-0 top-10 w-72 p-2 rounded-2xl bg-[#0b101d]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.9)] space-y-1 text-left z-30 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[9px] font-mono text-cyan-300 font-bold uppercase border-b border-white/10">
                  INJECT SOVEREIGN SCENARIO
                </div>
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      onTriggerPulse(sc.name);
                      setIsInjectMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-cyan-500/20 transition-colors space-y-0.5 cursor-pointer"
                  >
                    <div className="text-xs font-bold font-sans text-white">{sc.name}</div>
                    <div className="text-[10px] font-sans text-slate-300 leading-snug">{sc.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Planetary Carousel Quick-Switcher Bar (Top Sub-Rail) */}
      <div className="absolute top-18 left-4 right-4 z-15 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-none scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl pointer-events-auto mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {stages.map((st) => {
            const isSelected = selectedStage?.id === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  onSelectStage(st);
                  jarvisVoice.speak(st.voiceScript);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? `${st.color}35` : undefined,
                  borderColor: isSelected ? st.color : undefined,
                  borderWidth: isSelected ? '1px' : '0px',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: st.color }}
                />
                <span className="truncate max-w-[110px]">{st.planetName || st.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Planet Inspector Drawer with Voice & Live Feed & System Link */}
      {selectedStage && (
        <aside className="absolute right-4 top-24 bottom-14 z-30 w-84 sm:w-96 rounded-3xl bg-[#070d1a]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-200 text-white font-mono">
          {/* Planet Header */}
          <div
            className="p-4 border-b border-white/10 flex items-start justify-between gap-2"
            style={{
              background: `linear-gradient(135deg, ${selectedStage.color}25, transparent)`,
            }}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: `${selectedStage.color}30`,
                    color: selectedStage.color,
                  }}
                >
                  {selectedStage.phase}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CELESTIAL PLANET</span>
              </div>

              <div>
                <div className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
                  {selectedStage.planetName}
                </div>
                <h3 className="text-base font-bold font-sans tracking-tight text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedStage.color }} />
                  <span>{selectedStage.name}</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => onSelectStage(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Direct Deep Link Into System Action */}
            {onNavigateToView && selectedStage.systemLinkView && (
              <div
                className="p-3.5 rounded-2xl border space-y-2"
                style={{
                  backgroundColor: `${selectedStage.color}15`,
                  borderColor: `${selectedStage.color}40`,
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                  <span>DEEP SYSTEM NAVIGATION</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <button
                  onClick={() => onNavigateToView(selectedStage.systemLinkView)}
                  className="w-full py-2.5 px-3.5 rounded-xl font-mono font-bold text-xs flex items-center justify-between gap-2 text-black transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)] cursor-pointer"
                  style={{
                    backgroundColor: selectedStage.color,
                    color: selectedStage.color === '#F59E0B' ? '#000000' : '#ffffff',
                  }}
                >
                  <span className="font-bold truncate">{selectedStage.systemLinkLabel}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <p className="text-[10px] font-sans text-slate-300 leading-snug">
                  {selectedStage.systemLinkDescription}
                </p>
              </div>
            )}

            {/* Live Holographic Feed Monitor */}
            {selectedStage.liveFeed && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2.5 relative overflow-hidden">
                {/* CRT Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-pulse" />

                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>LIVE ORBITAL FEED: {selectedStage.liveFeed.status}</span>
                  </span>
                  <span className="text-slate-400">{selectedStage.liveFeed.resolution}</span>
                </div>

                {/* Video Monitor Frame */}
                <div className="p-2.5 rounded-xl bg-[#040813] border border-white/10 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-1">
                    <span className="truncate text-cyan-300 font-bold">{selectedStage.liveFeed.headline}</span>
                    <span className="text-slate-500">{selectedStage.liveFeed.signalStrength}</span>
                  </div>

                  <div className="text-[9px] text-slate-400">
                    FREQ: {selectedStage.liveFeed.activeFrequency}
                  </div>

                  {/* Active Ticking Data Streams */}
                  <div className="space-y-1 pt-1 text-[10px] text-slate-200">
                    {selectedStage.liveFeed.liveDataStream.map((stream, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-1.5 ${
                          idx === feedStreamIndex % selectedStage.liveFeed!.liveDataStream.length
                            ? 'text-cyan-300 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="text-cyan-400">›</span>
                        <span className="font-sans text-[11px] leading-snug">{stream}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Voice Audio Briefing Player */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span>JARVIS AUDIO INTEL BRIEFING</span>
                </span>
                <span className="text-cyan-300">{isVoiceSpeaking ? 'PLAYING' : 'READY'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#060b17] border border-white/5 text-[11px] font-sans text-slate-300 italic leading-relaxed">
                "{selectedStage.voiceScript}"
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSpeakSelectedStage}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isVoiceSpeaking ? 'REPLAY AUDIO BRIEFING' : 'SPEAK INTEL BRIEFING'}</span>
                </button>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {selectedStage.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5">
                  <div className="text-[9px] text-slate-400 uppercase truncate">{m.label}</div>
                  <div className="text-xs font-bold text-cyan-300">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Active Domain Agents */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span>DOMAIN SPECIALIST AGENTS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStage.activeAgents.map((ag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-[10px] font-mono"
                  >
                    {ag}
                  </span>
                ))}
              </div>
            </div>

            {/* Real-Time Telemetry Event Stream */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                <span>STAGE EVENT LOGS</span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SYNCED</span>
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {selectedStage.telemetryLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-cyan-400 mt-0.5">›</span>
                    <span className="font-sans">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-3 border-t border-white/10 bg-black/60 flex items-center gap-2">
            <button
              onClick={() => onTriggerPulse(`Surge pulse on ${selectedStage.planetName}`)}
              className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRIGGER ORBITAL SURGE</span>
            </button>
            <button
              onClick={() => onSelectStage(null)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
            >
              Dismiss
            </button>
          </div>
        </aside>
      )}

      {/* Bottom Floating Live Event Stream Ticker */}
      <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-3">
        {/* Real-time Ticker */}
        <div className="flex-1 max-w-3xl flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl text-white pointer-events-auto shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 shrink-0 uppercase tracking-wider">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>SOVEREIGN STREAM:</span>
          </div>

          <div className="flex-1 overflow-hidden">
            {recentEvents.length > 0 ? (
              <div className="text-[11px] font-mono text-slate-200 truncate flex items-center gap-2 animate-in fade-in">
                <span className="text-slate-400">[{recentEvents[0].timestamp}]</span>
                <span className="font-bold text-cyan-300">{recentEvents[0].title}:</span>
                <span className="text-slate-300 font-sans">{recentEvents[0].detail}</span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-400 truncate">
                Monitoring continuous sovereign loop across 8 operational planets...
              </div>
            )}
          </div>
        </div>

        {/* Orbit Helper Tip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl text-[10px] font-mono text-slate-400 pointer-events-auto">
          <span>DRAG TO ROTATE</span>
          <span>•</span>
          <span>SCROLL TO ZOOM</span>
          <span>•</span>
          <span>CLICK PLANET FOR VOICE & INTEL</span>
        </div>
      </div>
    </>
  );
};
