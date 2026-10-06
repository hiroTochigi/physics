import * as THREE from 'three';
import { ToolType } from '../MysteryTypes.ts';

/**
 * MysteryLabBuilder
 * Responsible for building and managing 3D structural geometry, procedural textures,
 * materials, and static fixtures of the EM Isolation Chamber (LAB-03).
 */
export class MysteryLabBuilder {
  private scene: THREE.Scene;
  private boxSize: number;
  private half: number;
  private heaterLight: THREE.PointLight;

  // Meshes & Materials
  private roomBox: THREE.LineSegments | null = null;
  private floorMesh: THREE.Mesh | null = null;
  private floorGrid: THREE.GridHelper | null = null;
  private floorTexture: THREE.CanvasTexture | null = null;
  private heaterMesh: THREE.Mesh | null = null;
  private heaterCoilMat: THREE.MeshStandardMaterial | null = null;
  private windowMesh: THREE.Mesh | null = null;
  private windowArrows: THREE.Group | null = null;
  private antennaGroup: THREE.Group | null = null;
  private energyCore: THREE.Mesh | null = null;
  private gimbalGroup: THREE.Group | null = null;

  constructor(scene: THREE.Scene, boxSize: number = 3.2, heaterLight: THREE.PointLight) {
    this.scene = scene;
    this.boxSize = boxSize;
    this.half = boxSize / 2;
    this.heaterLight = heaterLight;

    this.buildAll();
  }

  private buildAll(): void {
    this.buildChamberStructure();
    this.buildChamberFloor();
    this.buildFloorHeater();
    this.buildQuartzWindow();
    this.buildPoyntingFluxArrows();
    this.buildAntennaAndCore();
  }

  /**
   * Structural Frame, Metallic Struts, Corner Junctions & Semi-transparent Shield Walls
   */
  private buildChamberStructure(): void {
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
    const pillarGeo = new THREE.CylinderGeometry(0.045, 0.045, this.boxSize, 16);
    const cornerPositions: [number, number][] = [
      [-this.half, -this.half],
      [this.half, -this.half],
      [-this.half, this.half],
      [this.half, this.half]
    ];

    for (const [cx, cz] of cornerPositions) {
      const pillar = new THREE.Mesh(pillarGeo, frameMat);
      pillar.position.set(cx, 0, cz);
      this.scene.add(pillar);
    }

    // 8 Horizontal perimeter beams
    const beamGeo = new THREE.CylinderGeometry(0.035, 0.035, this.boxSize, 12);
    for (const y of [-this.half, this.half]) {
      for (const z of [-this.half, this.half]) {
        const beamX = new THREE.Mesh(beamGeo, frameMat);
        beamX.rotation.z = Math.PI / 2;
        beamX.position.set(0, y, z);
        this.scene.add(beamX);
      }
    }
    for (const y of [-this.half, this.half]) {
      for (const x of [-this.half, this.half]) {
        const beamZ = new THREE.Mesh(beamGeo, frameMat);
        beamZ.rotation.x = Math.PI / 2;
        beamZ.position.set(x, y, 0);
        this.scene.add(beamZ);
      }
    }

    // 8 Corner joint junction cubes with cyan accent LEDs
    const jointGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    for (const x of [-this.half, this.half]) {
      for (const y of [-this.half, this.half]) {
        for (const z of [-this.half, this.half]) {
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

    const wallPlane = new THREE.PlaneGeometry(this.boxSize, this.boxSize);

    const northWall = new THREE.Mesh(wallPlane, wallMat);
    northWall.position.set(0, 0, -this.half);
    this.scene.add(northWall);

    const westWall = new THREE.Mesh(wallPlane, wallMat);
    westWall.rotation.y = Math.PI / 2;
    westWall.position.set(-this.half, 0, 0);
    this.scene.add(westWall);

    const eastWall = new THREE.Mesh(wallPlane, wallMat);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.position.set(this.half, 0, 0);
    this.scene.add(eastWall);

    const ceiling = new THREE.Mesh(wallPlane, wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, this.half, 0);
    this.scene.add(ceiling);

    const boxGeo = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    this.roomBox = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
    );
    this.scene.add(this.roomBox);
  }

  /**
   * Chamber Floor with Procedural Canvas Texture
   */
  private buildChamberFloor(): void {
    this.floorTexture = this.createFloorTexture();

    const floorGeo = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.floorTexture,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide
    });

    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -this.half + 0.005;
    this.scene.add(this.floorMesh);

    this.floorGrid = new THREE.GridHelper(this.boxSize, 16, 0x0284c7, 0x1e293b);
    this.floorGrid.position.y = -this.half + 0.01;
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
   * 3D Recessed Floor Heater with Serpentine Nichrome Coils
   */
  private buildFloorHeater(): void {
    const hx = -0.4;
    const hy = -this.half;
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
   * Reinforced Quartz Viewport with Titanium Alloy Frame & Fresnel Material
   */
  private buildQuartzWindow(): void {
    const wx = 0.2;
    const wy = 0.0;
    const wz = this.half;
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
  private buildPoyntingFluxArrows(): void {
    this.windowArrows = new THREE.Group();
    const arrowDir = new THREE.Vector3(0, 0, 1);
    for (let x = -0.45; x <= 0.45; x += 0.3) {
      for (let y = -0.45; y <= 0.45; y += 0.3) {
        const origin = new THREE.Vector3(0.2 + x, y, this.half - 0.1);
        const arrow = new THREE.ArrowHelper(arrowDir, origin, 0.85, 0xf97316, 0.28, 0.16);
        this.windowArrows.add(arrow);
      }
    }
    this.windowArrows.visible = false;
    this.scene.add(this.windowArrows);
  }

  /**
   * Center Antenna, Heavy Base Pedestal, Ceramic Insulator Ribs & Gyroscopic Core
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

  public getInteractableObjects(): THREE.Object3D[] {
    const list: THREE.Object3D[] = [];
    if (this.heaterMesh) list.push(this.heaterMesh);
    if (this.windowMesh) list.push(this.windowMesh);
    return list;
  }

  public setTool(tool: ToolType, isWindowDiscovered: boolean, isHeaterDiscovered: boolean): void {
    if (!this.heaterMesh || !this.windowMesh) return;

    const heaterMat = this.heaterMesh.material as THREE.MeshStandardMaterial;
    if (tool === 'thermal') {
      heaterMat.emissive.setHex(0xff2200);
      heaterMat.emissiveIntensity = 1.0;
      if (this.heaterCoilMat) {
        this.heaterCoilMat.emissive.setHex(0xff4500);
        this.heaterCoilMat.emissiveIntensity = 1.5;
      }
      this.heaterLight.intensity = 2.8;
    } else {
      if (isHeaterDiscovered) {
        heaterMat.color.setHex(0xf59e0b);
        heaterMat.emissive.setHex(0xf97316);
        heaterMat.emissiveIntensity = 0.95;
        if (this.heaterCoilMat) {
          this.heaterCoilMat.emissive.setHex(0xfbbf24);
          this.heaterCoilMat.emissiveIntensity = 1.6;
        }
        this.heaterLight.intensity = 2.2;
      } else {
        heaterMat.emissive.setHex(0xef4444);
        heaterMat.emissiveIntensity = 0.45;
        if (this.heaterCoilMat) {
          this.heaterCoilMat.emissive.setHex(0xd97706);
          this.heaterCoilMat.emissiveIntensity = 0.8;
        }
        this.heaterLight.intensity = 1.2;
      }
    }

    const isPoyntingActive = tool === 'loupe' || tool === 'thermal' || isWindowDiscovered;
    if (this.windowArrows) {
      this.windowArrows.visible = isPoyntingActive;
    }

    const winMat = this.windowMesh.material as THREE.MeshPhysicalMaterial;
    if (tool === 'loupe') {
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
      const mat = this.heaterMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(0xf59e0b);
      mat.emissive.setHex(0xf97316);
      mat.emissiveIntensity = 0.95;
      if (this.heaterCoilMat) {
        this.heaterCoilMat.emissive.setHex(0xfbbf24);
        this.heaterCoilMat.emissiveIntensity = 1.6;
      }
      this.heaterLight.color.setHex(0xf59e0b);
      this.heaterLight.intensity = 2.2;
    }
    if (evidenceId === 'quartz_window' && this.windowArrows) {
      this.windowArrows.visible = true;
    }
  }

  public update(elapsedTime: number, isThermalTool: boolean): void {
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
    if (this.heaterCoilMat && isThermalTool) {
      const heatShimmer = 1.4 + Math.sin(elapsedTime * 6.0) * 0.25;
      this.heaterCoilMat.emissiveIntensity = heatShimmer;
    }

    // 4. Animate Poynting outward arrows if visible
    if (this.windowArrows && this.windowArrows.visible) {
      const flow = (Math.sin(elapsedTime * 6.0) + 1.0) * 0.15;
      this.windowArrows.position.z = flow;
    }
  }

  public dispose(): void {
    if (this.floorTexture) {
      this.floorTexture.dispose();
      this.floorTexture = null;
    }
  }
}
