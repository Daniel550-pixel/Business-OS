import * as THREE from 'three';

// Procedural Canvas-based texture generator for high-definition 3D planets
export class PlanetTextureGenerator {
  private static createBaseCanvas(width: number = 1024, height: number = 512): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    return [canvas, ctx];
  }

  // 1. Planet UAE Twin (Terra-Emirates): Deep ocean, golden Arabian desert, coastal lines, glowing city clusters
  public static createUAETwinTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    // Ocean base gradient (deep azure to midnight navy)
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#041833');
    oceanGrad.addColorStop(0.5, '#021226');
    oceanGrad.addColorStop(1, '#031938');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Continental landmasses (Emirates golden deserts & coastlines)
    ctx.fillStyle = '#b8860b';
    // Arabian Gulf peninsula shape
    ctx.beginPath();
    ctx.ellipse(w * 0.48, h * 0.52, w * 0.16, h * 0.22, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Secondary continents
    ctx.fillStyle = '#996515';
    ctx.beginPath();
    ctx.ellipse(w * 0.22, h * 0.45, w * 0.14, h * 0.28, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b3820a';
    ctx.beginPath();
    ctx.ellipse(w * 0.78, h * 0.55, w * 0.15, h * 0.25, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Desert texture dunes & mountain ranges
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const x = (w * 0.38) + Math.random() * (w * 0.22);
      const y = (h * 0.40) + Math.random() * (h * 0.25);
      ctx.arc(x, y, 10 + Math.random() * 25, 0, Math.PI * 1.2);
      ctx.stroke();
    }

    // Glowing UAE City Clusters: Dubai & Abu Dhabi night lights (Gold/Cyan dots)
    const cities = [
      { x: w * 0.51, y: h * 0.49, r: 8, color: '#00ffff' }, // Dubai
      { x: w * 0.46, y: h * 0.54, r: 10, color: '#ffd700' }, // Abu Dhabi
      { x: w * 0.53, y: h * 0.47, r: 5, color: '#00e5ff' }, // Sharjah
      { x: w * 0.55, y: h * 0.52, r: 6, color: '#ffb700' }, // Al Ain
      { x: w * 0.54, y: h * 0.43, r: 5, color: '#38bdf8' }, // Ras Al Khaimah
      { x: w * 0.56, y: h * 0.48, r: 5, color: '#f59e0b' }, // Fujairah
    ];

    cities.forEach((c) => {
      const grad = ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, c.r * 2.5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, c.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Orbital latitude/longitude holographic grid traces
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let y = h * 0.2; y <= h * 0.8; y += h * 0.15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // 2. Planet Sensor Ingest (Chronos): Cyan crystalline surface with radar grids
  public static createSensorIngestTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    // Deep cyan gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#031b26');
    bg.addColorStop(0.5, '#053147');
    bg.addColorStop(1, '#021822');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Crystalline faceted polygons
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x += 60) {
      for (let y = 0; y < h; y += 50) {
        ctx.strokeRect(x + (y % 100 === 0 ? 30 : 0), y, 60, 50);
      }
    }

    // Radar pulse sweeping rings
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    for (let r = 20; r < 200; r += 35) {
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Glowing sensor nodes
    for (let i = 0; i < 30; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 3. Planet Causal Nexus (Understand): Neural dendritic pathways on deep indigo
  public static createCausalNexusTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0a0826';
    ctx.fillRect(0, 0, w, h);

    // Neural dendrite branches
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      let cx = Math.random() * w;
      let cy = Math.random() * h;
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 5; s++) {
        cx += (Math.random() - 0.5) * 80;
        cy += (Math.random() - 0.5) * 60;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Synaptic fire hubs
    for (let i = 0; i < 20; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      const rad = ctx.createRadialGradient(sx, sy, 1, sx, sy, 15);
      rad.addColorStop(0, '#ffffff');
      rad.addColorStop(0.4, '#a855f7');
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(sx, sy, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 4. Planet Agent Swarm (Hive): Electric purple hive world with geometric honeycomb patterns
  public static createAgentSwarmTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#150628');
    bg.addColorStop(0.5, '#260a45');
    bg.addColorStop(1, '#110321');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Honeycomb hexagonal grids
    const hexSize = 24;
    ctx.strokeStyle = 'rgba(216, 70, 239, 0.45)';
    ctx.lineWidth = 1.5;

    for (let x = 0; x < w; x += hexSize * 1.8) {
      for (let y = 0; y < h; y += hexSize * 1.5) {
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI / 3) * a;
          const hx = x + hexSize * Math.cos(angle);
          const hy = y + hexSize * Math.sin(angle);
          if (a === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Glowing swarm power vectors
    for (let i = 0; i < 15; i++) {
      const gx = Math.random() * w;
      const gy = Math.random() * h;
      const g = ctx.createRadialGradient(gx, gy, 2, gx, gy, 25);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, '#ec4899');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(gx, gy, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 5. Planet Simulation & Horizons (Horizon): Rose & magenta gas bands like Jupiter
  public static createSimulationHorizonTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    // Atmospheric bands
    const bandColors = [
      '#400424', '#700c3b', '#a21caf', '#db2777', '#f43f5e',
      '#be185d', '#831843', '#50072b', '#9d174d', '#f472b6',
    ];

    const bandH = h / bandColors.length;
    bandColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, idx * bandH, w, bandH);

      // Wavy turbulence swirls
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, idx * bandH + bandH * 0.5);
      for (let x = 0; x < w; x += 40) {
        const wave = Math.sin(x * 0.02) * (bandH * 0.3);
        ctx.lineTo(x, idx * bandH + bandH * 0.5 + wave);
      }
      ctx.lineTo(w, idx * bandH + bandH);
      ctx.lineTo(0, idx * bandH + bandH);
      ctx.fill();
    });

    // The Great 2035 Horizon Eye (red/rose storm vortex)
    const stormX = w * 0.65;
    const stormY = h * 0.58;
    const stormGrad = ctx.createRadialGradient(stormX, stormY, 5, stormX, stormY, 45);
    stormGrad.addColorStop(0, '#ffffff');
    stormGrad.addColorStop(0.3, '#f43f5e');
    stormGrad.addColorStop(0.7, '#881337');
    stormGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = stormGrad;
    ctx.beginPath();
    ctx.ellipse(stormX, stormY, 45, 25, -0.1, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 6. Planet Cryptographic Policy Gate (Aegis): Molten gold & solar amber fortress world
  public static createPolicyGateTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    // Rich molten amber base
    const amber = ctx.createLinearGradient(0, 0, w, 0);
    amber.addColorStop(0, '#2d1804');
    amber.addColorStop(0.5, '#452608');
    amber.addColorStop(1, '#2d1804');
    ctx.fillStyle = amber;
    ctx.fillRect(0, 0, w, h);

    // Hexagonal airlock fortress boundaries
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 80) {
      for (let y = 0; y < h; y += 80) {
        ctx.strokeRect(x, y, 76, 76);
      }
    }

    // Zero-drift lock runes & cryptographic hash lines
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillRect(rx, ry, 12, 3);
    }

    // Bright gold energy equator
    const equatorGrad = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.55);
    equatorGrad.addColorStop(0, 'transparent');
    equatorGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.8)');
    equatorGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = equatorGrad;
    ctx.fillRect(0, h * 0.45, w, h * 0.1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 7. Planet Actuation & Ledger (Forge): Emerald green technosphere with matrix data cubes
  public static createActuationForgeTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#022013';
    ctx.fillRect(0, 0, w, h);

    // Matrix data blocks
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < w; x += 40) {
      for (let y = 0; y < h; y += 40) {
        if (Math.random() > 0.4) {
          ctx.strokeRect(x + 5, y + 5, 30, 30);
        }
      }
    }

    // Glowing emerald conduits
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(w, h * 0.3);
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w, h * 0.7);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 8. Planet Closed-Loop Telemetry (Echo): Bioluminescent aquamarine ocean with ripple wave fronts
  public static createTelemetryEchoTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas();
    const w = canvas.width;
    const h = canvas.height;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#032024');
    bg.addColorStop(0.5, '#06434d');
    bg.addColorStop(1, '#02181b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Concentric wave ripple lines
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
    ctx.lineWidth = 2;
    for (let r = 10; r < w * 0.7; r += 30) {
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let r = 10; r < w * 0.7; r += 30) {
      ctx.beginPath();
      ctx.arc(w * 0.7, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Central Star Texture (AIOS Sovereign Sun)
  public static createSovereignStarTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas(512, 256);
    const w = canvas.width;
    const h = canvas.height;

    const sunGrad = ctx.createLinearGradient(0, 0, 0, h);
    sunGrad.addColorStop(0, '#ff9900');
    sunGrad.addColorStop(0.5, '#fff0a0');
    sunGrad.addColorStop(1, '#ff6600');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);

    // Solar flares and spots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 50; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      ctx.beginPath();
      ctx.arc(sx, sy, 5 + Math.random() * 15, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Supermassive Black Hole Quasar Accretion Disk Texture
  public static createQuasarAccretionTexture(): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas(1024, 1024);
    const cx = 512;
    const cy = 512;

    // Dark cosmic void base
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 1024);

    // Concentric swirling accretion gradient
    const grad = ctx.createRadialGradient(cx, cy, 80, cx, cy, 500);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)'); // Photon ring boundary
    grad.addColorStop(0.24, 'rgba(0, 240, 255, 0.9)');    // High-energy cyan plasma
    grad.addColorStop(0.42, 'rgba(120, 40, 255, 0.85)');  // Ultraviolet synchrotron
    grad.addColorStop(0.65, 'rgba(255, 140, 0, 0.7)');    // Relativistic amber Doppler shelf
    grad.addColorStop(0.85, 'rgba(255, 40, 0, 0.35)');    // Redshifted outer boundary
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 500, 0, Math.PI * 2);
    ctx.fill();

    // Swirling spiral relativistic arms
    for (let a = 0; a < 6; a++) {
      const startAngle = (a * Math.PI) / 3;
      ctx.strokeStyle = a % 2 === 0 ? 'rgba(0, 255, 255, 0.45)' : 'rgba(255, 200, 50, 0.4)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      for (let r = 100; r < 480; r += 10) {
        const theta = startAngle + (r / 50);
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (r === 100) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Companion Sun Texture
  public static createCompanionSunTexture(colorA: string = '#ffbb00', colorB: string = '#ff5500'): THREE.CanvasTexture {
    const [canvas, ctx] = this.createBaseCanvas(512, 256);
    const w = canvas.width;
    const h = canvas.height;

    const sunGrad = ctx.createLinearGradient(0, 0, 0, h);
    sunGrad.addColorStop(0, colorA);
    sunGrad.addColorStop(0.5, '#ffffff');
    sunGrad.addColorStop(1, colorB);
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 10, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Planetary Ring Generator (Translucent striped concentric ring texture)
  public static createRingTexture(colorHex: string, secondaryHex: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.2, colorHex);
    grad.addColorStop(0.4, 'transparent');
    grad.addColorStop(0.5, secondaryHex);
    grad.addColorStop(0.7, colorHex);
    grad.addColorStop(0.85, secondaryHex);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
