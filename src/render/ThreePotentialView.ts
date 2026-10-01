import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Particle } from '../physics/Particle.ts';
import { CoulombEngine } from '../physics/CoulombEngine.ts';
import { TestParticle } from '../physics/TestParticle.ts';

export class ThreePotentialView {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private engine: CoulombEngine;
  private particles: Particle[] = [];

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private surfaceMesh: THREE.Mesh;
  private wireframeMesh: THREE.LineSegments;
  private geometry: THREE.PlaneGeometry;
  private particleMeshes: THREE.Mesh[] = [];
  private testParticleMeshes: THREE.Mesh[] = [];

  private planeWidth: number = 320;
  private planeHeight: number = 220;
  private segmentsX: number = 70;
  private segmentsY: number = 50;

  public showWireframe: boolean = true;
  public autoRotate: boolean = false;
  private animationId: number | null = null;
  private isDestroyed: boolean = false;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, engine: CoulombEngine) {
    this.container = container;
    this.canvas = canvas;
    this.engine = engine;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080c14);

    // 2. Camera setup
    const rect = this.container.getBoundingClientRect();
    const aspect = (rect.width || 600) / (rect.height || 400);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 2000);
    this.camera.position.set(0, 180, 280);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(rect.width || 600, rect.height || 400);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below ground
    this.controls.minDistance = 60;
    this.controls.maxDistance = 600;
    this.controls.addEventListener('change', () => this.render3D());

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(100, 250, 150);
    this.scene.add(dirLight);

    const dirLightBack = new THREE.DirectionalLight(0x38bdf8, 0.5);
    dirLightBack.position.set(-100, -100, -100);
    this.scene.add(dirLightBack);

    // 6. Reference Grid on Y = 0
    const grid = new THREE.GridHelper(360, 24, 0x334155, 0x1e293b);
    grid.position.y = -0.5;
    this.scene.add(grid);

    // 7. Surface Geometry & Materials
    this.geometry = new THREE.PlaneGeometry(
      this.planeWidth,
      this.planeHeight,
      this.segmentsX,
      this.segmentsY
    );
    // Rotate to lie on X-Z plane
    this.geometry.rotateX(-Math.PI / 2);

    const count = this.geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    this.surfaceMesh = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.surfaceMesh);

    // Wireframe overlay
    const wireframeGeo = new THREE.WireframeGeometry(this.geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.25
    });
    this.wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    this.scene.add(this.wireframeMesh);

    window.addEventListener('resize', () => this.handleResize());
  }


  public setParticles(particles: Particle[]): void {
    this.particles = particles;
    this.updateParticleMeshes();
    this.updateSurface();
  }

  private updateParticleMeshes(): void {
    // Remove existing particle spheres
    for (const mesh of this.particleMeshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    this.particleMeshes = [];

    // Create 3D spheres for each particle
    for (const p of this.particles) {
      const isPos = p.q > 0;
      const isNeg = p.q < 0;
      const color = isPos ? 0xef4444 : isNeg ? 0x3b82f6 : 0x94a3b8;

      const sphereGeo = new THREE.SphereGeometry(7, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.3,
        emissive: color,
        emissiveIntensity: 0.35
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      this.scene.add(sphere);
      this.particleMeshes.push(sphere);
    }
  }

  /**
   * Recompute 3D potential surface displacement and vertex colors
   */
  public updateSurface(): void {
    const posAttr = this.geometry.attributes.position;
    const colorAttr = this.geometry.attributes.color;

    const rect = this.container.getBoundingClientRect();
    const canvas2DW = rect.width || 600;
    const canvas2DH = rect.height || 400;

    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const x3D = posAttr.getX(i);
      const z3D = posAttr.getZ(i);

      // Map 3D (X, Z) back to 2D Canvas coordinates (px, py)
      const px = (x3D / this.planeWidth + 0.5) * canvas2DW;
      const py = (z3D / this.planeHeight + 0.5) * canvas2DH;

      const h = this.engine.calculatePotentialHeight(px, py, this.particles);
      posAttr.setY(i, h);

      // Color mapping:
      // Neutral zero: slate grey-blue (0.15, 0.22, 0.35)
      // Positive peak: vibrant red/amber
      // Negative well: deep royal blue/cyan
      let r = 0.15;
      let g = 0.22;
      let b = 0.35;

      const maxH = 90;
      if (h > 0) {
        const t = Math.min(1, h / maxH);
        // Slate -> Red/Yellow
        r = 0.15 + t * 0.85;
        g = 0.22 + t * (t > 0.6 ? 0.6 : 0.1);
        b = 0.35 * (1 - t * 0.8);
      } else if (h < 0) {
        const t = Math.min(1, -h / maxH);
        // Slate -> Vibrant Blue / Indigo
        r = 0.15 * (1 - t * 0.7);
        g = 0.22 + t * 0.35;
        b = 0.35 + t * 0.65;
      }

      colorAttr.setXYZ(i, r, g, b);
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();

    // Update wireframe geometry
    this.wireframeMesh.geometry.dispose();
    this.wireframeMesh.geometry = new THREE.WireframeGeometry(this.geometry);
    this.wireframeMesh.visible = this.showWireframe;

    // Update particle sphere positions in 3D
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const mesh = this.particleMeshes[i];
      if (!mesh) continue;

      const x3D = ((p.x / canvas2DW) - 0.5) * this.planeWidth;
      const z3D = ((p.y / canvas2DH) - 0.5) * this.planeHeight;
      const y3D = this.engine.calculatePotentialHeight(p.x, p.y, this.particles);

      mesh.position.set(x3D, y3D + (p.q >= 0 ? 8 : -8), z3D);
    }

    this.render3D();
  }

  public render3D(): void {
    if (this.isDestroyed) return;
    const rect = this.container.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    this.renderer.render(this.scene, this.camera);
  }

  public handleResize(): void {
    if (this.isDestroyed) return;
    const rect = this.container.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height);
    this.render3D();
  }

  public setAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
    if (enabled) {
      this.startLoop();
    } else {
      this.stopLoop();
      this.scene.rotation.y = 0;
      this.render3D();
    }
  }

  private startLoop(): void {
    if (this.animationId !== null) return;
    const animate = () => {
      if (this.isDestroyed || !this.autoRotate) {
        this.stopLoop();
        return;
      }

      this.scene.rotation.y += 0.005;
      this.controls.update();
      this.render3D();
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  private stopLoop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Synchronize active test particles into 3D glowing spheres on the potential surface
   */
  public updateTestParticles(testParticles: TestParticle[], canvas2DW: number, canvas2DH: number): void {
    if (this.isDestroyed) return;

    // Adjust mesh count to match testParticles
    while (this.testParticleMeshes.length < testParticles.length) {
      const sphereGeo = new THREE.SphereGeometry(5.5, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xfacc15,
        emissiveIntensity: 0.95,
        roughness: 0.1,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      this.scene.add(mesh);
      this.testParticleMeshes.push(mesh);
    }

    while (this.testParticleMeshes.length > testParticles.length) {
      const mesh = this.testParticleMeshes.pop();
      if (mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    }

    // Position each 3D test particle directly on the potential landscape
    for (let i = 0; i < testParticles.length; i++) {
      const tp = testParticles[i];
      const mesh = this.testParticleMeshes[i];
      if (!mesh) continue;

      const x3D = ((tp.x / canvas2DW) - 0.5) * this.planeWidth;
      const z3D = ((tp.y / canvas2DH) - 0.5) * this.planeHeight;
      const y3D = this.engine.calculatePotentialHeight(tp.x, tp.y, this.particles);

      mesh.position.set(x3D, y3D + 5.5, z3D);

      const isPos = tp.q > 0;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const targetColor = isPos ? 0xfacc15 : 0x06b6d4;
      mat.color.setHex(targetColor);
      mat.emissive.setHex(targetColor);
      mesh.scale.setScalar(tp.isAlive ? 1 : 0.3);
    }

    this.render3D();
  }

  public clearTestParticleMeshes(): void {
    for (const mesh of this.testParticleMeshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    this.testParticleMeshes = [];
    this.render3D();
  }

  /**
   * Set optimal camera perspective for split view, framing both mountain and valley
   */
  public setOptimalSplitCamera(): void {
    this.camera.position.set(0, 160, 240);
    this.controls.target.set(0, -5, 0);
    this.controls.update();
    this.render3D();
  }

  public resetCamera(): void {
    this.camera.position.set(0, 180, 280);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.render3D();
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.stopLoop();
    this.controls.dispose();
    this.renderer.dispose();
  }
}

