import * as THREE from 'three';
import { PoyntingEngine } from '../physics/PoyntingEngine.ts';
import { disposeThreeScene } from '../../../common/ThreeDisposer.ts';

export type HighlightTarget = 'none' | 'volume' | 'boundary' | 'source';

export class ThreeFieldView {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private engine: PoyntingEngine;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // 3D Objects
  private boxMesh: THREE.Mesh;
  private boxEdges: THREE.LineSegments;
  private facePlanes: THREE.Mesh[] = []; // 6 faces
  private faceMaterials: THREE.MeshBasicMaterial[] = [];

  private arrowInstancedMesh: THREE.InstancedMesh | null = null;
  private numArrows: number = 0;
  private arrowPositions: THREE.Vector3[] = [];

  // Source visuals
  private sourceGroup: THREE.Group;
  private dipoleSpheres: THREE.Mesh[] = [];
  private antennaRod: THREE.Mesh;

  // Flux particles
  private particleGeo: THREE.BufferGeometry;
  private particleMat: THREE.PointsMaterial;
  private particlePositions: Float32Array;
  private particleVelocities: THREE.Vector3[] = [];
  private particleSystem: THREE.Points;
  private numParticles: number = 120;

  // View state
  public showWireframe: boolean = true;
  public autoRotate: boolean = false;
  public highlightTarget: HighlightTarget = 'none';

  // Interaction / Orbit
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;
  private sphericalCoords: { radius: number; theta: number; phi: number } = {
    radius: 9.5,
    theta: Math.PI / 4,
    phi: Math.PI / 3
  };

  private animationFrameId: number | null = null;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, engine: PoyntingEngine) {
    this.container = container;
    this.canvas = canvas;
    this.engine = engine;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1120);

    const width = this.canvas.clientWidth || 600;
    const height = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.updateCameraPosition();

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // 4. Bounding Box & 6 Boundary Faces
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      depthWrite: false
    });
    this.boxMesh = new THREE.Mesh(boxGeo, boxMat);
    this.scene.add(this.boxMesh);

    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    this.boxEdges = new THREE.LineSegments(
      edgesGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    this.scene.add(this.boxEdges);

    this.createFacePlanes();

    // 5. Source (Antenna / Wire) Mesh
    this.sourceGroup = new THREE.Group();
    this.scene.add(this.sourceGroup);

    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.2
    });
    this.antennaRod = new THREE.Mesh(rodGeo, rodMat);
    this.antennaRod.rotation.x = Math.PI / 2; // Along z-axis
    this.sourceGroup.add(this.antennaRod);

    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const posSphereMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.6
    });
    const negSphereMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.6
    });

    const sphere1 = new THREE.Mesh(sphereGeo, posSphereMat);
    const sphere2 = new THREE.Mesh(sphereGeo, negSphereMat);
    this.sourceGroup.add(sphere1);
    this.sourceGroup.add(sphere2);
    this.dipoleSpheres = [sphere1, sphere2];

    // 6. Instanced Poynting Vector Field Arrows
    this.initPoyntingVectorGrid();

    // 7. Energy Flow Particles
    this.particlePositions = new Float32Array(this.numParticles * 3);
    for (let i = 0; i < this.numParticles; i++) {
      this.resetParticle(i);
    }
    this.particleGeo = new THREE.BufferGeometry();
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    this.particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.particleSystem = new THREE.Points(this.particleGeo, this.particleMat);
    this.scene.add(this.particleSystem);

    // 8. Event Listeners
    this.bindEvents();
    this.updateBoxGeometry();
  }

  private createFacePlanes(): void {
    // 6 faces: +X, -X, +Y, -Y, +Z, -Z
    for (let i = 0; i < 6; i++) {
      const planeGeo = new THREE.PlaneGeometry(1, 1);
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      this.scene.add(planeMesh);
      this.facePlanes.push(planeMesh);
      this.faceMaterials.push(planeMat);
    }
  }

  private updateFacePlanes(): void {
    const Lx = this.engine.volume.halfSizeX;
    const Ly = this.engine.volume.halfSizeY;
    const Lz = this.engine.volume.halfSizeZ;

    // 0: +X
    this.facePlanes[0].position.set(Lx, 0, 0);
    this.facePlanes[0].rotation.set(0, Math.PI / 2, 0);
    this.facePlanes[0].scale.set(2 * Lz, 2 * Ly, 1);

    // 1: -X
    this.facePlanes[1].position.set(-Lx, 0, 0);
    this.facePlanes[1].rotation.set(0, -Math.PI / 2, 0);
    this.facePlanes[1].scale.set(2 * Lz, 2 * Ly, 1);

    // 2: +Y
    this.facePlanes[2].position.set(0, Ly, 0);
    this.facePlanes[2].rotation.set(Math.PI / 2, 0, 0);
    this.facePlanes[2].scale.set(2 * Lx, 2 * Lz, 1);

    // 3: -Y
    this.facePlanes[3].position.set(0, -Ly, 0);
    this.facePlanes[3].rotation.set(-Math.PI / 2, 0, 0);
    this.facePlanes[3].scale.set(2 * Lx, 2 * Lz, 1);

    // 4: +Z
    this.facePlanes[4].position.set(0, 0, Lz);
    this.facePlanes[4].rotation.set(0, 0, 0);
    this.facePlanes[4].scale.set(2 * Lx, 2 * Ly, 1);

    // 5: -Z
    this.facePlanes[5].position.set(0, 0, -Lz);
    this.facePlanes[5].rotation.set(0, Math.PI, 0);
    this.facePlanes[5].scale.set(2 * Lx, 2 * Ly, 1);
  }

  private initPoyntingVectorGrid(): void {
    const range = 3.6;
    const step = 1.2;
    this.arrowPositions = [];

    for (let x = -range; x <= range; x += step) {
      for (let y = -range; y <= range; y += step) {
        for (let z = -range; z <= range; z += step) {
          const r = Math.sqrt(x * x + y * y + z * z);
          if (r > 0.6 && r <= range * 1.05) {
            this.arrowPositions.push(new THREE.Vector3(x, y, z));
          }
        }
      }
    }

    this.numArrows = this.arrowPositions.length;

    // Create instanced arrow: cone for arrow head
    const coneGeo = new THREE.ConeGeometry(0.07, 0.28, 8);
    coneGeo.translate(0, 0.14, 0); // Origin at base
    const coneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    this.arrowInstancedMesh = new THREE.InstancedMesh(coneGeo, coneMat, this.numArrows);
    this.arrowInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.arrowInstancedMesh);
  }

  private resetParticle(index: number): void {
    // Spawn near the dipole center with slight jitter
    const phi = Math.random() * 2 * Math.PI;
    const theta = Math.acos(2 * Math.random() - 1);
    const r = 0.4 + Math.random() * 0.4;

    this.particlePositions[index * 3] = r * Math.sin(theta) * Math.cos(phi);
    this.particlePositions[index * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    this.particlePositions[index * 3 + 2] = r * Math.cos(theta);

    this.particleVelocities[index] = new THREE.Vector3();
  }

  public updateBoxGeometry(): void {
    const Lx = this.engine.volume.halfSizeX;
    const Ly = this.engine.volume.halfSizeY;
    const Lz = this.engine.volume.halfSizeZ;

    this.boxMesh.scale.set(2 * Lx, 2 * Ly, 2 * Lz);
    this.boxEdges.scale.set(2 * Lx, 2 * Ly, 2 * Lz);
    this.updateFacePlanes();
  }

  public render(): void {
    const engine = this.engine;
    const t = engine.currentTime;
    const source = engine.source;

    // 1. Update Antenna / Dipole charge oscillations
    const omega = source.omega;
    const amp = 0.7 * Math.cos(omega * t);
    if (this.dipoleSpheres.length >= 2) {
      this.dipoleSpheres[0].position.set(0, 0, amp);
      this.dipoleSpheres[1].position.set(0, 0, -amp);
    }

    // 2. Update Instanced S-Vector Arrows
    if (this.arrowInstancedMesh) {
      const dummy = new THREE.Object3D();
      const up = new THREE.Vector3(0, 1, 0);

      for (let i = 0; i < this.numArrows; i++) {
        const pos = this.arrowPositions[i];
        const sample = source.evaluate(pos.x, pos.y, pos.z, t);
        const S = new THREE.Vector3(sample.S.x, sample.S.y, sample.S.z);
        const sMag = S.length();

        dummy.position.copy(pos);

        if (sMag > 1e-4) {
          const dir = S.clone().normalize();
          dummy.quaternion.setFromUnitVectors(up, dir);
          const scale = Math.min(1.8, Math.max(0.3, Math.sqrt(sMag) * 1.2));
          dummy.scale.set(scale, scale, scale);
        } else {
          dummy.scale.set(0.01, 0.01, 0.01);
        }

        dummy.updateMatrix();
        this.arrowInstancedMesh.setMatrixAt(i, dummy.matrix);
      }
      this.arrowInstancedMesh.instanceMatrix.needsUpdate = true;
    }

    // 3. Update Energy Flow Particles
    const posAttr = this.particleGeo.getAttribute('position') as THREE.BufferAttribute;
    const boundRadius = Math.max(engine.volume.halfSizeX, engine.volume.halfSizeY, engine.volume.halfSizeZ) * 1.6;

    for (let i = 0; i < this.numParticles; i++) {
      const px = this.particlePositions[i * 3];
      const py = this.particlePositions[i * 3 + 1];
      const pz = this.particlePositions[i * 3 + 2];

      const sample = source.evaluate(px, py, pz, t);
      const S = sample.S;
      const sLen = Math.sqrt(S.x * S.x + S.y * S.y + S.z * S.z) + 1e-5;

      const speed = 0.07;
      this.particlePositions[i * 3] += (S.x / sLen) * speed;
      this.particlePositions[i * 3 + 1] += (S.y / sLen) * speed;
      this.particlePositions[i * 3 + 2] += (S.z / sLen) * speed;

      // Check boundary escape reset
      const dist = Math.sqrt(px * px + py * py + pz * pz);
      if (dist > boundRadius || isNaN(dist)) {
        this.resetParticle(i);
      }
    }
    posAttr.needsUpdate = true;

    // 4. Update Boundary Wall Glow / Flash Effect
    const lastRes = engine.lastResult;
    if (lastRes) {
      const fluxes = [
        Math.max(0, lastRes.flux.posX),
        Math.max(0, lastRes.flux.negX),
        Math.max(0, lastRes.flux.posY),
        Math.max(0, lastRes.flux.negY),
        Math.max(0, lastRes.flux.posZ),
        Math.max(0, lastRes.flux.negZ)
      ];

      for (let i = 0; i < 6; i++) {
        let baseOpacity = 0.04;
        if (this.highlightTarget === 'boundary') {
          baseOpacity = 0.35;
        }
        const flashIntensity = Math.min(0.45, fluxes[i] * 0.25);
        this.faceMaterials[i].opacity = baseOpacity + flashIntensity;
      }
    }

    // 5. Apply Hover Highlighting
    const boxMat = this.boxMesh.material as THREE.MeshBasicMaterial;
    if (this.highlightTarget === 'volume') {
      const pulse = 0.2 + 0.15 * Math.sin(t * 8);
      boxMat.opacity = pulse;
      boxMat.color.setHex(0x38bdf8);
    } else {
      boxMat.opacity = 0.08;
      boxMat.color.setHex(0x38bdf8);
    }

    if (this.highlightTarget === 'source') {
      (this.antennaRod.material as THREE.MeshStandardMaterial).emissive.setHex(0xef4444);
      (this.antennaRod.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
    } else {
      (this.antennaRod.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
      (this.antennaRod.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }

    // 6. Auto-rotation
    if (this.autoRotate) {
      this.sphericalCoords.theta += 0.005;
      this.updateCameraPosition();
    }

    this.renderer.render(this.scene, this.camera);
  }

  public startAnimationLoop(): void {
    const loop = () => {
      this.engine.step(1 / 60);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.stopAnimationLoop();
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public handleResize(): void {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.render();
  }

  public resetCamera(): void {
    this.sphericalCoords = {
      radius: 9.5,
      theta: Math.PI / 4,
      phi: Math.PI / 3
    };
    this.updateCameraPosition();
    this.render();
  }

  public setAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
  }

  private updateCameraPosition(): void {
    const r = this.sphericalCoords.radius;
    const theta = this.sphericalCoords.theta;
    const phi = this.sphericalCoords.phi;

    this.camera.position.x = r * Math.sin(phi) * Math.sin(theta);
    this.camera.position.y = r * Math.cos(phi);
    this.camera.position.z = r * Math.sin(phi) * Math.cos(theta);
    this.camera.lookAt(0, 0, 0);
  }

  private bindEvents(): void {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      this.sphericalCoords.theta -= dx * 0.008;
      this.sphericalCoords.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.sphericalCoords.phi - dy * 0.008));
      this.updateCameraPosition();
      this.render();
    });

    canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.sphericalCoords.radius = Math.max(3.5, Math.min(22, this.sphericalCoords.radius + e.deltaY * 0.015));
        this.updateCameraPosition();
        this.render();
      },
      { passive: false }
    );
  }

  public dispose(): void {
    this.stopAnimationLoop();
    disposeThreeScene(this.renderer, this.scene);
  }
}
