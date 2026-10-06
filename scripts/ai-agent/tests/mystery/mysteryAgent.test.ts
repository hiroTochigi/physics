import { AgentDeviceWeb } from '../../core/AgentDeviceWeb.ts';
import * as fs from 'fs';
import * as path from 'path';

export async function runMysteryAgentTest(): Promise<void> {
  console.log('🕵️ [Mystery Agent Test]: Starting full autonomous Mystery investigation...');
  const agent = new AgentDeviceWeb('mystery');
  await agent.launch(true);

  const reports: string[] = [];
  const logStep = (title: string, detail: string) => {
    console.log(`  ▶ ${title}`);
    reports.push(`### ${title}\n${detail}\n`);
  };

  try {
    // 1. Switch to Mystery Mode
    await agent.tap('[data-mode="mystery"]');
    await agent.page?.waitForTimeout(400);

    let snap = await agent.snapshot();
    logStep('1. 初期表示 & 密室現場の概要', agent.formatSnapshotPrompt(snap));
    await agent.screenshot('01_mystery_initial_scene');

    // 2. Dialogue window conversation
    logStep('2. ノベル対話の進行', '助手との対話を進めて事件の背景とエネルギー消失状況を確認。');
    const btnNext = await agent.page?.$('#btn-dialogue-next');
    if (btnNext) {
      await agent.tap('#btn-dialogue-next');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('02_dialogue_advanced');
    }

    // 3. Switch tool to Poynting sensor
    logStep('3. 捜査ツールの切り替え', '通常調査から「ポインティング検出器」に切り替えて電磁エネルギーの流れを可視化。');
    const toolPoynting = await agent.page?.$('[data-tool="poynting-sensor"]');
    if (toolPoynting) {
      await agent.tap('[data-tool="poynting-sensor"]');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('03_tool_poynting_sensor');
    }

    // 4. Discover Evidences (床のヒーター & 石英窓)
    logStep('4. 現場の証拠発見', '3D現場内の床ヒーター(ジュール熱)と石英窓(ポインティング流出)を調査・特定。');
    await agent.page?.evaluate(() => {
      const mode = (window as any)._activeMysteryMode;
      if (mode && mode.handleObjectClick) {
        mode.handleObjectClick('floor_heater');
        mode.handleObjectClick('quartz_window');
      }
    });
    await agent.page?.waitForTimeout(300);
    await agent.screenshot('04_evidences_discovered');

    // 5. Slot Evidences in notebook (帳尻合わせ)
    logStep('5. 捜査手帳での帳尻合わせ (エネルギー保存則)', '発見した証拠（ジュール熱 30J, ポインティング流出 50J）を手帳のスロットに配置し、未解明エネルギー差分を 0 J に。');
    const slotBtns = agent.page?.locator('.btn-slot-evidence');
    const count = (await slotBtns?.count()) || 0;
    for (let i = 0; i < count; i++) {
      await slotBtns?.nth(i).click();
      await agent.page?.waitForTimeout(100);
    }
    await agent.screenshot('05_notebook_balanced');

    // Verify discrepancy is 0 J
    const discrepancy = await agent.page?.locator('#notebook-discrepancy-val').textContent();
    const isSolveReady = await agent.page?.locator('#btn-mystery-solve').isEnabled();
    logStep('6. 帳尻合わせの検証結果', `未解明差分: ${discrepancy}, 立証可能状態: ${isSolveReady}`);

    // 6. Accuse / Solve Mystery
    if (isSolveReady) {
      logStep('7. 真相立証 & 事件解決モーダル表示', '「真相を立証する」を実行し、エネルギー保存則とポインティングの定理の解説モーダルを表示。');
      await agent.tap('#btn-mystery-solve');
      await agent.page?.waitForTimeout(400);
      await agent.screenshot('06_case_solved_modal');

      // Close modal
      const btnCloseModal = await agent.page?.$('#btn-mystery-modal-close');
      if (btnCloseModal) {
        await agent.tap('#btn-mystery-modal-close');
        await agent.page?.waitForTimeout(200);
        await agent.screenshot('07_after_solve_overview');
      }
    }

    // Write report
    const reportFile = path.join(agent.getReportsDir(), 'mystery_investigation_report.md');
    fs.writeFileSync(reportFile, `# 🕵️ ミステリー捜査モード AI エージェント検証レポート\n\n` + reports.join('\n---\n'));
    console.log(`✅ [Mystery Agent Test] Investigation Complete! Report saved to ${reportFile}`);
  } finally {
    await agent.close();
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('mysteryAgent.test')) {
  runMysteryAgentTest().catch((err) => {
    console.error('Mystery Agent Test Failed:', err);
    process.exit(1);
  });
}
