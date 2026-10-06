import * as THREE from 'three';
import { ToolType } from '../MysteryTypes.ts';

/**
 * MysteryParticleSystem
 * Responsible for simulating and animating dynamic physical particle flows and wave emissions:
 * 1. Poynting Vector Flux Stream (160 photon particles bursting out of the Quartz Window)
 * 2. Joule Heat Convection Particles (130 thermal shimmer particles rising from the Floor Heater)
 * 3. Dynamic Spherical EM Wave Pulse Emission (Expanding concentric wave rings from the central antenna)
 */
export class MysteryParticleSystem {
  private scene: THREE.Scene;
  private half: number;

  // 1. Poynting Vector Dynamic Particle Flux Stream
  private poyntingPoints: THREE.Points | null = null;
  private poyntingVelocities: Float32Array | null = null;
  private poyntingTexture: THREE.CanvasTexture | null = null;
  private poyntingMat: THREE.PointsMaterial | null = null;

  // 2. Joule Heat Thermal Convection Particles
  private thermalPoints: THREE.Points | null = null;
  private thermalVelocities: Float32Array | null = null;
  private thermalTexture: THREE.CanvasTexture | null = null;
  private thermalMat: THREE.PointsMaterial | null = null;

  // 3. Dynamic Expanding EM Waves from Antenna
  private emPulseWaves: Array<{ mesh: THREE.Group; mat: THREE.MeshBasicMaterial }> = [];

  constructor(scene: THREE.Scene, half: number = 1.6) {
    this.scene = scene;
    this.half = half;

    this.buildPoyntingParticles();
    this.buildThermalParticles();
    this.buildEMWavePulses();
  }

  /**
   * Helper: Generate a circular glowing particle texture with radial gradient
   */
  private createRadialTexture(colorHex: string): THREE.CanvasTexture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, colorHex);
      gradient.addColorStop(0.65, colorHex + '88');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(center, center, center, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Poynting Particle Flow (Continuous beam streaming outward through Quartz Window)
   */
  private buildPoyntingParticles(): void {
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.poyntingVelocities = new Float32Array(count);

    const wx = 0.2;
    const wy = 0.0;
    const wz = this.half;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = wx + (Math.random() - 0.5) * 1.25;
      positions[i * 3 + 1] = wy + (Math.random() - 0.5) * 1.25;
      positions[i * 3 + 2] = wz - 0.05 + Math.random() * 1.5;

      this.poyntingVelocities[i] = 0.022 + Math.random() * 0.035;

      // Color gradient: Cyan near window, bright amber/gold as it exits
      const t = Math.random();
      colors[i * 3] = THREE.MathUtils.lerp(0.2, 1.0, t); // R
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.7, 0.55, t); // G
      colors[i * 3 + 2] = THREE.MathUtils.lerp(1.0, 0.08, t); // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.poyntingTexture = this.createRadialTexture('#f97316');
    this.poyntingMat = new THREE.PointsMaterial({
      size: 0.14,
      map: this.poyntingTexture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    this.poyntingPoints = new THREE.Points(geometry, this.poyntingMat);
    this.poyntingPoints.visible = false;
    this.scene.add(this.poyntingPoints);
  }

  /**
   * Joule Heat Thermal Convection Particles (Rising shimmer from Floor Heater)
   */
  private buildThermalParticles(): void {
    const count = 130;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.thermalVelocities = new Float32Array(count);

    const hx = -0.4;
    const hy = -this.half + 0.08;
    const hz = 0.3;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = hx + (Math.random() - 0.5) * 1.45;
      positions[i * 3 + 1] = hy + Math.random() * 0.9;
      positions[i * 3 + 2] = hz + (Math.random() - 0.5) * 1.05;

      this.thermalVelocities[i] = 0.007 + Math.random() * 0.014;

      // Thermal gradient: Bright fiery yellow at bottom to crimson/smoke higher up
      const t = Math.random();
      colors[i * 3] = 1.0; // R
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.75, 0.15, t); // G
      colors[i * 3 + 2] = THREE.MathUtils.lerp(0.15, 0.05, t); // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.thermalTexture = this.createRadialTexture('#ef4444');
    this.thermalMat = new THREE.PointsMaterial({
      size: 0.12,
      map: this.thermalTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    this.thermalPoints = new THREE.Points(geometry, this.thermalMat);
    this.thermalPoints.visible = false;
    this.scene.add(this.thermalPoints);
  }

  /**
   * Dynamic Spherical EM Wave Pulse Emission from Central Antenna
   */
  private buildEMWavePulses(): void {
    const pulseCount = 3;
    const waveRingMatBase = {
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    };

    for (let i = 0; i < pulseCount; i++) {
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial(waveRingMatBase);

      // Horizontal wave ring
      const ringGeoH = new THREE.RingGeometry(0.98, 1.02, 36);
      const ringH = new THREE.Mesh(ringGeoH, mat);
      ringH.rotation.x = Math.PI / 2;
      group.add(ringH);

      // Vertical diagonal wave ring 1
      const ringGeoV1 = new THREE.RingGeometry(0.98, 1.02, 36);
      const ringV1 = new THREE.Mesh(ringGeoV1, mat);
      ringV1.rotation.y = Math.PI / 4;
      group.add(ringV1);

      // Vertical diagonal wave ring 2
      const ringGeoV2 = new THREE.RingGeometry(0.98, 1.02, 36);
      const ringV2 = new THREE.Mesh(ringGeoV2, mat);
      ringV2.rotation.y = -Math.PI / 4;
      group.add(ringV2);

      this.scene.add(group);
      this.emPulseWaves.push({ mesh: group, mat });
    }
  }

  public setTool(tool: ToolType, isHeaterDiscovered: boolean, isWindowDiscovered: boolean): void {
    if (this.thermalPoints) {
      if (tool === 'thermal') {
        this.thermalPoints.visible = true;
        if (this.thermalMat) this.thermalMat.opacity = 0.95;
      } else {
        this.thermalPoints.visible = isHeaterDiscovered;
        if (this.thermalMat) this.thermalMat.opacity = 0.75;
      }
    }

    const isPoyntingActive = tool === 'loupe' || tool === 'thermal' || isWindowDiscovered;
    if (this.poyntingPoints) {
      this.poyntingPoints.visible = isPoyntingActive;
      if (this.poyntingMat) {
        this.poyntingMat.opacity = tool === 'loupe' ? 0.95 : 0.75;
      }
    }
  }

  public setEvidenceDiscovered(evidenceId: string): void {
    if (evidenceId === 'floor_heater' && this.thermalPoints) {
      this.thermalPoints.visible = true;
    }
    if (evidenceId === 'quartz_window' && this.poyntingPoints) {
      this.poyntingPoints.visible = true;
    }
  }

  public update(elapsedTime: number): void {
    // 1. Animate Poynting Particles (Stream bursting outward from Quartz Window)
    if (this.poyntingPoints && this.poyntingPoints.visible && this.poyntingVelocities) {
      const posAttr = this.poyntingPoints.geometry.attributes.position;
      const posArr = posAttr.array as Float32Array;
      const count = posArr.length / 3;
      const wx = 0.2;
      const wy = 0.0;
      const wz = this.half;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 2] += this.poyntingVelocities[i];
        if (posArr[i * 3 + 2] > wz + 1.5) {
          // Respawn near inner window pane
          posArr[i * 3] = wx + (Math.random() - 0.5) * 1.25;
          posArr[i * 3 + 1] = wy + (Math.random() - 0.5) * 1.25;
          posArr[i * 3 + 2] = wz - 0.05 + Math.random() * 0.1;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Animate Joule Heat Thermal Shimmer Particles (Rising from Floor Heater)
    if (this.thermalPoints && this.thermalPoints.visible && this.thermalVelocities) {
      const posAttr = this.thermalPoints.geometry.attributes.position;
      const posArr = posAttr.array as Float32Array;
      const count = posArr.length / 3;
      const hx = -0.4;
      const hy = -this.half + 0.08;
      const hz = 0.3;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += this.thermalVelocities[i]; // rise in Y
        posArr[i * 3] += Math.sin(elapsedTime * 3.5 + i) * 0.0018; // subtle convection wobble
        if (posArr[i * 3 + 1] > -this.half + 1.1) {
          // Respawn on heater bed
          posArr[i * 3] = hx + (Math.random() - 0.5) * 1.45;
          posArr[i * 3 + 1] = hy + Math.random() * 0.05;
          posArr[i * 3 + 2] = hz + (Math.random() - 0.5) * 1.05;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 3. Animate EM Wave Pulses radiating from Antenna
    const numPulses = this.emPulseWaves.length;
    for (let i = 0; i < numPulses; i++) {
      const { mesh, mat } = this.emPulseWaves[i];
      const phase = (elapsedTime * 0.45 + i / numPulses) % 1.0;
      const scale = 0.25 + phase * 2.2;
      mesh.scale.set(scale, scale, scale);
      mat.opacity = (1.0 - phase) * 0.35;
    }
  }

  public dispose(): void {
    if (this.poyntingTexture) {
      this.poyntingTexture.dispose();
      this.poyntingTexture = null;
    }
    if (this.thermalTexture) {
      this.thermalTexture.dispose();
      this.thermalTexture = null;
    }
  }
}
