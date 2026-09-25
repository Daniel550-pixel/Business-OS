export interface LivePlanetFeed {
  status: 'LIVE' | 'ENCRYPTED' | 'STANDBY';
  feedType: string;
  resolution: string;
  signalStrength: string;
  headline: string;
  liveDataStream: string[];
  activeFrequency: string;
}

export interface FlowStageNode {
  id: string;
  name: string;
  shortName: string;
  planetName: string;
  phase: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  color: string;
  accentColor: string;
  atmosphereColor: string;
  glyph: 'globe' | 'sensor' | 'lattice' | 'swarm' | 'sandbox' | 'prism' | 'ledger' | 'loop';
  status: 'optimal' | 'active' | 'warning' | 'verified';
  throughput: string;
  latency: string;
  activeAgents: string[];
  metrics: { label: string; value: string }[];
  telemetryLogs: string[];
  // Planetary properties
  radius: number;
  rotationSpeed: number;
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringColor?: string;
  ringSecondaryColor?: string;
  textureType:
    | 'uae-twin'
    | 'sensor-ingest'
    | 'causal-nexus'
    | 'agent-swarm'
    | 'simulation-horizon'
    | 'policy-gate'
    | 'actuation-forge'
    | 'telemetry-echo';
  // Deep navigation links into the system
  systemLinkView: string;
  systemLinkLabel: string;
  systemLinkDescription: string;
  // Voice engine briefing
  voiceScript: string;
  // Live simulated visual feed
  liveFeed: LivePlanetFeed;
}

export interface LiveDataPacket {
  id: string;
  sourceStageIndex: number;
  progress: number; // 0 to 1 along current segment
  type: 'telemetry' | 'causal_graph' | 'agent_thought' | 'simulation_vector' | 'policy_proof' | 'execution_tx';
  payload: string;
  color: string;
  speed: number;
}

export interface SimulatedSystemEvent {
  id: string;
  timestamp: string;
  stageId: string;
  title: string;
  detail: string;
  severity: 'info' | 'active' | 'warning' | 'success';
}

export const INITIAL_FLOW_STAGES: FlowStageNode[] = [
  {
    id: 'uae-world-model',
    name: 'UAE World Model (Digital Twin)',
    shortName: 'UAE Twin',
    planetName: 'Planet Terra-Emirates',
    phase: 'GROUND TRUTH',
    subtitle: 'Canonical Digital Representation of UAE',
    description:
      'Continuous geospatial twin synchronizing physical reality across all 7 Emirates: ports (Jebel Ali, Khalifa), airports (DXB, DWC), energy grids (Barakah, Shams), transport (Etihad Rail), and 1,482 spatial entities.',
    position: [-20, 2, -6],
    color: '#00F0FF',
    accentColor: '#D4AF37',
    atmosphereColor: '#0284c7',
    glyph: 'globe',
    status: 'optimal',
    throughput: '42.8 GB/s',
    latency: '4ms',
    activeAgents: ['Geospatial Agent', 'Infrastructure Agent'],
    metrics: [
      { label: 'Twin Nodes', value: '1,482' },
      { label: 'Spatial Resolution', value: 'L1-L5 High' },
      { label: 'State Freshness', value: '99.98%' },
    ],
    telemetryLogs: [
      'L5 Plot #8819 Dubai South: Foundation depth verified',
      'Jebel Ali Terminal 2: Berth 14 turnaround 84.2min',
      'Barakah Unit 3: Base load steady at 1,400MW',
    ],
    radius: 2.7,
    rotationSpeed: 0.008,
    hasRings: true,
    ringInner: 3.3,
    ringOuter: 4.6,
    ringColor: '#00f0ff',
    ringSecondaryColor: '#ffd700',
    textureType: 'uae-twin',
    systemLinkView: 'business-world',
    systemLinkLabel: 'Open UAE World Model (L1-L5)',
    systemLinkDescription: 'Enter the hierarchical 3D digital twin exploring plots, ports, and grids.',
    voiceScript:
      'Approaching Planet Terra-Emirates. Live UAE sovereign digital twin synchronized across all seven Emirates. 1,482 active spatial entities verified.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'ORBITAL HIGH-RES SAR',
      resolution: '4K ULTRA-SPATIAL',
      signalStrength: '99.8% dBm',
      headline: 'Dubai South & Jebel Ali Optical Telemetry',
      activeFrequency: '1420.405 MHz (Sovereign)',
      liveDataStream: [
        'SAR SATELLITE PASS: AL DHAFRA SOLAR CORRIDOR NOMINAL',
        'JEBEL ALI BERTH 14: CONTAINER CRANE AUTOMATION 100%',
        'ETIHAD RAIL LINK: SECTION 4 FREIGHT TRAFFIC ACTIVE',
      ],
    },
  },
  {
    id: 'see-ingest',
    name: 'Multimodal Ingestion (See)',
    shortName: 'See / Ingest',
    planetName: 'Planet Chronos',
    phase: 'PERCEPTION INGEST',
    subtitle: 'Real-time Cross-Modality Stream Pipeline',
    description:
      'Continuous sensor ingest fusing radar SAR satellite passes, AIS maritime vessel beacons, customs manifest feeds, IoT grid sensors, financial transaction streams, and air-gapped sovereign connectors.',
    position: [-13, 8, 2],
    color: '#38BDF8',
    accentColor: '#60A5FA',
    atmosphereColor: '#0369a1',
    glyph: 'sensor',
    status: 'active',
    throughput: '89.4k ev/s',
    latency: '8ms',
    activeAgents: ['Perception Engine', 'Sensor Fusion Agent'],
    metrics: [
      { label: 'Ingest Streams', value: '34 Feeds' },
      { label: 'Packet Drop Rate', value: '0.0001%' },
      { label: 'Multimodal Modes', value: '8 Types' },
    ],
    telemetryLogs: [
      'AIS Maritime beacon: 84 vessels tracked in Strait of Hormuz',
      'Sentinel-2 SAR pass: Surface moisture delta mapped in Al Dhafra',
      'FinStream: 12.4k EMEA payment vectors processed',
    ],
    radius: 1.9,
    rotationSpeed: 0.012,
    hasRings: false,
    textureType: 'sensor-ingest',
    systemLinkView: 'cyber-hud',
    systemLinkLabel: 'Open Cyber HUD Ingest Deck',
    systemLinkDescription: 'Access real-time sensor radar sweeps and cross-modality signals.',
    voiceScript:
      'Arriving at Planet Chronos. Multimodal radar SAR, maritime AIS beacons, and sovereign data feeds are ingesting at eighty-nine thousand events per second.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'CROSS-MODAL SENSOR INGEST',
      resolution: 'SUB-SECOND 60FPS',
      signalStrength: '98.9% dBm',
      headline: 'Maritime AIS & Customs Ingress Stream',
      activeFrequency: '850.120 MHz (Encrypted)',
      liveDataStream: [
        'AIS BEACONS: 84 VESSELS TRACKED IN STRAIT OF HORMUZ',
        'CUSTOMS MANIFEST: 4,120 CARGO CONTAINERS PARSED',
        'EMEA FIN-STREAM: ZERO DELAY IN PAYMENTS CLEARED',
      ],
    },
  },
  {
    id: 'understand-perception',
    name: 'Causal Synthesis (Understand)',
    shortName: 'Understand',
    planetName: 'Planet Nexus',
    phase: 'SEMANTIC REASONING',
    subtitle: 'Graph Correlation & Anomaly Extraction',
    description:
      'Converts raw multi-stream signals into high-dimensional semantic entities. Detects causal dependencies, cross-entity friction, supply chain bottlenecks, and early-warning divergence signals.',
    position: [-2, 12, 6],
    color: '#818CF8',
    accentColor: '#A78BFA',
    atmosphereColor: '#4f46e5',
    glyph: 'lattice',
    status: 'active',
    throughput: '14.2k graphs/s',
    latency: '14ms',
    activeAgents: ['Causal Graph Agent', 'Signal Synthesizer'],
    metrics: [
      { label: 'Active Graphs', value: '3,840' },
      { label: 'Anomaly Threshold', value: 'σ > 2.4' },
      { label: 'Causal Confidence', value: '98.4%' },
    ],
    telemetryLogs: [
      'Causal correlation: Red Sea vessel rerouting -> EMEA hardware lead time +18d',
      'Cross-impact: FRA-01 cloud egress latency aligned with EU fiber maintenance',
      'Divergence alert: High-value procurement approvals lagging sales target',
    ],
    radius: 2.1,
    rotationSpeed: 0.009,
    hasRings: false,
    textureType: 'causal-nexus',
    systemLinkView: 'command-center',
    systemLinkLabel: 'Open Causal Synthesis & Anomalies',
    systemLinkDescription: 'Explore the anomaly matrix and causal entity dependencies.',
    voiceScript:
      'Entering orbit around Planet Nexus. High-dimensional causal graphs active. Anomaly extraction confidence at ninety-eight point four percent.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'NEURAL GRAPH SYNTHESIS',
      resolution: 'TOPOLOGICAL VECTOR',
      signalStrength: '97.4% dBm',
      headline: 'Causal Dependency Graph Correlation',
      activeFrequency: '12.4 GHz (Synaptic)',
      liveDataStream: [
        'CAUSAL LINK: RED SEA ROUTING -> EMEA LEAD TIME +18D',
        'ANOMALY DETECTED: LATENCY SPIKE FRA-01 RESOLVED',
        'GRAPH CORRELATION: ZERO CONTRADICTIONS FOUND',
      ],
    },
  },
  {
    id: 'reason-cognition',
    name: 'Autonomous Agent Swarm (Reason)',
    shortName: 'Reason Swarm',
    planetName: 'Planet Hive',
    phase: 'COLLECTIVE INTELLIGENCE',
    subtitle: 'Multi-Agent Consensus & Specialized Reasoning',
    description:
      'The core cognitive engine running 8 specialized domain workers: FinSight, GSCIE Logistics, Spatial Intel, Architecture, Sovereign Security, and Economics executing synchronous multi-perspective reasoning.',
    position: [9, 10, 4],
    color: '#A855F7',
    accentColor: '#C084FC',
    atmosphereColor: '#9333ea',
    glyph: 'swarm',
    status: 'active',
    throughput: '1,280 tok/s',
    latency: '22ms',
    activeAgents: ['FinSight Agent', 'GSCIE Agent', 'Security Agent', 'Economics Agent'],
    metrics: [
      { label: 'Active Specialists', value: '8 Agents' },
      { label: 'Consensus Rate', value: '99.2%' },
      { label: 'Reasoning Depth', value: 'Tier-4 Causal' },
    ],
    telemetryLogs: [
      'FinSight: Projecting €4.2M working capital optimization',
      'GSCIE Logistics: Proposing multi-modal routing via Khalifa Port rail link',
      'Security: Enclave isolation verified across all agent memory spaces',
    ],
    radius: 2.8,
    rotationSpeed: 0.007,
    hasRings: true,
    ringInner: 3.5,
    ringOuter: 5.0,
    ringColor: '#a855f7',
    ringSecondaryColor: '#ec4899',
    textureType: 'agent-swarm',
    systemLinkView: 'agents',
    systemLinkLabel: 'Open Autonomous Agent Swarm',
    systemLinkDescription: 'Inspect all 8 domain agent workers, current tools, and memory logs.',
    voiceScript:
      'Approaching Planet Hive, sovereign seat of the Autonomous Agent Swarm. Eight specialized domain agents operating at ninety-nine point two percent consensus.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'SWARM COGNITIVE THOUGHT STREAM',
      resolution: 'SUB-TOKEN TRACE',
      signalStrength: '99.4% dBm',
      headline: 'Multi-Agent Synchronous Consensus',
      activeFrequency: '5.8 GHz (Swarm Mesh)',
      liveDataStream: [
        'FINSIGHT AGENT: OPTIMIZING WORKING CAPITAL VECTORS',
        'GSCIE AGENT: KHALIFA PORT RAIL SCHEDULING ALIGNED',
        'SECURITY AGENT: MEMORY ENCLAVE PROOFS VALIDATED',
      ],
    },
  },
  {
    id: 'simulate-predict',
    name: 'Scenario Sandbox (Simulate & Predict)',
    shortName: 'Simulate',
    planetName: 'Planet Horizon',
    phase: 'HYPOTHESIS SANDBOX',
    subtitle: 'Monte Carlo Stress Testing & 2035 Horizon',
    description:
      'Generates and evaluates branching futures across macro-economic, geopolitical, supply chain, and climate vectors before any real-world decision is authorized. Clearly labels assumptions vs projections.',
    position: [19, 4, -4],
    color: '#EC4899',
    accentColor: '#F472B6',
    atmosphereColor: '#db2777',
    glyph: 'sandbox',
    status: 'optimal',
    throughput: '64 scenarios/m',
    latency: '48ms',
    activeAgents: ['Simulation Engine', 'Trajectory Predictor'],
    metrics: [
      { label: 'Scenarios Evaluated', value: '412 runs' },
      { label: 'Horizon Bounds', value: '2026-2035' },
      { label: 'Risk Variance', value: '±1.8%' },
    ],
    telemetryLogs: [
      'Scenario S-2035: Solar-hydrogen grid integration stress test: PASSED (98.6%)',
      'Scenario M-04: Port congestion spike simulated under 30% sudden cargo surge',
      'Monte Carlo: Buffer allocation delta reduces stockout probability to 0.4%',
    ],
    radius: 3.2,
    rotationSpeed: 0.005,
    hasRings: true,
    ringInner: 4.0,
    ringOuter: 5.6,
    ringColor: '#ec4899',
    ringSecondaryColor: '#f43f5e',
    textureType: 'simulation-horizon',
    systemLinkView: 'missions',
    systemLinkLabel: 'Open 2035 Horizon Scenarios & Missions',
    systemLinkDescription: 'Review simulated scenario branches, confidence intervals, and active missions.',
    voiceScript:
      'Entering the gravity well of Planet Horizon. Monte Carlo projections actively testing twenty-twenty-six to twenty-thirty-five macroeconomic scenarios.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'MONTE CARLO PROJECTION MATRIX',
      resolution: 'MULTI-HORIZON',
      signalStrength: '96.8% dBm',
      headline: '2035 Horizon Stress-Test Simulations',
      activeFrequency: '28.2 GHz (Sub-Space)',
      liveDataStream: [
        'BRANCH #S-2035: HYDROGEN-SOLAR HYBRID GRID TESTED',
        'BRANCH #M-04: PORT SPIKE STRESS TOLERANCE 99.4%',
        'PROJECTION HORIZON: LOWEST VARIANCE ESTABLISHED',
      ],
    },
  },
  {
    id: 'verify-prove',
    name: 'Cryptographic Policy Gate (Verify)',
    shortName: 'Verify & Prove',
    planetName: 'Planet Aegis',
    phase: 'SOVEREIGN GOVERNANCE',
    subtitle: 'Zero-Drift Policy Gate & Formal Proofs',
    description:
      'The strict sovereign barrier. No agent can act without verifiable proof: schema validation, deterministic policy rules, Ed25519 sovereign signatures, and executive human approvals for consequential thresholds.',
    position: [15, -5, -8],
    color: '#F59E0B',
    accentColor: '#FBBF24',
    atmosphereColor: '#d97706',
    glyph: 'prism',
    status: 'warning',
    throughput: '100% Gated',
    latency: '11ms',
    activeAgents: ['Policy Gatekeeper', 'Zero-Drift Verifier'],
    metrics: [
      { label: 'Gated Policies', value: '18 Active' },
      { label: 'Zero-Drift Drift', value: '0.000%' },
      { label: 'Pending Approvals', value: '3 Actions' },
    ],
    telemetryLogs: [
      'Proof verified: Zero-drift compliance for Sovereign Procurement Rule #11',
      'Awaiting signature: Action #ACT-8819 requires Executive authorization',
      'Audit digest: SHA-256 block #99014 committed to immutable air-gapped log',
    ],
    radius: 2.3,
    rotationSpeed: 0.006,
    hasRings: true,
    ringInner: 2.9,
    ringOuter: 4.1,
    ringColor: '#fbbf24',
    ringSecondaryColor: '#f59e0b',
    textureType: 'policy-gate',
    systemLinkView: 'automations',
    systemLinkLabel: 'Open Cryptographic Policy Gate & Audits',
    systemLinkDescription: 'Review policy rules, zero-drift verification gates, and pending approval queues.',
    voiceScript:
      'Alert: Approaching Planet Aegis, the Cryptographic Policy Gate. Zero-drift sovereign enclaves enforced. Eighteen deterministic policies active.',
    liveFeed: {
      status: 'ENCRYPTED',
      feedType: 'AIR-GAPPED ED25519 ENCLAVE',
      resolution: 'ZERO-KNOWLEDGE PROOF',
      signalStrength: '100.0% SECURE',
      headline: 'Cryptographic Policy Gate Verification Enclave',
      activeFrequency: 'AIR-GAPPED (Hardware HSM)',
      liveDataStream: [
        'POLICY GATE: ALL 18 DETERMINISTIC RULES ACTIVE',
        'PENDING ACTION #ACT-8819: AWAITING DUAL-KEY SIGNATURE',
        'LEDGER DIGEST: SHA-256 AIR-GAPPED VERIFICATION OK',
      ],
    },
  },
  {
    id: 'authorized-act',
    name: 'Actuation & Ledger (Act)',
    shortName: 'Authorized Act',
    planetName: 'Planet Forge',
    phase: 'ACTUATION ENGINE',
    subtitle: 'Policy-Checked External Execution',
    description:
      'Executes authorized actions across physical and enterprise systems: automated port routing dispatch, ERP invoice reconciliation, energy grid balancing commands, and edge container redeployment.',
    position: [4, -10, -5],
    color: '#10B981',
    accentColor: '#34D399',
    atmosphereColor: '#059669',
    glyph: 'ledger',
    status: 'optimal',
    throughput: '320 ops/m',
    latency: '18ms',
    activeAgents: ['Execution Worker', 'Ledger Committer'],
    metrics: [
      { label: 'Executed Today', value: '1,420' },
      { label: 'Rollback Rate', value: '0.00%' },
      { label: 'Audit Trail', value: '100% Verified' },
    ],
    telemetryLogs: [
      'Dispatched: Automated rail freight container release to Jebel Ali Yard 4',
      'Reconciled: Vendor contract billing delta €182k committed to ledger',
      'Edge deployed: Frankfurt cluster traffic shed to Amsterdam failover',
    ],
    radius: 2.1,
    rotationSpeed: 0.01,
    hasRings: false,
    textureType: 'actuation-forge',
    systemLinkView: 'operations',
    systemLinkLabel: 'Open Actuation Engine & Operations',
    systemLinkDescription: 'Monitor active execution workers, physical dispatch logs, and system operations.',
    voiceScript:
      'Approaching Planet Forge. External actuation engine and immutable sovereign ledger operating with zero rollback drift.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'LEDGER EXECUTION DISPATCH',
      resolution: 'MICRO-SECOND LEDGER',
      signalStrength: '99.5% dBm',
      headline: 'Actuation Dispatch & Immutable Ledger Stream',
      activeFrequency: '915.000 MHz (Industrial)',
      liveDataStream: [
        'DISPATCHED: AUTOMATED FREIGHT RELEASE TO JEBEL ALI',
        'LEDGER COMMIT: TX-8819 AUDITED AND SEALED',
        'ROLLBACK DRIFT: 0.00% ACROSS ALL RECORD RUNS',
      ],
    },
  },
  {
    id: 'observe-update',
    name: 'Closed-Loop Telemetry (Observe & Update)',
    shortName: 'Observe & Update',
    planetName: 'Planet Echo',
    phase: 'FEEDBACK LOOP',
    subtitle: 'State Reconciliation & Learning Cycle',
    description:
      'Observes physical reality post-action to measure actual outcomes against simulation projections. Updates the UAE World Model state in real time, closing the cybernetic loop.',
    position: [-10, -8, -7],
    color: '#06B6D4',
    accentColor: '#22D3EE',
    atmosphereColor: '#0891b2',
    glyph: 'loop',
    status: 'optimal',
    throughput: '100% Synced',
    latency: '6ms',
    activeAgents: ['Reconciliation Engine', 'State Updater'],
    metrics: [
      { label: 'Closed Loops', value: '9,481' },
      { label: 'Projection Error', value: '0.04%' },
      { label: 'Model Convergence', value: '99.96%' },
    ],
    telemetryLogs: [
      'Reconciled: Port congestion dropped 18% matching S-04 prediction',
      'Synced: Grid load delta 12MW balanced into Barakah baseload model',
      'Closed: Loop #9481 successfully completed; World Model updated',
    ],
    radius: 1.9,
    rotationSpeed: 0.011,
    hasRings: false,
    textureType: 'telemetry-echo',
    systemLinkView: 'intelligence-feed',
    systemLinkLabel: 'Open Real-Time Telemetry Feed',
    systemLinkDescription: 'Inspect real-time closed-loop updates, activity streams, and world state sync.',
    voiceScript:
      'Entering orbit of Planet Echo. Post-actuation telemetry reconciled against simulation vectors. The sovereign loop is closed.',
    liveFeed: {
      status: 'LIVE',
      feedType: 'CLOSED-LOOP RECONCILIATION',
      resolution: 'CONTINUOUS FEED',
      signalStrength: '99.9% dBm',
      headline: 'Closed-Loop Telemetry & World Model Sync',
      activeFrequency: '2.45 GHz (Continuous Loop)',
      liveDataStream: [
        'OBSERVATION RECONCILED: OUTCOME MATCHES SIMULATION',
        'CYCLE TIME: 8.2 SECONDS FROM SENSOR TO LEDGER UPDATE',
        'WORLD MODEL STATE: 100% CANONICAL AND VERIFIED',
      ],
    },
  },
];

export const INITIAL_DATA_PACKETS: LiveDataPacket[] = [
  {
    id: 'pkt-1',
    sourceStageIndex: 0,
    progress: 0.1,
    type: 'telemetry',
    payload: 'AIS SAR: 84 Vessels at Jebel Ali Approach',
    color: '#00F0FF',
    speed: 0.22,
  },
  {
    id: 'pkt-2',
    sourceStageIndex: 1,
    progress: 0.45,
    type: 'causal_graph',
    payload: 'Causal link: EMEA Hardware Bottleneck -> Lead Time',
    color: '#38BDF8',
    speed: 0.26,
  },
  {
    id: 'pkt-3',
    sourceStageIndex: 2,
    progress: 0.8,
    type: 'agent_thought',
    payload: 'FinSight + GSCIE: Multi-modal reroute scenario',
    color: '#818CF8',
    speed: 0.24,
  },
  {
    id: 'pkt-4',
    sourceStageIndex: 3,
    progress: 0.3,
    type: 'simulation_vector',
    payload: 'Monte Carlo 2035 Horizon: 99.2% certainty',
    color: '#A855F7',
    speed: 0.28,
  },
  {
    id: 'pkt-5',
    sourceStageIndex: 4,
    progress: 0.65,
    type: 'policy_proof',
    payload: 'Zero-Drift Sovereign Proof: Ed25519 Validated',
    color: '#EC4899',
    speed: 0.25,
  },
  {
    id: 'pkt-6',
    sourceStageIndex: 5,
    progress: 0.15,
    type: 'execution_tx',
    payload: 'Ledger TX #8819: Jebel Ali Rail Dispatch Verified',
    color: '#10B981',
    speed: 0.22,
  },
  {
    id: 'pkt-7',
    sourceStageIndex: 6,
    progress: 0.5,
    type: 'telemetry',
    payload: 'Outcome Reconciled: Delta 0.4% within bounds',
    color: '#06B6D4',
    speed: 0.23,
  },
];
