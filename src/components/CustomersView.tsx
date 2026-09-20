import React, { useState } from 'react';
import {
  Users,
  Building,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCircle2,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { ProposedAction } from '../types';

interface CustomersViewProps {
  onExecuteAction: (action: ProposedAction) => void;
}

interface Account {
  id: string;
  name: string;
  arr: string;
  tier: 'Enterprise' | 'Mid-Market' | 'Growth';
  healthScore: number;
  seats: string;
  seatDelta: string;
  nrr: string;
  lastActive: string;
  anomaly?: string;
  actionProposal?: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onExecuteAction }) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const accounts: Account[] = [
    {
      id: 'acc_1',
      name: 'Global Freight Networks',
      arr: '$180,000',
      tier: 'Enterprise',
      healthScore: 44,
      seats: '58 / 85',
      seatDelta: '-31.7% contraction',
      nrr: '84%',
      lastActive: '4 hours ago',
      anomaly: 'Seat utilization fell from 85 to 58 active seats over past 14 days following client VP transition.',
      actionProposal: 'Schedule Customer Success executive check-in and automated seat reactivation audit.',
    },
    {
      id: 'acc_2',
      name: 'OmniFin Capital Management',
      arr: '$240,000',
      tier: 'Enterprise',
      healthScore: 98,
      seats: '140 / 140',
      seatDelta: '+40% expansion ready',
      nrr: '142%',
      lastActive: '12 mins ago',
      anomaly: undefined,
      actionProposal: 'Propose Enterprise Tier 2 license upgrade for 50 additional analytical seats.',
    },
    {
      id: 'acc_3',
      name: 'Apex Robotics Labs',
      arr: '$95,000',
      tier: 'Mid-Market',
      healthScore: 68,
      seats: '42 / 50',
      seatDelta: 'Flat',
      nrr: '102%',
      lastActive: '1 day ago',
      anomaly: 'Single-sign-on integration misconfiguration causing 8 developer login failures.',
      actionProposal: 'Dispatch Customer Agent SAML SSO self-healing diagnosis webhook.',
    },
    {
      id: 'acc_4',
      name: 'BioGenomics Cloud',
      arr: '$120,000',
      tier: 'Enterprise',
      healthScore: 91,
      seats: '90 / 100',
      seatDelta: '+12%',
      nrr: '128%',
      lastActive: '35 mins ago',
    },
  ];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = acc.name.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === 'all' || acc.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleIntervene = (acc: Account) => {
    const action: ProposedAction = {
      id: `act_cust_${Date.now()}`,
      title: `Dispatch Customer Retention Protocol to ${acc.name}`,
      riskLevel: 'low',
      targetSystem: 'Zendesk, Slack & Outreach CRM',
      requiresApproval: true,
      status: 'PROPOSED',
      parameters: {
        account: acc.name,
        healthScore: acc.healthScore,
        arr: acc.arr,
        intervention: acc.actionProposal,
      },
    };
    onExecuteAction(action);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Customers Horizon Header */}
      <div className="p-4 lg:p-5 rounded-xl os-glass-strong os-cyber-corners border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] os-mono tracking-widest text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50 uppercase">
                CUSTOMER RETENTION & EXPANSION
              </span>
              <span className="text-xs os-mono text-slate-400">• Net Retention Rate: 118.2%</span>
            </div>
            <h2 className="text-2xl font-bold text-white os-mono">1,428 Active Organizations · 88 Enterprise Tier</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Average account health score is 87/100. 1 enterprise account (Global Freight Networks) shows severe seat contraction risk requiring immediate retention intervention.
            </p>
          </div>

          <div className="flex items-center gap-2 os-mono text-xs">
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Gross Logo Churn</div>
              <div className="text-sm font-bold text-emerald-400">0.42%/mo (Benchmark)</div>
            </div>
            <div className="p-3 rounded-lg os-surface text-right">
              <div className="text-[10px] text-slate-400 uppercase">Expansion Pipeline</div>
              <div className="text-sm font-bold text-cyan-300">+$1.8M ARR Potential</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Directory & Anomaly Interceptor */}
      <div className="p-4 lg:p-5 rounded-xl os-glass space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase os-mono tracking-wider">
              Account Health Telemetry & Churn Interceptor
            </h3>
          </div>

          {/* Search & Tier Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accounts..."
                className="pl-7 pr-3 py-1 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 os-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            </div>

            <div className="flex items-center gap-1.5 os-mono text-xs">
              {['all', 'Enterprise', 'Mid-Market'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                    tierFilter === tier
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:text-white bg-black/30 border border-white/[0.06]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAccounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-4 rounded-lg os-surface os-interactive space-y-3 ${
                acc.healthScore < 60
                  ? 'border-rose-500/40 bg-rose-950/15'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{acc.name}</span>
                    <span className="text-[10px] os-mono px-2 py-0.2 rounded bg-white/[0.05] text-slate-300 border border-white/10">
                      {acc.tier}
                    </span>
                    <span className="text-xs os-mono font-bold text-cyan-300">{acc.arr} ARR</span>
                  </div>
                  <div className="text-[11px] os-mono text-slate-400">
                    Seats: <strong className="text-slate-200">{acc.seats}</strong> ({acc.seatDelta}) • NRR: {acc.nrr} • Active: {acc.lastActive}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right os-mono text-xs">
                    <div
                      className={`font-bold ${
                        acc.healthScore < 60
                          ? 'text-rose-400'
                          : acc.healthScore < 80
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {acc.healthScore}/100
                    </div>
                    <div className="text-[10px] text-slate-500">Health Score</div>
                  </div>

                  {acc.actionProposal && (
                    <button
                      onClick={() => handleIntervene(acc)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)] os-mono"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Execute Retention Protocol</span>
                    </button>
                  )}
                </div>
              </div>

              {acc.anomaly && (
                <div className="p-3 rounded-lg bg-black/60 border border-rose-500/30 text-xs os-mono text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Customer Risk Detected:</span>
                  </div>
                  <p className="text-slate-300">{acc.anomaly}</p>
                  {acc.actionProposal && (
                    <p className="text-cyan-300 pt-1">› Proposed Intervention: {acc.actionProposal}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
