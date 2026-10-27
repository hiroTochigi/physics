import { ElectronState } from '../ElectronTypes.ts';

interface InternalCharge {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export class ElectronCanvasView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;
  private animFrameId: number | null = null;
  private state: ElectronState;

  // Particle simulation for internal charges
  private internalCharges: InternalCharge[] = [];
  private readonly numCharges: number = 18;
  private time: number = 0;

  // Visual effects
  private pulsePhase: number = 0;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, initialState: ElectronState) {
    this.container = container;
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D context not available');
    this.ctx = context;
    this.state = initialState;

    this.initInternalCharges();
    this.resize();
    this.startLoop();
  }

  private initInternalCharges(): void {
    this.internalCharges = [];
    for (let i = 0; i < this.numCharges; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.85;
      this.internalCharges.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        radius: 4
      });
    }
  }

  public updateState(newState: ElectronState): void {
    this.state = newState;
  }

  public resize(): void {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(300, rect.width);
    const height = Math.max(260, rect.height);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }

  private startLoop(): void {
    const render = () => {
      this.time += 0.02;
      this.draw();
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  public stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private draw(): void {
    const width = parseFloat(this.canvas.style.width) || 400;
    const height = parseFloat(this.canvas.style.height) || 400;
    const cx = width / 2;
    const cy = height / 2;

    this.ctx.save();

    // Glitch / screen vibration when diverged or near singularity
    if (this.state.isDiverged) {
      const shakeX = (Math.random() - 0.5) * 8;
      const shakeY = (Math.random() - 0.5) * 8;
      this.ctx.translate(shakeX, shakeY);
    } else if (this.state.radiusMeters < 1e-16 && this.state.radiusMeters > 0) {
      const ratio = 1 - Math.log10(this.state.radiusMeters) / -19;
      const shake = ratio * 3;
      this.ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }

    // Clear background
    this.ctx.fillStyle = '#080c14';
    this.ctx.fillRect(0, 0, width, height);

    // Draw coordinate space grid / field grid
    this.drawBackgroundGrid(width, height);

    // Calculate visual radius in pixels
    let visualRadius: number;
    if (this.state.isPointCharge || this.state.radiusMeters === 0) {
      visualRadius = 0;
    } else {
      // Map log10(R) [-19, -10] to pixel radius [14, 130]
      const logR = Math.log10(this.state.radiusMeters);
      const clampedLog = Math.max(-19, Math.min(-10, logR));
      const norm = (clampedLog - (-19)) / 9; // 0 (tiny) to 1 (large)
      visualRadius = 14 + norm * 116;
    }

    // 1. Draw Field Lines & Space Energy Glow
    this.drawFieldAndEnergy(cx, cy, visualRadius, width, height);

    // 2. Draw Central Electron Body / Singularity
    if (this.state.isPointCharge || this.state.radiusMeters === 0) {
      this.drawSingularity(cx, cy);
    } else {
      this.drawElectronSphere(cx, cy, visualRadius);
    }

    // 3. Draw Classical Radius Target Indicator if near balance
    this.drawTargetIndicator(cx, cy, visualRadius);

    this.ctx.restore();
  }

  private drawBackgroundGrid(width: number, height: number): void {
    this.ctx.strokeStyle = 'rgba(35, 48, 78, 0.4)';
    this.ctx.lineWidth = 1;
    const step = 40;
    this.ctx.beginPath();
    for (let x = 0; x < width; x += step) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += step) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
    }
    this.ctx.stroke();
  }

  private drawFieldAndEnergy(cx: number, cy: number, visualRadius: number, _width: number, _height: number): void {
    const innerR = Math.max(2, visualRadius);

    // Energy density aura: u = 1/2 eps0 E^2
    // Color transitions from soft cyan to intense violet to hot red
    let innerColor = 'rgba(59, 130, 246, 0.4)';
    let midColor = 'rgba(147, 51, 234, 0.25)';
    if (this.state.isDiverged) {
      innerColor = 'rgba(239, 68, 68, 0.8)';
      midColor = 'rgba(249, 115, 22, 0.5)';
    } else if (this.state.isBalanced) {
      innerColor = 'rgba(234, 179, 8, 0.7)';
      midColor = 'rgba(59, 130, 246, 0.4)';
    } else if (this.state.radiusMeters < 1e-15) {
      innerColor = 'rgba(236, 72, 153, 0.6)';
      midColor = 'rgba(239, 68, 68, 0.3)';
    }

    const auraGrad = this.ctx.createRadialGradient(cx, cy, innerR, cx, cy, innerR + 140);
    auraGrad.addColorStop(0, innerColor);
    auraGrad.addColorStop(0.4, midColor);
    auraGrad.addColorStop(1, 'rgba(8, 12, 20, 0)');

    this.ctx.fillStyle = auraGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, innerR + 140, 0, Math.PI * 2);
    this.ctx.fill();

    // Electric field lines (radial inward pointing for negative charge)
    if (this.state.showFieldLines) {
      const numLines = 16;
      this.ctx.strokeStyle = this.state.isDiverged
        ? 'rgba(239, 68, 68, 0.6)'
        : this.state.isBalanced
        ? 'rgba(250, 204, 21, 0.5)'
        : 'rgba(56, 189, 248, 0.4)';
      this.ctx.lineWidth = 1.5;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2 + this.time * 0.05;
        const startDist = Math.max(visualRadius + 4, 10);
        const endDist = startDist + 120;

        const x1 = cx + Math.cos(angle) * startDist;
        const y1 = cy + Math.sin(angle) * startDist;
        const x2 = cx + Math.cos(angle) * endDist;
        const y2 = cy + Math.sin(angle) * endDist;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Animated inbound particle along field line
        const animOffset = (this.time * 2 + i * 0.3) % 1;
        const px = x2 - (x2 - x1) * animOffset;
        const py = y2 - (y2 - y1) * animOffset;
        this.ctx.fillStyle = this.state.isDiverged ? '#f87171' : '#38bdf8';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private drawElectronSphere(cx: number, cy: number, r: number): void {
    // Sphere body gradient
    const grad = this.ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);

    if (this.state.isBalanced) {
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#eab308');
      grad.addColorStop(1, '#854d0e');
    } else if (this.state.radiusMeters < 1e-15) {
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.6, '#db2777');
      grad.addColorStop(1, '#831843');
    } else {
      grad.addColorStop(0, '#93c5fd');
      grad.addColorStop(0.6, '#3b82f6');
      grad.addColorStop(1, '#1e3a8a');
    }

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();

    // Glowing border
    this.ctx.strokeStyle = this.state.isBalanced
      ? '#fde047'
      : this.state.radiusMeters < 1e-15
      ? '#f43f5e'
      : '#60a5fa';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Internal miniature repelling charges
    if (r > 20) {
      this.drawInternalCharges(cx, cy, r);
    }

    // Center badge with -e
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = `bold ${Math.max(12, Math.min(22, r * 0.4))}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('-e', cx, cy);
  }

  private drawInternalCharges(cx: number, cy: number, r: number): void {
    const agitation = Math.min(6, 1 + (130 / r) * 0.6);

    for (const c of this.internalCharges) {
      // Agitate velocity
      c.x += c.vx * agitation;
      c.y += c.vy * agitation;

      const dist = Math.sqrt(c.x * c.x + c.y * c.y);
      if (dist > 0.8) {
        // Bounce back from sphere boundary
        c.vx = -c.vx + (Math.random() - 0.5) * 0.02;
        c.vy = -c.vy + (Math.random() - 0.5) * 0.02;
        c.x = (c.x / dist) * 0.78;
        c.y = (c.y / dist) * 0.78;
      }

      const px = cx + c.x * r;
      const py = cy + c.y * r;

      this.ctx.fillStyle = this.state.isBalanced ? '#fef08a' : '#bfdbfe';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Show repulsion tension lines between charges if small
      if (r < 60) {
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(px, py);
        this.ctx.stroke();
      }
    }
  }

  private drawSingularity(cx: number, cy: number): void {
    // Point charge explosion / singularity effect
    const pulse = Math.sin(this.time * 8) * 0.5 + 0.5;

    // Outer shockwave rings
    this.ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.4})`;
    this.ctx.lineWidth = 2;
    for (let ring = 1; ring <= 4; ring++) {
      const ringR = ((this.time * 40 * ring) % 120);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Black Hole / White Singularity Core
    const coreGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, '#ef4444');
    coreGrad.addColorStop(0.7, '#7f1d1d');
    coreGrad.addColorStop(1, 'rgba(8, 12, 20, 0)');

    this.ctx.fillStyle = coreGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    this.ctx.fill();

    // Danger HUD crosshairs
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 28, cy);
    this.ctx.lineTo(cx + 28, cy);
    this.ctx.moveTo(cx, cy - 28);
    this.ctx.lineTo(cx, cy + 28);
    this.ctx.stroke();

    // Warning Banner
    this.ctx.fillStyle = '#fee2e2';
    this.ctx.font = 'bold 13px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('⚠ SINGULARITY: U → ∞', cx, cy + 42);
    this.ctx.fillStyle = '#fca5a5';
    this.ctx.font = '11px sans-serif';
    this.ctx.fillText('点電荷の仮定により質量が発散！', cx, cy + 58);
  }

  private drawTargetIndicator(cx: number, cy: number, visualRadius: number): void {
    if (this.state.isBalanced) {
      // Golden halo & celebration
      this.pulsePhase += 0.05;
      const haloR = visualRadius + 14 + Math.sin(this.pulsePhase) * 4;

      this.ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([6, 4]);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.fillStyle = '#fef08a';
      this.ctx.font = 'bold 12px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('★ 質量と完全一致（古典電子半径）', cx, cy - visualRadius - 22);
    }
  }
}
