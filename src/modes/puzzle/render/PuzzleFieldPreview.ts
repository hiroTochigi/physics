import * as THREE from 'three';
import { disposeThreeScene } from '../../../common/ThreeDisposer.ts';

export class PuzzleFieldPreview {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // Visual components
  private antennaGroup: THREE.Group;
  private dipolePlus: THREE.Mesh;
  private dipoleMinus: THREE.Mesh;
  private waveRings: THREE.Mesh[] = [];

  // Vectors for E (Red), B (Cyan), and S (Gold)
  private vectorGroup: THREE.Group;
  private poyntingArrows: THREE.ArrowHelper[] = [];
  private electricArrows: THREE.ArrowHelper[] = [];
  private magneticArrows: THREE.ArrowHelper[] = [];

  // Outward golden energy flux particles
  private poyntingParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleVelocities: THREE.Vector3[] = [];
  private numParticles: number = 160;

  // Thermal energy particles (Joule heat)
  private jouleParticles: THREE.Points;
  private joulePositions: Float32Array;
  private numJouleParticles: number = 40;

  // Step state & animations
  private currentIntensity: number = 0.15;
  private targetIntensity: number = 0.15;
  private isWarningMode: boolean = false;
  private showJouleHeat: boolean = false;

  // Camera Orbit Controls
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;
  private sphericalCoords = { radius: 8.5, theta: Math.PI / 4, phi: Math.PI / 3 };

  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private isDisposed: boolean = false;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14);

    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 180;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x60a5fa, 2.0, 20);
    pointLight.position.set(2, 4, 3);
    this.scene.add(pointLight);

    // Floor Grid
    const grid = new THREE.GridHelper(12, 12, 0x1e293b, 0x0f172a);
    grid.position.y = -1.5;
    this.scene.add(grid);

    // 1. Central Dipole Antenna (Exciting EM Waves)
    this.antennaGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    this.antennaGroup.add(rod);

    const sphereGeo = new THREE.SphereGeometry(0.16, 20, 20);
    const matPlus = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
    const matMinus = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.8 });

    this.dipolePlus = new THREE.Mesh(sphereGeo, matPlus);
    this.dipolePlus.position.y = 0.6;
    this.dipoleMinus = new THREE.Mesh(sphereGeo, matMinus);
    this.dipoleMinus.position.y = -0.6;

    this.antennaGroup.add(this.dipolePlus);
    this.antennaGroup.add(this.dipoleMinus);
    this.scene.add(this.antennaGroup);

    // 2. Expanding EM Wave Rings (Spherical Wavefronts)
    const ringGeo = new THREE.RingGeometry(0.9, 0.98, 48);
    for (let i = 0; i < 5; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.scene.add(ring);
      this.waveRings.push(ring);
    }

    // 3. E, B, and S Vectors Group
    this.vectorGroup = new THREE.Group();
    this.createFieldVectors();
    this.scene.add(this.vectorGroup);

    // 4. Poynting Golden Energy Flux Particles
    this.particlePositions = new Float32Array(this.numParticles * 3);
    for (let i = 0; i < this.numParticles; i++) {
      this.resetParticle(i, true);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b, // Golden Poynting Vector
      size: 0.16,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.poyntingParticles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.poyntingParticles);

    // 5. Joule Heat Particles (Resistance Heat)
    this.joulePositions = new Float32Array(this.numJouleParticles * 3);
    for (let i = 0; i < this.numJouleParticles; i++) {
      this.resetJouleParticle(i);
    }
    const jouleGeo = new THREE.BufferGeometry();
    jouleGeo.setAttribute('position', new THREE.BufferAttribute(this.joulePositions, 3));
    const jouleMat = new THREE.PointsMaterial({
      color: 0xff4500, // Orange-Red Heat
      size: 0.14,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });
    this.jouleParticles = new THREE.Points(jouleGeo, jouleMat);
    this.scene.add(this.jouleParticles);

    // Bind interaction & resizing
    this.bindMouseControls();
    this.setupResizeObserver();

    this.startLoop();
  }

  private createFieldVectors(): void {
    // 6 outward Poynting Vectors (Gold)
    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
    angles.forEach(rad => {
      const dir = new THREE.Vector3(Math.cos(rad), 0, Math.sin(rad));
      const origin = new THREE.Vector3(Math.cos(rad) * 0.8, 0, Math.sin(rad) * 0.8);
      const arrow = new THREE.ArrowHelper(dir, origin, 1.2, 0xf59e0b, 0.28, 0.16);
      this.vectorGroup.add(arrow);
      this.poyntingArrows.push(arrow);

      // Electric Field Vector E (Red, vertical)
      const eDir = new THREE.Vector3(0, 1, 0);
      const eArrow = new THREE.ArrowHelper(eDir, origin, 0.7, 0xef4444, 0.2, 0.1);
      this.vectorGroup.add(eArrow);
      this.electricArrows.push(eArrow);

      // Magnetic Field Vector B (Cyan, tangential)
      const bDir = new THREE.Vector3(-Math.sin(rad), 0, Math.cos(rad));
      const bArrow = new THREE.ArrowHelper(bDir, origin, 0.7, 0x06b6d4, 0.2, 0.1);
      this.vectorGroup.add(bArrow);
      this.magneticArrows.push(bArrow);
    });
  }

  private resetParticle(i: number, randomizeRadius: boolean = false): void {
    const r = randomizeRadius ? 0.3 + Math.random() * 3.8 : 0.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.7;

    this.particlePositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
    this.particlePositions[i * 3 + 1] = r * Math.sin(phi);
    this.particlePositions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

    const vel = new THREE.Vector3(
      this.particlePositions[i * 3],
      this.particlePositions[i * 3 + 1] * 0.5,
      this.particlePositions[i * 3 + 2]
    ).normalize().multiplyScalar(0.045);

    if (this.particleVelocities.length <= i) {
      this.particleVelocities.push(vel);
    } else {
      this.particleVelocities[i] = vel;
    }
  }

  private resetJouleParticle(i: number): void {
    this.joulePositions[i * 3] = (Math.random() - 0.5) * 0.6;
    this.joulePositions[i * 3 + 1] = -0.8 - Math.random() * 0.4;
    this.joulePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }

  public setStepState(intensity: number, isWarning: boolean, showJoule: boolean): void {
    this.targetIntensity = Math.max(0.1, Math.min(1.0, intensity));
    this.isWarningMode = isWarning;
    this.showJouleHeat = showJoule;
  }

  private startLoop(): void {
    const animate = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(animate);

      // Smooth intensity transition
      this.currentIntensity += (this.targetIntensity - this.currentIntensity) * 0.08;

      const time = performance.now() * 0.001;

      // Auto rotate if not dragged
      if (!this.isMouseDown) {
        this.sphericalCoords.theta += 0.004;
        this.updateCameraPosition();
      }

      // Antenna Dipole oscillation
      const osc = Math.sin(time * (4 + this.currentIntensity * 6));
      this.dipolePlus.position.y = 0.5 + osc * 0.15;
      this.dipoleMinus.position.y = -0.5 - osc * 0.15;

      // Warning mode (Red alert pulse)
      if (this.isWarningMode) {
        const warningGlow = 0.5 + Math.sin(time * 12) * 0.5;
        (this.dipolePlus.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + warningGlow * 1.5;
        (this.dipoleMinus.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + warningGlow * 1.5;
      } else {
        (this.dipolePlus.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
        (this.dipoleMinus.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      }

      // Animate Wave Rings
      this.waveRings.forEach((ring, idx) => {
        const ringScale = ((time * (1.5 + this.currentIntensity * 2) + idx * 0.8) % 4.5) + 0.5;
        ring.scale.set(ringScale, ringScale, 1);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, (1 - ringScale / 5.0) * 0.6 * this.currentIntensity);
      });

      // Animate Field Vectors E, B, and S
      const arrowScale = 0.5 + this.currentIntensity * 0.7;
      this.vectorGroup.scale.set(arrowScale, arrowScale, arrowScale);
      this.vectorGroup.rotation.y = time * 0.4;

      // Dynamic oscillation of E and B arrows
      const wavePhase = time * 6;
      this.electricArrows.forEach((arrow, idx) => {
        const amp = Math.sin(wavePhase + idx);
        arrow.scale.set(1, Math.abs(amp) * 1.2 + 0.2, 1);
      });
      this.magneticArrows.forEach((arrow, idx) => {
        const amp = Math.cos(wavePhase + idx);
        arrow.scale.set(1, Math.abs(amp) * 1.2 + 0.2, 1);
      });

      // Animate Poynting outward stream particles
      const posAttr = this.poyntingParticles.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const speedMult = 0.4 + this.currentIntensity * 1.6;

      for (let i = 0; i < this.numParticles; i++) {
        const idx = i * 3;
        const vel = this.particleVelocities[i];

        posArray[idx] += vel.x * speedMult;
        posArray[idx + 1] += vel.y * speedMult;
        posArray[idx + 2] += vel.z * speedMult;

        const dist = Math.sqrt(
          posArray[idx] * posArray[idx] +
          posArray[idx + 1] * posArray[idx + 1] +
          posArray[idx + 2] * posArray[idx + 2]
        );

        if (dist > 4.5) {
          this.resetParticle(i, false);
        }
      }
      posAttr.needsUpdate = true;

      // Poynting particle appearance
      const pMat = this.poyntingParticles.material as THREE.PointsMaterial;
      pMat.size = 0.10 + this.currentIntensity * 0.12;
      pMat.opacity = 0.4 + this.currentIntensity * 0.6;

      // Animate Joule Heat Particles
      const jPosAttr = this.jouleParticles.geometry.attributes.position as THREE.BufferAttribute;
      const jPosArray = jPosAttr.array as Float32Array;
      const jMat = this.jouleParticles.material as THREE.PointsMaterial;

      if (this.showJouleHeat) {
        jMat.opacity = Math.min(1.0, jMat.opacity + 0.05);
        for (let i = 0; i < this.numJouleParticles; i++) {
          const idx = i * 3;
          jPosArray[idx + 1] -= 0.015; // Flow down into heater/resistor
          jPosArray[idx] += (Math.random() - 0.5) * 0.01;
          jPosArray[idx + 2] += (Math.random() - 0.5) * 0.01;

          if (jPosArray[idx + 1] < -1.8) {
            this.resetJouleParticle(i);
          }
        }
        jPosAttr.needsUpdate = true;
      } else {
        jMat.opacity = Math.max(0, jMat.opacity - 0.05);
      }

      this.renderer.render(this.scene, this.camera);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private updateCameraPosition(): void {
    const { radius, theta, phi } = this.sphericalCoords;
    this.camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
    this.camera.position.y = radius * Math.cos(phi);
    this.camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
    this.camera.lookAt(0, 0, 0);
  }

  private bindMouseControls(): void {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
      const deltaX = e.clientX - this.prevMouseX;
      const deltaY = e.clientY - this.prevMouseY;

      this.sphericalCoords.theta -= deltaX * 0.008;
      this.sphericalCoords.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.sphericalCoords.phi - deltaY * 0.008));

      this.updateCameraPosition();

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isMouseDown = true;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isMouseDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.prevMouseX;
      const deltaY = e.touches[0].clientY - this.prevMouseY;

      this.sphericalCoords.theta -= deltaX * 0.008;
      this.sphericalCoords.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.sphericalCoords.phi - deltaY * 0.008));

      this.updateCameraPosition();

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isMouseDown = false;
    });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            this.resize(width, height);
          }
        }
      });
      this.resizeObserver.observe(this.container);
    }
  }

  public resize(width: number, height: number): void {
    if (this.isDisposed || width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    disposeThreeScene(this.renderer, this.scene);
    this.renderer.dispose();
  }
}
