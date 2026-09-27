import React, { ReactNode } from 'react';
import { Activity, ArrowUpRight, BrainCircuit, Database, ShieldCheck, Sparkles } from 'lucide-react';

type WorkspaceTone = 'cyan' | 'amber' | 'violet' | 'emerald' | 'blue';

interface OperationalWorkspaceProps {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  tone?: WorkspaceTone;
  status?: string;
  metrics?: Array<{ label: string; value: string | number }>;
  actions?: Array<{ label: string; onClick: () => void }>;
  children: ReactNode;
}

const tones: Record<WorkspaceTone, string> = {
  cyan: 'border-cyan-400/20 bg-cyan-400/[0.035] text-cyan-300',
  amber: 'border-amber-400/20 bg-amber-400/[0.035] text-amber-300',
  violet: 'border-violet-400/20 bg-violet-400/[0.035] text-violet-300',
  emerald: 'border-emerald-400/20 bg-emerald-400/[0.035] text-emerald-300',
  blue: 'border-blue-400/20 bg-blue-400/[0.035] text-blue-300',
};

export const OperationalWorkspace: React.FC<OperationalWorkspaceProps> = ({
  id, label, eyebrow, description, icon, tone = 'cyan', status = 'LIVE',
  metrics = [], actions = [], children,
}) => {
  const toneClass = tones[tone];

  return (
    <section className="min-h-[calc(100vh-150px)] overflow-hidden rounded-2xl border border-white/10 bg-[#05070b]/95 shadow-[0_24px_100px_rgba(0,0,0,.4)]">
      <header className="border-b border-white/10 bg-black/30 p-4 backdrop-blur-xl sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${toneClass}`}>{icon}</div>
            <div className="min-w-0">
              <div className="font-mono text-[9px] tracking-[0.24em] text-slate-500">{eyebrow}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white">{label}</h1>
                <span className={`rounded-full border px-2 py-0.5 font-mono text-[8px] ${toneClass}`}>● {status}</span>
              </div>
              <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-slate-400">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button key={action.label} onClick={action.onClick} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[9px] text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.05] hover:text-white">
                {action.label}<ArrowUpRight className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
        {metrics.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                <div className="font-mono text-[8px] tracking-widest text-slate-600">{metric.label}</div>
                <div className="mt-1 text-sm font-semibold text-slate-100">{metric.value}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 p-3 sm:p-5">{children}</div>
        <aside className="border-t border-white/10 bg-black/20 p-4 xl:border-l xl:border-t-0">
          <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-widest text-slate-500">
            <Activity className="h-3.5 w-3.5" /> WORKSPACE TELEMETRY
          </div>
          <div className="space-y-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-300"><BrainCircuit className="h-3.5 w-3.5 text-cyan-300" /> AI orchestration</div>
              <div className="mt-2 font-mono text-[8px] text-emerald-300">ONLINE</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-300"><Database className="h-3.5 w-3.5 text-cyan-300" /> Data context</div>
              <div className="mt-2 font-mono text-[8px] text-slate-500">SYNCHRONIZED</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-300"><ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> Policy gate</div>
              <div className="mt-2 font-mono text-[8px] text-amber-300">ENFORCED</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-300"><Sparkles className="h-3.5 w-3.5 text-violet-300" /> AI context</div>
              <div className="mt-2 font-mono text-[8px] text-slate-500">{id.toUpperCase()}</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
