import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ToolType } from '../MysteryTypes.ts';
import { MysteryLabBuilder } from './MysteryLabBuilder.ts';
import { MysteryParticleSystem } from './MysteryParticleSystem.ts';

/**
 * MysteryScene3D
 * Primary controller for the 3D Mystery Investigation Mode.
 * Orchestrates the Three.js viewport, camera navigation, raycasting interaction,
 * and delegates structural modeling and particle dynamics to sub-modules.
 */
export class MysteryScene3D {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  // Sub-modules
  private labBuilder: MysteryLabBuilder | null = null;
  private particleSystem: MysteryParticleSystem | null = null;
  private heaterLight: THREE.PointLight | null = null;

  // Discovery State
  private isWindowDiscovered: boolean = false;
  private isHeaterDiscovered: boolean = false;

  // Interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-999, -999);
  private currentTool: ToolType = 'inspect';
  private hoveredTarget: string | null = null;
  private onObjectClickCallback: ((objectId: string) => void) | null = null;

  // Animation
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;
  private isDisposed: boolean = false;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060a12); // Deep sci-fi chamber dark blue

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4.5, 3.5, 5.0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 15.0;

    // 5. Lighting
    this.setupLighting();

    // 6. Build Laboratory Geometry & Props
    const boxSize = 3.2;
    const half = boxSize / 2;
    this.labBuilder = new MysteryLabBuilder(this.scene, boxSize, this.heaterLight!);

    // 7. Dynamic Physical Particle FX
    this.particleSystem = new MysteryParticleSystem(this.scene, half);

    // 8. Event Listeners
    this.bindEvents();

    // 9. Start Render Loop
    this.startLoop();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 2.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-6, 8, -5);
    this.scene.add(fillLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 2.5, 9);
    coreLight.position.set(0, 0.9, 0);
    this.scene.add(coreLight);

    this.heaterLight = new THREE.PointLight(0xef4444, 1.2, 4.0);
    this.heaterLight.position.set(-0.4, -1.2, 0.3);
    this.scene.add(this.heaterLight);
  }

  public setTool(tool: ToolType): void {
    this.currentTool = tool;
    this.labBuilder?.setTool(this.currentTool, this.isWindowDiscovered, this.isHeaterDiscovered);
    this.particleSystem?.setTool(this.currentTool, this.isHeaterDiscovered, this.isWindowDiscovered);
  }

  public setEvidenceDiscovered(evidenceId: string): void {
    if (evidenceId === 'floor_heater') {
      this.isHeaterDiscovered = true;
    }
    if (evidenceId === 'quartz_window') {
      this.isWindowDiscovered = true;
    }
    this.labBuilder?.setEvidenceDiscovered(evidenceId);
    this.particleSystem?.setEvidenceDiscovered(evidenceId);
  }

  public focusCamera(target: 'heater' | 'window' | 'antenna' | 'room'): void {
    if (target === 'heater') {
      this.controls.target.set(-0.4, -1.0, 0.3);
      this.camera.position.set(0.5, 1.2, 1.8);
    } else if (target === 'window') {
      this.controls.target.set(0.2, 0, 1.6);
      this.camera.position.set(0.5, 0.4, 3.8);
    } else if (target === 'antenna') {
      this.controls.target.set(0, 0, 0);
      this.camera.position.set(2.0, 1.5, 2.5);
    } else {
      this.controls.target.set(0, 0, 0);
      this.camera.position.set(4.5, 3.5, 5.0);
    }
    this.controls.update();
  }

  public onObjectClick(cb: (objectId: string) => void): void {
    this.onObjectClickCallback = cb;
  }

  private bindEvents(): void {
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', () => this.onClick());
  }

  private onMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.checkHover();
  }

  private checkHover(): void {
    if (!this.labBuilder) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactables = this.labBuilder.getInteractableObjects();

    const intersects = this.raycaster.intersectObjects(interactables);
    if (intersects.length > 0) {
      const topObj = intersects[0].object;
      this.hoveredTarget = topObj.userData.id;
      this.canvas.style.cursor = 'pointer';
    } else {
      this.hoveredTarget = null;
      this.canvas.style.cursor = this.currentTool === 'loupe' ? 'zoom-in' : 'crosshair';
    }
  }

  private onClick(): void {
    if (this.hoveredTarget && this.onObjectClickCallback) {
      this.onObjectClickCallback(this.hoveredTarget);
    }
  }

  private startLoop(): void {
    const animate = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = this.clock.getElapsedTime();

      // Delegate animations to sub-modules
      this.labBuilder?.update(elapsedTime, this.currentTool === 'thermal');
      this.particleSystem?.update(elapsedTime);

      this.controls.update();
      if (!this.isDisposed) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();
  }

  public handleResize(): void {
    if (this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.labBuilder?.dispose();
    this.particleSystem?.dispose();
    this.controls.dispose();
    this.renderer.dispose();
  }
}
