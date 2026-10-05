import { CoulombEngine } from '../physics/CoulombEngine.ts';

export class GraphView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: CoulombEngine;
  private dpr: number = window.devicePixelRatio || 1;

  private currentR: number = 1.0;
  private currentF: number = 0;
  private q1: number = 2;
  private q2: number = -2;

  constructor(canvas: HTMLCanvasElement, engine: CoulombEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D canvas context for graph');
    }
    this.ctx = context;
    this.engine = engine;

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
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

  public update(rMeters: number, forceN: number, q1: number, q2: number): void {
    this.currentR = rMeters;
    this.currentF = forceN;
    this.q1 = q1;
    this.q2 = q2;
    this.render();
  }

  public render(): void {
    const ctx = this.ctx;
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, width, height);

    // Margins
    const padLeft = 70;
    const padRight = 16;
    const padTop = 22;
    const padBottom = 30;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    if (plotW <= 0 || plotH <= 0) {
      ctx.restore();
      return;
    }

    // Dynamic X range (distance in meters)
    const minR = 0.15;
    const maxR = 3.0;

    // Determine max F for scaling
    // Use theoretical force at 0.35m as reference ceiling to prevent low r blowout
    const refCeilF = Math.max(1e-4, this.engine.theoreticalForceAt(this.q1, this.q2, 0.4));
    const maxF = Math.max(this.currentF * 1.3, refCeilF * 1.5);

    // Helpers to map coordinates
    const toScreenX = (r: number) => padLeft + ((r - minR) / (maxR - minR)) * plotW;
    const toScreenY = (f: number) => padTop + plotH - (Math.min(f, maxF) / maxF) * plotH;

    // 1. Grid & Ticks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // Vertical grid ticks (r = 0.5, 1.0, 1.5, 2.0, 2.5)
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';

    for (let r = 0.5; r <= maxR; r += 0.5) {
      const sx = toScreenX(r);
      if (sx >= padLeft && sx <= padLeft + plotW) {
        ctx.beginPath();
        ctx.moveTo(sx, padTop);
        ctx.lineTo(sx, padTop + plotH);
        ctx.stroke();

        ctx.fillText(`${r.toFixed(1)}m`, sx, height - padBottom + 16);
      }
    }

    // Horizontal grid ticks (F = 25%, 50%, 75%, 100% of maxF)
    ctx.textAlign = 'right';
    for (let i = 1; i <= 3; i++) {
      const fVal = (maxF / 4) * i;
      const sy = toScreenY(fVal);
      ctx.beginPath();
      ctx.moveTo(padLeft, sy);
      ctx.lineTo(padLeft + plotW, sy);
      ctx.stroke();

      ctx.fillText(CoulombEngine.formatForce(fVal), padLeft - 6, sy + 3);
    }

    // 2. Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Y Axis
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    // X Axis
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Axis Labels: place clearly without colliding with ticks
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 10px "Inter", sans-serif';

    // X Axis Label
    ctx.textAlign = 'right';
    ctx.fillText('距離 r [m] →', padLeft + plotW, padTop + plotH - 6);

    // Y Axis Label placed cleanly above Y axis line
    ctx.textAlign = 'left';
    ctx.fillText('力 F [N] ↑', padLeft - 12, padTop - 6);

    // 3. Theoretical Curve: F(r) = k * |q1*q2| / r^2
    const chargeProduct = Math.abs(this.q1 * this.q2);
    if (chargeProduct > 1e-4) {
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      const steps = 60;
      let first = true;
      for (let i = 0; i <= steps; i++) {
        const r = minR + (i / steps) * (maxR - minR);
        const f = this.engine.theoreticalForceAt(this.q1, this.q2, r);
        const sx = toScreenX(r);
        const sy = toScreenY(f);

        if (first) {
          ctx.moveTo(sx, sy);
          first = false;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();

      // Subtle area fill under curve
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.lineTo(toScreenX(minR), padTop + plotH);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
      fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      fillGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      ctx.fillStyle = fillGrad;
      ctx.fill();
    }

    // 4. Current Operating Point Marker
    if (this.currentR >= minR && this.currentR <= maxR) {
      const curX = toScreenX(this.currentR);
      const curY = toScreenY(this.currentF);

      // Crosshairs to axes
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Drop to X axis
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX, padTop + plotH);
      // Drop to Y axis
      ctx.moveTo(curX, curY);
      ctx.lineTo(padLeft, curY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing dot
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(curX, curY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // White inner core
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Coordinate tooltip badge
      const tooltip = `(${this.currentR.toFixed(2)}m, ${CoulombEngine.formatForce(this.currentF)})`;
      ctx.font = '10px "JetBrains Mono", monospace';
      const badgeW = ctx.measureText(tooltip).width + 12;
      const badgeX = Math.min(padLeft + plotW - badgeW, Math.max(padLeft, curX - badgeW / 2));
      const badgeY = Math.max(padTop + 4, curY - 14);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY - 12, badgeW, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.textAlign = 'left';
      ctx.fillText(tooltip, badgeX + 6, badgeY);
    }

    ctx.restore();
  }
}
