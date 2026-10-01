import { Particle } from '../physics/Particle.ts';
import { CoulombEngine, ForceResult } from '../physics/CoulombEngine.ts';

export class Canvas2DView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: CoulombEngine;
  private particles: Particle[] = [];
  private activeDraggedParticle: Particle | null = null;
  private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  private dpr: number = window.devicePixelRatio || 1;

  public showGrid: boolean = true;
  public showVectors: boolean = true;
  public onStateChange?: () => void;

  constructor(canvas: HTMLCanvasElement, engine: CoulombEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D canvas context');
    }
    this.ctx = context;
    this.engine = engine;

    this.setupEvents();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  public setParticles(particles: Particle[]): void {
    this.particles = particles;
  }

  public handleResize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.render();
  }

  private setupEvents(): void {
    const getPos = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      const pos = getPos(e);
      for (const p of this.particles) {
        const dx = pos.x - p.x;
        const dy = pos.y - p.y;
        if (Math.hypot(dx, dy) <= p.radius + 10) {
          this.activeDraggedParticle = p;
          p.isDragging = true;
          this.dragOffset = { x: dx, y: dy };
          this.canvas.setPointerCapture(e.pointerId);
          this.canvas.style.cursor = 'grabbing';
          this.render();
          break;
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      const pos = getPos(e);

      if (this.activeDraggedParticle) {
        const p = this.activeDraggedParticle;
        const width = this.canvas.width / this.dpr;
        const height = this.canvas.height / this.dpr;
        const pad = p.radius + 15;

        // Keep inside canvas bounds
        p.x = Math.max(pad, Math.min(width - pad, pos.x - this.dragOffset.x));
        p.y = Math.max(pad, Math.min(height - pad, pos.y - this.dragOffset.y));

        this.render();
        if (this.onStateChange) this.onStateChange();
      } else {
        // Hover detection
        let hoveringAny = false;
        for (const p of this.particles) {
          const dx = pos.x - p.x;
          const dy = pos.y - p.y;
          const hovered = Math.hypot(dx, dy) <= p.radius + 8;
          if (p.isHovered !== hovered) {
            p.isHovered = hovered;
          }
          if (hovered) hoveringAny = true;
        }
        this.canvas.style.cursor = hoveringAny ? 'grab' : 'crosshair';
        this.render();
      }
    });

    const endDrag = (e: PointerEvent) => {
      if (this.activeDraggedParticle) {
        this.activeDraggedParticle.isDragging = false;
        this.activeDraggedParticle = null;
        try {
          this.canvas.releasePointerCapture(e.pointerId);
        } catch {
          // ignore if already released
        }
        this.canvas.style.cursor = 'grab';
        this.render();
        if (this.onStateChange) this.onStateChange();
      }
    };

    this.canvas.addEventListener('pointerup', endDrag);
    this.canvas.addEventListener('pointercancel', endDrag);
  }

  public render(): void {
    const ctx = this.ctx;
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Grid
    if (this.showGrid) {
      this.drawGrid(ctx, width, height);
    }

    if (this.particles.length >= 2) {
      const p1 = this.particles[0];
      const p2 = this.particles[1];
      const forceRes = this.engine.calculateForce(p1, p2);

      // 2. Distance measurement line and text
      this.drawDistanceIndicator(ctx, p1, p2, forceRes);

      // 3. Force vectors
      if (this.showVectors) {
        this.drawForceVectors(ctx, p1, p2, forceRes);
      }
    }

    // 4. Particles
    for (const p of this.particles) {
      this.drawParticle(ctx, p);
    }

    ctx.restore();
  }

  private drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gridSize = this.engine.pixelsPerMeter * 0.5; // 0.5 meter grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scale reference in bottom left
    const meterPx = this.engine.pixelsPerMeter;
    const scaleY = height - 20;
    const scaleX = 24;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY);
    ctx.lineTo(scaleX + meterPx, scaleY);
    ctx.moveTo(scaleX, scaleY - 4);
    ctx.lineTo(scaleX, scaleY + 4);
    ctx.moveTo(scaleX + meterPx, scaleY - 4);
    ctx.lineTo(scaleX + meterPx, scaleY + 4);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('1.0 m', scaleX + meterPx / 2 - 14, scaleY - 8);

    ctx.restore();
  }

  private drawDistanceIndicator(
    ctx: CanvasRenderingContext2D,
    p1: Particle,
    p2: Particle,
    forceRes: ForceResult
  ): void {
    ctx.save();

    // Dashed line between particles
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance label badge in midpoint
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const distText = `r = ${CoulombEngine.formatDistance(forceRes.distanceMeters)}`;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const textMetrics = ctx.measureText(distText);
    const boxW = textMetrics.width + 18;
    const boxH = 24;

    ctx.fillStyle = 'rgba(11, 15, 25, 0.92)';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    // Rounded rectangle
    const rx = midX - boxW / 2;
    const ry = midY - boxH / 2;
    ctx.beginPath();
    ctx.roundRect(rx, ry, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(distText, midX, midY);

    ctx.restore();
  }

  private drawForceVectors(
    ctx: CanvasRenderingContext2D,
    p1: Particle,
    p2: Particle,
    forceRes: ForceResult
  ): void {
    if (forceRes.magnitude < 1e-9) return;

    ctx.save();

    const vectorColor = forceRes.isAttraction ? '#f59e0b' : '#38bdf8';
    const forceText = CoulombEngine.formatForce(forceRes.magnitude);

    // Vector on Particle 1: starts at p1 surface, extends by forceOnP1
    const p1Angle = Math.atan2(forceRes.forceOnP1.y, forceRes.forceOnP1.x);
    const p1StartX = p1.x + Math.cos(p1Angle) * (p1.radius + 3);
    const p1StartY = p1.y + Math.sin(p1Angle) * (p1.radius + 3);
    const p1EndX = p1StartX + forceRes.forceOnP1.x;
    const p1EndY = p1StartY + forceRes.forceOnP1.y;

    this.drawArrow(ctx, p1StartX, p1StartY, p1EndX, p1EndY, vectorColor);
    this.drawForceLabel(ctx, p1, `F₁₂ = ${forceText}`, vectorColor, p1Angle);

    // Vector on Particle 2: starts at p2 surface, extends by forceOnP2
    const p2Angle = Math.atan2(forceRes.forceOnP2.y, forceRes.forceOnP2.x);
    const p2StartX = p2.x + Math.cos(p2Angle) * (p2.radius + 3);
    const p2StartY = p2.y + Math.sin(p2Angle) * (p2.radius + 3);
    const p2EndX = p2StartX + forceRes.forceOnP2.x;
    const p2EndY = p2StartY + forceRes.forceOnP2.y;

    this.drawArrow(ctx, p2StartX, p2StartY, p2EndX, p2EndY, vectorColor);
    this.drawForceLabel(ctx, p2, `F₂₁ = ${forceText}`, vectorColor, p2Angle);

    ctx.restore();
  }

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string
  ): void {
    const headLength = 14;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const length = Math.hypot(dx, dy);

    if (length < 8) return;

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    // Shaft
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  private drawForceLabel(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    label: string,
    color: string,
    vectorAngle: number
  ): void {
    // Position force label directly below particle (or offset if arrow points straight down)
    const pointsStraightDown = Math.sin(vectorAngle) > 0.8;
    const labelX = pointsStraightDown ? p.x + p.radius + 32 : p.x;
    const labelY = pointsStraightDown ? p.y : p.y + p.radius + 18;

    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const textW = ctx.measureText(label).width + 12;

    ctx.fillStyle = 'rgba(11, 15, 25, 0.92)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(labelX - textW / 2, labelY - 9, textW, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, labelX, labelY + 4);
  }

  private drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save();

    const isPos = p.isPositive;
    const isNeg = p.isNegative;

    let baseColor = '#94a3b8'; // Neutral
    let glowColor = 'rgba(148, 163, 184, 0.4)';

    if (isPos) {
      baseColor = '#ef4444';
      glowColor = 'rgba(239, 68, 68, 0.5)';
    } else if (isNeg) {
      baseColor = '#3b82f6';
      glowColor = 'rgba(59, 130, 246, 0.5)';
    }

    // Outer interactive aura on hover / drag
    if (p.isDragging || p.isHovered) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = p.isDragging ? glowColor : 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
    }

    // Radial glow
    const gradGlow = ctx.createRadialGradient(p.x, p.y, p.radius * 0.5, p.x, p.y, p.radius * 2);
    gradGlow.addColorStop(0, glowColor);
    gradGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradGlow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Particle sphere body with 3D spherical gradient
    const grad = ctx.createRadialGradient(
      p.x - p.radius * 0.3,
      p.y - p.radius * 0.3,
      p.radius * 0.1,
      p.x,
      p.y,
      p.radius
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, baseColor);
    grad.addColorStop(1, this.darkenColor(baseColor, 0.5));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central symbol (+ or - or 0)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const symbol = isPos ? '+' : isNeg ? '−' : '0';
    ctx.fillText(symbol, p.x, p.y);

    // Charge magnitude label above particle
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const qText = `${p.id}: ${p.q > 0 ? '+' : ''}${p.q.toFixed(1)} μC`;
    const qW = ctx.measureText(qText).width + 12;
    const labelY = p.y - p.radius - 14;

    ctx.fillStyle = 'rgba(11, 15, 25, 0.92)';
    ctx.strokeStyle = isPos ? 'rgba(239, 68, 68, 0.6)' : isNeg ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(p.x - qW / 2, labelY - 9, qW, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPos ? '#fecaca' : isNeg ? '#bfdbfe' : '#ffffff';
    ctx.fillText(qText, p.x, labelY);

    ctx.restore();
  }

  private darkenColor(hex: string, factor: number): string {
    if (hex.startsWith('#')) {
      const num = parseInt(hex.slice(1), 16);
      const r = Math.floor(((num >> 16) & 255) * factor);
      const g = Math.floor(((num >> 8) & 255) * factor);
      const b = Math.floor((num & 255) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return hex;
  }
}
