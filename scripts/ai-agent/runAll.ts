import { runCoulombAgentTest } from './tests/coulomb/coulombAgent.test.ts';
import { runPoyntingAgentTest } from './tests/poynting/poyntingAgent.test.ts';
import { runMysteryAgentTest } from './tests/mystery/mysteryAgent.test.ts';

async function main() {
  console.log('🤖 ===============================================');
  console.log('🤖 Running All Physics AI Agent Exploration Suites');
  console.log('🤖 ===============================================\n');

  const startTime = Date.now();

  try {
    await runCoulombAgentTest();
    console.log('');
    await runPoyntingAgentTest();
    console.log('');
    await runMysteryAgentTest();

    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n🎉 ===============================================');
    console.log(`🎉 All AI Agent Suites Completed Successfully in ${elapsedSec}s!`);
    console.log('📂 Reports saved in subdirectories:');
    console.log('   - agent-reports/coulomb/');
    console.log('   - agent-reports/poynting/');
    console.log('   - agent-reports/mystery/');
    console.log('🎉 ===============================================');
  } catch (error) {
    console.error('❌ AI Agent Suite Execution Error:', error);
    process.exit(1);
  }
}

main();
