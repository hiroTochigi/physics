import { ModeRegistry } from './core/ModeRegistry.ts';
import { AppRouter } from './core/AppRouter.ts';
import { CoulombMode } from './modes/coulomb/CoulombMode.ts';
import { PoyntingMode } from './modes/poynting/PoyntingMode.ts';
import { MysteryMode } from './modes/mystery/MysteryMode.ts';

import 'katex/dist/katex.min.css';

// 1. Instantiate and register available simulator modes
const coulombMode = new CoulombMode();
const poyntingMode = new PoyntingMode();
const mysteryMode = new MysteryMode();

ModeRegistry.register(coulombMode);
ModeRegistry.register(poyntingMode);
ModeRegistry.register(mysteryMode);

// 2. Instantiate platform router
const router = new AppRouter();

import renderMathInElement from 'katex/contrib/auto-render';

// Synchronize platform header text when modes switch
router.onModeChange((mode) => {
  const brandTitle = document.getElementById('header-title-text');
  const brandSubtitle = document.getElementById('header-subtitle-text');
  if (brandTitle) {
    brandTitle.textContent = `${mode.metadata.name} シミュレーター`;
  }
  if (brandSubtitle) {
    brandSubtitle.innerHTML = mode.metadata.subtitle;
    try {
      renderMathInElement(brandSubtitle, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn('Header math render error:', e);
    }
  }
});

// 3. Initialize routing and mount initial mode
router.init();

// 4. Quick navigation hooks
const btnOpenMystery = document.getElementById('btn-poynting-open-mystery');
if (btnOpenMystery) {
  btnOpenMystery.addEventListener('click', () => {
    router.switchMode('mystery');
  });
}

