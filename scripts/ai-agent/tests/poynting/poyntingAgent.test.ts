import { AgentDeviceWeb } from '../../core/AgentDeviceWeb.ts';
import * as fs from 'fs';
import * as path from 'path';

export async function runPoyntingAgentTest(): Promise<void> {
  console.log('🌊 [Poynting Agent Test]: Starting autonomous Poynting exploration...');
  const agent = new AgentDeviceWeb('poynting');
  await agent.launch(true);

  const reports: string[] = [];
  const logStep = (title: string, detail: string) => {
    console.log(`  ▶ ${title}`);
    reports.push(`### ${title}\n${detail}\n`);
  };

  try {
    // 1. Switch to Poynting Mode
    await agent.tap('[data-mode="poynting"]');
    await agent.page?.waitForTimeout(400);

    let snap = await agent.snapshot();
    logStep('1. Poynting Simulator Initial State', agent.formatSnapshotPrompt(snap));
    await agent.screenshot('01_poynting_initial');

    // 2. View Toggle (Multi-view inspection)
    logStep('2. Energy Balance & 3D Field View', 'Inspecting 3D Poynting vectors and energy balance graph.');
    await agent.screenshot('02_poynting_energy_graph');

    // 3. Formula ⇄ Intuitive Japanese Toggle
    logStep('3. Formula / Intuitive Text Toggle', 'Testing math-to-intuitive wording switch.');
    const toggleExpr = await agent.page?.$('#btn-poynting-toggle-expr');
    if (toggleExpr) {
      await agent.tap('#btn-poynting-toggle-expr');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('03_poynting_intuitive_mode');
    }

    // 4. Poynting Learning Scenario
    logStep('4. Guided Learning Scenario', 'Navigating Poynting learning scenario steps.');
    const btnLearn = await agent.page?.$('#btn-poynting-toggle-learning');
    if (btnLearn) {
      await agent.tap('#btn-poynting-toggle-learning');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('04_poynting_learning_step1');
      await agent.tap('#btn-poynting-exit-learning');
    }

    // Write report
    const reportFile = path.join(agent.getReportsDir(), 'poynting_report.md');
    fs.writeFileSync(reportFile, `# 🌊 Poynting Theorem AI Agent Report\n\n` + reports.join('\n---\n'));
    console.log(`✅ [Poynting Agent Test] Finished. Report saved to ${reportFile}`);
  } finally {
    await agent.close();
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('poyntingAgent.test')) {
  runPoyntingAgentTest().catch((err) => {
    console.error('Poynting Agent Test Failed:', err);
    process.exit(1);
  });
}
