import React, { useEffect, useRef } from 'react';
import { SystemRuntimeState } from '../types';

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Meteor {
  x: number;
  y: number;
  dx: number;
  dy: number;
  len: number;
  life: number;
  maxLife: number;
  color: string;
}

interface NebulaCloud {
  relX: number; // 0..1 relative to canvas width
  relY: number; // 0..1 relative to canvas height
  radiusRatio: number; // relative to canvas min dimension
  driftAngle: number;
  driftSpeed: number;
  phaseOffset: number;
}

interface StateNebulaTheme {
  primaryColor: [number, number, number]; // r, g, b
  secondaryColor: [number, number, number];
  tertiaryColor: [number, number, number];
  baseOpacity: number;
  pulseAmplitude: number;
  pulseFrequency: number;
  pulseRingCount: number;
}

interface CelestialStarfieldCanvasProps {
  systemState?: SystemRuntimeState;
}

export const CelestialStarfieldCanvas: React.FC<CelestialStarfieldCanvasProps> = ({
  systemState = 'risk_detected',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const systemStateRef = useRef<SystemRuntimeState>(systemState);

  // Keep ref synchronized without restarting animation loop
  useEffect(() => {
    systemStateRef.current = systemState;
  }, [systemState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Star collection
    const STAR_COUNT = Math.min(450, Math.floor((width * height) / 3800));
    const MAX_DEPTH = 1200;
    const SPEED = prefersReducedMotion ? 0.08 : 0.45;
    const FOV = 450;

    const celestialColors = [
      '#ffffff', // Diamond white
      '#e0f2fe', // Ice blue
      '#38bdf8', // Cyan hypergiant
      '#00f0ff', // Pure cyber cyan
      '#fef08a', // Pale gold
      '#fbbf24', // Solar amber
      '#c084fc', // Violet pulsar
    ];

    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * MAX_DEPTH + 1;
      stars.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z,
        prevZ: z,
        size: Math.random() * 1.6 + 0.6,
        color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Nebula Clouds Setup
    const nebulaClouds: NebulaCloud[] = [
      { relX: 0.5, relY: 0.35, radiusRatio: 0.45, driftAngle: 0, driftSpeed: 0.0006, phaseOffset: 0 },
      { relX: 0.2, relY: 0.65, radiusRatio: 0.38, driftAngle: Math.PI / 3, driftSpeed: 0.0004, phaseOffset: 1.5 },
      { relX: 0.8, relY: 0.6, radiusRatio: 0.42, driftAngle: (2 * Math.PI) / 3, driftSpeed: 0.0005, phaseOffset: 3.0 },
      { relX: 0.5, relY: 0.85, radiusRatio: 0.35, driftAngle: Math.PI, driftSpeed: 0.0003, phaseOffset: 4.2 },
    ];

    // System state color and pulse themes
    const getThemeForState = (state: SystemRuntimeState): StateNebulaTheme => {
      switch (state) {
        case 'major_decision':
          // Blazing solar amber / molten gold / critical crimson pulse
          return {
            primaryColor: [245, 158, 11], // #f59e0b Amber
            secondaryColor: [239, 68, 68], // #ef4444 Crimson
            tertiaryColor: [251, 191, 36], // #fbbf24 Bright Gold
            baseOpacity: 0.42, // High intensity
            pulseAmplitude: 0.22,
            pulseFrequency: 0.048, // Rapid heart-throb urgency
            pulseRingCount: 3,
          };
        case 'mission_executing':
          // Hyperspace ultraviolet / violet / energetic cyan plasma currents
          return {
            primaryColor: [168, 85, 247], // #a855f7 Violet
            secondaryColor: [236, 72, 153], // #ec4899 Magenta
            tertiaryColor: [6, 182, 212], // #06b6d4 Cyan
            baseOpacity: 0.38, // High intensity
            pulseAmplitude: 0.18,
            pulseFrequency: 0.038, // Swirling energetic surge
            pulseRingCount: 3,
          };
        case 'risk_detected':
          // Rose caution aura with cyan boundary
          return {
            primaryColor: [244, 63, 94], // #f43f5e Rose
            secondaryColor: [6, 182, 212], // #06b6d4 Cyan
            tertiaryColor: [225, 29, 72], // #e11d48 Deep Red
            baseOpacity: 0.24,
            pulseAmplitude: 0.1,
            pulseFrequency: 0.024,
            pulseRingCount: 1,
          };
        case 'investigating':
          // Analytical azure and cyber cyan scan pulse
          return {
            primaryColor: [6, 182, 212], // #06b6d4 Cyan
            secondaryColor: [59, 130, 246], // #3b82f6 Azure
            tertiaryColor: [99, 102, 241], // #6366f1 Indigo
            baseOpacity: 0.22,
            pulseAmplitude: 0.08,
            pulseFrequency: 0.02,
            pulseRingCount: 1,
          };
        case 'calm':
        default:
          // Serene deep sapphire and cyan gentle breathing glow
          return {
            primaryColor: [14, 165, 233], // #0ea5e9 Sky Blue
            secondaryColor: [99, 102, 241], // #6366f1 Indigo
            tertiaryColor: [56, 189, 248], // #38bdf8 Light Cyan
            baseOpacity: 0.15, // Subtle, peaceful
            pulseAmplitude: 0.05,
            pulseFrequency: 0.012, // Slow peaceful breath
            pulseRingCount: 0,
          };
      }
    };

    // Interpolation state variables for smooth visual transitions between states
    let curPrimary: [number, number, number] = [244, 63, 94];
    let curSecondary: [number, number, number] = [6, 182, 212];
    let curTertiary: [number, number, number] = [225, 29, 72];
    let curOpacity = 0.25;
    let curAmplitude = 0.1;
    let curFrequency = 0.024;
    let curRingCount = 1;

    // Occasional cosmic shooting stars
    const meteors: Meteor[] = [];
    let lastMeteorSpawn = Date.now();

    const spawnMeteor = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * (height * 0.4);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
      const speed = 7 + Math.random() * 5;
      meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 100,
        life: 0,
        maxLife: 35 + Math.random() * 25,
        color: Math.random() > 0.4 ? '#38bdf8' : '#fbbf24',
      });
    };

    // Parallax tracking
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = width / 2;
      const cy = height / 2;
      targetOffsetX = (e.clientX - cx) * 0.035;
      targetOffsetY = (e.clientY - cy) * 0.035;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax interpolation
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.05;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.05;

      const cx = width / 2 + currentOffsetX;
      const cy = height / 2 + currentOffsetY;

      // Update State Theme with smooth lerp
      const targetTheme = getThemeForState(systemStateRef.current);
      const LERP_FACTOR = 0.04;
      curPrimary = [
        curPrimary[0] + (targetTheme.primaryColor[0] - curPrimary[0]) * LERP_FACTOR,
        curPrimary[1] + (targetTheme.primaryColor[1] - curPrimary[1]) * LERP_FACTOR,
        curPrimary[2] + (targetTheme.primaryColor[2] - curPrimary[2]) * LERP_FACTOR,
      ];
      curSecondary = [
        curSecondary[0] + (targetTheme.secondaryColor[0] - curSecondary[0]) * LERP_FACTOR,
        curSecondary[1] + (targetTheme.secondaryColor[1] - curSecondary[1]) * LERP_FACTOR,
        curSecondary[2] + (targetTheme.secondaryColor[2] - curSecondary[2]) * LERP_FACTOR,
      ];
      curTertiary = [
        curTertiary[0] + (targetTheme.tertiaryColor[0] - curTertiary[0]) * LERP_FACTOR,
        curTertiary[1] + (targetTheme.tertiaryColor[1] - curTertiary[1]) * LERP_FACTOR,
        curTertiary[2] + (targetTheme.tertiaryColor[2] - curTertiary[2]) * LERP_FACTOR,
      ];
      curOpacity += (targetTheme.baseOpacity - curOpacity) * LERP_FACTOR;
      curAmplitude += (targetTheme.pulseAmplitude - curAmplitude) * LERP_FACTOR;
      curFrequency += (targetTheme.pulseFrequency - curFrequency) * LERP_FACTOR;
      curRingCount += (targetTheme.pulseRingCount - curRingCount) * LERP_FACTOR;

      // 1. RENDER DYNAMIC PULSE-BASED NEBULA GLOW
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const minDim = Math.min(width, height);
      const isUrgent =
        systemStateRef.current === 'major_decision' || systemStateRef.current === 'mission_executing';

      for (let i = 0; i < nebulaClouds.length; i++) {
        const cloud = nebulaClouds[i];
        if (!prefersReducedMotion) {
          cloud.driftAngle += cloud.driftSpeed;
        }

        // Gentle orbital drift
        const driftDistX = Math.cos(cloud.driftAngle) * 35;
        const driftDistY = Math.sin(cloud.driftAngle) * 25;
        const cloudX = width * cloud.relX + driftDistX + currentOffsetX * 0.4;
        const cloudY = height * cloud.relY + driftDistY + currentOffsetY * 0.4;

        // Dynamic pulse wave calculation
        const pulseWave = Math.sin(tick * curFrequency + cloud.phaseOffset);
        const activePulse = 1 + pulseWave * curAmplitude;
        const cloudRadius = minDim * cloud.radiusRatio * activePulse;

        // Calculate opacity based on pulse & current state
        const cloudAlpha = Math.max(0.04, Math.min(0.85, (curOpacity + pulseWave * 0.08) * (i === 0 ? 1.2 : 0.9)));

        const [pr, pg, pb] = curPrimary.map(Math.round);
        const [sr, sg, sb] = curSecondary.map(Math.round);
        const [tr, tg, tb] = curTertiary.map(Math.round);

        // Multi-stop radial nebula gradient
        const nebulaGrad = ctx.createRadialGradient(cloudX, cloudY, cloudRadius * 0.05, cloudX, cloudY, cloudRadius);
        nebulaGrad.addColorStop(0, `rgba(${tr}, ${tg}, ${tb}, ${cloudAlpha * 1.1})`);
        nebulaGrad.addColorStop(0.35, `rgba(${pr}, ${pg}, ${pb}, ${cloudAlpha * 0.75})`);
        nebulaGrad.addColorStop(0.68, `rgba(${sr}, ${sg}, ${sb}, ${cloudAlpha * 0.3})`);
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = nebulaGrad;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. EXPANDING PULSE / SHOCKWAVE ENERGY RINGS (Active during major_decision & mission_executing)
      if (curRingCount > 0.5) {
        const ringOriginX = width * 0.5 + currentOffsetX * 0.5;
        const ringOriginY = height * 0.45 + currentOffsetY * 0.5;
        const ringCycle = 160;
        const [rr, rg, rb] = curTertiary.map(Math.round);

        for (let r = 0; r < Math.floor(curRingCount); r++) {
          const ringProgress = ((tick * (isUrgent ? 1.8 : 1.0) + (r * ringCycle) / curRingCount) % ringCycle) / ringCycle;
          const ringRadius = minDim * 0.1 + ringProgress * minDim * 0.75;
          const ringAlpha = Math.sin(ringProgress * Math.PI) * (isUrgent ? 0.32 : 0.12);

          ctx.beginPath();
          ctx.arc(ringOriginX, ringOriginY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${ringAlpha})`;
          ctx.lineWidth = isUrgent ? 2.2 : 1.2;
          ctx.stroke();
        }
      }

      ctx.restore();

      // 3. DRAW 3D PROCEDURAL STARS
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.prevZ = star.z;
        star.z -= SPEED;

        if (star.z <= 0) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * width * 2.2;
          star.y = (Math.random() - 0.5) * height * 2.2;
        }

        const k = FOV / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        // Clip out of screen
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) {
          continue;
        }

        // Depth-based size and opacity
        const depthRatio = 1 - star.z / MAX_DEPTH;
        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const alpha = Math.max(0.08, Math.min(0.95, depthRatio * twinkle));
        const radius = Math.max(0.5, star.size * k * 0.6);

        // Previous point for motion streaks on fast warp
        const prevK = FOV / star.prevZ;
        const prevPx = star.x * prevK + cx;
        const prevPy = star.y * prevK + cy;

        // Subtle motion streak
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = star.color;
        ctx.globalAlpha = alpha * 0.45;
        ctx.lineWidth = Math.max(0.5, radius * 0.8);
        ctx.stroke();

        // Star core point
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Soft halo on larger/closer stars
        if (radius > 1.2 && depthRatio > 0.45) {
          ctx.beginPath();
          ctx.arc(px, py, radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha * 0.18;
          ctx.fill();
        }
      }

      // 4. DRAW METEORS / SHOOTING STARS
      if (!prefersReducedMotion) {
        const now = Date.now();
        if (now - lastMeteorSpawn > (isUrgent ? 4000 : 7000) + Math.random() * 6000) {
          spawnMeteor();
          lastMeteorSpawn = now;
        }

        for (let m = meteors.length - 1; m >= 0; m--) {
          const met = meteors[m];
          met.life++;
          met.x += met.dx;
          met.y += met.dy;

          const progress = met.life / met.maxLife;
          const meteorAlpha = Math.sin(progress * Math.PI);

          const tailX = met.x - (met.dx / Math.hypot(met.dx, met.dy)) * met.len * (1 - progress * 0.4);
          const tailY = met.y - (met.dy / Math.hypot(met.dx, met.dy)) * met.len * (1 - progress * 0.4);

          const grad = ctx.createLinearGradient(tailX, tailY, met.x, met.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.7, met.color);
          grad.addColorStop(1, '#ffffff');

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(met.x, met.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = meteorAlpha * 0.8;
          ctx.stroke();

          // Glowing head
          ctx.beginPath();
          ctx.arc(met.x, met.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = meteorAlpha;
          ctx.fill();

          if (met.life >= met.maxLife) {
            meteors.splice(m, 1);
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="celestial-starfield-canvas"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full mix-blend-screen opacity-75 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
