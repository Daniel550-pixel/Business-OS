import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FlowStageNode, LiveDataPacket } from './flowModel';
import { cyberAudio } from '../../utils/audioSynthesizer';
import { PlanetTextureGenerator } from './PlanetTextureGenerator';
import { jarvisVoice } from '../../utils/speechEngine';

interface LivingSystemFlowSceneProps {
  stages: FlowStageNode[];
  selectedStageId: string | null;
  onSelectStage: (stage: FlowStageNode) => void;
  speedMultiplier: number;
  isPaused: boolean;
  pulseTrigger: number;
  activePerspective: 'orbit' | 'uae' | 'swarm' | 'verify' | 'panoramic';
  showDataPackets?: boolean;
  onNavigateToView?: (view: any) => void;
}

export const LivingSystemFlowScene: React.FC<LivingSystemFlowSceneProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  speedMultiplier,
  isPaused,
  pulseTrigger,
  activePerspective,
  showDataPackets = true,
  onNavigateToView,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStage, setHoveredStage] = useState<FlowStageNode | null>(null);

  // References to mutable Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsGroupRef = useRef<THREE.Group | null>(null);
  const conduitParticlesRef = useRef<THREE.Points | null>(null);
  const planetMeshesRef = useRef<Map<string, {
    group: THREE.Group;
    bodyMesh: THREE.Mesh;
    atmosphereMesh?: THREE.Mesh;
    cloudMesh?: THREE.Mesh;
    ringsMesh?: THREE.Mesh;
    satellites: THREE.Mesh[];
  }>>(new Map());

  // Camera target interpolation
  const targetCamPos = useRef(new THREE.Vector3(0, 16, 42));
  const targetCamLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentCamLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Mouse interaction state
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const shockwavePulse = useRef(0);

  // Sync pulse trigger
  useEffect(() => {
    if (pulseTrigger > 0) {
      shockwavePulse.current = 1.0;
      cyberAudio.playEnergyBurst();
    }
  }, [pulseTrigger]);

  // Handle perspective switch & speech
  useEffect(() => {
    switch (activePerspective) {
      case 'uae': {
        const uaeStage = stages.find((s) => s.id === 'uae-world-model');
        if (uaeStage) {
          targetCamPos.current.set(uaeStage.position[0] - 6, uaeStage.position[1] + 4, uaeStage.position[2] + 12);
          targetCamLookAt.current.set(...uaeStage.position);
          jarvisVoice.speak(uaeStage.voiceScript);
        }
        break;
      }
      case 'swarm': {
        const swarmStage = stages.find((s) => s.id === 'reason-cognition');
        if (swarmStage) {
          targetCamPos.current.set(swarmStage.position[0] + 5, swarmStage.position[1] + 3, swarmStage.position[2] + 12);
          targetCamLookAt.current.set(...swarmStage.position);
          jarvisVoice.speak(swarmStage.voiceScript);
        }
        break;
      }
      case 'verify': {
        const verifyStage = stages.find((s) => s.id === 'verify-prove');
        if (verifyStage) {
          targetCamPos.current.set(verifyStage.position[0] + 4, verifyStage.position[1] + 3, verifyStage.position[2] + 10);
          targetCamLookAt.current.set(...verifyStage.position);
          jarvisVoice.speak(verifyStage.voiceScript);
        }
        break;
      }
      case 'panoramic': {
        targetCamPos.current.set(0, 36, 32);
        targetCamLookAt.current.set(0, -2, -2);
        jarvisVoice.speak(
          'Panoramic planetary perspective engaged. All eight sovereign planetary bodies are in alignment around the central AIOS Core.'
        );
        break;
      }
      case 'orbit':
      default: {
        targetCamPos.current.set(0, 14, 42);
        targetCamLookAt.current.set(0, 0, 0);
        break;
      }
    }
  }, [activePerspective, stages]);

  // Handle selected stage camera focus
  useEffect(() => {
    if (!selectedStageId) return;
    const targetStage = stages.find((s) => s.id === selectedStageId);
    if (targetStage) {
      const p = targetStage.position;
      targetCamPos.current.set(p[0] + targetStage.radius * 2.2, p[1] + targetStage.radius * 1.4, p[2] + targetStage.radius * 3.5);
      targetCamLookAt.current.set(p[0], p[1], p[2]);
      jarvisVoice.speak(targetStage.voiceScript);
    }
  }, [selectedStageId, stages]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020612, 0.012);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 42);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0c1e3d, 2.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff4cc, 4.5, 90, 0.8);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-20, 30, 20);
    scene.add(rimLight);

    // 5. Starfield Particle Field
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 260;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 180;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 260;

      const isGold = Math.random() > 0.7;
      const isCyan = Math.random() > 0.5;
      if (isGold) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.4;
      } else if (isCyan) {
        starColors[i * 3] = 0.2;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.9;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Cybernetic Orbital Plane Floor Grid
    const gridHelper = new THREE.GridHelper(100, 50, 0x00f0ff, 0x0d2140);
    gridHelper.position.y = -16;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.18;
    scene.add(gridHelper);

    // 7. Central AIOS Sovereign Star / Solar Reactor
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunTexture = PlanetTextureGenerator.createSovereignStarTexture();
    const sunGeo = new THREE.SphereGeometry(3.0, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    // Solar Corona Glow
    const coronaGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(coronaMesh);

    // Orbital Solar Flare Torus Rings
    const sunRingGeo = new THREE.TorusGeometry(4.8, 0.05, 16, 90);
    const sunRingMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const sunRingA = new THREE.Mesh(sunRingGeo, sunRingMat);
    sunRingA.rotation.x = Math.PI / 4;
    sunGroup.add(sunRingA);

    const sunRingB = new THREE.Mesh(sunRingGeo, sunRingMat);
    sunRingB.rotation.y = Math.PI / 3;
    sunGroup.add(sunRingB);

    // 8. Construct Continuous 3D Loop Conduit Curve
    const stagePositions = stages.map((s) => new THREE.Vector3(...s.position));
    const loopCurve = new THREE.CatmullRomCurve3(stagePositions, true, 'centripetal', 0.5);

    // Conduit Tube
    const tubeGeo = new THREE.TubeGeometry(loopCurve, 200, 0.2, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const conduitMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(conduitMesh);

    // Flowing Conduit Energy Particles
    const particleCount = 360;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleOffsets[i] = i / particleCount;
      const pt = loopCurve.getPoint(particleOffsets[i]);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;

      particleColors[i * 3] = 0.1 + Math.random() * 0.4;
      particleColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      particleColors[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const conduitParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(conduitParticles);
    conduitParticlesRef.current = conduitParticles;

    // 9. Build Actual 3D Planets for all 8 Stages
    const planetsGroup = new THREE.Group();
    scene.add(planetsGroup);
    planetsGroupRef.current = planetsGroup;
    planetMeshesRef.current.clear();

    stages.forEach((stage) => {
      const planetGroup = new THREE.Group();
      planetGroup.position.set(...stage.position);
      planetGroup.userData = { stageId: stage.id, stage };

      // Add planetary orbit ring around central star
      const distFromCenter = Math.sqrt(
        stage.position[0] * stage.position[0] + stage.position[2] * stage.position[2]
      );
      const orbitCurve = new THREE.EllipseCurve(0, 0, distFromCenter, distFromCenter * 0.9, 0, 2 * Math.PI, false, 0);
      const orbitPts = orbitCurve.getPoints(90).map((p) => new THREE.Vector3(p.x, stage.position[1] * 0.25, p.y));
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(stage.color),
        transparent: true,
        opacity: 0.2,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Select proper procedural texture
      let planetTexture: THREE.CanvasTexture;
      switch (stage.textureType) {
        case 'uae-twin':
          planetTexture = PlanetTextureGenerator.createUAETwinTexture();
          break;
        case 'sensor-ingest':
          planetTexture = PlanetTextureGenerator.createSensorIngestTexture();
          break;
        case 'causal-nexus':
          planetTexture = PlanetTextureGenerator.createCausalNexusTexture();
          break;
        case 'agent-swarm':
          planetTexture = PlanetTextureGenerator.createAgentSwarmTexture();
          break;
        case 'simulation-horizon':
          planetTexture = PlanetTextureGenerator.createSimulationHorizonTexture();
          break;
        case 'policy-gate':
          planetTexture = PlanetTextureGenerator.createPolicyGateTexture();
          break;
        case 'actuation-forge':
          planetTexture = PlanetTextureGenerator.createActuationForgeTexture();
          break;
        case 'telemetry-echo':
        default:
          planetTexture = PlanetTextureGenerator.createTelemetryEchoTexture();
          break;
      }

      // Planet Spherical Body Mesh
      const bodyGeo = new THREE.SphereGeometry(stage.radius, 36, 36);
      const bodyMat = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: 0.65,
        metalness: 0.2,
        emissive: new THREE.Color(stage.color),
        emissiveIntensity: 0.25,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      planetGroup.add(bodyMesh);

      // Planet Atmospheric Glow Shell
      const atmoGeo = new THREE.SphereGeometry(stage.radius * 1.07, 28, 28);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(stage.atmosphereColor || stage.color),
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
      planetGroup.add(atmosphereMesh);

      // Cloud/Holographic Coordinate Shell
      const cloudGeo = new THREE.SphereGeometry(stage.radius * 1.03, 24, 24);
      const cloudMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(stage.accentColor),
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      planetGroup.add(cloudMesh);

      // Optional Planetary Rings (e.g. UAE Twin, Swarm Hive, Horizon, Policy Gate)
      let ringsMesh: THREE.Mesh | undefined;
      if (stage.hasRings && stage.ringInner && stage.ringOuter) {
        const ringGeo = new THREE.RingGeometry(stage.ringInner, stage.ringOuter, 64);
        const ringTex = PlanetTextureGenerator.createRingTexture(
          stage.ringColor || stage.color,
          stage.ringSecondaryColor || '#ffffff'
        );
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.78,
          blending: THREE.AdditiveBlending,
        });
        ringsMesh = new THREE.Mesh(ringGeo, ringMat);
        ringsMesh.rotation.x = Math.PI / 2.3;
        ringsMesh.rotation.y = 0.15;
        planetGroup.add(ringsMesh);
      }

      // Orbiting Satellites / Drones
      const satellites: THREE.Mesh[] = [];
      const satCount = stage.id === 'reason-cognition' ? 4 : stage.id === 'uae-world-model' ? 2 : 1;
      const satGeo = new THREE.SphereGeometry(0.24, 10, 10);

      for (let s = 0; s < satCount; s++) {
        const satMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(stage.accentColor),
        });
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.userData = {
          angle: (s * Math.PI * 2) / satCount,
          dist: stage.radius + 1.2 + s * 0.4,
          speed: 1.2 + s * 0.5,
        };
        planetGroup.add(sat);
        satellites.push(sat);
      }

      // Targeting Reticle (for selection/hover)
      const reticleGeo = new THREE.RingGeometry(stage.radius * 1.35, stage.radius * 1.45, 32);
      const reticleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(stage.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
      });
      const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
      reticleMesh.name = 'reticle';
      planetGroup.add(reticleMesh);

      planetsGroup.add(planetGroup);
      planetMeshesRef.current.set(stage.id, {
        group: planetGroup,
        bodyMesh,
        atmosphereMesh,
        cloudMesh,
        ringsMesh,
        satellites,
      });
    });

    // 10. Mouse / Raycast Event Handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging.current) {
        const deltaX = e.clientX - prevMousePos.current.x;
        const deltaY = e.clientY - prevMousePos.current.y;
        prevMousePos.current = { x: e.clientX, y: e.clientY };

        targetCamPos.current.x -= deltaX * 0.06;
        targetCamPos.current.y = Math.max(-10, Math.min(40, targetCamPos.current.y + deltaY * 0.06));
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      const interactiveTargets: THREE.Object3D[] = [];
      planetsGroup.children.forEach((group) => {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.name !== 'reticle') {
            interactiveTargets.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(interactiveTargets);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== planetsGroup) {
          root = root.parent;
        }
        const stage = root.userData?.stage as FlowStageNode | undefined;
        if (stage && (!hoveredStage || hoveredStage.id !== stage.id)) {
          setHoveredStage(stage);
          cyberAudio.playNodeSelect(440);
        }
      } else {
        if (hoveredStage) setHoveredStage(null);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveTargets: THREE.Object3D[] = [];
      planetsGroup.children.forEach((group) => {
        group.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.name !== 'reticle') {
            interactiveTargets.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(interactiveTargets);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== planetsGroup) {
          root = root.parent;
        }
        const stage = root.userData?.stage as FlowStageNode | undefined;
        if (stage) {
          onSelectStage(stage);
          cyberAudio.playNodeSelect(580);
          jarvisVoice.speak(stage.voiceScript);
        }
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.03;
      targetCamPos.current.z = Math.max(12, Math.min(85, targetCamPos.current.z + zoomDelta));
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 11. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Sun
      sunMesh.rotation.y += delta * 0.08;
      coronaMesh.rotation.y -= delta * 0.05;
      sunRingA.rotation.z += delta * 0.15;
      sunRingB.rotation.z -= delta * 0.12;

      // Pulse handling
      if (shockwavePulse.current > 0) {
        shockwavePulse.current = Math.max(0, shockwavePulse.current - delta * 0.6);
        const scaleVal = 1.0 + shockwavePulse.current * 0.18;
        planetsGroup.scale.set(scaleVal, scaleVal, scaleVal);
      } else {
        planetsGroup.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
      }

      // Animate Conduit Particles
      if (conduitParticlesRef.current && !isPaused && showDataPackets) {
        const positions = conduitParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const speed = 0.06 * speedMultiplier;

        for (let i = 0; i < particleCount; i++) {
          particleOffsets[i] = (particleOffsets[i] + delta * speed) % 1;
          const pt = loopCurve.getPoint(particleOffsets[i]);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }
        conduitParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Animate each planet
      stages.forEach((stage) => {
        const planetRecord = planetMeshesRef.current.get(stage.id);
        if (!planetRecord) return;

        const { group, bodyMesh, atmosphereMesh, cloudMesh, ringsMesh, satellites } = planetRecord;

        // Rotate planet body
        bodyMesh.rotation.y += delta * (stage.rotationSpeed || 0.008);

        // Rotate cloud shell slightly faster
        if (cloudMesh) {
          cloudMesh.rotation.y += delta * (stage.rotationSpeed * 1.5);
          cloudMesh.rotation.x = Math.sin(time * 0.2) * 0.05;
        }

        // Rotate atmosphere
        if (atmosphereMesh) {
          atmosphereMesh.rotation.y -= delta * 0.004;
        }

        // Wobble rings
        if (ringsMesh) {
          ringsMesh.rotation.z += delta * 0.01;
        }

        // Orbit satellites
        satellites.forEach((sat) => {
          const u = sat.userData;
          u.angle += delta * u.speed;
          sat.position.x = Math.cos(u.angle) * u.dist;
          sat.position.z = Math.sin(u.angle) * u.dist;
          sat.position.y = Math.sin(u.angle * 2) * 0.5;
        });

        // Reticle selection effect
        const reticle = group.getObjectByName('reticle') as THREE.Mesh | undefined;
        const isHovered = hoveredStage && hoveredStage.id === stage.id;
        const isSelected = selectedStageId === stage.id;

        if (reticle) {
          reticle.rotation.z += delta * 0.8;
          reticle.lookAt(camera.position);
          const retMat = reticle.material as THREE.MeshBasicMaterial;
          retMat.opacity = isSelected ? 0.9 : isHovered ? 0.5 : 0.0;
        }

        // Hover scale
        const targetScale = isSelected ? 1.22 : isHovered ? 1.12 : 1.0;
        group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
      });

      // Camera Smooth Interpolation
      camera.position.lerp(targetCamPos.current, delta * 2.8);
      currentCamLookAt.current.lerp(targetCamLookAt.current, delta * 3.4);
      camera.lookAt(currentCamLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stages, onSelectStage]);

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[720px] overflow-hidden select-none bg-radial from-[#071329] via-[#030814] to-[#01040a]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Hover Floating Planetary HUD Tooltip */}
      {hoveredStage && (
        <div
          className="pointer-events-auto absolute left-6 top-20 z-20 max-w-sm p-4 rounded-3xl bg-black/85 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-white space-y-2 animate-in fade-in zoom-in-95 duration-150"
          style={{ borderColor: hoveredStage.color }}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ backgroundColor: `${hoveredStage.color}25`, color: hoveredStage.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: hoveredStage.color }} />
              <span>{hoveredStage.phase}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">LATENCY: {hoveredStage.latency}</span>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
              {hoveredStage.planetName}
            </div>
            <div className="text-base font-bold font-sans flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredStage.color }} />
              <span>{hoveredStage.name}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
            {hoveredStage.subtitle}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[10px] font-mono text-slate-300">
            <div>
              <span className="text-slate-500">THROUGHPUT: </span>
              <span className="text-cyan-300 font-bold">{hoveredStage.throughput}</span>
            </div>
            <div>
              <span className="text-slate-500">LIVE FEED: </span>
              <span className="text-emerald-400 font-bold uppercase">{hoveredStage.liveFeed?.status || 'ONLINE'}</span>
            </div>
          </div>

          {/* Direct Link Action */}
          <div className="pt-2 flex items-center gap-2">
            {onNavigateToView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToView(hoveredStage.systemLinkView);
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>ENTER {hoveredStage.shortName.toUpperCase()}</span>
                <span>→</span>
              </button>
            )}
            <button
              onClick={() => {
                onSelectStage(hoveredStage);
                jarvisVoice.speak(hoveredStage.voiceScript);
              }}
              className="py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
              title="Speak voice briefing"
            >
              VOICE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
