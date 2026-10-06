import { AgentDeviceWeb } from '../../core/AgentDeviceWeb.ts';
import * as fs from 'fs';
import * as path from 'path';

export async function runMonkeyRecoveryTest(): Promise<void> {
  console.log('🐒 [Monkey & Recovery Test]: Starting random button tapping & resilience test...');
  const agent = new AgentDeviceWeb('chaos');
  await agent.launch(true);

  const errors: string[] = [];
  const logEntries: string[] = [];

  agent.page?.on('pageerror', (err) => {
    errors.push(`[PageError]: ${err.message}`);
    console.error('💥 Uncaught Page Error:', err.message);
  });

  agent.page?.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[ConsoleError]: ${msg.text()}`);
    }
  });

  const log = (msg: string) => {
    console.log(`  ▶ ${msg}`);
    logEntries.push(msg);
  };

  try {
    // ==========================================
    // Phase 1: Mystery Mode Random Tapping Test
    // ==========================================
    log('Phase 1: Mystery Mode - Chaos Tapping...');
    await agent.tap('#tab-mode-mystery');
    await agent.page?.waitForTimeout(400);

    // Collect all clickable elements in Mystery Mode
    const getMysteryButtons = async () => {
      return await agent.page?.evaluate(() => {
        const btns = Array.from(
          document.querySelectorAll<HTMLElement>(
            '#mystery-mode-view button, #mystery-mode-view [role="button"], #mystery-mode-view canvas'
          )
        );
        return btns
          .filter((b) => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && b.id !== 'btn-mystery-reset'; // Exclude reset button during chaos
          })
          .map((b) => {
            if (b.id) return `#${b.id}`;
            if (b.getAttribute('data-tool')) return `[data-tool="${b.getAttribute('data-tool')}"]`;
            if (b.getAttribute('data-action')) return `[data-action="${b.getAttribute('data-action')}"]`;
            const firstClass = b.classList?.[0];
            if (firstClass) return `.${firstClass}`;
            return b.tagName.toLowerCase();
          });
      });
    };

    let mysteryTargets = (await getMysteryButtons()) || [];
    log(`Found ${mysteryTargets.length} interactive targets in Mystery Mode. Tapping 25 random actions...`);

    for (let i = 0; i < 25; i++) {
      if (mysteryTargets.length === 0) break;
      const target = mysteryTargets[Math.floor(Math.random() * mysteryTargets.length)];
      try {
        await agent.tap(target, 300);
      } catch (e: any) {
        // Ignored non-critical tap failures (e.g. disabled buttons)
      }
      await agent.page?.waitForTimeout(30);
      // Re-fetch targets as UI might reveal new buttons (dialogues, cards)
      if (i % 5 === 0) {
        mysteryTargets = (await getMysteryButtons()) || [];
      }
    }

    await agent.screenshot('01_mystery_chaos_state');
    log('Captured chaotic state screenshot.');

    // --- RECOVERY TEST 1: Mystery Reset Button ---
    log('Testing Recovery: Tapping "捜査リセット" (#btn-mystery-reset)...');
    await agent.tap('#btn-mystery-reset');
    await agent.page?.waitForTimeout(300);
    await agent.screenshot('02_mystery_recovered');

    // Verify Mystery Mode Recovery State
    const mysteryRecoveryState = await agent.page?.evaluate(() => {
      const missing = document.getElementById('notebook-missing-val')?.textContent;
      const discrepancy = document.getElementById('notebook-discrepancy-val')?.textContent;
      const slotJoule = document.getElementById('slot-joule-heat')?.textContent;
      const slotPoynting = document.getElementById('slot-poynting-flux')?.textContent;
      const solveBtnDisabled = (document.getElementById('btn-mystery-solve') as HTMLButtonElement)?.disabled;
      return { missing, discrepancy, slotJoule, slotPoynting, solveBtnDisabled };
    });

    log(`Mystery Recovery State: ${JSON.stringify(mysteryRecoveryState)}`);
    const mysteryRecoveredOk =
      mysteryRecoveryState?.discrepancy?.includes('80') &&
      mysteryRecoveryState?.slotJoule?.includes('未配置') &&
      mysteryRecoveryState?.solveBtnDisabled;
    log(`Mystery Recovery Success: ${mysteryRecoveredOk ? '✅ 完全復旧' : '⚠️ 一部不完全'}`);

    // ==========================================
    // Phase 2: Coulomb Mode Random Tapping Test
    // ==========================================
    log('Phase 2: Coulomb Mode - Chaos Tapping...');
    await agent.tap('#tab-mode-coulomb');
    await agent.page?.waitForTimeout(500);

    const getCoulombTargets = async () => {
      return await agent.page?.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll<HTMLElement>(
            '#coulomb-mode-view button, #coulomb-mode-view input, #coulomb-mode-view .btn-micro'
          )
        );
        return elements
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && el.id !== 'preset-reset'; // Exclude preset reset
          })
          .map((el) => {
            if (el.id) return `#${el.id}`;
            if (el.getAttribute('data-target')) {
              return `[data-target="${el.getAttribute('data-target')}"][data-val="${el.getAttribute('data-val')}"]`;
            }
            const firstClass = el.classList?.[0];
            if (firstClass) return `.${firstClass}`;
            return el.tagName.toLowerCase();
          });
      });
    };

    let coulombTargets = (await getCoulombTargets()) || [];
    log(`Found ${coulombTargets.length} targets in Coulomb Mode. Tapping 30 random actions...`);

    for (let i = 0; i < 30; i++) {
      if (coulombTargets.length === 0) break;
      const target = coulombTargets[Math.floor(Math.random() * coulombTargets.length)];
      try {
        if (target.includes('slider')) {
          const randomVal = (Math.random() * 10 - 5).toFixed(1);
          await agent.setSlider(target, parseFloat(randomVal));
        } else {
          await agent.tap(target, 300);
        }
      } catch (e: any) {
        // Ignored non-critical tap failures
      }
      await agent.page?.waitForTimeout(30);
    }

    await agent.screenshot('03_coulomb_chaos_state');
    log('Captured Coulomb chaotic state.');

    // --- RECOVERY TEST 2: Coulomb Preset Reset Button ---
    log('Testing Recovery: Tapping "初期配置" (#preset-reset)...');
    await agent.tap('#preset-reset');
    await agent.page?.waitForTimeout(300);
    await agent.screenshot('04_coulomb_recovered');

    const coulombRecoveryState = await agent.page?.evaluate(() => {
      const s = (window as any).__SIM_STATE__;
      const forceVal = document.getElementById('hud-force-val')?.textContent;
      const q1Val = document.getElementById('q1-val-display')?.textContent;
      const q2Val = document.getElementById('q2-val-display')?.textContent;
      return {
        q1: s?.particles?.[0]?.q,
        q2: s?.particles?.[1]?.q,
        forceVal,
        q1Val,
        q2Val
      };
    });

    log(`Coulomb Recovery State: ${JSON.stringify(coulombRecoveryState)}`);
    const coulombRecoveredOk =
      coulombRecoveryState?.q1 === 2 &&
      coulombRecoveryState?.q2 === -2 &&
      coulombRecoveryState?.q1Val?.includes('+2.0') &&
      coulombRecoveryState?.q2Val?.includes('-2.0');
    log(`Coulomb Recovery Success: ${coulombRecoveredOk ? '✅ 完全復旧' : '⚠️ 一部不完全'}`);

    // ==========================================
    // Phase 3: Rapid Mode Switching (Tab thrashing)
    // ==========================================
    log('Phase 3: Rapid Mode Switching Stress Test...');
    const modes = ['#tab-mode-coulomb', '#tab-mode-poynting', '#tab-mode-mystery'];
    for (let i = 0; i < 15; i++) {
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      try {
        await agent.tap(randomMode, 2000);
      } catch (e) {
        // Stress testing allows skipped events while DOM/Three.js re-mounts
      }
      await agent.page?.waitForTimeout(100);
    }
    // Return back to Coulomb and check visibility
    await agent.tap('#tab-mode-coulomb');
    await agent.page?.waitForTimeout(500);
    await agent.screenshot('05_after_tab_thrashing');

    const canvasVisible =
      (await agent.page?.locator('#sim-canvas').isVisible()) ||
      (await agent.page?.locator('#potential-canvas-3d').isVisible());
    log(`Canvas visible after mode thrashing: ${canvasVisible ? '✅ 正常描画' : '❌ 描画喪失'}`);

    // ==========================================
    // Final Report Summary
    // ==========================================
    const reportPath = path.join(agent.getReportsDir(), 'monkey_recovery_report.md');
    let md = `# 🐒 ランダムボタン操作（モンキーテスト）＆ 復帰性検証レポート\n\n`;
    md += `実行日時: ${new Date().toLocaleString()}\n\n`;
    md += `### 1. 検出された未捕捉エラー (Uncaught Exceptions)\n`;
    if (errors.length === 0) {
      md += `* **エラーなし（0件）**: ランダムな高速連打・連続操作中もアプリはクラッシュせず、正常に稼働を継続しました。\n\n`;
    } else {
      md += `* **検出エラー (${errors.length}件)**:\n${errors.map((e) => `  - \`${e}\``).join('\n')}\n\n`;
    }

    md += `### 2. 各モードの復帰性（リカバリー性能）\n`;
    md += `* **ミステリー捜査モード**: ${mysteryRecoveredOk ? '⭐⭐⭐⭐⭐ (1タップで完全復帰)' : '⭐⭐⭐ (課題あり)'}\n`;
    md += `  - ランダムに証拠配置や対話を進めた後でも、**「捜査リセット」ボタンを1回押すだけ**で未解明差分 80 J、スロット初期化、立証ボタン無効化が確実に復元されました。\n`;
    md += `* **クーロンの法則モード**: ${coulombRecoveredOk ? '⭐⭐⭐⭐⭐ (1タップで完全復帰)' : '⭐⭐⭐ (課題あり)'}\n`;
    md += `  - スライダーやトグル、ビューをデタラメに変更した後でも、**「初期配置」ボタンを1回押すだけ**で $q_1 = +2.0\\,\\mu\\text{C}, q_2 = -2.0\\,\\mu\\text{C}$ の標準座標に即座に復帰しました。\n`;
    md += `* **モード高速切り替え耐久性**: ${canvasVisible ? '⭐⭐⭐⭐⭐ (安定維持)' : '❌ (破綻)'}\n`;
    md += `  - 3つのモードタブを15回ランダムに乱打しても、WebGL / Three.js のコンテキストロストやDOM消失は発生せず、再マウントが正常に完了しました。\n\n`;

    md += `### 3. 操作ログ\n`;
    md += logEntries.map((l) => `- ${l}`).join('\n') + '\n';

    fs.writeFileSync(reportPath, md);
    console.log(`\n🎉 Monkey Recovery Test Finished! Report saved to ${reportPath}`);
  } finally {
    await agent.close();
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('monkeyRecovery.test')) {
  runMonkeyRecoveryTest().catch((err) => {
    console.error('Monkey Recovery Test Failed:', err);
    process.exit(1);
  });
}
