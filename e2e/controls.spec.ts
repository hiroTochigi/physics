import { test, expect } from '@playwright/test';

test.describe('クーロンシミュレーター コントロール・HUD連動テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to initialize
    await page.waitForFunction(() => !!window.__SIM_STATE__);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const match = testInfo.title.match(/(TC-[A-Z0-9]+-\d+)/);
    const id = match ? match[1] : 'test';
    await page.screenshot({ path: `test-screenshots/${id}.png`, fullPage: true });
  });

  test('TC-DOM-01: 初期表示でCanvasとHUDが正しく表示されること', async ({ page }) => {
    await expect(page.locator('#sim-canvas')).toBeVisible();
    await expect(page.locator('#graph-canvas')).toBeVisible();

    // 初期状態は引力 (+2.0 μC と -2.0 μC)
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');
    await expect(page.locator('#hud-force-val')).not.toHaveText('0.00 N');
    await expect(page.locator('#hud-dist-val')).not.toHaveText('0.00 m');

    await expect(page.locator('#q1-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('-2.0 μC');
  });

  test('TC-DOM-02: プリセットボタンで状態が正しく切り替わること', async ({ page }) => {
    // 同符号（斥力）
    await page.click('#preset-repel');
    await expect(page.locator('#hud-force-type')).toHaveText('斥力（反発する）');
    await expect(page.locator('#q1-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('+2.0 μC');

    // 電荷比（+4μC & +1μC）
    await page.click('#preset-ratio');
    await expect(page.locator('#hud-force-type')).toHaveText('斥力（反発する）');
    await expect(page.locator('#q1-val-display')).toHaveText('+4.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('+1.0 μC');

    // 異符号（引力）
    await page.click('#preset-attract');
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');
    await expect(page.locator('#q1-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('-2.0 μC');

    // 初期配置リセット
    await page.click('#preset-reset');
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');
    await expect(page.locator('#q1-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('-2.0 μC');
  });

  test('TC-DOM-03: 符号反転（±反転）ボタンで極性と引力/斥力が反転すること', async ({ page }) => {
    // 初期状態: q1=+2, q2=-2 (引力)
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');

    // q2 反転 -> q2=+2 (同符号なので斥力)
    await page.click('#q2-toggle-sign');
    await expect(page.locator('#q2-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#hud-force-type')).toHaveText('斥力（反発する）');

    // q1 反転 -> q1=-2 (異符号なので引力)
    await page.click('#q1-toggle-sign');
    await expect(page.locator('#q1-val-display')).toHaveText('-2.0 μC');
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');
  });

  test('TC-DOM-04: 電荷スライダー操作で値とHUDが連動すること', async ({ page }) => {
    const q1Slider = page.locator('#q1-slider');

    // スライダーの値を 5.0 に変更
    await q1Slider.fill('5');
    await expect(page.locator('#q1-val-display')).toHaveText('+5.0 μC');

    // 内部ステートの更新確認
    const q1 = await page.evaluate(() => window.__SIM_STATE__!.particles[0].q);
    expect(q1).toBe(5);
  });

  test('TC-DOM-05: クイック電荷ボタン（マイクロボタン）クリックで値が反映されること', async ({ page }) => {
    // q1 を -5 に設定
    await page.click('.btn-micro[data-target="q1"][data-val="-5"]');
    await expect(page.locator('#q1-val-display')).toHaveText('-5.0 μC');
    await expect(page.locator('.btn-micro[data-target="q1"][data-val="-5"]')).toHaveClass(/active/);

    // q2 を 0 に設定（中性状態テスト）
    await page.click('.btn-micro[data-target="q2"][data-val="0"]');
    await expect(page.locator('#q2-val-display')).toHaveText('0.0 μC');
    await expect(page.locator('#hud-force-val')).toHaveText('0.00 N');
    await expect(page.locator('#hud-force-type')).toHaveText('力なし (中性)');
  });

  test('TC-DOM-06: グリッドおよび力ベクトルの表示トグルが機能すること', async ({ page }) => {
    const chkGrid = page.locator('#chk-grid');
    const chkVectors = page.locator('#chk-vectors');

    // 初期状態はチェック済み
    await expect(chkGrid).toBeChecked();
    await expect(chkVectors).toBeChecked();

    // ラベルをクリックしてトグル
    await page.locator('label:has(#chk-grid)').click();
    await page.locator('label:has(#chk-vectors)').click();

    await expect(chkGrid).not.toBeChecked();
    await expect(chkVectors).not.toBeChecked();

    const viewState = await page.evaluate(() => ({
      showGrid: window.__SIM_STATE__!.canvasView.showGrid,
      showVectors: window.__SIM_STATE__!.canvasView.showVectors,
    }));

    expect(viewState.showGrid).toBe(false);
    expect(viewState.showVectors).toBe(false);
  });
});
