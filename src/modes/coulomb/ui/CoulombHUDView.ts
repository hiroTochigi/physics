import katex from 'katex';
import { Particle } from '../physics/Particle.ts';
import { CoulombEngine, ForceResult } from '../physics/CoulombEngine.ts';

export class CoulombHUDView {
  public update(p1: Particle, p2: Particle, forceRes: ForceResult): void {
    // 1. HUD Updates
    const hudForceVal = document.getElementById('hud-force-val');
    const hudForceType = document.getElementById('hud-force-type');
    const hudDistVal = document.getElementById('hud-dist-val');

    if (hudForceVal) {
      hudForceVal.textContent = CoulombEngine.formatForce(forceRes.magnitude);
    }
    if (hudDistVal) {
      hudDistVal.textContent = CoulombEngine.formatDistance(forceRes.distanceMeters);
    }

    if (hudForceType) {
      if (p1.q === 0 || p2.q === 0) {
        hudForceType.textContent = '力なし (中性)';
        hudForceType.className = 'hud-type';
      } else if (forceRes.isAttraction) {
        hudForceType.textContent = '引力（引き合う）';
        hudForceType.className = 'hud-type attract';
      } else {
        hudForceType.textContent = '斥力（反発する）';
        hudForceType.className = 'hud-type repel';
      }
    }

    // 2. Charge 1 UI
    const q1Slider = document.getElementById('q1-slider') as HTMLInputElement | null;
    const q1ValDisplay = document.getElementById('q1-val-display');
    const q1Badge = document.getElementById('q1-badge');
    if (q1Slider) q1Slider.value = p1.q.toString();
    if (q1ValDisplay) q1ValDisplay.textContent = `${p1.q > 0 ? '+' : ''}${p1.q.toFixed(1)} μC`;
    if (q1Badge) this.updateChargeBadge(q1Badge, p1.q, '1');

    // 3. Charge 2 UI
    const q2Slider = document.getElementById('q2-slider') as HTMLInputElement | null;
    const q2ValDisplay = document.getElementById('q2-val-display');
    const q2Badge = document.getElementById('q2-badge');
    if (q2Slider) q2Slider.value = p2.q.toString();
    if (q2ValDisplay) q2ValDisplay.textContent = `${p2.q > 0 ? '+' : ''}${p2.q.toFixed(1)} μC`;
    if (q2Badge) this.updateChargeBadge(q2Badge, p2.q, '2');

    // 4. Update Micro Buttons state
    this.updateMicroButtons(p1, p2);

    // 5. Update Dynamic Proper Function Displays
    const qProd = Math.abs(p1.q * p2.q);
    const cFactor = 8.98755e-3 * qProd;

    const funcFormulaDisplay = document.getElementById('func-formula-display');
    const formulaDynamic = document.getElementById('formula-dynamic');

    if (funcFormulaDisplay) {
      if (qProd === 0) {
        katex.render('F(r) = 0\\ \\mathrm{[N]}', funcFormulaDisplay, { displayMode: false, throwOnError: false });
      } else {
        const cStr = cFactor >= 0.01 ? cFactor.toFixed(4) : cFactor.toExponential(3);
        katex.render(`F(r) = \\frac{${cStr}}{r^2}\\ \\mathrm{[N]}`, funcFormulaDisplay, { displayMode: false, throwOnError: false });
      }
    }

    if (formulaDynamic) {
      if (qProd === 0) {
        katex.render('\\text{現在の関数式: } F(r) = 0\\ \\mathrm{[N]}\\quad(\\text{中性})', formulaDynamic, { displayMode: false, throwOnError: false });
      } else {
        const cStr = cFactor >= 0.01 ? cFactor.toFixed(4) : cFactor.toExponential(3);
        katex.render(`\\text{現在の関数式: } F(r) = \\frac{${cStr}}{r^2}\\ \\mathrm{[N]}`, formulaDynamic, { displayMode: false, throwOnError: false });
      }
    }
  }

  private updateChargeBadge(badgeEl: HTMLElement, q: number, labelIndex: string): void {
    const symbolSpan = badgeEl.querySelector('.badge-symbol');
    const textSpans = badgeEl.querySelectorAll('span');
    const textSpan = textSpans[1];

    if (q > 0) {
      badgeEl.className = 'charge-badge positive';
      if (symbolSpan) symbolSpan.textContent = '+';
    } else if (q < 0) {
      badgeEl.className = 'charge-badge negative';
      if (symbolSpan) symbolSpan.textContent = '−';
    } else {
      badgeEl.className = 'charge-badge';
      badgeEl.style.background = 'rgba(255, 255, 255, 0.1)';
      badgeEl.style.color = '#cbd5e1';
      badgeEl.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      if (symbolSpan) symbolSpan.textContent = '0';
    }
    if (textSpan) {
      textSpan.textContent = `電荷 ${labelIndex} (q${labelIndex === '1' ? '₁' : '₂'})`;
    }
  }

  private updateMicroButtons(p1: Particle, p2: Particle): void {
    document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
      const target = btn.getAttribute('data-target');
      const val = parseFloat(btn.getAttribute('data-val') || '0');
      const particle = target === 'q1' ? p1 : p2;

      if (Math.abs(particle.q - val) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}
