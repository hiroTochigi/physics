import { test, expect } from '@playwright/test';

test.describe('Multi-Mode Platform & Poynting Simulator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-MODE-01: モード切り替えタブでクーロンとポインティングを行き来できること', async ({ page }) => {
    // 1. 初期状態: クーロンモードがアクティブ
    const coulombTab = page.locator('#tab-mode-coulomb');
    const poyntingTab = page.locator('#tab-mode-poynting');
    const coulombView = page.locator('#coulomb-mode-view');
    const poyntingView = page.locator('#poynting-mode-view');

    await expect(coulombTab).toHaveClass(/active/);
    await expect(coulombView).toBeVisible();
    await expect(poyntingView).toHaveClass(/hidden/);
    await expect(page.locator('#header-title-text')).toHaveText('クーロンの法則 シミュレーター');

    // 2. ポインティングモードへ切り替え
    await poyntingTab.click();

    await expect(poyntingTab).toHaveClass(/active/);
    await expect(coulombTab).not.toHaveClass(/active/);
    await expect(poyntingView).toBeVisible();
    await expect(coulombView).toHaveClass(/hidden/);
    await expect(page).toHaveURL(/mode=poynting/);
    await expect(page.locator('#header-title-text')).toHaveText('ポインティングの定理 シミュレーター');

    // 3. 再度クーロンモードへ戻る
    await coulombTab.click();
    await expect(coulombTab).toHaveClass(/active/);
    await expect(coulombView).toBeVisible();
    await expect(poyntingView).toHaveClass(/hidden/);
    await expect(page).toHaveURL(/mode=coulomb/);
  });

  test('TC-MODE-02: ポインティングモードのマルチビュー切替とHUDリアルタイム表示', async ({ page }) => {
    await page.click('#tab-mode-poynting');

    // Canvas要素の存在確認
    const canvas3D = page.locator('#poynting-canvas-3d');
    const canvasGraph = page.locator('#poynting-graph-canvas');
    await expect(canvas3D).toBeVisible();
    await expect(canvasGraph).toBeVisible();

    // HUD数値が描画されていること
    const hudW = page.locator('#poynting-val-w');
    const hudFlux = page.locator('#poynting-val-flux');
    await expect(hudW).not.toHaveText('0.000 J');
    await expect(hudFlux).toBeVisible();

    // 2D中央断面ビューへ切替
    const tabSlice = page.locator('#poynting-tab-slice');
    await tabSlice.click();
    await expect(tabSlice).toHaveClass(/active/);
    await expect(page.locator('#poynting-canvas-wrapper')).toHaveClass(/view-slice/);

    // スプリットビューへ切替
    const tabSplit = page.locator('#poynting-tab-split');
    await tabSplit.click();
    await expect(tabSplit).toHaveClass(/active/);
    await expect(page.locator('#poynting-canvas-wrapper')).toHaveClass(/view-split/);
  });

  test('TC-MODE-03: 「数式 ⇄ 直感日本語」トグルスイッチが動作すること', async ({ page }) => {
    await page.click('#tab-mode-poynting');

    const toggleBtn = page.locator('#btn-poynting-toggle-math');
    await expect(toggleBtn).toHaveText(/直感日本語モード/);
    await expect(page.locator('.katex-formula-interactive')).toBeVisible();

    // 日本語モードへ切り替え
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText(/数式モード/);
    await expect(page.locator('.intuitive-japanese-box')).toBeVisible();
    await expect(page.locator('#katex-part-dwdt')).toContainText('dW/dt');

    // 再度数式モードへ戻す
    await toggleBtn.click();
    await expect(page.locator('.katex-formula-interactive')).toBeVisible();
  });

  test('TC-MODE-04: 探究学習モード＆演習課題・自動採点が機能すること', async ({ page }) => {
    await page.click('#tab-mode-poynting');

    // 1. 探究学習モード起動
    const btnLearn = page.locator('#btn-poynting-toggle-learning');
    await btnLearn.click();

    const banner = page.locator('#poynting-learning-banner');
    await expect(banner).toBeVisible();
    await expect(page.locator('#poynting-step-badge')).toHaveText('Step 1: 空間のエネルギー');

    // ステップ進行
    await page.click('#btn-poynting-next-step');
    await expect(page.locator('#poynting-step-badge')).toHaveText('Step 2: 時間微分');

    // 終了
    await page.click('#btn-poynting-exit-learning');
    await expect(banner).toHaveClass(/hidden/);

    // 2. 課題1（向き判定）の自動採点
    const inwardRadio = page.locator('input[name="poynting-dir-answer"][value="inward"]');
    await inwardRadio.check();
    await page.click('#btn-poynting-submit-answer');

    const feedback = page.locator('#poynting-challenge-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('正解です');

    // 3. 手計算解説ドロワーのトグル
    const solDrawer = page.locator('#poynting-solution-drawer');
    await expect(solDrawer).toHaveClass(/hidden/);
    await page.click('#btn-poynting-toggle-solution');
    await expect(solDrawer).toBeVisible();
  });

  test('TC-MODE-05: URLクエリパラメータによるディープリンク（?mode=poynting）', async ({ page }) => {
    await page.goto('/?mode=poynting');

    await expect(page.locator('#tab-mode-poynting')).toHaveClass(/active/);
    await expect(page.locator('#poynting-mode-view')).toBeVisible();
    await expect(page.locator('#coulomb-mode-view')).toHaveClass(/hidden/);
    await expect(page.locator('#header-title-text')).toHaveText('ポインティングの定理 シミュレーター');
  });
});
