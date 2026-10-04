import { PoyntingEngine } from '../physics/PoyntingEngine.ts';

export class EnergyBalanceGraphView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: PoyntingEngine;

  private dpr: number = 1;
  private padding = { top: 25, right: 30, bottom: 35, left: 55 };

  public highlightSeries: 'all' | 'stored' | 'escaped' | 'joule' = 'all';

  constructor(canvas: HTMLCanvasElement, engine: PoyntingEngine) {
    this.canvas = canvas;
    this.engine = engine;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context for EnergyBalanceGraphView');
    }
    this.ctx = context;
    this.handleResize();
  }

  public handleResize(): void {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const w = rect && rect.width > 0 ? rect.width : 340;
    const h = rect && rect.height > 0 ? rect.height : 220;

    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.render();
  }

  public render(): void {
    const ctx = this.ctx;
    const dpr = this.dpr;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // 1. Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const history = this.engine.history;
    if (history.length < 2) {
      this.drawPlaceholder(ctx, w, h);
      ctx.restore();
      return;
    }

    const pad = this.padding;
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // 2. Compute range
    let maxVal = 1e-3;
    for (const pt of history) {
      maxVal = Math.max(maxVal, pt.storedEnergy, pt.cumulativeEscaped, pt.totalEnergyAccount);
    }
    maxVal *= 1.15; // 15% head room

    // 3. Draw grid and axes
    this.drawGrid(ctx, pad, plotW, plotH, maxVal);

    // 4. Coordinates mapper
    const tStart = history[0].time;
    const tEnd = history[history.length - 1].time;
    const tSpan = Math.max(0.1, tEnd - tStart);

    const getX = (t: number) => pad.left + ((t - tStart) / tSpan) * plotW;
    const getY = (val: number) => pad.top + plotH - (val / maxVal) * plotH;

    // 5. Draw Total Energy Account (White Dashed Line)
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = getX(pt.time);
      const y = getY(pt.totalEnergyAccount);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // 6. Draw Cumulative Escaped Flux (Orange Line)
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = this.highlightSeries === 'escaped' ? 3.0 : 2.0;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = getX(pt.time);
      const y = getY(pt.cumulativeEscaped);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 7. Draw Stored Energy in Box W(t) (Cyan Line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = this.highlightSeries === 'stored' ? 3.5 : 2.2;
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = getX(pt.time);
      const y = getY(pt.storedEnergy);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 8. Draw current values on the right
    const latest = history[history.length - 1];
    const latestX = getX(latest.time);
    const latestYW = getY(latest.storedEnergy);
    const latestYEsc = getY(latest.cumulativeEscaped);

    // Pulsing dots at current points
    this.drawDot(ctx, latestX, latestYW, '#38bdf8');
    this.drawDot(ctx, latestX, latestYEsc, '#f97316');

    ctx.restore();
  }

  private drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    pad: { top: number; right: number; bottom: number; left: number },
    plotW: number,
    plotH: number,
    maxVal: number
  ): void {
    ctx.save();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const numTicks = 4;
    for (let i = 0; i <= numTicks; i++) {
      const yVal = (maxVal * i) / numTicks;
      const y = pad.top + plotH - (plotH * i) / numTicks;

      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();

      ctx.fillText(yVal.toFixed(2), pad.left - 8, y);
    }

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('時間 t [s]', pad.left + plotW / 2, pad.top + plotH + 22);

    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('エネルギー [J]', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  private drawPlaceholder(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('シミュレーション時間進行中...', w / 2, h / 2);
  }
}
