import { ChargePoint, FaradayState, TestBall } from '../FaradayTypes.ts';
import { FaradayPhysics } from '../physics/FaradayPhysics.ts';
import { faradaySounds } from '../audio/FaradaySoundEffects.ts';

interface StreamParticle {
  lineIndex: number;
  t: number; // 0 to 1 along line
  speed: number;
}

export class FaradayCanvasView {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: FaradayState;
  private onStateChange: (state: FaradayState) => void;

  private isRunning: boolean = true;
  private animFrameId: number | null = null;
  private draggingCharge: ChargePoint | null = null;

  // Particle simulation along field lines
  private fieldLinePaths: Array<Array<{ x: number; y: number }>> = [];
  private particles: StreamParticle[] = [];
  private lastTime: number = 0;

  // Mouse & Loupe coordinates
  private mouseCanvasX: number = 0;
  private mouseCanvasY: number = 0;
  private isMouseOver: boolean = false;

  // Track discovered unique sniper points (using rounded grid keys)
  private discoveredSniperPoints: Set<string> = new Set();

  constructor(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    initialState: FaradayState,
    onStateChange: (state: FaradayState) => void
  ) {
    this.container = container;
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D context not supported');
    this.ctx = context;
    this.state = initialState;
    this.onStateChange = onStateChange;

    this.resize();
    this.recomputeFieldLines();
    this.initParticles();
    this.bindEvents();
    this.start();
  }

  public updateState(newState: FaradayState): void {
    const presetChanged = newState.presetId !== this.state.presetId;
    const chargesChanged = newState.charges.length !== this.state.charges.length;
    this.state = newState;

    if (presetChanged || chargesChanged) {
      this.recomputeFieldLines();
      this.initParticles();
    }
  }

  public resize(): void {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.scale(dpr, dpr);
    this.recomputeFieldLines();
  }

  private start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    const loop = (now: number) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;
      this.updatePhysics(dt);
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    faradaySounds.stopTheremin();
  }

  private recomputeFieldLines(): void {
    this.fieldLinePaths = [];
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2;

    const maxSteps = 160;
    const stepSize = 4.0;

    for (const c of this.state.charges) {
      if (c.q <= 0) continue; // Trace starting from positive charges
      const numLines = Math.min(24, Math.max(12, Math.round(c.q * 16)));
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        let currX = cx + c.x + Math.cos(angle) * 14;
        let currY = cy + c.y + Math.sin(angle) * 14;
        const linePath: Array<{ x: number; y: number }> = [{ x: currX, y: currY }];

        for (let s = 0; s < maxSteps; s++) {
          const simX = currX - cx;
          const simY = currY - cy;
          const res = FaradayPhysics.stepSteepestDescent(simX, simY, this.state.charges, stepSize);
          currX = cx + res.nextX;
          currY = cy + res.nextY;
          linePath.push({ x: currX, y: currY });

          if (res.reachedSink) break;
          if (currX < -50 || currX > w + 50 || currY < -50 || currY > h + 50) break;
        }

        if (linePath.length > 2) {
          this.fieldLinePaths.push(linePath);
        }
      }
    }
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.fieldLinePaths.length; i++) {
      const line = this.fieldLinePaths[i];
      if (line.length < 3) continue;
      // 2 particles per field line
      this.particles.push({ lineIndex: i, t: Math.random(), speed: 0.25 + Math.random() * 0.15 });
      this.particles.push({ lineIndex: i, t: Math.random(), speed: 0.25 + Math.random() * 0.15 });
    }
  }

  private updatePhysics(dt: number): void {
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2;

    // 1. Update Test Balls
    const updatedBalls: TestBall[] = [];
    for (const ball of this.state.testBalls) {
      if (!ball.active) continue;
      const simX = ball.x - cx;
      const simY = ball.y - cy;
      const res = FaradayPhysics.stepSteepestDescent(simX, simY, this.state.charges, 4.5);
      ball.x = cx + res.nextX;
      ball.y = cy + res.nextY;
      ball.trail.push({ x: ball.x, y: ball.y });

      if (ball.trail.length > 200) {
        ball.trail.shift();
      }

      if (res.reachedSink || ball.x < 0 || ball.x > w || ball.y < 0 || ball.y > h) {
        ball.active = false;
      } else {
        updatedBalls.push(ball);
      }
    }
    this.state.testBalls = updatedBalls;

    // 2. Update Stream particles
    const tubeInfo = FaradayPhysics.calculateFluxTube(this.state.fluxTubeSqueeze);
    for (const p of this.particles) {
      const line = this.fieldLinePaths[p.lineIndex];
      if (!line || line.length < 2) continue;
      // In tube mode, central lines accelerate
      const isCenterLine = Math.abs(p.lineIndex - Math.floor(this.fieldLinePaths.length / 2)) < 3;
      const multiplier = this.state.showFluxTube && isCenterLine ? tubeInfo.particleSpeed : 1.0;
      p.t += (p.speed * multiplier * dt);
      if (p.t > 1.0) p.t = 0.0;
    }
  }

  private render(): void {
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Render Background Potential Elevation Contour Heatmap
    this.renderPotentialField(w, h, cx, cy);

    // 2. Render Equipotential Lines (等高線)
    if (this.state.showEquipotentialLines) {
      this.renderEquipotentialContours(w, h, cx, cy);
    }

    // 3. Render Flux Tube highlight if active
    if (this.state.showFluxTube) {
      this.renderFluxTube();
    }

    // 4. Render Electric Field Lines
    if (this.state.showFieldLines) {
      this.renderFieldLines();
    }

    // 5. Render Stream Particles (光の粒子)
    if (this.state.showParticles) {
      this.renderStreamParticles();
    }

    // 6. Render Test Charge Balls & Glowing Trails
    this.renderTestBalls();

    // 7. Render Charges (+ / -)
    this.renderCharges(cx, cy);

    // 8. Render 90° Orthogonal Loupe Inspector (when mouse is inside canvas)
    if (this.isMouseOver) {
      this.renderOrthogonalLoupe(cx, cy);
    }
  }

  private renderPotentialField(w: number, h: number, cx: number, cy: number): void {
    // Subtle background mesh/dots
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;
    const step = 40;
    this.ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
    }
    this.ctx.stroke();

    // Potential radial glow around charges
    for (const c of this.state.charges) {
      const scrX = cx + c.x;
      const scrY = cy + c.y;
      const grad = this.ctx.createRadialGradient(scrX, scrY, 10, scrX, scrY, 180);
      if (c.q > 0) {
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
      }
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(scrX, scrY, 180, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderEquipotentialContours(w: number, h: number, cx: number, cy: number): void {
    // Render smooth discrete concentric / hyperbolic equipotential contour rings
    const sampleLevels = [-60, -40, -25, -15, -8, 8, 15, 25, 40, 60];
    const gridStep = 8;
    const cols = Math.floor(w / gridStep) + 1;
    const rows = Math.floor(h / gridStep) + 1;

    // Simple marching / threshold contour rendering for speed & beauty
    this.ctx.save();
    this.ctx.lineWidth = 1.2;

    for (const level of sampleLevels) {
      this.ctx.strokeStyle = level > 0 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(96, 165, 250, 0.35)';
      if (Math.abs(level) === 25) {
        this.ctx.strokeStyle = level > 0 ? 'rgba(248, 113, 113, 0.65)' : 'rgba(96, 165, 250, 0.65)';
        this.ctx.lineWidth = 1.6;
      } else {
        this.ctx.lineWidth = 1.0;
      }

      this.ctx.beginPath();
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const x0 = c * gridStep;
          const y0 = r * gridStep;
          const p0 = FaradayPhysics.calculatePotential(x0 - cx, y0 - cy, this.state.charges);
          const p1 = FaradayPhysics.calculatePotential(x0 + gridStep - cx, y0 - cy, this.state.charges);
          const p2 = FaradayPhysics.calculatePotential(x0 - cx, y0 + gridStep - cy, this.state.charges);

          // Horizontal crossing
          if ((p0 - level) * (p1 - level) < 0) {
            const t = (level - p0) / (p1 - p0);
            this.ctx.moveTo(x0 + t * gridStep, y0);
            this.ctx.lineTo(x0 + t * gridStep, y0 + 3);
          }
          // Vertical crossing
          if ((p0 - level) * (p2 - level) < 0) {
            const t = (level - p0) / (p2 - p0);
            this.ctx.moveTo(x0, y0 + t * gridStep);
            this.ctx.lineTo(x0 + 3, y0 + t * gridStep);
          }
        }
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  private renderFluxTube(): void {
    if (this.fieldLinePaths.length < 2) return;
    const midIdx = Math.floor(this.fieldLinePaths.length / 2);
    const upperLine = this.fieldLinePaths[Math.max(0, midIdx - 1)];
    const lowerLine = this.fieldLinePaths[Math.min(this.fieldLinePaths.length - 1, midIdx + 1)];

    if (!upperLine || !lowerLine || upperLine.length < 3 || lowerLine.length < 3) return;

    const tubeInfo = FaradayPhysics.calculateFluxTube(this.state.fluxTubeSqueeze);

    this.ctx.save();
    this.ctx.fillStyle = tubeInfo.flowColor === '#ef4444'
      ? 'rgba(239, 68, 68, 0.18)'
      : tubeInfo.flowColor === '#f59e0b'
      ? 'rgba(245, 158, 11, 0.16)'
      : 'rgba(56, 189, 248, 0.14)';
    this.ctx.strokeStyle = tubeInfo.flowColor;
    this.ctx.lineWidth = 1.8;
    this.ctx.setLineDash([4, 4]);

    // Draw shaded polygon tube
    this.ctx.beginPath();
    this.ctx.moveTo(upperLine[0].x, upperLine[0].y);
    for (let i = 1; i < upperLine.length; i++) {
      this.ctx.lineTo(upperLine[i].x, upperLine[i].y);
    }
    for (let i = lowerLine.length - 1; i >= 0; i--) {
      this.ctx.lineTo(lowerLine[i].x, lowerLine[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Cross-section ring in the middle
    const midPointIdx = Math.floor(upperLine.length * 0.45);
    const pU = upperLine[midPointIdx];
    const pL = lowerLine[midPointIdx];
    if (pU && pL) {
      this.ctx.setLineDash([]);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.moveTo(pU.x, pU.y);
      this.ctx.lineTo(pL.x, pL.y);
      this.ctx.stroke();

      // Label: ΔS
      this.ctx.fillStyle = '#fef08a';
      this.ctx.font = 'bold 11px var(--font-mono, monospace)';
      const midX = (pU.x + pL.x) / 2;
      const midY = (pU.y + pL.y) / 2;
      this.ctx.fillText(`ΔS = ${tubeInfo.areaS.toFixed(0)}`, midX + 8, midY - 6);
      this.ctx.fillText(`E = ${tubeInfo.electricFieldE.toFixed(0)}`, midX + 8, midY + 10);
    }

    this.ctx.restore();
  }

  private renderFieldLines(): void {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    this.ctx.lineWidth = 1.4;

    for (const line of this.fieldLinePaths) {
      if (line.length < 2) continue;
      this.ctx.beginPath();
      this.ctx.moveTo(line[0].x, line[0].y);
      for (let i = 1; i < line.length; i++) {
        this.ctx.lineTo(line[i].x, line[i].y);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  private renderStreamParticles(): void {
    const tubeInfo = FaradayPhysics.calculateFluxTube(this.state.fluxTubeSqueeze);

    for (const p of this.particles) {
      const line = this.fieldLinePaths[p.lineIndex];
      if (!line || line.length < 2) continue;

      const idxFloat = p.t * (line.length - 1);
      const idx = Math.floor(idxFloat);
      const frac = idxFloat - idx;
      const pt1 = line[idx];
      const pt2 = line[Math.min(line.length - 1, idx + 1)];
      if (!pt1 || !pt2) continue;

      const x = pt1.x + (pt2.x - pt1.x) * frac;
      const y = pt1.y + (pt2.y - pt1.y) * frac;

      const isCenterLine = Math.abs(p.lineIndex - Math.floor(this.fieldLinePaths.length / 2)) < 3;
      const color = this.state.showFluxTube && isCenterLine ? tubeInfo.flowColor : '#38bdf8';
      const radius = this.state.showFluxTube && isCenterLine ? 3.0 : 2.0;

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderTestBalls(): void {
    for (const ball of this.state.testBalls) {
      // Trail
      if (ball.trail.length > 1) {
        this.ctx.save();
        this.ctx.strokeStyle = ball.color;
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(ball.trail[0].x, ball.trail[0].y);
        for (let i = 1; i < ball.trail.length; i++) {
          this.ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
        }
        this.ctx.stroke();
        this.ctx.restore();
      }

      // Ball head
      if (ball.active) {
        this.ctx.save();
        this.ctx.fillStyle = '#facc15';
        this.ctx.shadowColor = '#fde047';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  private renderCharges(cx: number, cy: number): void {
    for (const c of this.state.charges) {
      const scrX = cx + c.x;
      const scrY = cy + c.y;
      const isPos = c.q > 0;

      this.ctx.save();
      // Glow circle
      this.ctx.fillStyle = isPos ? '#ef4444' : '#3b82f6';
      this.ctx.shadowColor = isPos ? '#f87171' : '#60a5fa';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(scrX, scrY, 15, 0, Math.PI * 2);
      this.ctx.fill();

      // Sign text (+ or -)
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 16px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(isPos ? '+' : '−', scrX, scrY);

      // Label: +1C or -1C
      this.ctx.font = '10px var(--font-mono, monospace)';
      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.fillText(`${c.q > 0 ? '+' : ''}${c.q} C`, scrX, scrY + 24);

      this.ctx.restore();
    }
  }

  private renderOrthogonalLoupe(cx: number, cy: number): void {
    const mx = this.mouseCanvasX;
    const my = this.mouseCanvasY;
    const simX = mx - cx;
    const simY = my - cy;

    const { ex, ey, mag } = FaradayPhysics.calculateElectricField(simX, simY, this.state.charges);
    const phi = FaradayPhysics.calculatePotential(simX, simY, this.state.charges);
    const { tx, ty } = FaradayPhysics.calculateEquipotentialTangent(ex, ey, mag);

    // Inner product E・T = 0
    const innerProd = (ex * tx + ey * ty) / (mag || 1);
    const angleDeg = 90.0; // By definition of equipotential normal

    // Update state & HUD readout
    this.state.cursorPotential = phi;
    this.state.cursorEFieldMag = mag;
    this.state.cursorAngleDeg = angleDeg;
    this.state.cursorInnerProduct = innerProd;

    // Check sniper goal: if close to any field line, trigger snap
    let nearestDist = 999;
    let snapPt: { x: number; y: number } | null = null;
    for (const line of this.fieldLinePaths) {
      for (const pt of line) {
        const d = Math.sqrt((pt.x - mx) * (pt.x - mx) + (pt.y - my) * (pt.y - my));
        if (d < nearestDist) {
          nearestDist = d;
          snapPt = pt;
        }
      }
    }

    const isSnapped = nearestDist < 25 && snapPt !== null;
    const drawX = isSnapped && snapPt ? snapPt.x : mx;
    const drawY = isSnapped && snapPt ? snapPt.y : my;

    if (isSnapped) {
      const snapKey = `${Math.round(drawX / 30)}_${Math.round(drawY / 30)}`;
      if (!this.discoveredSniperPoints.has(snapKey)) {
        this.discoveredSniperPoints.add(snapKey);
        this.state.sniperSnappedCount = Math.min(3, this.discoveredSniperPoints.size);
        faradaySounds.play90DegreeSnap();

        if (this.state.sniperSnappedCount >= 3 && !this.state.sniperBadgeUnlocked) {
          this.state.sniperBadgeUnlocked = true;
          faradaySounds.playSuccessFanfare();
        }
        this.onStateChange(this.state);
      }
    }

    // Draw Loupe Circle
    this.ctx.save();
    this.ctx.strokeStyle = isSnapped ? '#10b981' : '#38bdf8';
    this.ctx.lineWidth = 2.0;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    this.ctx.beginPath();
    this.ctx.arc(drawX, drawY, 32, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Crosshairs
    this.ctx.strokeStyle = isSnapped ? 'rgba(16, 185, 129, 0.5)' : 'rgba(56, 189, 248, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(drawX - 32, drawY);
    this.ctx.lineTo(drawX + 32, drawY);
    this.ctx.moveTo(drawX, drawY - 32);
    this.ctx.lineTo(drawX, drawY + 32);
    this.ctx.stroke();

    if (mag > 0.05) {
      // 1. E vector (Steepest Descent, Red arrow)
      const eLen = 26;
      const eDx = (ex / mag) * eLen;
      const eDy = (ey / mag) * eLen;
      this.ctx.strokeStyle = '#ef4444';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(drawX, drawY);
      this.ctx.lineTo(drawX + eDx, drawY + eDy);
      this.ctx.stroke();

      // 2. Tangent vector (Equipotential Contour, Cyan arrow)
      const tLen = 26;
      const tDx = tx * tLen;
      const tDy = ty * tLen;
      this.ctx.strokeStyle = '#06b6d4';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(drawX, drawY);
      this.ctx.lineTo(drawX + tDx, drawY + tDy);
      this.ctx.stroke();

      // 3. Right Angle (90° square symbol)
      const sqSize = 8;
      const normEx = ex / mag;
      const normEy = ey / mag;
      this.ctx.strokeStyle = isSnapped ? '#10b981' : '#facc15';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(drawX + normEx * sqSize, drawY + normEy * sqSize);
      this.ctx.lineTo(drawX + (normEx + tx) * sqSize, drawY + (normEy + ty) * sqSize);
      this.ctx.lineTo(drawX + tx * sqSize, drawY + ty * sqSize);
      this.ctx.stroke();

      // Badge Label: 90.0°
      this.ctx.fillStyle = isSnapped ? '#10b981' : '#fef08a';
      this.ctx.font = 'bold 11px var(--font-mono, monospace)';
      this.ctx.fillText('90.0° 直交', drawX + 38, drawY - 10);
      this.ctx.font = '9px var(--font-mono, monospace)';
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.fillText('E · dr = 0 (仕事ゼロ)', drawX + 38, drawY + 6);
      this.ctx.fillText(`標高 φ = ${phi.toFixed(1)}V`, drawX + 38, drawY + 20);
    }

    this.ctx.restore();
  }

  public launchTestBall(canvasX?: number, canvasY?: number): void {
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    const spawnX = canvasX !== undefined ? canvasX : w * 0.35 + (Math.random() - 0.5) * 40;
    const spawnY = canvasY !== undefined ? canvasY : h * 0.35 + (Math.random() - 0.5) * 40;

    const newBall: TestBall = {
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      trail: [{ x: spawnX, y: spawnY }],
      active: true,
      color: '#facc15'
    };

    this.state.testBalls.push(newBall);
    faradaySounds.playBallLaunch();
  }

  private bindEvents(): void {
    // Mouse Move
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseCanvasX = e.clientX - rect.left;
      this.mouseCanvasY = e.clientY - rect.top;
      this.isMouseOver = true;

      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);
      const simX = this.mouseCanvasX - w / 2;
      const simY = this.mouseCanvasY - h / 2;

      // Handle charge dragging
      if (this.draggingCharge) {
        this.draggingCharge.x = simX;
        this.draggingCharge.y = simY;
        this.recomputeFieldLines();
        this.initParticles();
        this.onStateChange(this.state);
      }

      // Update Theremin sound based on potential!
      const phi = FaradayPhysics.calculatePotential(simX, simY, this.state.charges);
      faradaySounds.updateThereminPotential(phi);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseOver = false;
      this.draggingCharge = null;
      faradaySounds.stopTheremin();
    });

    // Mouse Down (Check if clicking a charge to drag, or clicking to spawn ball)
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);
      const simX = x - w / 2;
      const simY = y - h / 2;

      let hitCharge: ChargePoint | null = null;
      for (const c of this.state.charges) {
        const dx = simX - c.x;
        const dy = simY - c.y;
        if (Math.sqrt(dx * dx + dy * dy) < 22) {
          hitCharge = c;
          break;
        }
      }

      if (hitCharge) {
        this.draggingCharge = hitCharge;
        faradaySounds.playClick();
      } else {
        // Spawn test charge ball
        this.launchTestBall(x, y);
      }
    });

    window.addEventListener('mouseup', () => {
      this.draggingCharge = null;
    });
  }
}
