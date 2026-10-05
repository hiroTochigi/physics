import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import { Particle } from '../physics/Particle.ts';
import { CoulombEngine } from '../physics/CoulombEngine.ts';
import { ChallengeManager } from './ChallengeManager.ts';
import { Challenge } from './ChallengeTypes.ts';
import { Canvas2DView } from '../render/Canvas2DView.ts';

export interface CoulombChallengePresenterContext {
  engine: CoulombEngine;
  particles: Particle[];
  getCanvasView: () => Canvas2DView | null;
  updateUI: () => void;
}

export class CoulombChallengePresenter {
  private challengeManager: ChallengeManager;
  private ctx: CoulombChallengePresenterContext;

  constructor(challengeManager: ChallengeManager, ctx: CoulombChallengePresenterContext) {
    this.challengeManager = challengeManager;
    this.ctx = ctx;
  }

  public bind(): void {
    const btnChallengeTabs = document.querySelectorAll('.btn-challenge-tab');
    const btnRandomChallenge = document.getElementById('btn-random-challenge');
    const btnSubmitAnswer = document.getElementById('btn-submit-answer');
    const btnSyncToStage = document.getElementById('btn-sync-to-stage');
    const btnToggleSolution = document.getElementById('btn-toggle-solution');
    const challengeSolutionDrawer = document.getElementById('challenge-solution-drawer');

    btnChallengeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        btnChallengeTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.getAttribute('data-id') || 'challenge-1';
        const ch = this.challengeManager.selectChallengeById(id);
        if (ch) {
          this.renderCurrentChallenge(ch);
        }
      });
    });

    btnRandomChallenge?.addEventListener('click', () => {
      btnChallengeTabs.forEach((t) => t.classList.remove('active'));
      const randomCh = this.challengeManager.generateRandomChallenge();
      this.renderCurrentChallenge(randomCh);
    });

    btnSubmitAnswer?.addEventListener('click', () => {
      const input = document.getElementById('input-challenge-force') as HTMLInputElement | null;
      const dirRadio = document.querySelector('input[name="challenge-dir"]:checked') as HTMLInputElement | null;
      const forceStr = input?.value || '';
      const dirStr = dirRadio ? dirRadio.value : 'attract';

      const result = this.challengeManager.evaluateAnswer(forceStr, dirStr);
      const feedback = document.getElementById('challenge-feedback');
      if (feedback) {
        feedback.className = `challenge-feedback ${result.isCorrect ? 'success' : 'error'}`;
        feedback.textContent = result.message;
      }
    });

    btnToggleSolution?.addEventListener('click', () => {
      if (!challengeSolutionDrawer) return;
      const isHidden = challengeSolutionDrawer.classList.contains('hidden');
      if (isHidden) {
        challengeSolutionDrawer.classList.remove('hidden');
        if (btnToggleSolution) btnToggleSolution.textContent = '✕ 解説を閉じる';
      } else {
        challengeSolutionDrawer.classList.add('hidden');
        if (btnToggleSolution) btnToggleSolution.textContent = '📖 手計算解説を見る';
      }
    });

    btnSyncToStage?.addEventListener('click', () => {
      const ch = this.challengeManager.getCurrentChallenge();
      this.applyChallengeToSimulator(ch);
    });

    this.renderCurrentChallenge(this.challengeManager.getCurrentChallenge());
  }

  public renderCurrentChallenge(challenge: Challenge): void {
    const challengeDiff = document.getElementById('challenge-diff');
    const challengeTitle = document.getElementById('challenge-title');
    const challengeDesc = document.getElementById('challenge-desc');
    const challengeFeedback = document.getElementById('challenge-feedback');
    const challengeSolutionDrawer = document.getElementById('challenge-solution-drawer');
    const solutionStepsList = document.getElementById('solution-steps-list');
    const inputChallengeForce = document.getElementById('input-challenge-force') as HTMLInputElement | null;
    const btnToggleSolution = document.getElementById('btn-toggle-solution');

    if (challengeDiff) {
      challengeDiff.textContent = challenge.difficulty;
      if (challenge.difficulty === '入門') {
        challengeDiff.style.background = '#0284c7';
      } else if (challenge.difficulty === '基本') {
        challengeDiff.style.background = '#2563eb';
      } else if (challenge.difficulty === '応用') {
        challengeDiff.style.background = '#d97706';
      } else if (challenge.difficulty === '発展') {
        challengeDiff.style.background = '#7c3aed';
      } else {
        challengeDiff.style.background = '#059669';
      }
    }

    if (challengeTitle) challengeTitle.textContent = challenge.title;

    if (challengeDesc) {
      challengeDesc.innerHTML = challenge.description;
      try {
        renderMathInElement(challengeDesc, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        console.warn('Math render error in challenge description:', e);
      }
    }

    if (inputChallengeForce) inputChallengeForce.value = '';
    if (challengeFeedback) {
      challengeFeedback.className = 'challenge-feedback hidden';
      challengeFeedback.textContent = '';
    }
    if (challengeSolutionDrawer) {
      challengeSolutionDrawer.classList.add('hidden');
      if (btnToggleSolution) btnToggleSolution.textContent = '📖 手計算解説を見る';
    }

    if (solutionStepsList) {
      solutionStepsList.innerHTML = '';
      challenge.solutionSteps.forEach((step) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'solution-step-item';

        const titleEl = document.createElement('div');
        titleEl.className = 'solution-step-title';
        titleEl.textContent = `Step ${step.stepNumber}: ${step.title}`;
        stepEl.appendChild(titleEl);

        const bodyEl = document.createElement('div');
        bodyEl.className = 'solution-step-body';
        bodyEl.innerHTML = step.explanation;
        stepEl.appendChild(bodyEl);

        if (step.formulaLatex) {
          const mathEl = document.createElement('div');
          mathEl.className = 'solution-step-math';
          try {
            katex.render(step.formulaLatex, mathEl, {
              displayMode: true,
              throwOnError: false
            });
          } catch (err) {
            mathEl.textContent = step.formulaLatex;
          }
          stepEl.appendChild(mathEl);
        }

        try {
          renderMathInElement(bodyEl, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {}

        solutionStepsList.appendChild(stepEl);
      });
    }
  }

  public applyChallengeToSimulator(challenge: Challenge): void {
    this.ctx.particles[0].q = challenge.q1_uC;
    this.ctx.particles[1].q = challenge.q2_uC;

    const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement | null;
    const rect = simCanvas?.parentElement?.getBoundingClientRect();
    const w = rect && rect.width > 0 ? rect.width : 600;
    const h = rect && rect.height > 0 ? rect.height : 400;
    const centerX = w / 2;
    const centerY = h / 2;

    const distPx = challenge.r_m * this.ctx.engine.pixelsPerMeter;
    this.ctx.particles[0].x = Math.max(60, centerX - distPx / 2);
    this.ctx.particles[0].y = centerY;
    this.ctx.particles[1].x = Math.min(w - 60, centerX + distPx / 2);
    this.ctx.particles[1].y = centerY;

    this.ctx.getCanvasView()?.render();
    this.ctx.updateUI();

    const challengeFeedback = document.getElementById('challenge-feedback');
    if (challengeFeedback) {
      challengeFeedback.className = 'challenge-feedback success';
      challengeFeedback.innerHTML = `🔬 シミュレーターの電荷を <strong>q₁ = ${challenge.q1_uC > 0 ? '+' : ''}${challenge.q1_uC} μC</strong>, <strong>q₂ = ${challenge.q2_uC > 0 ? '+' : ''}${challenge.q2_uC} μC</strong>, 距離 <strong>r = ${challenge.r_m.toFixed(2)} m</strong> に配置しました！左上のHUDと矢印を確認してみよう。`;
    }
  }
}
