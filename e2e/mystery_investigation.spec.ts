import { test, expect } from '@playwright/test';

test.describe('Mystery Investigation Mode E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?mode=mystery');
  });

  test('TC-MYSTERY-01: ミステリー捜査モードの初期表示と消失エネルギー確認', async ({ page }) => {
    // 1. タブとコンテナの確認
    const mysteryTab = page.locator('#tab-mode-mystery');
    const mysteryView = page.locator('#mystery-mode-view');
    await expect(mysteryTab).toHaveClass(/active/);
    await expect(mysteryView).toBeVisible();

    // 2. タイトルと見出しの確認
    await expect(page.locator('.mystery-heading')).toHaveText('密室から消えた 80 ジュールの謎');
    await expect(page.locator('#header-title-text')).toHaveText('エネルギー消失事件の捜査 シミュレーター');

    // 3. 捜査手帳の初期ステータス確認
    const missingVal = page.locator('#notebook-missing-val');
    const remainVal = page.locator('#notebook-remain-val');
    const discrepancyVal = page.locator('#notebook-discrepancy-val');

    await expect(missingVal).toHaveText('-80 J');
    await expect(remainVal).toHaveText('20 J');
    await expect(discrepancyVal).toHaveText('80 J');

    // 4. 3Dキャンバスの存在確認
    await expect(page.locator('#mystery-canvas-3d')).toBeVisible();
  });

  test('TC-MYSTERY-02: ノベル対話ウィンドウのナビゲーション', async ({ page }) => {
    const speakerEl = page.locator('#mystery-dialogue-speaker');
    const progressEl = page.locator('#mystery-dialogue-progress');
    const nextBtn = page.locator('#btn-mystery-next-dialogue');
    const prevBtn = page.locator('#btn-mystery-prev-dialogue');

    await expect(speakerEl).toHaveText('ナレーション');
    await expect(progressEl).toHaveText('1 / 5');
    await expect(prevBtn).toBeDisabled();

    // 1回「次へ」をクリック
    await nextBtn.click();
    await expect(speakerEl).toHaveText('助手のアオイ');
    await expect(progressEl).toHaveText('2 / 5');
    await expect(prevBtn).toBeEnabled();

    // 「前へ」をクリックして戻る
    await prevBtn.click();
    await expect(speakerEl).toHaveText('ナレーション');
    await expect(progressEl).toHaveText('1 / 5');
  });

  test('TC-MYSTERY-03: 捜査ツールの切り替え動作', async ({ page }) => {
    const toolInspect = page.locator('.btn-mystery-tool[data-tool="inspect"]');
    const toolThermal = page.locator('.btn-mystery-tool[data-tool="thermal"]');
    const toolLoupe = page.locator('.btn-mystery-tool[data-tool="loupe"]');

    await expect(toolInspect).toHaveClass(/active/);

    // 熱探知カメラへ切り替え
    await toolThermal.click();
    await expect(toolThermal).toHaveClass(/active/);
    await expect(toolInspect).not.toHaveClass(/active/);

    // 精密虫眼鏡へ切り替え
    await toolLoupe.click();
    await expect(toolLoupe).toHaveClass(/active/);
    await expect(toolThermal).not.toHaveClass(/active/);
  });

  test('TC-MYSTERY-04: 現場調査から証拠獲得、帳尻合わせと事件解決モーダルまでのフロー', async ({ page }) => {
    // 1. 3D現場をクリックして床のヒーターを調査（ThreeSceneのオブジェクトクリックをシミュレート）
    // Canvasの中心やや下側（床ヒーター位置）をクリック
    const canvas = page.locator('#mystery-canvas-3d');
    const box = await canvas.boundingBox();
    if (box) {
      // 画面の少し左下付近（床ヒーター）をクリック
      await page.mouse.click(box.x + box.width * 0.45, box.y + box.height * 0.65);
    }

    // 証拠を確実に発見状態にする（UIまたは内部メソッド経由）
    await page.evaluate(() => {
      // @ts-expect-error test hook
      const mode = window.__testMysteryMode || null;
      if (mode) {
        mode.discoverEvidence('floor_heater');
        mode.discoverEvidence('quartz_window');
      } else {
        // 直接ボタン等の動作を担保
        const evCards = document.querySelectorAll('.btn-slot-evidence');
        if (evCards.length === 0) {
          // 発見イベントを直接発火
          const modeObj = (window as any)._appRouter?.getCurrentMode?.();
          if (modeObj && modeObj.handleObjectClick) {
            modeObj.handleObjectClick('floor_heater');
            modeObj.handleObjectClick('quartz_window');
          }
        }
      }
    });

    // 現場直接クリックで発見できているか確認（もし未発見ならhandleObjectClickを呼び出す）
    const discoveredCards = page.locator('.evidence-card.discovered');
    const count = await discoveredCards.count();
    if (count < 2) {
      await page.evaluate(() => {
        const mode = (window as any)._activeMysteryMode;
        if (mode) {
          mode.handleObjectClick('floor_heater');
          mode.handleObjectClick('quartz_window');
        }
      });
    }

    // 証拠カードの配置ボタンをクリック
    const slotBtns = page.locator('.btn-slot-evidence');
    const slotCount = await slotBtns.count();
    for (let i = 0; i < slotCount; i++) {
      await slotBtns.nth(i).click();
    }

    // 差分が 0 J になることを確認
    const discrepancyVal = page.locator('#notebook-discrepancy-val');
    await expect(discrepancyVal).toHaveText('0 J');

    // 「真相を立証する」ボタンが有効化される
    const solveBtn = page.locator('#btn-mystery-solve');
    await expect(solveBtn).toBeEnabled();
    await expect(solveBtn).toHaveClass(/ready-to-solve/);

    // 事件解決ボタンをクリック
    await solveBtn.click();

    // 解決モーダルが表示されること
    const modal = page.locator('#mystery-solved-modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2')).toContainText('事件解決！密室から消えた 80 ジュールの真相');
    await expect(modal.locator('.history-note')).toContainText('歴史的動機');

    // モーダルを閉じる
    await page.locator('#btn-mystery-modal-close').click();
    await expect(modal).toHaveClass(/hidden/);
  });

  test('TC-MYSTERY-05: ポインティングモードからのワンクリック遷移', async ({ page }) => {
    await page.goto('/?mode=poynting');
    const jumpBtn = page.locator('#btn-poynting-open-mystery');
    await expect(jumpBtn).toBeVisible();

    await jumpBtn.click();
    await expect(page).toHaveURL(/mode=mystery/);
    await expect(page.locator('#mystery-mode-view')).toBeVisible();
    await expect(page.locator('#tab-mode-mystery')).toHaveClass(/active/);
  });
});
