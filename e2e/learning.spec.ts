import { test, expect } from '@playwright/test';

test.describe('探究学習モード＆演習課題・解説システム E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !!window.__SIM_STATE__);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const match = testInfo.title.match(/(TC-[A-Z0-9]+-\d+)/);
    const id = match ? match[1] : 'test';
    await page.screenshot({ path: `test-screenshots/${id}.png`, fullPage: true });
  });

  test('TC-LEARN-01: 探究学習モードの起動と終了が正しく動作すること', async ({ page }) => {
    const banner = page.locator('#learning-stepper-banner');
    const toggleBtn = page.locator('#btn-toggle-learning');
    const exitBtn = page.locator('#btn-exit-learning');

    // 初期状態は非表示
    await expect(banner).toHaveClass(/hidden/);

    // 学習モード起動
    await toggleBtn.click();
    await expect(banner).not.toHaveClass(/hidden/);
    await expect(toggleBtn).toHaveClass(/active/);
    await expect(page.locator('#step-badge')).toHaveText('Step 1: 直感の獲得');

    // 終了ボタンで非表示に戻る
    await exitBtn.click();
    await expect(banner).toHaveClass(/hidden/);
    await expect(toggleBtn).not.toHaveClass(/active/);
  });

  test('TC-LEARN-02: ステップバイステップ進行と自動環境セットアップが連動すること', async ({ page }) => {
    await page.click('#btn-toggle-learning');

    // Step 1: 作用・反作用（自動でq1=4, q2=1）
    await expect(page.locator('#step-badge')).toHaveText('Step 1: 直感の獲得');
    await expect(page.locator('#q1-val-display')).toHaveText('+4.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('+1.0 μC');
    await expect(page.locator('.quick-presets')).toHaveClass(/tutorial-highlight/);

    // 次へ -> Step 2: 逆二乗則
    await page.click('#btn-next-step');
    await expect(page.locator('#step-badge')).toHaveText('Step 2: 逆二乗則の核心');
    await expect(page.locator('.graph-card')).toHaveClass(/tutorial-highlight/);

    // 次へ -> Step 3: 3D電位曲面（自動でスプリット表示 & 電気力線ON）
    await page.click('#btn-next-step');
    await expect(page.locator('#step-badge')).toHaveText('Step 3: 空間イメージの獲得');
    await expect(page.locator('#canvas-wrapper')).toHaveClass(/view-split/);

    // 次へ -> Step 4: 手計算課題
    await page.click('#btn-next-step');
    await expect(page.locator('#step-badge')).toHaveText('Step 4: 自力計算のマスター');
    await expect(page.locator('#btn-next-step')).toHaveText('🎉 学習完了！');

    // 前へボタンで戻れること
    await page.click('#btn-prev-step');
    await expect(page.locator('#step-badge')).toHaveText('Step 3: 空間イメージの獲得');
  });

  test('TC-LEARN-03: ステップドット直接クリックによるナビゲーション', async ({ page }) => {
    await page.click('#btn-toggle-learning');

    // 直接Step 4をクリック
    const step4Dot = page.locator('.step-dot[data-step="3"]');
    await step4Dot.click();
    await expect(page.locator('#step-badge')).toHaveText('Step 4: 自力計算のマスター');
    await expect(step4Dot).toHaveClass(/active/);

    // 直接Step 1をクリック
    const step1Dot = page.locator('.step-dot[data-step="0"]');
    await step1Dot.click();
    await expect(page.locator('#step-badge')).toHaveText('Step 1: 直感の獲得');
    await expect(step1Dot).toHaveClass(/active/);
  });

  test('TC-CHALLENGE-01: 演習課題の切り替えとKaTeX数式の表示', async ({ page }) => {
    const desc = page.locator('#challenge-desc');

    // 初期は課題1 (入門)
    await expect(page.locator('#challenge-diff')).toHaveText('入門');
    await expect(page.locator('#challenge-title')).toContainText('課題 1');
    await expect(desc).toContainText('+2.0');
    await expect(desc).toContainText('-3.0');
    // KaTeX数式要素がレンダリングされていること
    await expect(desc.locator('.katex').first()).toBeVisible();

    // 課題2に切り替え
    await page.click('.btn-challenge-tab[data-id="challenge-2"]');
    await expect(page.locator('#challenge-diff')).toHaveText('基本');
    await expect(page.locator('#challenge-title')).toContainText('課題 2');
    await expect(desc).toContainText('+4.0');

    // 課題4に切り替え
    await page.click('.btn-challenge-tab[data-id="challenge-4"]');
    await expect(page.locator('#challenge-diff')).toHaveText('発展');
    await expect(page.locator('#challenge-title')).toContainText('課題 4');
  });

  test('TC-CHALLENGE-02: 解答入力と自動採点（誤答・正解フィードバック）', async ({ page }) => {
    // 課題1を選択
    await page.click('.btn-challenge-tab[data-id="challenge-1"]');

    const inputForce = page.locator('#input-challenge-force');
    const submitBtn = page.locator('#btn-submit-answer');
    const feedback = page.locator('#challenge-feedback');

    // 1. 間違った値を入力して判定
    await inputForce.fill('0.999');
    await submitBtn.click();
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/error/);
    await expect(feedback).toContainText('力の大きさの計算が違います');

    // 2. 正解の値を入力して判定 (0.054 N, 引力)
    await inputForce.fill('0.054');
    await page.check('input[name="challenge-dir"][value="attract"]');
    await submitBtn.click();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('🎉 正解です！');
  });

  test('TC-CHALLENGE-03: 「シミュレーターで再現」で装置と同期されること', async ({ page }) => {
    // 課題1 (+2.0 μC, -3.0 μC, r = 1.00 m)
    await page.click('.btn-challenge-tab[data-id="challenge-1"]');
    await page.click('#btn-sync-to-stage');

    // HUDとスライダーが同期されたことを検証
    await expect(page.locator('#q1-val-display')).toHaveText('+2.0 μC');
    await expect(page.locator('#q2-val-display')).toHaveText('-3.0 μC');
    await expect(page.locator('#hud-dist-val')).toHaveText('1.00 m');
    await expect(page.locator('#hud-force-type')).toHaveText('引力（引き合う）');
    await expect(page.locator('#hud-force-val')).toContainText('0.054 N');
  });

  test('TC-CHALLENGE-04: 手計算解説アコーディオンの開閉と数式ステップの展開', async ({ page }) => {
    await page.click('.btn-challenge-tab[data-id="challenge-1"]');
    const solutionDrawer = page.locator('#challenge-solution-drawer');
    const toggleBtn = page.locator('#btn-toggle-solution');

    // 初期状態は非表示
    await expect(solutionDrawer).toHaveClass(/hidden/);

    // 解説を見るボタンをクリック
    await toggleBtn.click();
    await expect(solutionDrawer).not.toHaveClass(/hidden/);
    await expect(toggleBtn).toHaveText('✕ 解説を閉じる');

    // 複数のステップが表示され、KaTeX数式が含まれていること
    const steps = page.locator('.solution-step-item');
    await expect(steps).toHaveCount(5);
    await expect(steps.first()).toContainText('Step 1: 力の向き');
    await expect(solutionDrawer.locator('.katex').first()).toBeVisible();

    // もう一度押して閉じる
    await toggleBtn.click();
    await expect(solutionDrawer).toHaveClass(/hidden/);
  });

  test('TC-CHALLENGE-05: ランダム課題生成ボタンで新しい問題が作成されること', async ({ page }) => {
    await page.click('#btn-random-challenge');

    await expect(page.locator('#challenge-diff')).toHaveText('ランダム');
    await expect(page.locator('#challenge-title')).toContainText('ランダム生成課題');
    await expect(page.locator('#challenge-desc')).toBeVisible();

    // 「シミュレーターで再現」がランダム課題でも正しく動作すること
    await page.click('#btn-sync-to-stage');
    await expect(page.locator('#challenge-feedback')).toHaveClass(/success/);
    await expect(page.locator('#challenge-feedback')).toContainText('シミュレーターの電荷を');
  });
});
