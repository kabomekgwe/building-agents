/**
 * Multi-Agent System Runtime
 * Main entry point for the local implementation
 */

import { AgentRouter } from './runtime/router.js';
import { AgentExecutor } from './runtime/executor.js';
import { ContextManager } from './runtime/context.js';
import 'dotenv/config';

export { AgentRouter, AgentExecutor, ContextManager };

/**
 * Demo function - Shows basic usage
 */
async function demo() {
  console.log('🤖 Multi-Agent System - Local Runtime Demo\n');

  // Initialize router
  const router = new AgentRouter();
  console.log('Loading agents...');
  await router.loadAgents();

  const stats = router.getStats();
  console.log(`✓ Loaded ${stats.totalAgents} agents across ${stats.domains} domains\n`);

  // Test routing
  const testRequests = [
    'Build a React button component with primary and secondary variants',
    'Design a mobile app dashboard',
    'Create a TikTok marketing strategy',
    'Optimize database query performance'
  ];

  console.log('Testing routing:\n');

  for (const request of testRequests) {
    const result = await router.route(request);
    console.log(`Request: "${request}"`);
    console.log(`  → ${result.domain} / ${result.agent} (${result.confidence}% confidence)\n`);
  }

  console.log('Demo complete! Use the CLI for interactive usage:');
  console.log('  npm run cli -- route "your request here"');
  console.log('  npm run cli -- list');
  console.log('  npm run cli -- stats');
}

// Run demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demo().catch(console.error);
}
