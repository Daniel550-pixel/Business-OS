import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  Server,
  Code2,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { WorldNode } from '../types';

interface BusinessWorldProps {
  nodes: WorldNode[];
  selectedNode: WorldNode | null;
  onSelectNode: (node: WorldNode) => void;
  highlightedNodeIds?: string[];
  onQuickInspectNode?: (nodeId: string) => void;
}

export const BusinessWorld: React.FC<BusinessWorldProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  highlightedNodeIds = [],
  onQuickInspectNode,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<WorldNode | null>(null);

  // SVG coordinate bounds
  const svgWidth = 1000;
  const svgHeight = 600;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeIcon = (type: WorldNode['type']) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'customers':
        return <Users className="w-5 h-5" />;
      case 'sales':
        return <TrendingUp className="w-5 h-5" />;
      case 'finance':
        return <DollarSign className="w-5 h-5" />;
      case 'operations':
        return <Server className="w-5 h-5" />;
      case 'projects':
        return <Code2 className="w-5 h-5" />;
      case 'agents':
        return <Cpu className="w-5 h-5" />;
      case 'systems':
        return <Layers className="w-5 h-5" />;
    }
  };

  // Collect unique connections between nodes
  const connectionPairs: { source: WorldNode; target: WorldNode; key: string }[] = [];
  const seenPairs = new Set<string>();

  nodes.forEach((source) => {
    source.connections.forEach((targetId) => {
      const target = nodes.find((n) => n.id === targetId);
      if (target) {
        const pairKey = [source.id, target.id].sort().join('--');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          connectionPairs.push({ source, target, key: pairKey });
        }
      }
    });
  });

  const filteredNodes = nodes.filter((node) => {
    if (filterType === 'all') return true;
    if (filterType === 'attention') return node.status === 'critical' || node.status === 'warning';
    return node.type === filterType;
  });

  return (
    <div className="relative w-full h-[620px] rounded-xl bg-[#06090e] border border-white/[0.08] overflow-hidden flex flex-col select-none shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
      {/* Top Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#0b0f19]/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 text-cyan-400 font-mono font-semibold">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '24s' }} />
            <span>BUSINESS WORLD MODEL</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'attention', label: 'Needs Attention (3)' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'sales', label: 'Sales' },
              { id: 'operations', label: 'Operations' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                  filterType === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Zoom & Reset controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0b0f19]/80 backdrop-blur-md p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08]"
            title="Zoom in"
          >
            +
          </button>
          <span className="text-[10px] text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08]"
            title="Zoom out"
          >
            -
          </button>
          <div className="h-3 w-px bg-white/10" />
          <button
            onClick={resetView}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.08]"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle Spatial Coordinate Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Ambient gradients & filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Connecting Neural / Data Flow Edges */}
          {connectionPairs.map(({ source, target, key }) => {
            const isHighlighted =
              (selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id)) ||
              (hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id)) ||
              (highlightedNodeIds.includes(source.id) && highlightedNodeIds.includes(target.id));

            return (
              <g key={key}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? '#06b6d4' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? '4 2' : undefined}
                  className={isHighlighted ? 'transition-all duration-300' : ''}
                />
                {/* Animated data packet traveling between connected business domains */}
                {isHighlighted && (
                  <circle r={3} fill="#22d3ee">
                    <animateMotion
                      path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                      dur="3.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Interactive World Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHighlighted = highlightedNodeIds.includes(node.id);
            const isAttention = node.status === 'critical' || node.status === 'warning';

            let ringColor = 'border-white/10';
            let statusColor = '#06b6d4';
            if (node.status === 'critical') statusColor = '#f43f5e';
            else if (node.status === 'warning') statusColor = '#f59e0b';
            else if (node.status === 'optimal') statusColor = '#10b981';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer Pulse Wave for attention / selected */}
                {(isSelected || isAttention || isHighlighted) && (
                  <circle
                    r={isSelected ? 44 : 38}
                    fill="none"
                    stroke={statusColor}
                    strokeOpacity={0.4}
                    strokeWidth={1.5}
                    className="animate-ping"
                    style={{ animationDuration: node.status === 'critical' ? '1.8s' : '3s' }}
                  />
                )}

                {/* Node Outer Base */}
                <circle
                  r={isSelected ? 36 : 30}
                  fill="#0b0f19"
                  stroke={isSelected ? '#06b6d4' : statusColor}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={isSelected || isAttention ? (node.status === 'critical' ? 'url(#glow-rose)' : 'url(#glow-cyan)') : undefined}
                />

                {/* Node Icon */}
                <foreignObject
                  x={-14}
                  y={-14}
                  width={28}
                  height={28}
                  className="pointer-events-none flex items-center justify-center text-slate-200"
                >
                  <div className="w-full h-full flex items-center justify-center" style={{ color: statusColor }}>
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>

                {/* Status Indicator Dot */}
                <circle
                  cx={18}
                  cy={-18}
                  r={5}
                  fill={statusColor}
                  stroke="#06090e"
                  strokeWidth={1.5}
                />

                {/* Text Label & Key Metric */}
                <text
                  y={46}
                  textAnchor="middle"
                  className="text-[12px] font-semibold fill-slate-100 tracking-wide select-none"
                >
                  {node.label}
                </text>
                <text
                  y={60}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-cyan-400/90 font-medium select-none"
                >
                  {node.metric}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inline Contextual Node Inspector Drawer (Embedded so user never leaves context!) */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 right-3 z-30 p-4 rounded-xl bg-[#0c111d]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedNode.label}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                    selectedNode.status === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedNode.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedNode.status}
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-bold">{selectedNode.metric}</span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">({selectedNode.subMetric})</span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">{selectedNode.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400">
                <span>Owner: <strong className="text-slate-200">{selectedNode.details.ownerAgent}</strong></span>
                <span>•</span>
                <span>Risk: <strong className={selectedNode.details.riskScore > 40 ? 'text-rose-400' : 'text-slate-200'}>{selectedNode.details.riskScore}/100</strong></span>
              </div>

              {onQuickInspectNode && (
                <button
                  onClick={() => onQuickInspectNode(selectedNode.id)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <span>Drill into Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Key Drivers Pill Row */}
          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-500 uppercase text-[10px]">Drivers:</span>
            {selectedNode.details.keyDrivers.map((driver, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                {driver}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
