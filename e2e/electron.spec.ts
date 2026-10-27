import { test, expect } from '@playwright/test';

test.describe('Electron Classical Radius & Self-Energy Mode Exhaustive Tests', () => {
  test('should load home page, switch to electron tab, and perform all interactions without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    // 1. Start from base root URL (defaults to coulomb)
    await page.goto('/');

    const coulombTab = page.locator('#tab-mode-coulomb');
    await expect(coulombTab).toHaveClass(/active/);

    // 2. Click the Electron Mode tab
    const electronTab = page.locator('#tab-mode-electron');
    await expect(electronTab).toBeVisible();
    await electronTab.click();

    // 3. Verify URL and active state
    await expect(page).toHaveURL(/mode=electron/);
    await expect(electronTab).toHaveClass(/active/);
    await expect(page.locator('#electron-mode-view')).toHaveClass(/active/);
    await expect(page.locator('#header-title-text')).toContainText('電子の古典半径');

    // 4. Verify canvas and HUD elements
    const canvas = page.locator('#electron-canvas');
    await expect(canvas).toBeVisible();

    const slider = page.locator('#slider-radius');
    await expect(slider).toBeVisible();

    // 5. Test each preset button
    const presets = ['bohr', 'compton', 'classical_4pi', 'classical_8pi', 'experiment_limit', 'singularity'];
    for (const presetId of presets) {
      const btn = page.locator(`button.btn-preset[data-preset-id="${presetId}"]`);
      await btn.click();
      await page.waitForTimeout(100);

      if (presetId === 'singularity') {
        await expect(page.locator('#hud-singularity-warning')).toBeVisible();
        await expect(page.locator('#val-calc-energy')).toContainText('∞');
      } else if (presetId.startsWith('classical')) {
        await expect(page.locator('#hud-singularity-warning')).not.toBeVisible();
        await expect(page.locator('#tag-balance-status')).toContainText('均衡');
      }
    }

    // 6. Click recovery button from singularity
    await page.locator('#btn-recover-classical').click();
    await expect(page.locator('#hud-singularity-warning')).not.toBeVisible();
    await expect(page.locator('#tag-balance-status')).toContainText('均衡');

    // 7. Test Mission tabs
    const m1 = page.locator('button.mission-tab[data-mission="mission1_field"]');
    await m1.click();
    await expect(page.locator('#story-title')).toContainText('Step 1');

    const m2 = page.locator('button.mission-tab[data-mission="mission2_balance"]');
    await m2.click();
    await expect(page.locator('#story-title')).toContainText('Step 2');

    const m3 = page.locator('button.mission-tab[data-mission="mission3_divergence"]');
    await m3.click();
    await expect(page.locator('#story-title')).toContainText('Step 3');
    await expect(page.locator('#hud-singularity-warning')).toBeVisible();

    // 8. Test View mode toggles
    await page.locator('#btn-recover-classical').click();

    await page.locator('#btn-toggle-math').click();
    await expect(page.locator('#badge-view-mode')).toContainText('厳密な大学数式');

    await page.locator('#btn-toggle-intuitive').click();
    await expect(page.locator('#badge-view-mode')).toContainText('直感吹き出し付き');

    // 9. Test Blog Modal Reader, Safety Net Callout, and Quiz
    const btnOpenBlog = page.locator('#btn-open-blog-modal');
    await expect(btnOpenBlog).toBeVisible();
    await btnOpenBlog.click();

    const blogModal = page.locator('#electron-blog-modal');
    await expect(blogModal).toBeVisible();
    await expect(blogModal).toContainText('電子の体重は無限大!?');
    await expect(blogModal).toContainText('ハルキ（高校生）');

    // Verify Safety Net Callout exists in Chapter 3
    const safetyNet = blogModal.locator('.callout-safetynet');
    await expect(safetyNet).toBeVisible();
    await expect(safetyNet).toContainText('読み飛ばしOK');

    // Test 3-Question Quiz in Blog Modal
    const q1Correct = blogModal.locator('.quiz-card[data-quiz-id="q1"] button[data-correct="true"]');
    const q2Correct = blogModal.locator('.quiz-card[data-quiz-id="q2"] button[data-correct="true"]');
    const q3Correct = blogModal.locator('.quiz-card[data-quiz-id="q3"] button[data-correct="true"]');

    await q1Correct.click();
    await expect(q1Correct).toHaveClass(/correct/);

    await q2Correct.click();
    await expect(q2Correct).toHaveClass(/correct/);

    await q3Correct.click();
    await expect(q3Correct).toHaveClass(/correct/);

    // Verify Master Badge is unlocked
    const badgeContainer = blogModal.locator('#quiz-badge-container');
    await expect(badgeContainer).toBeVisible();
    await expect(badgeContainer).toContainText('マスターバッジ獲得');

    // Take screenshot of the Blog Modal with Quiz cleared
    await page.screenshot({ path: 'test-screenshots/electron-blog-modal-quiz.png' });

    // Test inline simulation trigger inside blog (e.g. balance button)
    const btnBlogBalance = blogModal.locator('button.btn-sim-action[data-action="balance"]');
    await btnBlogBalance.click();

    // Verify modal closed and simulator reached balanced state
    await expect(blogModal).not.toBeVisible();
    await expect(page.locator('#tag-balance-status')).toContainText('均衡');

    // 10. Test Sound Toggle Button
    const btnSound = page.locator('#btn-toggle-sound');
    await expect(btnSound).toContainText('🔊 SE');
    await btnSound.click();
    await expect(btnSound).toContainText('🔇 SE');
    await btnSound.click();
    await expect(btnSound).toContainText('🔊 SE');

    // 11. Test Everyday Scale Comparison Card
    const btnScaleCard = page.locator('#btn-toggle-scale-card');
    const boxScaleCard = page.locator('#box-scale-card');
    await expect(boxScaleCard).toHaveClass(/hidden/);
    await btnScaleCard.click();
    await expect(boxScaleCard).not.toHaveClass(/hidden/);
    await expect(boxScaleCard).toContainText('東京ドーム');
    await btnScaleCard.click();
    await expect(boxScaleCard).toHaveClass(/hidden/);

    // 12. Test Game Mode (Blind Balance Challenge)
    const btnGameMode = page.locator('#btn-toggle-game-mode');
    const gameBanner = page.locator('#game-challenge-banner');
    await btnGameMode.click();
    await expect(gameBanner).toBeVisible();
    await expect(btnGameMode).toHaveClass(/btn-accent/);

    // Switch to non-balanced preset (Bohr) to test masked values
    await page.locator('button.btn-preset[data-preset-id="bohr"]').click();
    await expect(page.locator('#val-calc-energy')).toContainText('???');
    await expect(page.locator('#lbl-current-radius')).toContainText('???');

    // Solve the balance challenge by selecting classical_4pi
    await page.locator('button.btn-preset[data-preset-id="classical_4pi"]').click();
    await expect(gameBanner).toHaveClass(/cleared/);
    await expect(gameBanner).toContainText('ピタ止め成功');
    await expect(page.locator('#val-calc-energy')).toContainText('0.511 MeV');

    // Exit Game Mode
    await btnGameMode.click();
    await expect(gameBanner).toHaveClass(/hidden/);

    // 13. Test unmount and remount (switch to coulomb and back)
    await page.locator('#tab-mode-coulomb').click();
    await expect(page.locator('#coulomb-mode-view')).toHaveClass(/active/);
    await expect(page.locator('#electron-mode-view')).toHaveClass(/hidden/);

    await page.locator('#tab-mode-electron').click();
    await expect(page.locator('#electron-mode-view')).toHaveClass(/active/);
    await expect(canvas).toBeVisible();

    // 14. Check that NO console errors or page exceptions occurred!
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({ path: 'test-screenshots/electron-full-journey.png' });
  });
});
