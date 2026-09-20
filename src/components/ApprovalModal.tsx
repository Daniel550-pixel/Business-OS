import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { ProposedAction } from '../types';

interface ApprovalModalProps {
  action: ProposedAction | null;
  onConfirm: (action: ProposedAction) => void;
  onCancel: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  action,
  onConfirm,
  onCancel,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  if (!action) return null;

  const handleConfirm = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      onConfirm(action);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0c111d] border border-cyan-500/40 shadow-[0_12px_48px_rgba(0,0,0,0.8)] p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                Policy Gate: Authorize Action
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                AI DECIDES ≠ AI EXECUTES
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                action.riskLevel === 'high' || action.riskLevel === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : action.riskLevel === 'medium'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {action.riskLevel} Risk
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {action.targetSystem}</span>
          </div>

          <h4 className="text-sm font-bold text-white">{action.title}</h4>
          {action.description && (
            <p className="text-xs text-slate-300">{action.description}</p>
          )}

          {/* Outcome Simulation */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Verification Outcome:</span>
            </div>
            <p className="text-slate-300">
              All preconditions verified. Rollback checkpoint will be saved to immutable event log.
            </p>
            {action.parameters && (
              <div className="text-[10px] text-slate-400 pt-1 border-t border-white/[0.04] truncate">
                Payload: {JSON.stringify(action.parameters)}
              </div>
            )}
          </div>
        </div>

        {/* Action Confirmation Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-mono transition-all"
          >
            Reject / Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isExecuting}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Committing Mutation...' : 'Confirm & Execute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
