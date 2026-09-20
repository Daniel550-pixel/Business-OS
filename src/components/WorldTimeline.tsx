import React from 'react';
import { Clock3, FastForward, Pause, Play, Rewind } from 'lucide-react';

interface WorldTimelineProps { value: number; onChange: (value: number) => void; playing: boolean; onPlayingChange: (value: boolean) => void; }

export const WorldTimeline: React.FC<WorldTimelineProps> = ({ value, onChange, playing, onPlayingChange }) => {
  const labels = ['24h ago','12h ago','6h ago','Now','+6h'];
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[min(520px,calc(100%-24px))] rounded-xl border border-white/10 bg-[#090d15]/90 backdrop-blur-xl px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2">
        <Clock3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <button onClick={() => onPlayingChange(false)} className="p-1 text-slate-500 hover:text-white"><Rewind className="w-3 h-3" /></button>
        <input aria-label="Business timeline" type="range" min="0" max="4" step="1" value={value} onChange={e => onChange(Number(e.target.value))} className="flex-1 accent-cyan-400" />
        <button onClick={() => onPlayingChange(!playing)} className="p-1 text-slate-300 hover:text-white">{playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}</button>
        <button onClick={() => onChange(Math.min(4, value + 1))} className="p-1 text-slate-500 hover:text-white"><FastForward className="w-3 h-3" /></button>
        <span className="w-12 text-right text-[9px] font-mono text-cyan-300">{labels[value]}</span>
      </div>
    </div>
  );
};
