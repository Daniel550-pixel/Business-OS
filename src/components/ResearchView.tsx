import React from 'react';
import {
  Search,
  BookOpen,
  TrendingUp,
  Globe,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  const researchBriefs = [
    {
      id: 'res_1',
      title: 'UAE & MENA Sovereign AI Infrastructure Mandates (2026-2028)',
      author: 'Research Agent',
      domain: 'Geopolitical & Regulatory',
      confidence: 96,
      summary:
        'New sovereign data storage regulations in Abu Dhabi and Dubai require all government and tier-1 enterprise telemetry to reside on in-country hardware clusters. Our me-central-1 cluster gives us an 18-month competitive advantage over US-only vendors.',
      tags: ['Sovereign AI', 'UAE Compliance', 'Enterprise Moat'],
      date: 'Today, 07:15 UTC',
    },
    {
      id: 'res_2',
      title: 'Competitor Pricing Shift: Unbundling Token Ingestion vs. Agent Seats',
      author: 'Research Agent',
      domain: 'Competitive Benchmarking',
      confidence: 91,
      summary:
        'Major competitive platforms have begun charging $0.08 per 1,000 tool execution calls rather than per-seat pricing. Our unified platform model saves customers an estimated 38% at scale, creating a potent displacement angle for enterprise sales.',
      tags: ['Pricing Strategy', 'Sales Enablement', 'Market Displacement'],
      date: 'Yesterday',
    },
    {
      id: 'res_3',
      title: 'Model Distillation & On-Device Small Language Model Efficiency',
      author: 'Research Agent',
      domain: 'Core AI Technology',
      confidence: 88,
      summary:
        'Fine-tuning 8B parameter specialized domain models for revenue and operations auditing achieves 98.4% parity with frontier 70B models while slashing inference COGS by 82%.',
      tags: ['Cost Efficiency', 'Inference Latency', 'COGS Reduction'],
      date: '3 days ago',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Horizon Header */}
      <div className="p-4 lg:p-5 rounded-xl os-glass-strong os-cyber-corners border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] os-mono tracking-widest text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/50 uppercase">
                RESEARCH & STRATEGIC INTELLIGENCE
              </span>
              <span className="text-xs os-mono text-slate-400">• Autonomous Market Horizon Scan</span>
            </div>
            <h2 className="text-2xl font-bold text-white os-mono">Market Radar, Competitive Moats & Sovereign Policy</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Continuous monitoring of competitor API pricing, sovereign data sovereignty directives, and AI cost optimization breakthroughs.
            </p>
          </div>

          <div className="flex items-center gap-2 os-mono text-xs">
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Tracked Competitors</div>
              <div className="text-sm font-bold text-cyan-300">14 Active</div>
            </div>
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Synthesis Accuracy</div>
              <div className="text-sm font-bold text-emerald-400">94.8% Grounded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Briefs Matrix */}
      <div className="p-4 lg:p-5 rounded-xl os-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase os-mono tracking-wider">
              Autonomous Intelligence Briefs
            </h3>
          </div>
          <span className="text-[11px] os-mono text-slate-400">Continuous radar scan</span>
        </div>

        <div className="space-y-3">
          {researchBriefs.map((brief) => (
            <div
              key={brief.id}
              className="p-4 rounded-lg os-surface os-interactive space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] os-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-semibold">
                    {brief.domain}
                  </span>
                  <span className="text-xs os-mono text-slate-400">{brief.date}</span>
                </div>
                <div className="text-[11px] os-mono text-slate-400">
                  Confidence: <span className="text-cyan-300 font-bold">{brief.confidence}%</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white">{brief.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{brief.summary}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {brief.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] os-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
