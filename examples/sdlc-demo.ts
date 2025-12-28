#!/usr/bin/env node
/**
 * SDLC System Demo
 * Complete walkthrough of a feature development using SDLC orchestration
 */

import { SDLCOrchestrator } from '../src/sdlc/orchestrator.js';
import { SDLCPhase } from '../src/sdlc/types.js';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(message: string) {
  console.log('\n' + '='.repeat(60));
  log(message, colors.bright + colors.cyan);
  console.log('='.repeat(60) + '\n');
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warn(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  header('🚀 SDLC Multi-Agent System Demo');

  log('This demo simulates a complete SDLC project lifecycle:');
  log('- E-Commerce Checkout Feature');
  log('- 6 SDLC phases with quality gates');
  log('- Agent assignments and deliverables');
  log('- Phase transitions with validation\n');

  await sleep(2000);

  const orchestrator = new SDLCOrchestrator();

  // ========================================
  // PHASE 1: REQUIREMENTS
  // ========================================
  header('Phase 1: Requirements & Planning');

  info('Creating new SDLC project...');
  const project = await orchestrator.startProject({
    name: 'E-Commerce Checkout Feature',
    description: 'One-click checkout with Stripe payment integration'
  });

  success(`Project created: ${project.id}`);
  success(`Current phase: ${project.currentPhase}`);
  success(`Deliverables initialized: ${project.deliverables.length}`);

  await sleep(1000);

  // Assign deliverables to agents
  info('\nAssigning deliverables to agents...');

  const prdDeliverable = project.deliverables.find(d => d.name === 'Product Requirements Document (PRD)');
  if (prdDeliverable) {
    await orchestrator.assignDeliverable(prdDeliverable.id, 'sprint-prioritizer');
    success('PRD assigned to sprint-prioritizer');
  }

  const userStoriesDeliverable = project.deliverables.find(d => d.name === 'User Stories');
  if (userStoriesDeliverable) {
    await orchestrator.assignDeliverable(userStoriesDeliverable.id, 'feedback-synthesizer');
    success('User Stories assigned to feedback-synthesizer');
  }

  await sleep(1000);

  // Simulate agent completing work
  info('\nSimulating agent work completion...');

  if (prdDeliverable) {
    await orchestrator.markDeliverableComplete(prdDeliverable.id, [
      {
        id: 'artifact-1',
        deliverableId: prdDeliverable.id,
        type: 'document',
        name: 'PRD.md',
        content: '# Product Requirements Document\n\n## Overview\nOne-click checkout...',
        createdAt: new Date(),
        createdBy: 'sprint-prioritizer'
      }
    ]);
    success('✓ PRD completed by sprint-prioritizer');
  }

  if (userStoriesDeliverable) {
    await orchestrator.markDeliverableComplete(userStoriesDeliverable.id, [
      {
        id: 'artifact-2',
        deliverableId: userStoriesDeliverable.id,
        type: 'document',
        name: 'user-stories.md',
        content: '# User Stories\n\nUS-001: Guest checkout\nUS-002: Saved payment methods...',
        createdAt: new Date(),
        createdBy: 'feedback-synthesizer'
      }
    ]);
    success('✓ User Stories completed by feedback-synthesizer');
  }

  // Complete remaining deliverables
  const metricsDeliverable = project.deliverables.find(d => d.name === 'Success Metrics');
  if (metricsDeliverable) {
    await orchestrator.markDeliverableComplete(metricsDeliverable.id);
    success('✓ Success Metrics completed');
  }

  await sleep(1000);

  // Check phase completion
  info('\nChecking phase completion...');
  let completion = await orchestrator.checkPhaseCompletion(project.id);

  log(`Phase: ${completion.phase}`);
  log(`Complete: ${completion.isComplete ? 'Yes' : 'No'}`);
  log(`Progress: ${completion.completionPercentage}%`);

  if (completion.blockers.length > 0) {
    warn('Blockers:');
    completion.blockers.forEach(b => log(`  - ${b}`));
  }

  await sleep(1000);

  // Run quality gates
  info('\nRunning quality gates...');
  let gateResults = await orchestrator.runQualityGates(project.id, SDLCPhase.REQUIREMENTS);

  log(`Total gates: ${gateResults.totalGates}`);
  log(`Passed: ${gateResults.passedGates}`);
  log(`Failed: ${gateResults.failedGates}`);
  log(`Overall: ${gateResults.overallPass ? 'PASS ✅' : 'FAIL ❌'}`);

  gateResults.results.forEach(gate => {
    const status = gate.status === 'passed' ? '✅' : gate.status === 'failed' ? '❌' : '⏳';
    log(`  ${status} ${gate.name}`);
  });

  await sleep(2000);

  // Approve manual quality gates
  info('\nApproving manual quality gates...');
  await orchestrator.approveManualGate(project.id, 'Requirements Completeness', 'product-manager');
  success('✓ Requirements Completeness approved');
  await orchestrator.approveManualGate(project.id, 'Stakeholder Approval', 'product-owner');
  success('✓ Stakeholder Approval granted');

  // Re-check gates after approval
  info('\nRe-checking quality gates...');
  gateResults = await orchestrator.runQualityGates(project.id, SDLCPhase.REQUIREMENTS);
  gateResults.results.forEach(gate => {
    const status = gate.status === 'passed' ? '✅' : gate.status === 'failed' ? '❌' : '⏳';
    log(`  ${status} ${gate.name}`);
  });

  if (gateResults.overallPass) {
    success('\n✓ All quality gates passed!');
  }

  await sleep(2000);

  // Transition to Design phase
  info('\nAttempting phase transition to Design...');

  const transition1 = await orchestrator.transitionPhase({
    projectId: project.id,
    fromPhase: SDLCPhase.REQUIREMENTS,
    toPhase: SDLCPhase.DESIGN,
    requestedBy: 'product-manager',
    reason: 'All requirements approved and prioritized'
  });

  if (transition1.success) {
    success(`✓ Transitioned to ${transition1.newPhase} phase`);
  } else {
    error(`✗ Transition failed: ${transition1.message}`);
    if (transition1.blockers) {
      transition1.blockers.forEach(b => error(`  - ${b}`));
    }
    return;
  }

  await sleep(2000);

  // ========================================
  // PHASE 2: DESIGN
  // ========================================
  header('Phase 2: System Design');

  const updatedProject = orchestrator.getProject(project.id);
  info(`Current phase: ${updatedProject.currentPhase}`);
  info(`New deliverables: ${updatedProject.deliverables.filter(d => d.phase === SDLCPhase.DESIGN).length}`);

  // List design deliverables
  log('\nDesign phase deliverables:');
  updatedProject.deliverables
    .filter(d => d.phase === SDLCPhase.DESIGN)
    .forEach(d => log(`  - ${d.name} ${d.required ? '(required)' : '(optional)'}`));

  await sleep(1000);

  // Assign design deliverables
  info('\nAssigning design work to agents...');

  const apiContractDeliverable = updatedProject.deliverables.find(
    d => d.phase === SDLCPhase.DESIGN && d.name === 'API Contracts'
  );
  if (apiContractDeliverable) {
    await orchestrator.assignDeliverable(apiContractDeliverable.id, 'backend-architect');
    success('API Contracts assigned to backend-architect');
  }

  const mockupsDeliverable = updatedProject.deliverables.find(
    d => d.phase === SDLCPhase.DESIGN && d.name === 'UI/UX Mockups'
  );
  if (mockupsDeliverable) {
    await orchestrator.assignDeliverable(mockupsDeliverable.id, 'ui-designer');
    success('UI/UX Mockups assigned to ui-designer');
  }

  await sleep(1000);

  // Complete design deliverables
  info('\nSimulating design completion...');

  const designDeliverables = updatedProject.deliverables.filter(d => d.phase === SDLCPhase.DESIGN && d.required);
  for (const deliverable of designDeliverables) {
    await orchestrator.markDeliverableComplete(deliverable.id, [
      {
        id: `artifact-${deliverable.id}`,
        deliverableId: deliverable.id,
        type: deliverable.name.includes('Mockups') ? 'design' : 'document',
        name: `${deliverable.name.toLowerCase().replace(/\s+/g, '-')}.md`,
        content: `# ${deliverable.name}\n\nCompleted by agent...`,
        createdAt: new Date(),
        createdBy: deliverable.assignedAgent || 'system'
      }
    ]);
    success(`✓ ${deliverable.name} completed`);
    await sleep(500);
  }

  await sleep(1000);

  // Check design phase completion
  completion = await orchestrator.checkPhaseCompletion(project.id);
  info(`\nDesign phase progress: ${completion.completionPercentage}%`);

  // Approve manual quality gates
  info('\nApproving design phase quality gates...');
  await orchestrator.approveManualGate(project.id, 'Architecture Review', 'tech-lead');
  success('✓ Architecture Review approved');
  await orchestrator.approveManualGate(project.id, 'Security Review', 'security-engineer');
  success('✓ Security Review passed');

  await sleep(1000);

  // Try to transition to Implementation
  info('\nAttempting transition to Implementation...');

  const transition2 = await orchestrator.transitionPhase({
    projectId: project.id,
    fromPhase: SDLCPhase.DESIGN,
    toPhase: SDLCPhase.IMPLEMENTATION,
    requestedBy: 'tech-lead',
    reason: 'Design approved, ready for development'
  });

  if (transition2.success) {
    success(`✓ Transitioned to ${transition2.newPhase} phase`);
  } else {
    error(`✗ Transition failed: ${transition2.message}`);
    return;
  }

  await sleep(2000);

  // ========================================
  // PHASE 3: IMPLEMENTATION
  // ========================================
  header('Phase 3: Implementation');

  const implProject = orchestrator.getProject(project.id);

  // Simulate setting metrics (from CI/CD integration)
  implProject.metrics.testCoverage = 87;
  implProject.metrics.codeQualityScore = 82;
  implProject.metrics.criticalBugs = 0;

  info('Simulating implementation progress...');
  log(`Test Coverage: ${implProject.metrics.testCoverage}% (target: 80%)`);
  log(`Code Quality: ${implProject.metrics.codeQualityScore}/100 (target: 70)`);
  log(`Critical Bugs: ${implProject.metrics.criticalBugs} (target: 0)`);

  await sleep(1000);

  // Complete implementation deliverables
  const implDeliverables = implProject.deliverables.filter(d => d.phase === SDLCPhase.IMPLEMENTATION && d.required);

  info('\nCompleting implementation deliverables...');
  for (const deliverable of implDeliverables) {
    await orchestrator.markDeliverableComplete(deliverable.id);
    success(`✓ ${deliverable.name} completed`);
    await sleep(300);
  }

  await sleep(1000);

  // Approve manual Code Review gate
  info('\nApproving code review...');
  await orchestrator.approveManualGate(project.id, 'Code Review', 'tech-lead');
  success('✓ Code Review approved by 2+ reviewers');

  await sleep(1000);

  // Run implementation quality gates
  info('\nRunning implementation quality gates...');
  gateResults = await orchestrator.runQualityGates(project.id, SDLCPhase.IMPLEMENTATION);

  gateResults.results.forEach(gate => {
    const status = gate.status === 'passed' ? '✅' : gate.status === 'failed' ? '❌' : '⏳';
    log(`  ${status} ${gate.name}`);

    if (gate.criteria && gate.criteria.length > 0) {
      gate.criteria.forEach(criteria => {
        if (criteria.actual !== undefined) {
          log(`     ${criteria.name}: ${criteria.actual} ${criteria.operator} ${criteria.threshold}`);
        }
      });
    }
  });

  if (gateResults.overallPass) {
    success('\n✓ All quality gates passed!');
  } else {
    error('\n✗ Some quality gates failed');
    return;
  }

  await sleep(2000);

  // ========================================
  // PROJECT SUMMARY
  // ========================================
  header('📊 Project Summary');

  const finalProject = orchestrator.getProject(project.id);
  const stats = orchestrator.getProjectStats(project.id);

  log('Project Status:');
  log(`  Name: ${finalProject.name}`);
  log(`  Current Phase: ${finalProject.currentPhase}`);
  log(`  Progress: ${stats.percentComplete}%`);
  log(`  Duration: ${stats.actualDuration} days`);
  log('');

  log('Deliverables:');
  log(`  Completed: ${stats.deliverablesComplete}/${stats.deliverablesTotal}`);
  log('');

  log('Quality Metrics:');
  log(`  Test Coverage: ${stats.testCoverage}%`);
  log(`  Code Quality: ${stats.codeQualityScore}/100`);
  log(`  Security Score: ${stats.securityScore}/100`);
  log(`  Critical Bugs: ${stats.criticalBugs}`);
  log('');

  log('Quality Gates:');
  log(`  Passed: ${stats.gatesPassed}/${stats.gatesTotal}`);
  log('');

  log('Audit Trail:');
  log(`  Total Events: ${finalProject.auditLog.length}`);
  finalProject.auditLog.slice(-5).forEach(event => {
    log(`  - [${event.timestamp.toLocaleTimeString()}] ${event.eventType} by ${event.actor}`);
  });

  await sleep(1000);

  header('✅ Demo Complete!');

  log('Key Takeaways:');
  log('  ✓ SDLC enforces sequential phases');
  log('  ✓ Quality gates prevent bad transitions');
  log('  ✓ Agents assigned to phase-compatible work');
  log('  ✓ Complete audit trail for compliance');
  log('  ✓ Real-time metrics track project health');
  log('');
  log('Next Steps:');
  log('  1. Integrate with existing agent router');
  log('  2. Connect quality gates to CI/CD');
  log('  3. Build web dashboard for visualization');
  log('  4. Run real project through SDLC');
}

// Run demo
demo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});
