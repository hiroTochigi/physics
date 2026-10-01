import { test, expect } from '@playwright/test';

test.describe('Phase 2: 場の可視化 & テスト電荷 E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TC-FIELD-01: 電気力線と電場ベクトルの表示トグルが機能すること', async ({ page }) => {
    const chkFieldLines = page.locator('#chk-field-lines');
    const chkEField = page.locator('#chk-efield');

    // Default state: field lines enabled, efield grid disabled
    await expect(chkFieldLines).toBeChecked();
    await expect(chkEField).not.toBeChecked();

    const initialState = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return {
        showFieldLines: sim?.canvasView?.showFieldLines,
        showEFieldGrid: sim?.canvasView?.showEFieldGrid,
      };
    });
    expect(initialState.showFieldLines).toBe(true);
    expect(initialState.showEFieldGrid).toBe(false);

    // Toggle EField on by clicking label
    await page.locator('label:has(#chk-efield)').click();
    await expect(chkEField).toBeChecked();
    const efieldOnState = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.showEFieldGrid;
    });
    expect(efieldOnState).toBe(true);

    // Toggle FieldLines off by clicking label
    await page.locator('label:has(#chk-field-lines)').click();
    await expect(chkFieldLines).not.toBeChecked();
    const fieldLinesOffState = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.showFieldLines;
    });
    expect(fieldLinesOffState).toBe(false);
  });

  test('TC-FIELD-02: テスト電荷の極性切り替えと放出・クリアが機能すること', async ({ page }) => {
    const btnPos = page.locator('#btn-test-pos');
    const btnNeg = page.locator('#btn-test-neg');
    const btnSpawn = page.locator('#btn-spawn-test');
    const btnClear = page.locator('#btn-clear-test');

    await expect(btnPos).toBeVisible();
    await expect(btnNeg).toBeVisible();
    await expect(btnSpawn).toBeVisible();
    await expect(btnClear).toBeVisible();

    // Default polarity is positive
    await expect(btnPos).toHaveClass(/active/);
    await expect(btnNeg).not.toHaveClass(/active/);

    // Switch to negative polarity
    await btnNeg.click();
    await expect(btnNeg).toHaveClass(/active/);
    await expect(btnPos).not.toHaveClass(/active/);

    const sign = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.testChargeSign;
    });
    expect(sign).toBe(-1);

    // Spawn test particle
    await btnSpawn.click();
    let particleCount = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.testParticles?.length;
    });
    expect(particleCount).toBeGreaterThan(0);

    // Clear test particles
    await btnClear.click();
    particleCount = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.testParticles?.length;
    });
    expect(particleCount).toBe(0);
  });

  test('TC-FIELD-03: キャンバス上でのShift+クリックでテスト電荷が配置されること', async ({ page }) => {
    const canvas = page.locator('#sim-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    // Click on empty space (e.g. at box.x + 100, box.y + 100) with Shift key
    await page.keyboard.down('Shift');
    await page.mouse.click(box.x + 100, box.y + 100);
    await page.keyboard.up('Shift');

    const particleCount = await page.evaluate(() => {
      const sim = (window as any).__SIM_STATE__;
      return sim?.canvasView?.testParticles?.length;
    });
    expect(particleCount).toBeGreaterThan(0);
  });
});
