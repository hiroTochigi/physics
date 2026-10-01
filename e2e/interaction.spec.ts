import { test, expect, Page } from '@playwright/test';

/**
 * Helper to smoothly drag pointer with frame intervals
 * so canvas updates are clearly rendered and visible in video / headed mode
 */
async function dragSmoothly(
  page: Page,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  steps = 15
): Promise<void> {
  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    const curX = fromX + ((toX - fromX) * i) / steps;
    const curY = fromY + ((toY - fromY) * i) / steps;
    await page.mouse.move(curX, curY);
    await page.waitForTimeout(25); // 25ms per step ensures visible motion on canvas
  }
  await page.mouse.up();
  await page.waitForTimeout(100);
}

test.describe('Canvas 粒子ドラッグ操作・物理法則E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__SIM_STATE__);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const match = testInfo.title.match(/(TC-[A-Z0-9]+-\d+)/);
    const id = match ? match[1] : 'test';
    await page.screenshot({ path: `test-screenshots/${id}.png`, fullPage: true });
  });

  test('TC-CANVAS-01: 粒子を近づけると距離が縮まりクーロン力が急増すること（逆二乗則）', async ({ page }) => {
    const canvas = page.locator('#sim-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // 初期状態の粒子座標を取得
    const initialParticles = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return { p1: { x: p1.x, y: p1.y }, p2: { x: p2.x, y: p2.y } };
    });

    const initialForce = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return window.__SIM_STATE__!.engine.calculateForce(p1, p2).magnitude;
    });

    // p1 を p2 に近づけるようにスムーズにドラッグ（中点付近へ移動）
    const startX = box!.x + initialParticles.p1.x;
    const startY = box!.y + initialParticles.p1.y;
    const targetX = box!.x + (initialParticles.p1.x + initialParticles.p2.x) / 2 - 30;
    const targetY = box!.y + initialParticles.p1.y;

    await dragSmoothly(page, startX, startY, targetX, targetY, 20);

    // ドラッグ後のステートを取得
    const movedForce = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return window.__SIM_STATE__!.engine.calculateForce(p1, p2).magnitude;
    });

    // 距離が近づいたため、力は初期状態より著しく増加していること
    expect(movedForce).toBeGreaterThan(initialForce);
  });

  test('TC-CANVAS-02: 粒子を遠ざけるとクーロン力が減衰すること', async ({ page }) => {
    const canvas = page.locator('#sim-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    const initialParticles = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return { p1: { x: p1.x, y: p1.y }, p2: { x: p2.x, y: p2.y } };
    });

    const initialForce = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return window.__SIM_STATE__!.engine.calculateForce(p1, p2).magnitude;
    });

    // p1 をキャンバス左端方向へスムーズに遠ざける
    const startX = box!.x + initialParticles.p1.x;
    const startY = box!.y + initialParticles.p1.y;
    const targetX = box!.x + Math.max(50, initialParticles.p1.x - 100);
    const targetY = box!.y + initialParticles.p1.y;

    await dragSmoothly(page, startX, startY, targetX, targetY, 20);

    const movedForce = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return window.__SIM_STATE__!.engine.calculateForce(p1, p2).magnitude;
    });

    // 距離が離れたため、力は初期状態より減少していること
    expect(movedForce).toBeLessThan(initialForce);
  });

  test('TC-CANVAS-03: 作用・反作用の法則（両粒子にかかる力の大きさが等しく向きが逆）が満たされること', async ({ page }) => {
    const forceResult = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      const p2 = window.__SIM_STATE__!.particles[1];
      return window.__SIM_STATE__!.engine.calculateForce(p1, p2);
    });

    // p1 と p2 の力ベクトルの大きさが等しいこと (F1 = -F2)
    const f1Mag = Math.hypot(forceResult.forceOnP1.x, forceResult.forceOnP1.y);
    const f2Mag = Math.hypot(forceResult.forceOnP2.x, forceResult.forceOnP2.y);

    expect(f1Mag).toBeCloseTo(f2Mag, 4);

    // 向きが逆向き (和が 0 に近いこと)
    expect(forceResult.forceOnP1.x + forceResult.forceOnP2.x).toBeCloseTo(0, 4);
    expect(forceResult.forceOnP1.y + forceResult.forceOnP2.y).toBeCloseTo(0, 4);
  });

  test('TC-CANVAS-04: キャンバス境界外へのドラッグでも座標がCanvas内に収まること', async ({ page }) => {
    const canvas = page.locator('#sim-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    const p1Pos = await page.evaluate(() => {
      const p1 = window.__SIM_STATE__!.particles[0];
      return { x: p1.x, y: p1.y };
    });

    // キャンバスを大きく超えて左上画面外へドラッグ
    const startX = box!.x + p1Pos.x;
    const startY = box!.y + p1Pos.y;
    const targetX = box!.x - 100;
    const targetY = box!.y - 100;

    await dragSmoothly(page, startX, startY, targetX, targetY, 15);

    const finalP1 = await page.evaluate(() => {
      const p = window.__SIM_STATE__!.particles[0];
      return { x: p.x, y: p.y, radius: p.radius };
    });

    // パディングと半径を考慮した Canvas 境界内にクランプされていること
    expect(finalP1.x).toBeGreaterThanOrEqual(finalP1.radius);
    expect(finalP1.y).toBeGreaterThanOrEqual(finalP1.radius);
  });
});
