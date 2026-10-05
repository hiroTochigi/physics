export interface Vector2D {
  x: number;
  y: number;
}

export class Particle {
  public id: string;
  public x: number; // Screen coordinate or world coordinate
  public y: number;
  public q: number; // Charge in micro-coulombs (μC)
  public radius: number;
  public isDragging: boolean = false;
  public isHovered: boolean = false;

  constructor(id: string, x: number, y: number, q: number, radius: number = 24) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.q = q;
    this.radius = radius;
  }

  public get isPositive(): boolean {
    return this.q > 0;
  }

  public get isNegative(): boolean {
    return this.q < 0;
  }

  public get isNeutral(): boolean {
    return this.q === 0;
  }

  public distanceTo(other: Particle): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public directionTo(other: Particle): Vector2D {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1e-6) {
      return { x: 1, y: 0 };
    }
    return { x: dx / dist, y: dy / dist };
  }
}
