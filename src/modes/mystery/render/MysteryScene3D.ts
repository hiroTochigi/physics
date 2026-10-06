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

  // Meshes & Structural Objects (Phase A)
  private roomBox: THREE.LineSegments | null = null;
  private floorMesh: THREE.Mesh | null = null;
  private floorGrid: THREE.GridHelper | null = null;
  private floorTexture: THREE.CanvasTexture | null = null;
  private heaterMesh: THREE.Mesh | null = null;
  private heaterCoilMat: THREE.MeshStandardMaterial | null = null;
  private heaterLight: THREE.PointLight | null = null;
  private windowMesh: THREE.Mesh | null = null;
  private windowArrows: THREE.Group | null = null;
  private antennaGroup: THREE.Group | null = null;
  private energyCore: THREE.Mesh | null = null;
  private gimbalGroup: THREE.Group | null = null;

  // Dynamic Physical FX (Phase B)
  // 1. Poynting Vector Particle Flux (Photons bursting outward through Quartz Window)
  private poyntingPoints: THREE.Points | null = null;
  private poyntingVelocities: Float32Array | null = null;
  private poyntingTexture: THREE.CanvasTexture | null = null;
  private poyntingMat: THREE.PointsMaterial | null = null;
  private isWindowDiscovered: boolean = false;

  // 2. Joule Heat Shimmer / Thermal Convection Particles
  private thermalPoints: THREE.Points | null = null;
  private thermalVelocities: Float32Array | null = null;
  private thermalTexture: THREE.CanvasTexture | null = null;
  private thermalMat: THREE.PointsMaterial | null = null;
  private isHeaterDiscovered: boolean = false;

  // 3. Dynamic Expanding EM Waves from Antenna
  private emPulseWaves: Array<{ mesh: THREE.Group; mat: THREE.MeshBasicMaterial }> = [];

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
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip under floor too much
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 15.0;

    // 5. Lighting
    this.setupLighting();

    // 6. Build Laboratory Scene (Phase A Refinement + Phase B Dynamic Effects)
    this.buildLaboratory();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Start Render Loop
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

  private buildLaboratory(): void {
    const boxSize = 3.2; // Laboratory bounding box
    const half = boxSize / 2;

    // Phase A: Structural Frame & Electromagnetic Shield Walls
    this.buildChamberStructure(boxSize, half);

    // Phase A: High-Tech Laboratory Floor with Canvas Texture & Hazard Markings
    this.buildChamberFloor(boxSize, half);

    // Phase A: 3D Recessed Floor Heater with Serpentine Nichrome Coils (Evidence 1)
    this.buildFloorHeater(half);

    // Phase A: Heavy Reinforced Quartz Viewport on South Wall (Evidence 2)
    this.buildQuartzWindow(half);

    // Outward Poynting Vector Flux Static Arrows
    this.buildPoyntingFluxArrows(half);

    // Phase A: Upgraded Center Antenna, Isolator Fins & Gyro Core
    this.buildAntennaAndCore();

    // Phase B: Poynting Vector Dynamic Particle Flux Stream (Bursting through Quartz Window)
    this.buildPoyntingParticles(half);

    // Phase B: Joule Heat Thermal Convection & Shimmer Particles (Rising from Floor Heater)
    this.buildThermalParticles(half);

    // Phase B: Dynamic Spherical EM Wave Pulse Emission from Antenna
    this.buildEMWavePulses();
  }

  /**
   * Helper: Generate a soft circular glowing particle texture with radial gradient
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
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Phase A: Structural Frame, Metallic Struts, Corner Junctions & Semi-transparent Shield Walls
   */
  private buildChamberStructure(boxSize: number, half: number): void {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2
    });

    // 4 Vertical corner pillars
    const pillarGeo = new THREE.CylinderGeometry(0.045, 0.045, boxSize, 16);
    const cornerPositions: [number, number][] = [
      [-half, -half],
      [half, -half],
      [-half, half],
      [half, half]
    ];

    for (const [cx, cz] of cornerPositions) {
      const pillar = new THREE.Mesh(pillarGeo, frameMat);
      pillar.position.set(cx, 0, cz);
      this.scene.add(pillar);
    }

    // 8 Horizontal perimeter beams
    const beamGeo = new THREE.CylinderGeometry(0.035, 0.035, boxSize, 12);
    for (const y of [-half, half]) {
      for (const z of [-half, half]) {
        const beamX = new THREE.Mesh(beamGeo, frameMat);
        beamX.rotation.z = Math.PI / 2;
        beamX.position.set(0, y, z);
        this.scene.add(beamX);
      }
    }
    for (const y of [-half, half]) {
      for (const x of [-half, half]) {
        const beamZ = new THREE.Mesh(beamGeo, frameMat);
        beamZ.rotation.x = Math.PI / 2;
        beamZ.position.set(x, y, 0);
        this.scene.add(beamZ);
      }
    }

    // 8 Corner joint junction cubes with cyan accent LEDs
    const jointGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    for (const x of [-half, half]) {
      for (const y of [-half, half]) {
        for (const z of [-half, half]) {
          const joint = new THREE.Mesh(jointGeo, jointMat);
          joint.position.set(x, y, z);
          this.scene.add(joint);
        }
      }
    }

    // Semi-transparent Electromagnetic Shield Wall Panels
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.08,
      roughness: 0.2,
      metalness: 0.7,
      side: THREE.DoubleSide
    });

    const wallPlane = new THREE.PlaneGeometry(boxSize, boxSize);

    const northWall = new THREE.Mesh(wallPlane, wallMat);
    northWall.position.set(0, 0, -half);
    this.scene.add(northWall);

    const westWall = new THREE.Mesh(wallPlane, wallMat);
    westWall.rotation.y = Math.PI / 2;
    westWall.position.set(-half, 0, 0);
    this.scene.add(westWall);

    const eastWall = new THREE.Mesh(wallPlane, wallMat);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.position.set(half, 0, 0);
    this.scene.add(eastWall);

    const ceiling = new THREE.Mesh(wallPlane, wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, half, 0);
    this.scene.add(ceiling);

    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    this.roomBox = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
    );
    this.scene.add(this.roomBox);
  }

  /**
   * Phase A: Sci-Fi Chamber Floor with Procedural Canvas Texture
   */
  private buildChamberFloor(boxSize: number, half: number): void {
    this.floorTexture = this.createFloorTexture();

    const floorGeo = new THREE.PlaneGeometry(boxSize, boxSize);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.floorTexture,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide
    });

    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -half + 0.005;
    this.scene.add(this.floorMesh);

    this.floorGrid = new THREE.GridHelper(boxSize, 16, 0x0284c7, 0x1e293b);
    this.floorGrid.position.y = -half + 0.01;
    this.scene.add(this.floorGrid);
  }

  private createFloorTexture(): THREE.CanvasTexture {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, size, size);

      const tileSize = size / 8;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const x = i * tileSize;
          const y = j * tileSize;

          ctx.fillStyle = (i + j) % 2 === 0 ? '#0b1325' : '#080e1c';
          ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

          ctx.strokeStyle = '#1e293b';
          ctx.strokeRect(x, y, tileSize, tileSize);

          ctx.fillStyle = '#0284c7';
          ctx.fillRect(x + 6, y + 6, 4, 4);
        }
      }

      const hx = 180, hy = 530, hw = 520, hh = 420;
      ctx.save();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(hx, hy, hw, hh);

      ctx.clip();
      ctx.fillStyle = '#18181b';
      for (let s = -200; s < size + 400; s += 24) {
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.lineTo(s + 12, 0);
        ctx.lineTo(s - size + 12, size);
        ctx.lineTo(s - size, size);
        ctx.fill();
      }
      ctx.restore();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('LAB-03 // EM ISOLATION CHAMBER [VOL: V]', 40, 60);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px monospace';
      ctx.fillText('SPEC: BOUNDING VOLUME V = (3.2m)^3 | SHIELD: CLASS-IV', 40, 85);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('⚡ CAUTION: THERMAL RESISTOR / JOULE HEAT SINK AREA', 200, 515);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('🔍 OBSERVATION PORT: QUARTZ DIELECTRIC BOUNDARY ∂V ➔', 380, 990);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '13px monospace';
      ctx.fillText('WARNING: CHARGED PARTICLE CONVERTER RESISTOR (30 J LOAD)', 200, 970);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  /**
   * Phase A: 3D Recessed Floor Heater with Serpentine Nichrome Coils
   */
  private buildFloorHeater(half: number): void {
    const hx = -0.4;
    const hy = -half;
    const hz = 0.3;
    const heaterWidth = 1.6;
    const heaterDepth = 1.2;

    const trayGeo = new THREE.BoxGeometry(heaterWidth + 0.1, 0.08, heaterDepth + 0.1);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.3
    });
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.set(hx, hy + 0.04, hz);
    this.scene.add(tray);

    const bedGeo = new THREE.PlaneGeometry(heaterWidth, heaterDepth);
    const heaterMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0xef4444,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.75,
      side: THREE.DoubleSide
    });
    this.heaterMesh = new THREE.Mesh(bedGeo, heaterMat);
    this.heaterMesh.rotation.x = -Math.PI / 2;
    this.heaterMesh.position.set(hx, hy + 0.081, hz);
    this.heaterMesh.userData = { id: 'floor_heater', name: '床のヒーター' };
    this.scene.add(this.heaterMesh);

    const coilPoints: THREE.Vector3[] = [];
    const rows = 6;
    const xMin = -heaterWidth / 2 + 0.15;
    const xMax = heaterWidth / 2 - 0.15;
    const zMin = -heaterDepth / 2 + 0.15;
    const zMax = heaterDepth / 2 - 0.15;
    const zStep = (zMax - zMin) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      const z = zMin + r * zStep;
      if (r % 2 === 0) {
        coilPoints.push(new THREE.Vector3(xMin, 0.015, z));
        coilPoints.push(new THREE.Vector3(xMax, 0.015, z));
      } else {
        coilPoints.push(new THREE.Vector3(xMax, 0.015, z));
        coilPoints.push(new THREE.Vector3(xMin, 0.015, z));
      }
    }

    const coilCurve = new THREE.CatmullRomCurve3(coilPoints, false, 'catmullrom', 0.15);
    const coilGeo = new THREE.TubeGeometry(coilCurve, 120, 0.022, 8, false);

    this.heaterCoilMat = new THREE.MeshStandardMaterial({
      color: 0xfb923c,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });

    const coilMesh = new THREE.Mesh(coilGeo, this.heaterCoilMat);
    coilMesh.position.set(hx, hy + 0.082, hz);
    coilMesh.userData = { id: 'floor_heater', name: '床のヒーター' };
    this.scene.add(coilMesh);

    const clampGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12);
    const clampMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    for (const cx of [hx - heaterWidth / 2 + 0.08, hx + heaterWidth / 2 - 0.08]) {
      for (const cz of [hz - heaterDepth / 2 + 0.08, hz + heaterDepth / 2 - 0.08]) {
        const clamp = new THREE.Mesh(clampGeo, clampMat);
        clamp.position.set(cx, hy + 0.09, cz);
        this.scene.add(clamp);
      }
    }
  }

  /**
   * Phase A: Reinforced Quartz Viewport with Titanium Alloy Frame & Fresnel Material
   */
  private buildQuartzWindow(half: number): void {
    const wx = 0.2;
    const wy = 0.0;
    const wz = half;
    const winSize = 1.4;

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.2
    });

    const beamH = new THREE.BoxGeometry(winSize + 0.24, 0.12, 0.12);
    const beamV = new THREE.BoxGeometry(0.12, winSize, 0.12);

    const topBeam = new THREE.Mesh(beamH, frameMat);
    topBeam.position.set(wx, wy + winSize / 2 + 0.06, wz);
    this.scene.add(topBeam);

    const btmBeam = new THREE.Mesh(beamH, frameMat);
    btmBeam.position.set(wx, wy - winSize / 2 - 0.06, wz);
    this.scene.add(btmBeam);

    const leftBeam = new THREE.Mesh(beamV, frameMat);
    leftBeam.position.set(wx - winSize / 2 - 0.06, wy, wz);
    this.scene.add(leftBeam);

    const rightBeam = new THREE.Mesh(beamV, frameMat);
    rightBeam.position.set(wx + winSize / 2 + 0.06, wy, wz);
    this.scene.add(rightBeam);

    const boltGeo = new THREE.SphereGeometry(0.024, 8, 8);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const boltPositions = [
      [wx - winSize / 2 - 0.06, wy + winSize / 2 + 0.06],
      [wx + winSize / 2 + 0.06, wy + winSize / 2 + 0.06],
      [wx - winSize / 2 - 0.06, wy - winSize / 2 - 0.06],
      [wx + winSize / 2 + 0.06, wy - winSize / 2 - 0.06],
      [wx, wy + winSize / 2 + 0.06],
      [wx, wy - winSize / 2 - 0.06]
    ];
    for (const [bx, by] of boltPositions) {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.set(bx, by, wz + 0.06);
      this.scene.add(bolt);
    }

    const winGeo = new THREE.PlaneGeometry(winSize, winSize);
    const winMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.52,
      roughness: 0.04,
      metalness: 0.08,
      transmission: 0.88,
      ior: 1.54,
      side: THREE.DoubleSide
    });
    this.windowMesh = new THREE.Mesh(winGeo, winMat);
    this.windowMesh.position.set(wx, wy, wz);
    this.windowMesh.userData = { id: 'quartz_window', name: '南壁の石英窓' };
    this.scene.add(this.windowMesh);

    const gridEdges = new THREE.EdgesGeometry(winGeo);
    const frameLine = new THREE.LineSegments(
      gridEdges,
      new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2, transparent: true, opacity: 0.7 })
    );
    frameLine.position.copy(this.windowMesh.position);
    this.scene.add(frameLine);
  }

  /**
   * Outward Poynting Vector Flux Arrows
   */
  private buildPoyntingFluxArrows(half: number): void {
    this.windowArrows = new THREE.Group();
    const arrowDir = new THREE.Vector3(0, 0, 1);
    for (let x = -0.45; x <= 0.45; x += 0.3) {
      for (let y = -0.45; y <= 0.45; y += 0.3) {
        const origin = new THREE.Vector3(0.2 + x, y, half - 0.1);
        const arrow = new THREE.ArrowHelper(arrowDir, origin, 0.85, 0xf97316, 0.28, 0.16);
        this.windowArrows.add(arrow);
      }
    }
    this.windowArrows.visible = false;
    this.scene.add(this.windowArrows);
  }

  /**
   * Phase A: Center Antenna, Heavy Base Pedestal, Ceramic Insulator Ribs & Gyroscopic Core
   */
  private buildAntennaAndCore(): void {
    this.antennaGroup = new THREE.Group();

    const baseGeo1 = new THREE.CylinderGeometry(0.35, 0.42, 0.08, 24);
    const baseGeo2 = new THREE.CylinderGeometry(0.22, 0.35, 0.1, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
    const b1 = new THREE.Mesh(baseGeo1, baseMat);
    b1.position.y = -1.56;
    const b2 = new THREE.Mesh(baseGeo2, baseMat);
    b2.position.y = -1.48;
    this.antennaGroup.add(b1);
    this.antennaGroup.add(b2);

    const mastGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.6, 16);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    this.antennaGroup.add(mast);

    const insGeo = new THREE.TorusGeometry(0.085, 0.02, 12, 24);
    const insMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.3 });
    for (let iy = -0.4; iy <= 0.4; iy += 0.25) {
      const fin = new THREE.Mesh(insGeo, insMat);
      fin.rotation.x = Math.PI / 2;
      fin.position.y = iy;
      this.antennaGroup.add(fin);
    }

    const coreGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    this.energyCore = new THREE.Mesh(coreGeo, coreMat);
    this.antennaGroup.add(this.energyCore);

    this.gimbalGroup = new THREE.Group();
    const ring1Geo = new THREE.TorusGeometry(0.36, 0.014, 12, 36);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);

    const ring2Geo = new THREE.TorusGeometry(0.42, 0.014, 12, 36);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;

    this.gimbalGroup.add(ring1);
    this.gimbalGroup.add(ring2);
    this.antennaGroup.add(this.gimbalGroup);

    for (let r = 0.55; r <= 1.3; r += 0.35) {
      const waveGeo = new THREE.RingGeometry(r, r + 0.02, 36);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.rotation.x = Math.PI / 2;
      this.antennaGroup.add(wave);
    }

    this.scene.add(this.antennaGroup);
  }

  /**
   * Phase B: Dynamic Poynting Particle Flow (Continuous beam streaming through Quartz Window)
   */
  private buildPoyntingParticles(half: number): void {
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.poyntingVelocities = new Float32Array(count);

    const wx = 0.2;
    const wy = 0.0;
    const wz = half;

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
    this.poyntingPoints.visible = false; // Activated on loupe tool or discovery
    this.scene.add(this.poyntingPoints);
  }

  /**
   * Phase B: Joule Heat Thermal Convection Particles (Rising shimmer from Floor Heater)
   */
  private buildThermalParticles(half: number): void {
    const count = 130;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.thermalVelocities = new Float32Array(count);

    const hx = -0.4;
    const hy = -half + 0.08;
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
    this.thermalPoints.visible = false; // Activated on thermal tool or discovery
    this.scene.add(this.thermalPoints);
  }

  /**
   * Phase B: Dynamic Spherical EM Wave Pulse Emission from Central Antenna
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
      if (this.heaterCoilMat) {
        this.heaterCoilMat.emissive.setHex(0xff4500);
        this.heaterCoilMat.emissiveIntensity = 1.5;
      }
      if (this.heaterLight) {
        this.heaterLight.intensity = 2.8;
      }
      if (this.thermalPoints) {
        this.thermalPoints.visible = true;
        if (this.thermalMat) this.thermalMat.opacity = 0.95;
      }
    } else {
      heaterMat.emissive.setHex(0xef4444);
      heaterMat.emissiveIntensity = 0.45;
      if (this.heaterCoilMat) {
        this.heaterCoilMat.emissive.setHex(0xd97706);
        this.heaterCoilMat.emissiveIntensity = 0.8;
      }
      if (this.heaterLight) {
        this.heaterLight.intensity = 1.2;
      }
      if (this.thermalPoints) {
        this.thermalPoints.visible = this.isHeaterDiscovered;
        if (this.thermalMat) this.thermalMat.opacity = 0.75;
      }
    }

    // Loupe tool reveals Poynting vector arrows and particle stream
    const isPoyntingActive = this.currentTool === 'loupe' || this.currentTool === 'thermal' || this.isWindowDiscovered;
    if (this.windowArrows) {
      this.windowArrows.visible = isPoyntingActive;
    }
    if (this.poyntingPoints) {
      this.poyntingPoints.visible = isPoyntingActive;
      if (this.poyntingMat) {
        this.poyntingMat.opacity = this.currentTool === 'loupe' ? 0.95 : 0.75;
      }
    }

    const winMat = this.windowMesh.material as THREE.MeshPhysicalMaterial;
    if (this.currentTool === 'loupe') {
      winMat.emissive.setHex(0xf97316);
      winMat.emissiveIntensity = 0.85;
      winMat.opacity = 0.82;
    } else {
      winMat.emissive.setHex(0x06b6d4);
      winMat.emissiveIntensity = 0.35;
      winMat.opacity = 0.52;
    }
  }

  public setEvidenceDiscovered(evidenceId: string): void {
    if (evidenceId === 'floor_heater' && this.heaterMesh) {
      this.isHeaterDiscovered = true;
      const mat = this.heaterMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(0xf59e0b);
      mat.emissive.setHex(0xf97316);
      mat.emissiveIntensity = 0.95;
      if (this.heaterCoilMat) {
        this.heaterCoilMat.emissive.setHex(0xfbbf24);
        this.heaterCoilMat.emissiveIntensity = 1.6;
      }
      if (this.heaterLight) {
        this.heaterLight.color.setHex(0xf59e0b);
        this.heaterLight.intensity = 2.2;
      }
      if (this.thermalPoints) {
        this.thermalPoints.visible = true;
      }
    }
    if (evidenceId === 'quartz_window') {
      this.isWindowDiscovered = true;
      if (this.windowArrows) {
        this.windowArrows.visible = true;
      }
      if (this.poyntingPoints) {
        this.poyntingPoints.visible = true;
      }
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
    const half = 1.6; // half box size
    const animate = () => {
      if (this.isDisposed) return;
      this.animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = this.clock.getElapsedTime();

      // 1. Pulsing energy core
      if (this.energyCore) {
        const pulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.08;
        this.energyCore.scale.set(pulse, pulse, pulse);
      }

      // 2. Revolving gyroscopic gimbal rings
      if (this.gimbalGroup) {
        this.gimbalGroup.rotation.y = elapsedTime * 0.6;
        this.gimbalGroup.rotation.x = elapsedTime * 0.4;
      }

      // 3. Thermal breathing glow on nichrome coils when thermal tool is active
      if (this.heaterCoilMat && this.currentTool === 'thermal') {
        const heatShimmer = 1.4 + Math.sin(elapsedTime * 6.0) * 0.25;
        this.heaterCoilMat.emissiveIntensity = heatShimmer;
      }

      // 4. Animate Poynting outward arrows if visible
      if (this.windowArrows && this.windowArrows.visible) {
        const flow = (Math.sin(elapsedTime * 6.0) + 1.0) * 0.15;
        this.windowArrows.position.z = flow;
      }

      // 5. Phase B: Animate Poynting Particles (Stream bursting outward from Quartz Window)
      if (this.poyntingPoints && this.poyntingPoints.visible && this.poyntingVelocities) {
        const posAttr = this.poyntingPoints.geometry.attributes.position;
        const posArr = posAttr.array as Float32Array;
        const count = posArr.length / 3;
        const wx = 0.2;
        const wy = 0.0;
        const wz = half;

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

      // 6. Phase B: Animate Joule Heat Thermal Shimmer Particles (Rising from Floor Heater)
      if (this.thermalPoints && this.thermalPoints.visible && this.thermalVelocities) {
        const posAttr = this.thermalPoints.geometry.attributes.position;
        const posArr = posAttr.array as Float32Array;
        const count = posArr.length / 3;
        const hx = -0.4;
        const hy = -half + 0.08;
        const hz = 0.3;

        for (let i = 0; i < count; i++) {
          posArr[i * 3 + 1] += this.thermalVelocities[i]; // rise in Y
          posArr[i * 3] += Math.sin(elapsedTime * 3.5 + i) * 0.0018; // subtle convection wobble
          if (posArr[i * 3 + 1] > -half + 1.1) {
            // Respawn on heater bed
            posArr[i * 3] = hx + (Math.random() - 0.5) * 1.45;
            posArr[i * 3 + 1] = hy + Math.random() * 0.05;
            posArr[i * 3 + 2] = hz + (Math.random() - 0.5) * 1.05;
          }
        }
        posAttr.needsUpdate = true;
      }

      // 7. Phase B: Animate EM Wave Pulses radiating from Antenna
      const numPulses = this.emPulseWaves.length;
      for (let i = 0; i < numPulses; i++) {
        const { mesh, mat } = this.emPulseWaves[i];
        const phase = (elapsedTime * 0.45 + i / numPulses) % 1.0;
        const scale = 0.25 + phase * 2.2;
        mesh.scale.set(scale, scale, scale);
        mat.opacity = (1.0 - phase) * 0.35;
      }

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
    if (this.floorTexture) {
      this.floorTexture.dispose();
      this.floorTexture = null;
    }
    if (this.poyntingTexture) {
      this.poyntingTexture.dispose();
      this.poyntingTexture = null;
    }
    if (this.thermalTexture) {
      this.thermalTexture.dispose();
      this.thermalTexture = null;
    }
    this.controls.dispose();
    this.renderer.dispose();
  }
}
