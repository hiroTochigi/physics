import { test, expect } from '@playwright/test';

test.describe('Faraday Lines of Force & Flux Tubes Mode Exhaustive Tests', () => {
  test('should load home page, switch to faraday tab, and perform all interactions without console errors', async ({ page }) => {
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

    // 2. Click the Faraday Mode tab
    const faradayTab = page.locator('#tab-mode-faraday');
    await expect(faradayTab).toBeVisible();
    await faradayTab.click();

    // 3. Verify URL and active state
    await expect(page).toHaveURL(/mode=faraday/);
    await expect(faradayTab).toHaveClass(/active/);
    await expect(page.locator('#faraday-mode-view')).toHaveClass(/active/);
    await expect(page.locator('#header-title-text')).toContainText('ファラデー幾何学');

    // 4. Verify canvas and HUD elements
    const canvas = page.locator('#faraday-canvas');
    await expect(canvas).toBeVisible();

    // 5. Test Test Charge Launch Button
    const btnLaunch = page.locator('#btn-launch-ball');
    await expect(btnLaunch).toBeVisible();
    await btnLaunch.click();
    await page.waitForTimeout(100);

    // 6. Test all Presets
    const presets = ['single_positive', 'quadrupole', 'parallel_plates', 'dipole'];
    for (const presetId of presets) {
      const btn = page.locator(`button.btn-preset[data-preset-id="${presetId}"]`);
      await btn.click();
      await page.waitForTimeout(80);
      await expect(btn).toHaveClass(/active/);
    }

    // 7. Test Mission Steps
    const step1 = page.locator('button.mission-tab[data-mission="step1_potential_hill"]');
    const step2 = page.locator('button.mission-tab[data-mission="step2_flux_tube"]');
    const step3 = page.locator('button.mission-tab[data-mission="step3_orthogonal_sniper"]');

    await step2.click();
    await expect(step2).toHaveClass(/active/);
    await expect(page.locator('#faraday-story-title')).toContainText('Step 2');
    await expect(page.locator('#chk-flux-tube')).toBeChecked();

    // Test Flux Tube Slider
    const sliderTube = page.locator('#slider-tube-squeeze');
    await expect(sliderTube).toBeVisible();
    await sliderTube.fill('0.3');
    await sliderTube.dispatchEvent('input');
    await expect(page.locator('#val-tube-area')).toContainText('30');

    await step3.click();
    await expect(step3).toHaveClass(/active/);
    await expect(page.locator('#faraday-story-title')).toContainText('Step 3');

    // Hover mouse on canvas to test 90° Loupe Inspector and Telemetry
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5);
      await page.waitForTimeout(100);
      await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.5);
      await page.waitForTimeout(100);
    }

    await expect(page.locator('#val-cursor-angle')).toContainText('90.0°');
    await expect(page.locator('#val-cursor-work')).toContainText('仕事ゼロ');

    // 8. Test Sound toggle
    const btnSound = page.locator('#btn-toggle-faraday-sound');
    await expect(btnSound).toContainText('🔊 SE');
    await btnSound.click();
    await expect(btnSound).toContainText('🔇 SE');
    await btnSound.click();
    await expect(btnSound).toContainText('🔊 SE');

    // 9. Test View mode toggles
    const btnMath = page.locator('#btn-faraday-math');
    const btnIntuitive = page.locator('#btn-faraday-intuitive');

    await btnMath.click();
    await expect(btnMath).toHaveClass(/btn-accent/);
    await expect(page.locator('#badge-faraday-view-mode')).toContainText('大学の勾配');

    await btnIntuitive.click();
    await expect(btnIntuitive).toHaveClass(/btn-accent/);
    await expect(page.locator('#badge-faraday-view-mode')).toContainText('高校の内積');

    // 10. Test Faraday Blog Modal
    const btnOpenBlog = page.locator('#btn-open-faraday-blog');
    await expect(btnOpenBlog).toBeVisible();
    await btnOpenBlog.click();

    const blogModal = page.locator('#faraday-blog-modal');
    await expect(blogModal).toBeVisible();
    await expect(blogModal).toContainText('ファラデーが視た');
    await expect(blogModal).toContainText('鍛冶屋の息子');

    // Verify safety net callout
    const safetyNet = blogModal.locator('.callout-safetynet');
    await expect(safetyNet).toBeVisible();
    await expect(safetyNet).toContainText('読み飛ばしOK');

    // Complete the 3-question Quiz inside blog
    const q1Correct = blogModal.locator('.quiz-card[data-quiz-id="q1"] button[data-correct="true"]');
    const q2Correct = blogModal.locator('.quiz-card[data-quiz-id="q2"] button[data-correct="true"]');
    const q3Correct = blogModal.locator('.quiz-card[data-quiz-id="q3"] button[data-correct="true"]');

    await q1Correct.click();
    await expect(q1Correct).toHaveClass(/correct/);

    await q2Correct.click();
    await expect(q2Correct).toHaveClass(/correct/);

    await q3Correct.click();
    await expect(q3Correct).toHaveClass(/correct/);

    // Verify Quiz Badge Unlocked
    const quizBadge = blogModal.locator('#faraday-quiz-badge-container');
    await expect(quizBadge).toBeVisible();
    await expect(quizBadge).toContainText('ファラデー幾何学探偵バッジ獲得');

    // Take screenshot of blog modal with quiz passed
    await page.screenshot({ path: 'test-screenshots/faraday-blog-modal-quiz.png' });

    // Click interactive in-blog trigger button
    const btnSimTrigger = blogModal.locator('button.btn-sim-action[data-action="fluxtube"]');
    await btnSimTrigger.click();

    // Verify modal closed and mode switched to flux tube
    await expect(blogModal).not.toBeVisible();
    await expect(step2).toHaveClass(/active/);
    await expect(page.locator('#chk-flux-tube')).toBeChecked();

    // 11. Test tab switching back and forth
    await page.locator('#tab-mode-electron').click();
    await expect(page.locator('#electron-mode-view')).toHaveClass(/active/);
    await expect(page.locator('#faraday-mode-view')).toHaveClass(/hidden/);

    await page.locator('#tab-mode-faraday').click();
    await expect(page.locator('#faraday-mode-view')).toHaveClass(/active/);
    await expect(canvas).toBeVisible();

    // Take full screenshot of Faraday mode
    await page.screenshot({ path: 'test-screenshots/faraday-full-stage.png' });

    // 12. Verify zero console errors or uncaught page exceptions
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
