import { test, expect } from '@playwright/test';

test.describe('Phase 3: 3D 電位曲面 & ビューモード切替 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });


  test('TC-THREE-01: 初期状態で2Dビューがアクティブであること', async ({ page }) => {
    const tab2D = page.locator('#tab-view-2d');
    const tab3D = page.locator('#tab-view-3d');
    const tabSplit = page.locator('#tab-view-split');
    const canvasWrapper = page.locator('#canvas-wrapper');

    await expect(tab2D).toBeVisible();
    await expect(tab3D).toBeVisible();
    await expect(tabSplit).toBeVisible();

    await expect(tab2D).toHaveClass(/active/);
    await expect(tab3D).not.toHaveClass(/active/);
    await expect(tabSplit).not.toHaveClass(/active/);

    await expect(canvasWrapper).toHaveClass(/view-2d/);
    await expect(page.locator('#sim-canvas')).toBeVisible();
  });

  test('TC-THREE-02: 3D電位曲面タブをクリックすると3Dビューに切り替わること', async ({ page }) => {
    const tab3D = page.locator('#tab-view-3d');
    const canvasWrapper = page.locator('#canvas-wrapper');
    const canvas3D = page.locator('#potential-canvas-3d');

    await tab3D.click();

    await expect(tab3D).toHaveClass(/active/);
    await expect(canvasWrapper).toHaveClass(/view-3d/);
    await expect(canvas3D).toBeVisible();
    await expect(page.locator('#sim-canvas')).toBeHidden();

    // Verify 3D overlay controls are visible in 3D mode
    await expect(page.locator('#btn-3d-wireframe')).toBeVisible();
    await expect(page.locator('#btn-3d-autorotate')).toBeVisible();
    await expect(page.locator('#btn-3d-reset-cam')).toBeVisible();
  });

  test('TC-THREE-03: スプリット表示タブをクリックすると2Dと3Dが両方表示されること', async ({ page }) => {
    const tabSplit = page.locator('#tab-view-split');
    const canvasWrapper = page.locator('#canvas-wrapper');

    await tabSplit.click();

    await expect(tabSplit).toHaveClass(/active/);
    await expect(canvasWrapper).toHaveClass(/view-split/);

    // Both canvases should be visible in split mode
    await expect(page.locator('#sim-canvas')).toBeVisible();
    await expect(page.locator('#potential-canvas-3d')).toBeVisible();
  });

  test('TC-THREE-04: 3Dコントロール（ワイヤーフレーム・自動回転）が動作すること', async ({ page }) => {
    await page.locator('#tab-view-3d').click();

    const btnWireframe = page.locator('#btn-3d-wireframe');
    const btnAutoRotate = page.locator('#btn-3d-autorotate');

    // Toggle wireframe off
    await btnWireframe.click();
    await expect(btnWireframe).not.toHaveClass(/active/);
    let state = await page.evaluate(() => (window as any).__SIM_STATE__?.threeView?.showWireframe);
    expect(state).toBe(false);

    // Toggle wireframe back on
    await btnWireframe.click();
    await expect(btnWireframe).toHaveClass(/active/);
    state = await page.evaluate(() => (window as any).__SIM_STATE__?.threeView?.showWireframe);
    expect(state).toBe(true);

    // Toggle auto-rotate on
    await btnAutoRotate.click();
    await expect(btnAutoRotate).toHaveClass(/active/);
    let autoRotateState = await page.evaluate(() => (window as any).__SIM_STATE__?.threeView?.autoRotate);
    expect(autoRotateState).toBe(true);

    // Toggle auto-rotate back off to ensure clean teardown
    await btnAutoRotate.click();
    await expect(btnAutoRotate).not.toHaveClass(/active/);
  });


  test('TC-THREE-05: 電荷変更時に3D電位曲面データが追従更新されること', async ({ page }) => {
    // Switch to 3D mode
    await page.locator('#tab-view-3d').click();

    // Trigger preset repel (+2, +2)
    await page.locator('#preset-repel').click();

    const bothPositivePeaks = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      const engine = sim.engine;
      const particles = sim.particles;
      const p1Height = engine.calculatePotentialHeight(particles[0].x, particles[0].y, particles);
      const p2Height = engine.calculatePotentialHeight(particles[1].x, particles[1].y, particles);
      return { p1Height, p2Height };
    });

    // Both heights should be positive hills
    expect(bothPositivePeaks.p1Height).toBeGreaterThan(0);
    expect(bothPositivePeaks.p2Height).toBeGreaterThan(0);
  });
});
