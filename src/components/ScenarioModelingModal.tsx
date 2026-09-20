import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { ScenarioModel } from '../types';
import { initialScenarioModels } from '../data/digitalTwinData';

interface ScenarioModelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: ScenarioModel) => void;
}

export const ScenarioModelingModal: React.FC<ScenarioModelingModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario_a');

  if (!isOpen) return null;

  const selectedScenario =
    initialScenarioModels.find((s) => s.id === selectedScenarioId) ||
    initialScenarioModels[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl bg-[#0a0d16] border border-purple-500/40 shadow-[0_16px_50px_rgba(0,0,0,0.9)] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-500/20 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-bold">
                Future Computational Scenario Engine
              </span>
            </div>
            <h3 className="text-lg font-bold text-white font-mono">
              Computational Future Scenario Modeling
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invariant Warning Banner */}
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3 text-xs font-mono text-purple-300">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>ARCHITECTURAL INVARIANT:</strong> Simulations and projections are mathematical scenario models based on current business state variables, never empirical facts.
          </span>
        </div>

        {/* 3 Scenario Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {initialScenarioModels.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      sc.type === 'baseline'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : sc.type === 'aggressive'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {sc.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{sc.confidence}% Conf.</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{sc.name}</h4>

                <div className="pt-2 flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-white">{sc.projectedArr}</span>
                  <span
                    className={`text-xs font-bold ${
                      sc.arrGrowth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {sc.arrGrowth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Scenario Deep Dive */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Active Model: </span>
              <span className="text-white font-bold text-sm">{selectedScenario.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                Runway: <strong className="text-white">{selectedScenario.projectedRunway}</strong>
              </span>
              <span className="text-slate-400">
                Confidence: <strong className="text-purple-400">{selectedScenario.confidence}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Key Assumptions */}
            <div className="space-y-2">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                Key Assumptions
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedScenario.keyAssumptions.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Decisions */}
            <div className="space-y-2">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                Required Decisions
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedScenario.requiredDecisions.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                Identified Risk Factors
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedScenario.riskFactors.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <div className="text-[11px] font-mono text-slate-500">
            Engine: Gemini Multi-Scenario Simulation & Sensitivity Matrix
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onApplyScenario(selectedScenario);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-[0_0_16px_rgba(168,85,247,0.3)] transition-all"
            >
              <span>Project Scenario into World Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
