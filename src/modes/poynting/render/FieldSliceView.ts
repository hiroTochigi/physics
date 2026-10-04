import { PoyntingEngine } from '../physics/PoyntingEngine.ts';

export class FieldSliceView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private engine: PoyntingEngine;
  private dpr: number = 1;

  constructor(canvas: HTMLCanvasElement, engine: PoyntingEngine) {
    this.canvas = canvas;
    this.engine = engine;
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context for FieldSliceView');
    }
    this.ctx = context;
    this.handleResize();
  }

  public handleResize(): void {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const w = rect && rect.width > 0 ? rect.width : 500;
    const h = rect && rect.height > 0 ? rect.height : 450;

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

    // 1. Dark background
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, w, h);

    const source = this.engine.source;
    const t = this.engine.currentTime;
    const vol = this.engine.volume;

    const centerX = w / 2;
    const centerY = h / 2;
    const scale = Math.min(w, h) / 7.5; // Scale world units to screen pixels

    // 2. Draw coordinate grid & axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, h);
    ctx.stroke();

    // 3. Draw Bounding Box Slice (Dashed cyan rectangle)
    const boxW = vol.halfSizeX * 2 * scale;
    const boxH = vol.halfSizeZ * 2 * scale;
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(centerX - boxW / 2, centerY - boxH / 2, boxW, boxH);
    ctx.restore();

    // 4. Sample and draw Vector Grid (x in [-3.2, 3.2], z in [-3.2, 3.2])
    const range = 3.2;
    const step = 0.45;

    for (let x = -range; x <= range; x += step) {
      for (let z = -range; z <= range; z += step) {
        const r = Math.sqrt(x * x + z * z);
        if (r < 0.35) continue;

        const sample = source.evaluate(x, 0, z, t);
        const scrX = centerX + x * scale;
        const scrY = centerY - z * scale; // invert z to screen y

        // Draw Magnetic Field B (y-component perpendicular to slice)
        const By = sample.B.y;
        if (Math.abs(By) > 0.02) {
          ctx.save();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = '#60a5fa';
          ctx.fillStyle = '#60a5fa';
          const radius = Math.min(6, Math.max(2, Math.sqrt(Math.abs(By)) * 4.5));

          ctx.beginPath();
          ctx.arc(scrX, scrY, radius, 0, Math.PI * 2);
          ctx.stroke();

          if (By > 0) {
            // Out of screen (dot)
            ctx.beginPath();
            ctx.arc(scrX, scrY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Into screen (cross)
            const off = radius * 0.55;
            ctx.beginPath();
            ctx.moveTo(scrX - off, scrY - off);
            ctx.lineTo(scrX + off, scrY + off);
            ctx.moveTo(scrX + off, scrY - off);
            ctx.lineTo(scrX - off, scrY + off);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Draw Electric Field E (x and z components)
        const Ex = sample.E.x;
        const Ez = sample.E.z;
        const eLen = Math.sqrt(Ex * Ex + Ez * Ez);

        if (eLen > 0.01) {
          const arrowLen = Math.min(22, Math.max(6, Math.sqrt(eLen) * 16));
          const dirX = Ex / eLen;
          const dirY = -Ez / eLen; // screen y inverted

          ctx.save();
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(scrX, scrY);
          ctx.lineTo(scrX + dirX * arrowLen, scrY + dirY * arrowLen);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 5. Draw Central Dipole Rod
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(centerX - 3, centerY - 25, 6, 50);

    // Charge spheres
    const omega = source.omega;
    const amp = 18 * Math.cos(omega * t);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY - amp, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY + amp, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Labels & Legend
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('x 軸 (水平)', w - 65, centerY - 8);
    ctx.fillText('z 軸 (アンテナ軸)', centerX + 8, 20);

    ctx.restore();
  }
}
