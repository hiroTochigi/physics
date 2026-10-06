import { AgentDeviceWeb } from '../../core/AgentDeviceWeb.ts';
import * as fs from 'fs';
import * as path from 'path';

export async function runMysteryAgentTest(): Promise<void> {
  console.log('🕵️ [Mystery Agent Test]: Starting autonomous Mystery exploration...');
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
    logStep('1. Mystery Mode Crime Scene Initial State', agent.formatSnapshotPrompt(snap));
    await agent.screenshot('01_mystery_scene_initial');

    // 2. Dialogue Window Navigation
    logStep('2. Dialogue Window Interaction', 'Advancing conversation with the inspector/assistant.');
    const btnNextDialogue = await agent.page?.$('#btn-dialogue-next');
    if (btnNextDialogue) {
      await agent.tap('#btn-dialogue-next');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('02_dialogue_step2');
    }

    // 3. Investigation Tools Switch
    logStep('3. Crime Scene Tools', 'Switching investigation tool to Poynting Sensor.');
    const toolPoynting = await agent.page?.$('[data-tool="poynting-sensor"]');
    if (toolPoynting) {
      await agent.tap('[data-tool="poynting-sensor"]');
      await agent.page?.waitForTimeout(200);
      await agent.screenshot('03_tool_poynting_sensor');
    }

    // 4. Notebook Status Inspection
    logStep('4. Investigation Notebook & Energy Balance', 'Verifying missing energy status in the notebook.');
    await agent.screenshot('04_notebook_status');

    // Write report
    const reportFile = path.join(agent.getReportsDir(), 'mystery_report.md');
    fs.writeFileSync(reportFile, `# 🕵️ Mystery Investigation AI Agent Report\n\n` + reports.join('\n---\n'));
    console.log(`✅ [Mystery Agent Test] Finished. Report saved to ${reportFile}`);
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
