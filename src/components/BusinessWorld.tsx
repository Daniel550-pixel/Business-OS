import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ChevronDown, Layers3, Minus, Pause, Play, Plus, RotateCcw,
  Scan, ShieldCheck, Sparkles, Target, X
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WorldNode, ProposedAction } from '../types';
import { BUSINESS_DATA_MODE } from '../data/runtimeState';

interface BusinessWorldProps {
  nodes?: WorldNode[];
  selectedNode?: WorldNode | null;
  onSelectNode?: (node: WorldNode) => void;
  highlightedNodeIds?: string[];
  onQuickInspectNode?: (nodeId: string) => void;
  onExecutePolicyAction?: (action: ProposedAction) => void;
}

type Entity3D = WorldNode & { position: [number, number, number] };

const FALLBACK_ENTITIES: WorldNode[] = [
  { id:'revenue', label:'Revenue', type:'revenue', metric:'$4.82M', subMetric:'ARR', status:'optimal', x:0, y:0, description:'Primary ARR generation and pricing intelligence.', details:'', connections:['core','customers'] },
  { id:'sales', label:'Sales Pipeline', type:'sales', metric:'$14.8M', subMetric:'PIPELINE', status:'active', x:0, y:0, description:'Enterprise pipeline, deal velocity and conversion.', details:'', connections:['core','customers'] },
  { id:'customers', label:'Customers', type:'customers', metric:'124%', subMetric:'NRR', status:'warning', x:0, y:0, description:'Retention, expansion and customer health.', details:'', connections:['sales','revenue'] },
  { id:'operations', label:'Operations', type:'operations', metric:'99.99%', subMetric:'HEALTH', status:'optimal', x:0, y:0, description:'Infrastructure, capacity and service reliability.', details:'', connections:['core','finance'] },
  { id:'finance', label:'Finance', type:'finance', metric:'$2.37M', subMetric:'LIQUIDITY', status:'optimal', x:0, y:0, description:'Treasury, cash position and capital allocation.', details:'', connections:['core','operations'] },
  { id:'core', label:'Business Core', type:'systems', metric:'42ms', subMetric:'LATENCY', status:'active', x:0, y:0, description:'Central orchestration, policy and decision runtime.', details:'', connections:['revenue','sales','operations','finance'] },
];

const POSITIONS: Record<string, [number, number, number]> = {
  revenue: [-15, 2, -10], sales: [0, 2, -17], customers: [15, 2, -8],
  operations: [15, 2, 10], finance: [-14, 2, 12], core: [0, 4, 2],
};

const AGENTS = [
  { id:'revenue-agent', name:'Revenue Agent', from:'revenue', to:'core', color:0x63e6ff },
  { id:'finance-agent', name:'Finance Agent', from:'finance', to:'core', color:0x63f5ae },
  { id:'customer-agent', name:'Customer Agent', from:'customers', to:'sales', color:0xb98cff },
  { id:'ops-agent', name:'Ops Agent', from:'operations', to:'core', color:0xffc85a },
];

const statusColor = (status: WorldNode['status']) =>
  status === 'critical' ? 0xff5574 : status === 'warning' ? 0xffc85a : status === 'active' ? 0x63e6ff : 0x63f5ae;

function makeLabel(text: string, color = '#d9f7ff') {
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '600 34px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), canvas.width / 2, 46);
  ctx.font = '500 20px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(170,190,205,.8)';
  ctx.fillText('BUSINESS ENTITY', canvas.width / 2, 91);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5.8, 1.15, 1);
  return sprite;
}

function makeNode(entity: Entity3D) {
  const group = new THREE.Group();
  group.name = entity.id;
  const color = statusColor(entity.status);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(entity.id === 'core' ? 1.9 : 1.45, 2),
    new THREE.MeshStandardMaterial({ color:0x0b1722, emissive:color, emissiveIntensity:0.38, metalness:.72, roughness:.26 })
  );
  core.position.y = entity.id === 'core' ? 3.2 : 2.2;
  core.userData.entityId = entity.id;
  group.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(entity.id === 'core' ? 2.65 : 2.05, .045, 8, 96),
    new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.72 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.copy(core.position);
  ring.userData.entityId = entity.id;
  group.add(ring);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(.035,.11,entity.id === 'core' ? 3.2 : 2.2,12),
    new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.65 })
  );
  stem.position.y = core.position.y / 2;
  group.add(stem);

  const label = makeLabel(entity.label, '#e8fbff');
  label.position.set(0, core.position.y + 2.2, 0);
  label.userData.entityId = entity.id;
  group.add(label);

  group.position.set(...entity.position);
  group.userData.entityId = entity.id;
  return group;
}

function makeEdge(a: THREE.Vector3, b: THREE.Vector3, color = 0x4bdcff) {
  const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
  const material = new THREE.LineBasicMaterial({ color, transparent:true, opacity:.34 });
  return new THREE.Line(geometry, material);
}

export const BusinessWorld: React.FC<BusinessWorldProps> = ({
  nodes = [], selectedNode, onSelectNode, highlightedNodeIds = [], onQuickInspectNode, onExecutePolicyAction,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ scene:THREE.Scene; camera:THREE.PerspectiveCamera; renderer:THREE.WebGLRenderer; controls:OrbitControls; groups:Map<string,THREE.Group>; agents:THREE.Mesh[]; clock:THREE.Clock } | null>(null);
  const [selectedId, setSelectedId] = useState(selectedNode?.id || 'core');
  const [playing, setPlaying] = useState(true);
  const [simulation, setSimulation] = useState(false);
  const [tick, setTick] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const selectedIdRef = useRef(selectedId);
  const entitiesRef = useRef<Entity3D[]>([]);
  const nodesRef = useRef<WorldNode[]>([]);
  const onSelectNodeRef = useRef(onSelectNode);
  const onQuickInspectNodeRef = useRef(onQuickInspectNode);

  const entities = useMemo<Entity3D[]>(() => {
    const source = nodes.length ? nodes : FALLBACK_ENTITIES;
    return source.slice(0, 12).map((n, i) => ({
      ...n,
      position: POSITIONS[n.id] || [((i % 4) - 1.5) * 9, 2, Math.floor(i / 4) * 10 - 8],
    }));
  }, [nodes]);

  const active = entities.find(e => e.id === selectedId) || entities[0];
  const lookup = useMemo(() => new Map(entities.map(e => [e.id, e])), [entities]);

  useEffect(() => {
    if (selectedNode?.id) setSelectedId(selectedNode.id);
  }, [selectedNode?.id]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    entitiesRef.current = entities;
    nodesRef.current = nodes;
    onSelectNodeRef.current = onSelectNode;
    onQuickInspectNodeRef.current = onQuickInspectNode;
  }, [selectedId, entities, nodes, onSelectNode, onQuickInspectNode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02060f);
    scene.fog = new THREE.FogExp2(0x02060f, 0.026);

    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / Math.max(1,mount.clientHeight), .1, 250);
    camera.position.set(28, 27, 34);

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .065;
    controls.enablePan = true;
    controls.minDistance = 15;
    controls.maxDistance = 82;
    controls.minPolarAngle = .34;
    controls.maxPolarAngle = 1.48;
    controls.target.set(0,2,0);

    scene.add(new THREE.HemisphereLight(0x9adfff, 0x03060b, 1.7));
    const key = new THREE.PointLight(0x58ddff, 180, 55);
    key.position.set(0,18,0);
    scene.add(key);
    const fill = new THREE.PointLight(0x8d6dff, 95, 65);
    fill.position.set(-28,10,-22);
    scene.add(fill);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90,90,1,1),
      new THREE.MeshStandardMaterial({ color:0x040a12, metalness:.55, roughness:.74, transparent:true, opacity:.96 })
    );
    floor.rotation.x = -Math.PI/2;
    floor.position.y = -0.2;
    scene.add(floor);

    const grid = new THREE.GridHelper(90,45,0x18485c,0x0a2733);
    grid.position.y = -.12;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = .52;
    scene.add(grid);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(23,26,.6,96),
      new THREE.MeshStandardMaterial({ color:0x06111b, emissive:0x06212b, emissiveIntensity:.7, metalness:.85, roughness:.25 })
    );
    platform.position.y = .1;
    scene.add(platform);

    const groups = new Map<string,THREE.Group>();
    entities.forEach(entity => {
      const g = makeNode(entity);
      groups.set(entity.id,g);
      scene.add(g);
    });

    const edgePairs = [
      ['core','revenue'],['core','finance'],['core','sales'],['core','operations'],
      ['sales','customers'],['revenue','customers'],['finance','operations'],
    ];
    edgePairs.forEach(([a,b]) => {
      const A=lookup.get(a), B=lookup.get(b);
      if (!A || !B) return;
      const line=makeEdge(new THREE.Vector3(...A.position).setY(2.8),new THREE.Vector3(...B.position).setY(2.8));
      scene.add(line);
    });

    const agents: THREE.Mesh[] = [];
    AGENTS.forEach(agent => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(.34,20,20),
        new THREE.MeshBasicMaterial({ color:agent.color })
      );
      sphere.userData.agent = agent;
      scene.add(sphere);
      agents.push(sphere);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const click = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
      pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects(Array.from(groups.values()),true);
      const hit=hits.find(h=>h.object.userData.entityId);
      if (!hit) return;
      const id=hit.object.userData.entityId as string;
      const entity=entitiesRef.current.find(e=>e.id===id);
      if (!entity) return;
      setSelectedId(id);
      const source=nodesRef.current.find(n=>n.id===id);
      if(source) onSelectNodeRef.current?.(source);
      onQuickInspectNodeRef.current?.(id);
    };
    renderer.domElement.addEventListener('click',click);

    const clock=new THREE.Clock();
    sceneRef.current={scene,camera,renderer,controls,groups,agents,clock};

    let raf=0;
    const animate=()=>{
      raf=requestAnimationFrame(animate);
      const t=clock.getElapsedTime();
      controls.update();
      groups.forEach((g,id)=>{
        const selected=id===selectedIdRef.current;
        g.scale.lerp(new THREE.Vector3(selected?1.16:1,selected?1.16:1,selected?1.16:1),.12);
        const ring=g.children[1];
        if(ring) ring.rotation.z=t*.35;
        const core=g.children[0];
        if(core) core.rotation.y=t*.18;
      });
      AGENTS.forEach((agent,i)=>{
        const A=lookup.get(agent.from),B=lookup.get(agent.to),mesh=agents[i];
        if(!A||!B) return;
        const u=(t*(.09+i*.012))%1;
        mesh.position.lerpVectors(new THREE.Vector3(...A.position).setY(3.4),new THREE.Vector3(...B.position).setY(3.4),u);
      });
      renderer.render(scene,camera);
    };
    animate();

    const resize=()=>{
      const w=mount.clientWidth,h=Math.max(1,mount.clientHeight);
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
    };
    const ro=new ResizeObserver(resize);
    ro.observe(mount);

    return ()=>{
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('click',click);
      controls.dispose();
      scene.traverse(o=>{
        const m=o as THREE.Mesh;
        if(m.geometry) m.geometry.dispose();
        const mat=m.material as THREE.Material|THREE.Material[]|undefined;
        if(Array.isArray(mat)) mat.forEach(x=>x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current=null;
    };
  }, [entities]);

  useEffect(()=>{
    const world=sceneRef.current;
    if(!world) return;
    world.groups.forEach((group,id)=>{
      const entity=entities.find(e=>e.id===id);
      if(!entity) return;
      const color=statusColor(entity.status);
      const selected=id===selectedId;
      const highlighted=highlightedNodeIds.includes(id);
      const core=group.children[0] as THREE.Mesh;
      const ring=group.children[1] as THREE.Mesh;
      if(core.material instanceof THREE.MeshStandardMaterial){
        core.material.emissive.setHex(selected?0x6ff3ff:highlighted?0x9a70ff:color);
        core.material.emissiveIntensity=selected?1.0:highlighted?.72:.38;
      }
      if(ring.material instanceof THREE.MeshBasicMaterial){
        ring.material.color.setHex(selected?0x8fffff:highlighted?0xa77cff:color);
        ring.material.opacity=selected?.95:.58;
      }
    });
  }, [selectedId,highlightedNodeIds,entities]);

  const resetCamera=()=>sceneRef.current?.controls.reset();
  const zoom=(delta:number)=>{
    const world=sceneRef.current;
    if(!world) return;
    const direction=new THREE.Vector3().subVectors(world.camera.position,world.controls.target).normalize();
    world.camera.position.addScaledVector(direction,delta);
  };
  const policyAction=()=>{
    if(!active) return;
    onExecutePolicyAction?.({
      id:`world_${active.id}_${Date.now()}`,
      title:`Optimize ${active.label} operating policy`,
      description:`AI-proposed mutation for the ${active.label} domain.`,
      riskLevel:'medium', targetSystem:active.label, requiresApproval:true, status:'PROPOSED',
      parameters:{simulation,worldEntity:active.id},
    });
  };

  useEffect(()=>{
    if(!playing) return;
    const id=window.setInterval(()=>setTick(t=>t+1),250);
    return()=>window.clearInterval(id);
  },[playing]);

  return (
    <section className="relative w-full min-h-[720px] h-[calc(100vh-235px)] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#02060f] os-cyber-corners os-scanlines">
      <div className="absolute inset-0 z-0" ref={mountRef} aria-label="Interactive three-dimensional business world" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(65%_60%_at_50%_46%,transparent_0%,rgba(2,6,15,.14)_48%,rgba(2,6,15,.72)_100%)]" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(180deg,rgba(2,6,15,.78),rgba(2,6,15,.04)_26%,rgba(2,6,15,.22)_70%,rgba(2,6,15,.88))]" />

      <header className="absolute top-0 left-0 right-0 z-30 h-[68px] px-5 lg:px-7 flex items-center justify-between border-b border-white/[0.09] bg-[#02060f]/58 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm tracking-[0.18em]"><Layers3 className="w-4 h-4 text-cyan-200"/>BUSINESS-OS</div>
          <span className="hidden sm:inline text-[9px] font-mono tracking-[0.16em] text-slate-400/80">3D BUSINESS WORLD / DIGITAL TWIN</span>
          <span className={`px-2 py-0.5 rounded border text-[9px] font-mono ${simulation?'border-violet-400/50 text-violet-300 bg-violet-500/10':'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'}`}>{simulation?'FUTURE SIMULATION':BUSINESS_DATA_MODE === 'SIMULATED' ? 'SIMULATED TELEMETRY' : 'LIVE TELEMETRY'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPlaying(v=>!v)} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title={playing?'Pause telemetry':'Resume telemetry'}>{playing?<Pause size={15}/>:<Play size={15}/>}</button>
          <button onClick={()=>setSimulation(v=>!v)} className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono ${simulation?'border-violet-400/40 text-violet-300':'border-white/10 text-slate-400'}`}>SIM</button>
          <button onClick={resetCamera} className="p-2 rounded-lg hover:bg-white/10 text-slate-300" title="Reset camera"><RotateCcw size={15}/></button>
        </div>
      </header>

      <div className="absolute left-5 bottom-5 z-20 flex flex-col gap-1">
        <button onClick={()=>zoom(-4)} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Plus size={15}/></button>
        <button onClick={()=>zoom(4)} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Minus size={15}/></button>
        <button onClick={()=>{const world=sceneRef.current;if(world){const offset=world.camera.position.clone().sub(world.controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),.35);world.camera.position.copy(world.controls.target).add(offset);world.camera.lookAt(world.controls.target);}}} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><RotateCcw size={15}/></button>
        <button onClick={()=>{const world=sceneRef.current;if(world){const offset=world.camera.position.clone().sub(world.controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),-.35);world.camera.position.copy(world.controls.target).add(offset);world.camera.lookAt(world.controls.target);}}} className="p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300 hover:text-white"><Scan size={15}/></button>
      </div>

      {showLegend&&<div className="absolute left-[68px] bottom-5 z-20 p-3 rounded-xl border border-white/10 bg-[#050a12]/72 backdrop-blur-xl text-[9px] font-mono text-slate-400">
        <div className="flex items-center gap-2"><Target size={11} className="text-cyan-300"/> LEFT DRAG = ORBIT</div>
        <div className="mt-1 text-slate-600">RIGHT DRAG = PAN · WHEEL = ZOOM</div>
        <div className="mt-2 flex items-center gap-3"><span className="text-emerald-300">● LIVE</span><span className="text-violet-300">● AI AGENT</span><span className="text-amber-300">● WARNING</span></div>
      </div>}

      <button onClick={()=>setShowLegend(v=>!v)} className="absolute right-5 bottom-5 z-20 px-2 py-1.5 rounded-lg border border-white/10 bg-[#0b1018]/90 text-[9px] font-mono text-slate-400">{showLegend?'HIDE LEGEND':'SHOW LEGEND'}</button>

      {showInspector&&active&&<aside className="absolute right-4 top-20 z-25 w-72 max-h-[calc(100%-6rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1018]/92 backdrop-blur-2xl shadow-2xl">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div><div className="text-[9px] font-mono text-cyan-300">SPATIAL INSPECTOR</div><div className="text-sm font-semibold text-white mt-0.5">{active.label}</div></div>
          <button onClick={()=>setShowInspector(false)} className="text-slate-500 hover:text-white"><X size={15}/></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="text-[8px] font-mono text-slate-500">PRIMARY</div><div className="mt-1 text-sm font-mono text-cyan-200">{simulation&&active.id==='revenue'?'$5.24M':active.metric}</div></div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"><div className="text-[8px] font-mono text-slate-500">STATE</div><div className="mt-1 text-[10px] uppercase font-mono text-slate-300">{active.status}</div></div>
          </div>
          <p className="text-[11px] leading-5 text-slate-400">{active.description}</p>
          <div className="space-y-2"><div className="flex items-center gap-2 text-[9px] font-mono text-slate-500"><Activity size={11}/> TELEMETRY <span className="ml-auto text-emerald-300">STREAMING</span></div><div className="h-10 flex items-end gap-1">{Array.from({length:18},(_,i)=><span key={i} className="flex-1 bg-cyan-400/30 rounded-t" style={{height:`${20+((i*17+tick)%55)}%`}}/>)}</div></div>
          <div className="flex gap-2">
            <button onClick={()=>onQuickInspectNode?.(active.id)} className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300 hover:border-cyan-400/40">OPEN DOMAIN</button>
            <button onClick={policyAction} className="flex-1 px-3 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-[9px] font-mono text-cyan-200 hover:bg-cyan-400/20 flex items-center justify-center gap-1"><ShieldCheck size={11}/> POLICY</button>
          </div>
        </div>
      </aside>}

      {!showInspector&&active&&<button onClick={()=>setShowInspector(true)} className="absolute right-4 top-20 z-20 p-2 rounded-lg border border-white/10 bg-[#0b1018]/90 text-slate-300"><ChevronDown size={15}/></button>}

      <footer className="absolute bottom-0 left-0 right-0 z-30 h-10 px-4 flex items-center justify-between border-t border-white/[0.07] bg-[#090d15]/90 backdrop-blur-xl text-[9px] font-mono">
        <div className="flex items-center gap-4 text-slate-500"><span>ENTITIES <b className="text-slate-300">{entities.length}</b></span><span>AI AGENTS <b className="text-cyan-300">{AGENTS.length}</b></span><span>RENDER <b className="text-emerald-300">WEBGL</b></span>{simulation&&<span className="text-violet-300">SIMULATION DELTA: +8.7% ARR</span>}</div>
        <div className="flex items-center gap-2 text-slate-500"><Target size={11}/> TICK {String(tick).padStart(6,'0')} <Sparkles size={11} className="text-cyan-300"/></div>
      </footer>
    </section>
  );
};
