import { AgentDeviceWeb } from '../../core/AgentDeviceWeb.ts';
import * as fs from 'fs';
import * as path from 'path';

export async function runCoulombAgentTest(): Promise<void> {
  console.log('⚡ [Coulomb Agent Test]: Starting autonomous Coulomb exploration...');
  const agent = new AgentDeviceWeb('coulomb');
  await agent.launch(true);

  const reports: string[] = [];
  const logStep = (title: string, detail: string) => {
    console.log(`  ▶ ${title}`);
    reports.push(`### ${title}\n${detail}\n`);
  };

  try {
    // 1. Initial State
    let snap = await agent.snapshot();
    logStep('1. Initial Load & Setup', agent.formatSnapshotPrompt(snap));
    await agent.screenshot('01_initial_state');

    // 2. Adjust Charges
    logStep('2. Repulsive Charges (+4μC, +4μC)', 'Setting both charges to +4 μC to observe repulsion peak.');
    await agent.setSlider('#q1-slider', 4.0);
    await agent.setSlider('#q2-slider', 4.0);
    await agent.screenshot('02_charges_repulsive_4uC');

    // 3. Switch to Split View & Wireframe
    logStep('3. 3D Split View & Wireframe', 'Switching to side-by-side 2D/3D mode.');
    await agent.tap('#tab-view-split');
    await agent.tap('#btn-3d-wireframe');
    await agent.screenshot('03_split_view_wireframe');

    // 4. Toggle Field Grid & Field Lines
    logStep('4. Field Grid & Field Lines', 'Activating vector field overlay and force lines.');
    await agent.tap('#chk-efield');
    await agent.screenshot('04_field_grid_active');

    // 5. Test Particles
    logStep('5. Test Particle Injection', 'Injecting test particles to trace field force trajectories.');
    await agent.tap('#btn-spawn-test');
    await agent.tap('#btn-spawn-test');
    await agent.page?.waitForTimeout(300);
    await agent.screenshot('05_test_particles_active');

    // 6. Guided Learning Mode
    logStep('6. Learning Mode Navigation', 'Opening learning scenario and advancing step.');
    await agent.tap('#btn-toggle-learning');
    await agent.screenshot('06_learning_step1');
    await agent.tap('#btn-next-step');
    await agent.screenshot('07_learning_step2');
    await agent.tap('#btn-exit-learning');

    // 7. Challenge Mode Inspection
    logStep('7. Challenge & Solution Drawer', 'Switching challenge tab and opening step-by-step solution.');
    await agent.tap('.btn-challenge-tab[data-id="challenge-2"]');
    await agent.tap('#btn-toggle-solution');
    await agent.screenshot('08_challenge_solution_opened');

    // Write report
    const reportFile = path.join(agent.getReportsDir(), 'coulomb_report.md');
    fs.writeFileSync(reportFile, `# ⚡ Coulomb Mode AI Agent Report\n\n` + reports.join('\n---\n'));
    console.log(`✅ [Coulomb Agent Test] Finished. Report saved to ${reportFile}`);
  } finally {
    await agent.close();
  }
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('coulombAgent.test')) {
  runCoulombAgentTest().catch((err) => {
    console.error('Coulomb Agent Test Failed:', err);
    process.exit(1);
  });
}
