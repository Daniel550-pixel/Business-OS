import React from 'react';
import {
  History,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Play,
  Layers,
} from 'lucide-react';
import { TemporalEpoch } from '../types';
import { initialTemporalSnapshots } from '../data/digitalTwinData';

interface TemporalTimelineProps {
  currentEpoch: TemporalEpoch;
  onEpochChange: (epoch: TemporalEpoch) => void;
  onOpenScenarioModeling: () => void;
}

export const TemporalTimeline: React.FC<TemporalTimelineProps> = ({
  currentEpoch,
  onEpochChange,
  onOpenScenarioModeling,
}) => {
  const epochs: { id: TemporalEpoch; label: string; isFuture?: boolean }[] = [
    { id: 'JAN', label: 'Jan' },
    { id: 'FEB', label: 'Feb' },
    { id: 'MAR', label: 'Mar' },
    { id: 'APR', label: 'Apr' },
    { id: 'MAY', label: 'May' },
    { id: 'JUN', label: 'Jun' },
    { id: 'NOW', label: 'NOW' },
    { id: 'SIM_3M', label: '+3M (SIM)', isFuture: true },
    { id: 'SIM_6M', label: '+6M (SIM)', isFuture: true },
  ];

  const currentIndex = epochs.findIndex((e) => e.id === currentEpoch);
  const currentSnapshot = initialTemporalSnapshots[currentEpoch];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onEpochChange(epochs[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < epochs.length - 1) {
      onEpochChange(epochs[currentIndex + 1].id);
    }
  };

  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#0A0C10]/95 backdrop-blur-xl border-t border-white/[0.07] px-4 py-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
      <div className="w-full max-w-none flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Temporal State Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold">
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Temporal Navigation:</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase ${
                currentSnapshot.simulationNotice
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : currentEpoch === 'NOW'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.06] text-slate-300 border border-white/10'
              }`}
            >
              {currentEpoch}
            </span>

            <span className="text-white font-bold">{currentSnapshot.arr}</span>
            <span className="text-slate-500 hidden lg:inline">•</span>
            <span className="text-slate-400 hidden lg:inline">{currentSnapshot.runway} runway</span>
            <span className="text-slate-500 hidden xl:inline">•</span>
            <span className="text-slate-400 hidden xl:inline">{currentSnapshot.customers} accounts</span>
          </div>
        </div>

        {/* Center: Interactive Scrubber Track */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar justify-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/[0.06]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/[0.06]">
            {epochs.map((epoch) => {
              const isSelected = currentEpoch === epoch.id;
              return (
                <button
                  key={epoch.id}
                  onClick={() => onEpochChange(epoch.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all relative ${
                    isSelected
                      ? epoch.isFuture
                        ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : epoch.isFuture
                      ? 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{epoch.label}</span>
                  {isSelected && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === epochs.length - 1}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/[0.06]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Simulation / Scenario Modeling Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {currentSnapshot.simulationNotice && (
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 hidden lg:inline">
              SIMULATION (NOT FACT)
            </span>
          )}

          <button
            onClick={onOpenScenarioModeling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold transition-all shadow-[0_0_16px_rgba(168,85,247,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Scenario Models</span>
          </button>
        </div>
      </div>
    </div>
  );
};
