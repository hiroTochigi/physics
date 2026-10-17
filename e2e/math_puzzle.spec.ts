import { test, expect } from '@playwright/test';

test.describe('Math Block Puzzle Mode (ノードベース数式パズル)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?mode=puzzle');
    await page.waitForSelector('#puzzle-mode-view.active');
  });

  test('タブ切り替えと初期UI要素が正しく表示される', async ({ page }) => {
    // ヘッダータイトル
    const title = page.locator('#header-title-text');
    await expect(title).toContainText('数式パズル');

    // スッキリ度メーター初期値 (15%)
    const cleanliness = page.locator('#cleanliness-text');
    await expect(cleanliness).toHaveText('15%');

    // 初期手札カード (積の微分公式)
    const cards = page.locator('.rule-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('積の微分公式');

    // 3Dプレビューキャンバス
    const canvas = page.locator('#puzzle-3d-canvas');
    await expect(canvas).toBeVisible();
  });

  test('カード適用とステップ進行（微分展開 -> マクスウェル則 -> 完成）', async ({ page }) => {
    // Step 1: 積の微分カードをクリックして選択し、スロットをクリックして適用
    const diffCard = page.locator('.rule-card[data-card-id="card-diff-rule"]');
    await diffCard.click();
    await expect(diffCard).toHaveClass(/card-selected/);

    const diffSlot = page.locator('.formula-slot[data-slot-id="slot-diff-energy"]');
    await diffSlot.click({ force: true });

    // Step 2へ自動遷移: 赤点滅アラートの確認
    await expect(page.locator('.slot-warning.pulse-danger')).toHaveCount(2);
    await expect(page.locator('#cleanliness-text')).toHaveText('30%');

    // 手札にアンペール則とファラデー則があることを確認
    const ampereCard = page.locator('.rule-card[data-card-id="card-ampere-maxwell"]');
    const faradayCard = page.locator('.rule-card[data-card-id="card-faraday"]');
    await expect(ampereCard).toBeVisible();
    await expect(faradayCard).toBeVisible();

    // アンペール則を適用
    await ampereCard.click();
    await page.locator('.formula-slot[data-slot-id="slot-dE-dt"]').click({ force: true });

    // ファラデー則を適用
    await faradayCard.click();
    await page.locator('.formula-slot[data-slot-id="slot-dB-dt"]').click({ force: true });

    // Step 3へ遷移: ジュール熱分離とベクトル公式合体
    await expect(page.locator('#cleanliness-text')).toHaveText('55%');
    const vectorCard = page.locator('.rule-card[data-card-id="card-vector-identity"]');
    await expect(vectorCard).toBeVisible();

    // ベクトル公式カードを適用
    await vectorCard.click();
    await page.locator('.formula-slot[data-slot-id="slot-vector-merge"]').click({ force: true });

    // Step 4へ遷移: ポインティングベクトルの定義
    await expect(page.locator('#cleanliness-text')).toHaveText('80%');
    const poyntingCard = page.locator('.rule-card[data-card-id="card-poynting-def"]');
    await expect(poyntingCard).toBeVisible();

    // ポインティング定義カードを適用
    await poyntingCard.click();
    await page.locator('.formula-slot[data-slot-id="slot-poynting-promote"]').click({ force: true });

    // Step 5: スッキリ度 100% と完成バナーの確認
    await expect(page.locator('#cleanliness-text')).toHaveText('100%');
    await expect(page.locator('.puzzle-completion-banner')).toBeVisible();
    await expect(page.locator('.puzzle-completion-banner')).toContainText('ポインティングの定理の導出完了！');
  });

  test('直感日本語（文系向け）モードのトグル切替と文系テキストの表示', async ({ page }) => {
    // 1. 直感日本語トグルをクリック
    const btnIntuitive = page.locator('#btn-toggle-intuitive');
    await btnIntuitive.click();
    await expect(btnIntuitive).toHaveClass(/active/);

    // 2. ステージタイトルが直感ブロックに変化すること
    await expect(page.locator('#puzzle-stage-title')).toHaveText('🧩 直感ブロック・ワークスペース');

    // 3. お小遣い帳（家計簿たとえ）バッジが表示されること
    await expect(page.locator('#puzzle-budget-analogy')).toBeVisible();
    await expect(page.locator('#puzzle-budget-analogy')).toContainText('お財布');

    // 4. 文系向け記号超訳チップが表示されること
    await expect(page.locator('.humanities-glossary')).toBeVisible();
    await expect(page.locator('.humanities-glossary')).toContainText('文系のための記号超訳');

    // 5. 厳密数式モードへ戻せること
    const btnFormal = page.locator('#btn-toggle-formal');
    await btnFormal.click();
    await expect(btnFormal).toHaveClass(/active/);
    await expect(page.locator('#puzzle-stage-title')).toHaveText('🧮 数式ブロック・ワークスペース');
  });

  test('テキスト選択およびコピーが可能であること', async ({ page }) => {
    // 1. body の user-select が none でないこと
    const bodyUserSelect = await page.evaluate(() => {
      return window.getComputedStyle(document.body).userSelect;
    });
    expect(bodyUserSelect).toBe('text');

    // 2. ステップ情報や説明文（ナラティブカード）のテキストが選択・コピー可能であること
    const narrativeCard = page.locator('#puzzle-narrative-card');
    await expect(narrativeCard).toBeVisible();

    const selectedStepText = await page.evaluate(() => {
      const el = document.querySelector('#puzzle-narrative-card');
      if (!el) return '';
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return sel?.toString() || '';
    });
    expect(selectedStepText.length).toBeGreaterThan(0);
    expect(selectedStepText).toContain('目標');

    // 3. 手札カード（.rule-card）内のテキストも選択可能であること
    const cardUserSelect = await page.evaluate(() => {
      const card = document.querySelector('.rule-card');
      return card ? window.getComputedStyle(card).userSelect : '';
    });
    expect(cardUserSelect).not.toBe('none');

    const selectedCardText = await page.evaluate(() => {
      const card = document.querySelector('.rule-card');
      if (!card) return '';
      const range = document.createRange();
      range.selectNodeContents(card);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return sel?.toString() || '';
    });
    expect(selectedCardText.length).toBeGreaterThan(0);
    expect(selectedCardText).toContain('積の微分公式');

    // 4. 家計簿バナーやお小遣い帳のテキストも選択可能であること
    const banner = page.locator('#puzzle-budget-analogy');
    await expect(banner).toBeVisible();

    const selectedBannerText = await page.evaluate(() => {
      const el = document.querySelector('#puzzle-budget-analogy');
      if (!el) return '';
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return sel?.toString() || '';
    });
    expect(selectedBannerText.length).toBeGreaterThan(0);
    expect(selectedBannerText).toContain('お財布');

    // 5. 厳密数式モードの数式表示エリアも選択可能であること
    await page.locator('#btn-toggle-formal').click();
    const formulaDisplay = page.locator('#puzzle-main-formula');
    await expect(formulaDisplay).toBeVisible();

    const selectedFormulaText = await page.evaluate(() => {
      const el = document.querySelector('#puzzle-main-formula');
      if (!el) return '';
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      return sel?.toString() || '';
    });
    expect(selectedFormulaText.length).toBeGreaterThan(0);
  });
});

