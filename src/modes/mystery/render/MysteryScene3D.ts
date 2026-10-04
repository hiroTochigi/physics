import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ToolType } from '../MysteryTypes.ts';

export class MysteryScene3D {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  // Meshes
  private roomBox: THREE.LineSegments | null = null;
  private floorGrid: THREE.GridHelper | null = null;
  private heaterMesh: THREE.Mesh | null = null;
  private windowMesh: THREE.Mesh | null = null;
  private windowArrows: THREE.Group | null = null;
  private antennaGroup: THREE.Group | null = null;
  private energyCore: THREE.Mesh | null = null;

  // Interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-999, -999);
  private currentTool: ToolType = 'inspect';
  private hoveredTarget: string | null = null;
  private onObjectClickCallback: ((objectId: string) => void) | null = null;

  // Animation
  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14); // Deep mystery cyber blue

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
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip under floor too much
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 15.0;

    // 5. Lighting
    this.setupLighting();

    // 6. Build Laboratory Scene
    this.buildLaboratory();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Start Render Loop
    this.startLoop();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0x223344, 1.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 8);
    pointLight.position.set(0, 1.0, 0);
    this.scene.add(pointLight);
  }

  private buildLaboratory(): void {
    const boxSize = 3.2; // Laboratory bounding box
    const half = boxSize / 2;

    // 1. Transparent Laboratory Bounding Box (Volume V)
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    this.roomBox = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    this.scene.add(this.roomBox);

    // Floor grid inside room
    this.floorGrid = new THREE.GridHelper(boxSize, 8, 0x0284c7, 0x1e293b);
    this.floorGrid.position.y = -half + 0.01;
    this.scene.add(this.floorGrid);

    // 2. Floor Heater (Evidence 1: floor_heater)
    // Placed on the floor (-half + 0.02)
    const heaterGeo = new THREE.PlaneGeometry(1.6, 1.2);
    const heaterMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.7,
      side: THREE.DoubleSide
    });
    this.heaterMesh = new THREE.Mesh(heaterGeo, heaterMat);
    this.heaterMesh.rotation.x = -Math.PI / 2;
    this.heaterMesh.position.set(-0.4, -half + 0.02, 0.3);
    this.heaterMesh.userData = { id: 'floor_heater', name: '床のヒーター' };
    this.scene.add(this.heaterMesh);

    // Coil wires decoration on heater
    const coilGroup = new THREE.Group();
    for (let i = -0.5; i <= 0.5; i += 0.25) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.7, -half + 0.03, 0.3 + i),
        new THREE.Vector3(0.7, -half + 0.03, 0.3 + i)
      ]);
      const line = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xfca5a5, linewidth: 2 })
      );
      coilGroup.add(line);
    }
    this.scene.add(coilGroup);

    // 3. Quartz Window (Evidence 2: quartz_window)
    // Placed on the South Wall (z = +half)
    const winGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const winMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      side: THREE.DoubleSide
    });
    this.windowMesh = new THREE.Mesh(winGeo, winMat);
    this.windowMesh.position.set(0.2, 0, half);
    this.windowMesh.userData = { id: 'quartz_window', name: '南壁の石英窓' };
    this.scene.add(this.windowMesh);

    // Window frame
    const frameEdges = new THREE.EdgesGeometry(winGeo);
    const frameLine = new THREE.LineSegments(
      frameEdges,
      new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 3 })
    );
    frameLine.position.copy(this.windowMesh.position);
    this.scene.add(frameLine);

    // 4. Outward Poynting Vector Arrows (Bursting through the window!)
    this.windowArrows = new THREE.Group();
    const arrowDir = new THREE.Vector3(0, 0, 1); // Pointing outward
    for (let x = -0.45; x <= 0.45; x += 0.3) {
      for (let y = -0.45; y <= 0.45; y += 0.3) {
        const origin = new THREE.Vector3(0.2 + x, y, half - 0.1);
        const arrow = new THREE.ArrowHelper(arrowDir, origin, 0.8, 0xf97316, 0.25, 0.15);
        this.windowArrows.add(arrow);
      }
    }
    this.windowArrows.visible = false; // Turned on when loupe/UV or discovered
    this.scene.add(this.windowArrows);

    // 5. Center Antenna & Energy Core
    this.antennaGroup = new THREE.Group();
    // Metal mast
    const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    this.antennaGroup.add(mast);

    // Energy Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.22, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });
    this.energyCore = new THREE.Mesh(coreGeo, coreMat);
    this.antennaGroup.add(this.energyCore);

    // Wave rings around antenna
    for (let r = 0.5; r <= 1.2; r += 0.35) {
      const ringGeo = new THREE.RingGeometry(r, r + 0.02, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.antennaGroup.add(ring);
    }

    this.scene.add(this.antennaGroup);
  }

  public setTool(tool: ToolType): void {
    this.currentTool = tool;
    this.updateToolVisuals();
  }

  private updateToolVisuals(): void {
    if (!this.heaterMesh || !this.windowMesh) return;

    // Thermal tool highlights the floor heater dramatically
    const heaterMat = this.heaterMesh.material as THREE.MeshStandardMaterial;
    if (this.currentTool === 'thermal') {
      heaterMat.emissive.setHex(0xff2200);
      heaterMat.emissiveIntensity = 1.0;
    } else {
      heaterMat.emissive.setHex(0xef4444);
      heaterMat.emissiveIntensity = 0.4;
    }

    // Loupe tool reveals Poynting vector arrows bursting out of the quartz window
    if (this.windowArrows) {
      this.windowArrows.visible = this.currentTool === 'loupe' || this.currentTool === 'thermal';
    }

    const winMat = this.windowMesh.material as THREE.MeshPhysicalMaterial;
    if (this.currentTool === 'loupe') {
      winMat.emissive.setHex(0xf97316);
      winMat.emissiveIntensity = 0.8;
      winMat.opacity = 0.8;
    } else {
      winMat.emissive.setHex(0x06b6d4);
      winMat.emissiveIntensity = 0.3;
      winMat.opacity = 0.45;
    }
  }

  public setEvidenceDiscovered(evidenceId: string): void {
    if (evidenceId === 'floor_heater' && this.heaterMesh) {
      const mat = this.heaterMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(0xf59e0b);
      mat.emissive.setHex(0xf97316);
      mat.emissiveIntensity = 0.9;
    }
    if (evidenceId === 'quartz_window' && this.windowArrows) {
      this.windowArrows.visible = true;
    }
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
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactables: THREE.Object3D[] = [];
    if (this.heaterMesh) interactables.push(this.heaterMesh);
    if (this.windowMesh) interactables.push(this.windowMesh);

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
      this.animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = this.clock.getElapsedTime();

      // Pulsing energy core
      if (this.energyCore) {
        const pulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.08;
        this.energyCore.scale.set(pulse, pulse, pulse);
      }

      // Animate Poynting outward arrows if visible
      if (this.windowArrows && this.windowArrows.visible) {
        const flow = (Math.sin(elapsedTime * 6.0) + 1.0) * 0.15;
        this.windowArrows.position.z = flow;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  public handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.controls.dispose();
    this.renderer.dispose();
  }
}
