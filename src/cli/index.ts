#!/usr/bin/env node

/**
 * Multi-Agent System CLI
 * Interactive command-line interface for the multi-agent system
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { AgentRouter } from '../runtime/router.js';
import { AgentExecutor } from '../runtime/executor.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

const program = new Command();

program
  .name('agent')
  .description('Multi-Agent System CLI - Route and execute agent tasks')
  .version('2.0.0');

/**
 * Route command - Find the right agent for a task
 */
program
  .command('route <request>')
  .description('Route a request to the appropriate agent')
  .option('-v, --verbose', 'Show detailed routing information')
  .action(async (request: string, options: { verbose?: boolean }) => {
    const spinner = ora('Analyzing request...').start();

    try {
      const router = new AgentRouter();
      const result = await router.route(request);

      spinner.succeed('Routing complete');

      console.log('\n' + chalk.bold.cyan('📍 Routing Result'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.bold('Domain:')} ${chalk.green(result.domain)}`);
      console.log(`${chalk.bold('Agent:')} ${chalk.green(result.agent)}`);
      console.log(`${chalk.bold('Confidence:')} ${getConfidenceColor(result.confidence)(`${result.confidence}%`)}`);

      if (options.verbose) {
        console.log(`\n${chalk.bold('Keywords extracted:')} ${result.keywords.join(', ')}`);
        console.log(`${chalk.bold('Reasoning:')} ${result.reasoning}`);
      }

      console.log(chalk.gray('─'.repeat(50)));

      // Show agent info
      const agent = router.getAgent(result.agent);
      if (agent) {
        console.log(`\n${chalk.bold.yellow('ℹ️  Agent Info')}`);
        console.log(`Path: ${chalk.dim(agent.path)}`);
        console.log(`Keywords: ${chalk.dim(agent.keywords.slice(0, 5).join(', '))}...`);
      }
    } catch (error) {
      spinner.fail('Routing failed');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Execute command - Route and execute an agent task
 */
program
  .command('exec <request>')
  .description('Route and execute an agent task using Claude API')
  .option('-w, --workflow', 'Enable multi-agent workflow execution')
  .option('--api-key <key>', 'Claude API key (or set ANTHROPIC_API_KEY env var)')
  .action(async (request: string, options: { workflow?: boolean; apiKey?: string }) => {
    const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error(chalk.red('Error: Claude API key required'));
      console.log('Set ANTHROPIC_API_KEY environment variable or use --api-key option');
      process.exit(1);
    }

    const spinner = ora('Routing request...').start();

    try {
      // Route to agent
      const router = new AgentRouter();
      const routing = await router.route(request);

      spinner.text = `Executing ${routing.agent}...`;

      // Execute agent task
      const executor = new AgentExecutor(apiKey);

      if (options.workflow) {
        // Multi-agent workflow
        const results = await executor.executeWorkflow(request);

        spinner.succeed(`Workflow complete (${results.length} agents)`);

        // Display results
        console.log('\n' + chalk.bold.cyan('🔄 Workflow Results'));
        console.log(chalk.gray('─'.repeat(50)));

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          console.log(`\n${chalk.bold(`Step ${i + 1}:`)} ${chalk.green(result.agent)} (${result.domain})`);
          console.log(chalk.dim(result.response.substring(0, 200) + '...'));

          if (result.handoffNeeded) {
            console.log(chalk.yellow(`→ Handoff to ${result.handoffTo}`));
          }
        }
      } else {
        // Single agent execution
        const agent = router.getAgent(routing.agent);
        if (!agent) {
          throw new Error(`Agent ${routing.agent} not found`);
        }

        const result = await executor.execute({
          agent,
          userRequest: request
        });

        spinner.succeed('Execution complete');

        // Display result
        console.log('\n' + chalk.bold.cyan('✅ Execution Result'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(`${chalk.bold('Agent:')} ${chalk.green(result.agent)}`);
        console.log(`${chalk.bold('Domain:')} ${chalk.green(result.domain)}`);
        console.log(`\n${chalk.bold('Response:')}`);
        console.log(result.response);

        if (result.handoffNeeded) {
          console.log(`\n${chalk.yellow('⚠️  Handoff needed to:')} ${result.handoffTo}`);
          console.log('Run with --workflow flag to execute complete workflow');
        }
      }

      console.log(chalk.gray('─'.repeat(50)));
    } catch (error) {
      spinner.fail('Execution failed');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * List command - Show all available agents
 */
program
  .command('list')
  .description('List all available agents')
  .option('-d, --domain <domain>', 'Filter by domain')
  .action(async (options: { domain?: string }) => {
    const spinner = ora('Loading agents...').start();

    try {
      const router = new AgentRouter();
      await router.loadAgents();

      const stats = router.getStats();
      spinner.succeed(`Loaded ${stats.totalAgents} agents across ${stats.domains} domains`);

      console.log('\n' + chalk.bold.cyan('📋 Available Agents'));
      console.log(chalk.gray('─'.repeat(50)));

      if (options.domain) {
        // Show agents in specific domain
        const agents = router.getAgentsByDomain(options.domain);
        console.log(chalk.bold(`\n${options.domain} domain (${agents.length} agents):`));
        agents.forEach(agent => {
          console.log(`  • ${chalk.green(agent.name)} - ${chalk.dim(agent.keywords.slice(0, 3).join(', '))}`);
        });
      } else {
        // Show all domains
        for (const [domain, count] of Object.entries(stats.agentsPerDomain)) {
          console.log(chalk.bold(`\n${domain} (${count} agents):`));
          const agents = router.getAgentsByDomain(domain);
          agents.forEach(agent => {
            console.log(`  • ${chalk.green(agent.name)}`);
          });
        }
      }

      console.log(chalk.gray('\n' + '─'.repeat(50)));
    } catch (error) {
      spinner.fail('Failed to load agents');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Info command - Show detailed agent information
 */
program
  .command('info <agent>')
  .description('Show detailed information about an agent')
  .action(async (agentName: string) => {
    const spinner = ora(`Loading ${agentName}...`).start();

    try {
      const router = new AgentRouter();
      await router.loadAgents();

      const agent = router.getAgent(agentName);

      if (!agent) {
        spinner.fail(`Agent ${agentName} not found`);
        console.log('\nUse "agent list" to see all available agents');
        process.exit(1);
      }

      spinner.succeed(`Loaded ${agentName}`);

      console.log('\n' + chalk.bold.cyan(`📖 ${agent.name}`));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.bold('Domain:')} ${chalk.green(agent.domain)}`);
      console.log(`${chalk.bold('Path:')} ${chalk.dim(agent.path)}`);
      console.log(`${chalk.bold('Keywords:')} ${agent.keywords.join(', ')}`);

      // Show first few lines of agent definition
      const lines = agent.content.split('\n').slice(0, 20);
      console.log(`\n${chalk.bold('Definition:')}`);
      console.log(chalk.dim(lines.join('\n')));
      console.log(chalk.dim('\n... (truncated)'));

      console.log(chalk.gray('─'.repeat(50)));
    } catch (error) {
      spinner.fail('Failed to load agent info');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Stats command - Show system statistics
 */
program
  .command('stats')
  .description('Show system statistics')
  .action(async () => {
    const spinner = ora('Collecting statistics...').start();

    try {
      const router = new AgentRouter();
      await router.loadAgents();

      const stats = router.getStats();

      spinner.succeed('Statistics collected');

      console.log('\n' + chalk.bold.cyan('📊 System Statistics'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(`${chalk.bold('Total Agents:')} ${chalk.green(stats.totalAgents)}`);
      console.log(`${chalk.bold('Domains:')} ${chalk.green(stats.domains)}`);
      console.log(`\n${chalk.bold('Agents per Domain:')}`);

      const sorted = Object.entries(stats.agentsPerDomain).sort(([, a], [, b]) => b - a);
      sorted.forEach(([domain, count]) => {
        const bar = '█'.repeat(count);
        console.log(`  ${domain.padEnd(20)} ${chalk.green(bar)} ${count}`);
      });

      console.log(chalk.gray('─'.repeat(50)));
    } catch (error) {
      spinner.fail('Failed to collect statistics');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Test command - Run test cases from GETTING_STARTED.md
 */
program
  .command('test')
  .description('Run test cases from documentation')
  .action(async () => {
    console.log(chalk.bold.cyan('🧪 Running Test Cases'));
    console.log(chalk.gray('─'.repeat(50)));

    const testCases = [
      'Build a React button component with primary and secondary variants',
      'Build a REST API for user authentication with JWT tokens',
      'Design a mobile app dashboard, then implement it in React Native',
      'Optimize the dashboard performance'
    ];

    const router = new AgentRouter();

    for (const testCase of testCases) {
      console.log(`\n${chalk.bold('Test:')} ${testCase}`);

      const result = await router.route(testCase);

      const status = result.confidence >= 70 ? chalk.green('✓') : chalk.yellow('~');
      console.log(`${status} ${result.domain} → ${result.agent} (${result.confidence}% confidence)`);
    }

    console.log(chalk.gray('\n' + '─'.repeat(50)));
    console.log(chalk.green('✓ All tests complete'));
  });

/**
 * Helper: Get color for confidence level
 */
function getConfidenceColor(confidence: number): (text: string) => string {
  if (confidence >= 80) return (text: string) => chalk.green(text);
  if (confidence >= 60) return (text: string) => chalk.yellow(text);
  return (text: string) => chalk.red(text);
}

// Parse arguments and run
program.parse();
