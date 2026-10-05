import { Particle } from '../physics/Particle.ts';
import { Canvas2DView } from '../render/Canvas2DView.ts';
import { ThreePotentialView } from '../render/ThreePotentialView.ts';

export interface CoulombControlsCallbacks {
  onStateChange: () => void;
  onSwitchView: (mode: '2d' | '3d' | 'split') => void;
  onResetPreset: () => void;
}

export class CoulombControlsBinder {
  private particles: Particle[];
  private getCanvasView: () => Canvas2DView | null;
  private getThreeView: () => ThreePotentialView | null;
  private callbacks: CoulombControlsCallbacks;

  constructor(
    particles: Particle[],
    getCanvasView: () => Canvas2DView | null,
    getThreeView: () => ThreePotentialView | null,
    callbacks: CoulombControlsCallbacks
  ) {
    this.particles = particles;
    this.getCanvasView = getCanvasView;
    this.getThreeView = getThreeView;
    this.callbacks = callbacks;
  }

  public bind(): void {
    const q1Slider = document.getElementById('q1-slider') as HTMLInputElement | null;
    const q2Slider = document.getElementById('q2-slider') as HTMLInputElement | null;
    const q1ToggleSign = document.getElementById('q1-toggle-sign');
    const q2ToggleSign = document.getElementById('q2-toggle-sign');

    q1Slider?.addEventListener('input', () => {
      this.particles[0].q = parseFloat(q1Slider.value);
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    q2Slider?.addEventListener('input', () => {
      this.particles[1].q = parseFloat(q2Slider.value);
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    q1ToggleSign?.addEventListener('click', () => {
      this.particles[0].q = -this.particles[0].q;
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    q2ToggleSign?.addEventListener('click', () => {
      this.particles[1].q = -this.particles[1].q;
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    // Quick charge buttons
    document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const val = parseFloat(btn.getAttribute('data-val') || '0');
        if (target === 'q1') {
          this.particles[0].q = val;
        } else {
          this.particles[1].q = val;
        }
        this.getCanvasView()?.render();
        this.callbacks.onStateChange();
      });
    });

    // Presets
    const presetAttract = document.getElementById('preset-attract');
    const presetRepel = document.getElementById('preset-repel');
    const presetRatio = document.getElementById('preset-ratio');
    const presetReset = document.getElementById('preset-reset');

    presetAttract?.addEventListener('click', () => {
      this.particles[0].q = 2.0;
      this.particles[1].q = -2.0;
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    presetRepel?.addEventListener('click', () => {
      this.particles[0].q = 2.0;
      this.particles[1].q = 2.0;
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    presetRatio?.addEventListener('click', () => {
      this.particles[0].q = 4.0;
      this.particles[1].q = 1.0;
      this.getCanvasView()?.render();
      this.callbacks.onStateChange();
    });

    presetReset?.addEventListener('click', () => {
      this.callbacks.onResetPreset();
    });

    // Display Toggles
    const chkGrid = document.getElementById('chk-grid') as HTMLInputElement | null;
    const chkVectors = document.getElementById('chk-vectors') as HTMLInputElement | null;
    const chkFieldLines = document.getElementById('chk-field-lines') as HTMLInputElement | null;
    const chkEField = document.getElementById('chk-efield') as HTMLInputElement | null;

    chkGrid?.addEventListener('change', () => {
      const cv = this.getCanvasView();
      if (cv) cv.showGrid = chkGrid.checked;
      cv?.render();
    });

    chkVectors?.addEventListener('change', () => {
      const cv = this.getCanvasView();
      if (cv) cv.showVectors = chkVectors.checked;
      cv?.render();
    });

    chkFieldLines?.addEventListener('change', () => {
      const cv = this.getCanvasView();
      if (cv) cv.showFieldLines = chkFieldLines.checked;
      cv?.render();
    });

    chkEField?.addEventListener('change', () => {
      const cv = this.getCanvasView();
      if (cv) cv.showEFieldGrid = chkEField.checked;
      cv?.render();
    });

    // Test particle buttons
    const btnTestPos = document.getElementById('btn-test-pos');
    const btnTestNeg = document.getElementById('btn-test-neg');
    const btnSpawnTest = document.getElementById('btn-spawn-test');
    const btnClearTest = document.getElementById('btn-clear-test');

    btnTestPos?.addEventListener('click', () => {
      const cv = this.getCanvasView();
      if (cv) cv.testChargeSign = 1;
      btnTestPos.classList.add('active');
      btnTestNeg?.classList.remove('active');
    });

    btnTestNeg?.addEventListener('click', () => {
      const cv = this.getCanvasView();
      if (cv) cv.testChargeSign = -1;
      btnTestNeg.classList.add('active');
      btnTestPos?.classList.remove('active');
    });

    btnSpawnTest?.addEventListener('click', () => {
      this.getCanvasView()?.spawnTestParticle();
    });

    btnClearTest?.addEventListener('click', () => {
      this.getCanvasView()?.clearTestParticles();
      this.getThreeView()?.clearTestParticleMeshes();
    });

    // View mode tabs
    const tab2D = document.getElementById('tab-view-2d');
    const tab3D = document.getElementById('tab-view-3d');
    const tabSplit = document.getElementById('tab-view-split');

    tab2D?.addEventListener('click', () => this.callbacks.onSwitchView('2d'));
    tab3D?.addEventListener('click', () => this.callbacks.onSwitchView('3d'));
    tabSplit?.addEventListener('click', () => this.callbacks.onSwitchView('split'));

    // 3D Controls
    const btn3DWireframe = document.getElementById('btn-3d-wireframe');
    const btn3DAutoRotate = document.getElementById('btn-3d-autorotate');
    const btn3DResetCam = document.getElementById('btn-3d-reset-cam');

    btn3DWireframe?.addEventListener('click', () => {
      const tv = this.getThreeView();
      if (tv) {
        tv.showWireframe = !tv.showWireframe;
        tv.updateSurface();
        btn3DWireframe.classList.toggle('active', tv.showWireframe);
      }
    });

    btn3DAutoRotate?.addEventListener('click', () => {
      const tv = this.getThreeView();
      if (tv) {
        const newAuto = !tv.autoRotate;
        tv.setAutoRotate(newAuto);
        btn3DAutoRotate.classList.toggle('active', newAuto);
      }
    });

    btn3DResetCam?.addEventListener('click', () => {
      this.getThreeView()?.resetCamera();
    });
  }
}
