import { Vector2D, Particle } from './Particle.ts';
import { CoulombEngine } from './CoulombEngine.ts';

export class TestParticle {
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public q: number; // micro-Coulombs (+: positive, -: negative)
  public mass: number = 0.001; // kg
  public trail: Vector2D[] = [];
  public maxTrail: number = 30;
  public isAlive: boolean = true;
  public radius: number = 6;

  constructor(x: number, y: number, q: number = 0.5) {
    this.x = x;
    this.y = y;
    this.q = q;
  }

  public update(dt: number, engine: CoulombEngine, particles: Particle[], width: number, height: number): void {
    if (!this.isAlive) return;

    // Electric field at test particle location
    const eField = engine.calculateElectricField(this.x, this.y, particles);
    const qC = this.q * 1e-6; // Coulombs

    // F = q * E (in Newtons)
    const fx = qC * eField.ex;
    const fy = qC * eField.ey;

    // Acceleration in screen pixels / s^2
    const ax = (fx / this.mass) * engine.pixelsPerMeter;
    const ay = (fy / this.mass) * engine.pixelsPerMeter;

    // Clamp max acceleration to prevent erratic jumps near charges
    const aMag = Math.hypot(ax, ay);
    const maxA = 3500;
    const aScale = aMag > maxA ? maxA / aMag : 1;

    // Light drag damping for stable visual flow
    const damping = 0.97;
    this.vx = (this.vx + ax * aScale * dt) * damping;
    this.vy = (this.vy + ay * aScale * dt) * damping;

    // Clamp speed
    const speed = Math.hypot(this.vx, this.vy);
    const maxSpeed = 350;
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Update trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    // Boundary check
    const pad = 60;
    if (this.x < -pad || this.x > width + pad || this.y < -pad || this.y > height + pad) {
      this.isAlive = false;
    }

    // Absorbed on contact with source charge
    for (const p of particles) {
      const dist = Math.hypot(this.x - p.x, this.y - p.y);
      if (dist <= p.radius + 2) {
        this.isAlive = false;
        break;
      }
    }
  }
}
