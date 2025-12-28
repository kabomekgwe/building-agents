/**
 * Multi-Agent System Web API
 * REST API for routing and executing agent tasks
 * Built with Hono for high performance
 */

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { AgentRouter } from '../runtime/router.js';
import { AgentExecutor } from '../runtime/executor.js';
import { SDLCOrchestrator } from '../sdlc/orchestrator.js';
import { SDLCPhase, PlanningSession, RequirementsFormData } from '../sdlc/types.js';
import { AutonomousTaskExecutor } from '../autonomous/task-executor.js';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Serve static files from public directory
app.use('/*', serveStatic({ root: './public' }));

// Initialize router, executor, SDLC orchestrator, and autonomous task executor
const router = new AgentRouter();
const sdlcOrchestrator = new SDLCOrchestrator();
let autonomousExecutor: AutonomousTaskExecutor | null = null;
let routerInitialized = false;

// Planning session storage (in-memory)
const planningSessions = new Map<string, PlanningSession>();

const initRouter = async () => {
  if (!routerInitialized) {
    await router.loadAgents();
    routerInitialized = true;
  }
};

const initAutonomous = async () => {
  if (!autonomousExecutor) {
    autonomousExecutor = new AutonomousTaskExecutor();
    await autonomousExecutor.initialize();
  }
  return autonomousExecutor;
};

// Request schemas
const RouteRequestSchema = z.object({
  request: z.string().min(1),
  verbose: z.boolean().optional()
});

const ExecuteRequestSchema = z.object({
  request: z.string().min(1),
  workflow: z.boolean().optional(),
  apiKey: z.string().optional()
})

const InitializePlanningSchema = z.object({
  projectName: z.string().min(1),
  description: z.string().optional()
})

const CompletePhaseSchema = z.object({
  phaseId: z.enum(['requirements', 'design', 'implementation']),
  output: z.any()
})

/**
 * Build PRD generation prompt from requirements data
 */
function buildPRDPrompt(requirements: RequirementsFormData): string {
  return `<context>
The user is planning a new project and has provided the following information:

**Project Name:** ${requirements.projectName}

**High-Level Description:**
${requirements.description}

**Problem Statement:**
${requirements.problemStatement}

**Target Audience:**
${requirements.targetAudience}

**Key Features:**
${requirements.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**Success Metrics:**
${requirements.successMetrics.map((m, i) => `${i + 1}. ${m}`).join('\n')}

**Out of Scope:**
${requirements.outOfScope.length > 0
  ? requirements.outOfScope.map((item, i) => `${i + 1}. ${item}`).join('\n')
  : 'Not specified'}
</context>

<task>
Generate a professional Product Requirements Document (PRD) based on the information above.

Follow modern PRD best practices for 2025:
- Be concise but comprehensive
- Focus on shared understanding, not exhaustive detail
- Include clear rationale for decisions
- Make it a living document that can evolve

Include all standard sections:
1. Overview - High-level summary of what's being built and why
2. Purpose - Problem being solved and objectives
3. Target Audience - User personas and market segments
4. Success Metrics - KPIs and measurable outcomes
5. Features - Specific capabilities with user benefits
6. Scope - What's included in this release
7. Out of Scope - Explicitly stated non-goals
8. Timeline - Suggested milestones and release planning

Format as markdown with clear headings, bullet points, and logical structure.
</task>

<format>
# [Project Name] - Product Requirements Document

*Version 1.0 | Generated: [Current Date]*

## Overview
[2-3 paragraphs describing what's being built and the high-level vision]

## Purpose

### Problem Statement
[Detailed problem description]

### Objectives
- [Objective 1]
- [Objective 2]
- ...

## Target Audience

### User Personas
[Describe who will use this]

### Market Segments
[If applicable, define market positioning]

## Success Metrics
[List measurable outcomes and KPIs from user input]

## Features

### [Feature Category 1]
- **[Feature Name]**: [Description and user benefit]
- ...

### [Feature Category 2]
- **[Feature Name]**: [Description and user benefit]
- ...

## Scope

### In Scope
[What will be delivered in this release]

### Out of Scope
[Explicitly stated non-goals from user input]

## Timeline

### Suggested Milestones
- **Phase 1**: [Description] - [Timeframe]
- **Phase 2**: [Description] - [Timeframe]
- ...

### Release Planning
[Recommended release strategy]

---

*This PRD is a living document and should be reviewed and updated as the project evolves.*
</format>

If any information seems incomplete or unclear, make reasonable assumptions based on the context provided, but note them in the document.
`
}

/**
 * Generate PRD using Claude API
 */
async function generatePRD(requirements: RequirementsFormData): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set')
  }

  const anthropic = new Anthropic({ apiKey })
  const prompt = buildPRDPrompt(requirements)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: 'You are an expert product manager with 15 years of experience writing professional Product Requirements Documents (PRDs). You create clear, comprehensive PRDs that align with modern 2025 best practices.',
      messages: [{ role: 'user', content: prompt }]
    })

    const prdText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')

    return prdText
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error(`Failed to generate PRD: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Health check
 */
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get system statistics
 */
app.get('/api/stats', async (c) => {
  try {
    await initRouter();
    const stats = router.getStats();

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * List all agents
 */
app.get('/api/agents', async (c) => {
  try {
    await initRouter();

    const domain = c.req.query('domain');
    const agents = domain
      ? router.getAgentsByDomain(domain)
      : router['agents']; // Access private field for all agents

    return c.json({
      success: true,
      data: agents.map(a => ({
        name: a.name,
        domain: a.domain,
        keywords: a.keywords,
        path: a.path
      }))
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get agent details
 */
app.get('/api/agents/:name', async (c) => {
  try {
    await initRouter();

    const name = c.req.param('name');
    const agent = router.getAgent(name);

    if (!agent) {
      return c.json({
        success: false,
        error: `Agent ${name} not found`
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        name: agent.name,
        domain: agent.domain,
        keywords: agent.keywords,
        path: agent.path,
        content: agent.content
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Route a request to appropriate agent
 */
app.post('/api/route', async (c) => {
  try {
    const body = await c.req.json();
    const validated = RouteRequestSchema.parse(body);

    await initRouter();
    const result = await router.route(validated.request);

    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Invalid request',
        details: error.errors
      }, 400);
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Execute an agent task
 */
app.post('/api/execute', async (c) => {
  try {
    const body = await c.req.json();
    const validated = ExecuteRequestSchema.parse(body);

    const apiKey = validated.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return c.json({
        success: false,
        error: 'Claude API key required'
      }, 401);
    }

    await initRouter();

    // Route to agent
    const routing = await router.route(validated.request);
    const agent = router.getAgent(routing.agent);

    if (!agent) {
      return c.json({
        success: false,
        error: `Agent ${routing.agent} not found`
      }, 404);
    }

    // Execute
    const executor = new AgentExecutor(apiKey);

    if (validated.workflow) {
      // Multi-agent workflow
      const results = await executor.executeWorkflow(validated.request);

      return c.json({
        success: true,
        data: {
          type: 'workflow',
          routing,
          results
        }
      });
    } else {
      // Single agent execution
      const result = await executor.execute({
        agent,
        userRequest: validated.request
      });

      return c.json({
        success: true,
        data: {
          type: 'single',
          routing,
          result
        }
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Invalid request',
        details: error.errors
      }, 400);
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get available domains
 */
app.get('/api/domains', async (c) => {
  try {
    await initRouter();

    const stats = router.getStats();
    const domains = Object.keys(stats.agentsPerDomain).map(domain => ({
      name: domain,
      agentCount: stats.agentsPerDomain[domain]
    }));

    return c.json({
      success: true,
      data: domains
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Test endpoint - Run routing tests
 */
app.get('/api/test', async (c) => {
  try {
    await initRouter();

    const testCases = [
      'Build a React button component',
      'Design a user dashboard',
      'Optimize database queries',
      'Create TikTok campaign'
    ];

    const results = await Promise.all(
      testCases.map(async (request) => {
        const result = await router.route(request);
        return {
          request,
          domain: result.domain,
          agent: result.agent,
          confidence: result.confidence
        };
      })
    );

    return c.json({
      success: true,
      data: {
        totalTests: results.length,
        results
      }
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ========================================
// PLANNING WORKFLOW ENDPOINTS
// ========================================

/**
 * Serve planning workflow UI
 */
app.get('/planning', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation-First Planning | Multi-Agent System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: hsl(250, 84%, 67%);
      --primary-dark: hsl(250, 84%, 57%);
      --secondary: hsl(280, 67%, 55%);
      --accent: hsl(190, 90%, 50%);
      --bg: hsl(240, 20%, 8%);
      --card-bg: hsla(240, 20%, 15%, 0.7);
      --card-border: hsla(240, 20%, 30%, 0.5);
      --text: hsl(0, 0%, 95%);
      --text-muted: hsl(240, 5%, 70%);
      --success: hsl(145, 80%, 45%);
      --error: hsl(0, 84%, 60%);
      --warning: hsl(45, 100%, 60%);
      --glass-blur: 16px;
      --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
      --radius: 16px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      background-image:
        radial-gradient(at 0% 0%, hsla(250, 84%, 67%, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, hsla(280, 67%, 55%, 0.15) 0px, transparent 50%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
      padding: 0 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 2rem auto;
      animation: fadeIn 0.8s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 3rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--text) 0%, var(--primary) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }

    .header p {
      font-size: 1.15rem;
      color: var(--text-muted);
      font-weight: 300;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 2.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 2rem;
      transition: var(--transition);
    }

    .phase-stepper {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 3rem;
      position: relative;
    }

    .phase-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      cursor: pointer;
      transition: var(--transition);
    }

    .phase-step.locked {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .phase-step-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--card-bg);
      border: 3px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1rem;
      transition: var(--transition);
      position: relative;
      z-index: 2;
    }

    .phase-step.active .phase-step-circle {
      border-color: var(--primary);
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      box-shadow: 0 0 30px hsla(250, 84%, 67%, 0.5);
    }

    .phase-step.completed .phase-step-circle {
      border-color: var(--success);
      background: var(--success);
    }

    .phase-step-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .phase-step-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .phase-connector {
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--card-border);
      z-index: 1;
    }

    .phase-content {
      background: hsla(0, 0%, 100%, 0.03);
      border-radius: var(--radius);
      padding: 2rem;
      border: 1px solid var(--card-border);
    }

    .input-group {
      margin-bottom: 2rem;
    }

    .input-group label {
      display: block;
      font-size: 0.95rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: var(--text-muted);
    }

    .input-group input,
    .input-group textarea {
      width: 100%;
      padding: 1rem 1.25rem;
      background: hsla(240, 20%, 5%, 0.5);
      border: 2px solid var(--card-border);
      border-radius: 12px;
      color: var(--text);
      font-family: inherit;
      font-size: 1rem;
      transition: var(--transition);
    }

    .input-group input:focus,
    .input-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: hsla(240, 20%, 5%, 0.8);
      box-shadow: 0 0 0 4px hsla(250, 84%, 67%, 0.15);
    }

    .input-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .btn {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 1rem 2.5rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      box-shadow: 0 4px 15px hsla(250, 84%, 67%, 0.3);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px hsla(250, 84%, 67%, 0.5);
      filter: brightness(1.1);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-secondary {
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      box-shadow: none;
    }

    .btn-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .status-message {
      padding: 1rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: none;
    }

    .status-message.success {
      background: hsla(145, 80%, 45%, 0.15);
      border: 1px solid hsla(145, 80%, 45%, 0.3);
      color: var(--success);
    }

    .status-message.error {
      background: hsla(0, 84%, 60%, 0.15);
      border: 1px solid hsla(0, 84%, 60%, 0.3);
      color: var(--error);
    }

    .step-progress {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .step-container {
      display: none;
      animation: slideIn 0.3s ease-out;
    }

    .step-container.active {
      display: block;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text);
    }

    .char-count {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      text-align: right;
    }

    .char-count.over-limit {
      color: var(--error);
    }

    .field-error {
      font-size: 0.875rem;
      color: var(--error);
      margin-top: 0.5rem;
      display: none;
    }

    .field-error.visible {
      display: block;
    }

    input.invalid, textarea.invalid {
      border: 2px solid var(--error);
    }

    .list-field {
      margin-bottom: 1.5rem;
    }

    .list-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .list-item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .list-item input {
      flex: 1;
    }

    .list-item-btn {
      padding: 0.5rem 0.75rem;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      color: var(--text);
      cursor: pointer;
      transition: var(--transition);
      font-size: 0.875rem;
      min-width: 40px;
    }

    .list-item-btn:hover:not(:disabled) {
      background: var(--primary);
      border-color: var(--primary);
    }

    .list-item-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .list-item-btn.remove {
      background: hsla(0, 84%, 60%, 0.15);
      border-color: hsla(0, 84%, 60%, 0.3);
    }

    .list-item-btn.remove:hover:not(:disabled) {
      background: var(--error);
      border-color: var(--error);
    }

    .step-nav {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-top: 2rem;
    }

    .prd-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .prd-actions {
      display: flex;
      gap: 1rem;
    }

    .prd-content {
      max-width: 800px;
      line-height: 1.6;
    }

    .prd-content h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #fff;
    }

    .prd-content h2 {
      font-size: 1.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #e0e0e0;
    }

    .prd-content h3 {
      font-size: 1.25rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: #d0d0d0;
    }

    .prd-content p {
      margin-bottom: 1rem;
      color: #c0c0c0;
    }

    .prd-content ul, .prd-content ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
      color: #c0c0c0;
    }

    .prd-content li {
      margin-bottom: 0.5rem;
    }

    .prd-content strong {
      color: #fff;
      font-weight: 600;
    }

    .prd-content code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }

    .prd-content hr {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin: 2rem 0;
    }

    .prd-content blockquote {
      border-left: 4px solid rgba(255, 255, 255, 0.3);
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: #b0b0b0;
    }

    @media (max-width: 768px) {
      .phase-stepper {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .phase-connector {
        display: none;
      }

      .header h1 {
        font-size: 2rem;
      }

      .card {
        padding: 1.5rem;
      }

      .btn-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Documentation-First Planning</h1>
      <p>Guided SDLC workflow with hard gates enforcing documentation quality</p>
    </div>

    <div class="card">
      <div class="phase-stepper">
        <div class="phase-connector"></div>

        <div class="phase-step" data-phase="requirements">
          <div class="phase-step-circle">
            <span class="phase-icon">📋</span>
          </div>
          <div class="phase-step-title">Requirements</div>
          <div class="phase-step-desc">PRD Generation</div>
        </div>

        <div class="phase-step locked" data-phase="design">
          <div class="phase-step-circle">
            <span class="phase-icon">🎨</span>
          </div>
          <div class="phase-step-title">Design</div>
          <div class="phase-step-desc">Technical Spec & ADRs</div>
        </div>

        <div class="phase-step locked" data-phase="implementation">
          <div class="phase-step-circle">
            <span class="phase-icon">⚙️</span>
          </div>
          <div class="phase-step-title">Implementation</div>
          <div class="phase-step-desc">Task Breakdown & File Plan</div>
        </div>
      </div>

      <div id="statusMessage" class="status-message"></div>

      <div class="phase-content">
        <h2 id="phaseTitle" style="font-size: 1.75rem; margin-bottom: 1.5rem;">Phase 1: Requirements Gathering</h2>
        <p id="phaseDescription" style="color: var(--text-muted); margin-bottom: 2rem;">
          Define your project requirements and generate a comprehensive Product Requirements Document (PRD).
        </p>

        <div id="phaseForm">
          <!-- Form content will be dynamically inserted here -->
        </div>

        <div class="btn-group">
          <button type="button" class="btn btn-secondary" id="saveDraftBtn">Save Progress</button>
          <button type="button" class="btn" id="continueBtn" disabled>Continue to Next Phase</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = '/api/planning';
    let currentSession = null;
    let currentStep = 1;
    let requirementsFormData = {
      projectName: '',
      description: '',
      problemStatement: '',
      targetAudience: '',
      features: [''],
      successMetrics: [''],
      outOfScope: []
    };

    function createElement(tag, className, textContent) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      if (textContent) el.textContent = textContent;
      return el;
    }

    const phases = {
      requirements: {
        id: 'requirements',
        title: 'Phase 1: Requirements Gathering',
        description: 'Define your project requirements and generate a comprehensive Product Requirements Document (PRD).',
        icon: '📋',
        multiStep: true,
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Project Basics',
            fields: [
              { name: 'projectName', label: 'Project Name', type: 'text', placeholder: 'E-Commerce Checkout Feature', required: true, minLength: 3, maxLength: 100 },
              { name: 'description', label: 'High-Level Description', type: 'textarea', placeholder: 'Describe what you\'re building in 2-3 sentences', required: true, minLength: 50, maxLength: 500 }
            ]
          },
          {
            stepNumber: 2,
            stepTitle: 'Problem & Solution',
            fields: [
              { name: 'problemStatement', label: 'Problem Statement', type: 'textarea', placeholder: 'What problem are you solving? Who is affected?', required: true, minLength: 100, maxLength: 1000 },
              { name: 'targetAudience', label: 'Target Audience', type: 'textarea', placeholder: 'Who will use this? Define your user personas', required: true, minLength: 50, maxLength: 500 }
            ]
          },
          {
            stepNumber: 3,
            stepTitle: 'Features & Capabilities',
            fields: [
              { name: 'features', label: 'Key Features', type: 'list', placeholder: 'What specific capabilities will this provide?', required: true, minItems: 1, maxItems: 20 }
            ]
          },
          {
            stepNumber: 4,
            stepTitle: 'Success & Scope',
            fields: [
              { name: 'successMetrics', label: 'Success Metrics', type: 'list', placeholder: 'How will you measure success? (e.g., "Users can complete signup in <60 seconds")', required: true, minItems: 1, maxItems: 10 },
              { name: 'outOfScope', label: 'Out of Scope', type: 'list', placeholder: 'What should we explicitly NOT build in this version?', required: false, minItems: 0, maxItems: 10 }
            ]
          }
        ]
      },
      design: {
        id: 'design',
        title: 'Phase 2: Design Documentation',
        description: 'Create technical specifications and Architecture Decision Records (ADRs).',
        icon: '🎨',
        fields: [
          { name: 'architecture', label: 'System Architecture', type: 'textarea', placeholder: 'Describe the system architecture...', required: true },
          { name: 'techStack', label: 'Technology Stack', type: 'text', placeholder: 'React, Node.js, PostgreSQL...', required: true }
        ]
      },
      implementation: {
        id: 'implementation',
        title: 'Phase 3: Implementation Planning',
        description: 'Break down work into tasks and create a detailed file plan.',
        icon: '⚙️',
        fields: [
          { name: 'tasks', label: 'Task Breakdown', type: 'textarea', placeholder: 'List implementation tasks...', required: true },
          { name: 'filePlan', label: 'File Plan', type: 'textarea', placeholder: 'List files to be created/modified...', required: true }
        ]
      }
    };

    let autosaveTimer = null;
    let formDirty = false;

    async function initSession() {
      try {
        const response = await fetch(API_BASE + '/state');
        const data = await response.json();

        if (data.success && data.data) {
          currentSession = data.data;
          loadSavedRequirements();
          updateUI();
        } else {
          await createSession();
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        showStatus('Failed to load planning session', 'error');
      }
    }

    async function createSession() {
      try {
        const response = await fetch(API_BASE + '/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectName: 'New Project' })
        });

        const data = await response.json();

        if (data.success) {
          currentSession = data.data;
          updateUI();
        }
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    }

    function loadSavedRequirements() {
      if (currentSession?.phaseData?.requirements) {
        const saved = currentSession.phaseData.requirements;
        requirementsFormData = {
          projectName: saved.projectName || '',
          description: saved.description || '',
          problemStatement: saved.problemStatement || '',
          targetAudience: saved.targetAudience || '',
          features: saved.features || [''],
          successMetrics: saved.successMetrics || [''],
          outOfScope: saved.outOfScope || []
        };
      }
    }

    function markFormDirty() {
      formDirty = true;
      if (!autosaveTimer) {
        autosaveTimer = setTimeout(autosave, 30000);
      }
    }

    async function autosave() {
      if (!formDirty) return;

      const validItems = (arr) => arr.filter(item => item.trim().length > 0);

      const hasMinimumData = requirementsFormData.projectName.length >= 3 &&
                             requirementsFormData.description.length >= 50;

      if (!hasMinimumData) {
        formDirty = false;
        autosaveTimer = null;
        return;
      }

      try {
        const response = await fetch('/api/planning/requirements/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: requirementsFormData.projectName,
            description: requirementsFormData.description,
            problemStatement: requirementsFormData.problemStatement,
            targetAudience: requirementsFormData.targetAudience,
            features: validItems(requirementsFormData.features),
            successMetrics: validItems(requirementsFormData.successMetrics),
            outOfScope: validItems(requirementsFormData.outOfScope)
          })
        });

        const result = await response.json();
        if (result.success) {
          formDirty = false;
          showAutosaveIndicator('Saved');
        }
      } catch (error) {
        console.error('Autosave failed:', error);
      }

      autosaveTimer = null;
    }

    function showAutosaveIndicator(message) {
      const indicator = document.getElementById('autosaveIndicator');
      if (!indicator) {
        const newIndicator = createElement('div');
        newIndicator.id = 'autosaveIndicator';
        newIndicator.style.cssText = 'position: fixed; top: 20px; right: 20px; background: hsla(145, 80%, 45%, 0.15); border: 1px solid hsla(145, 80%, 45%, 0.3); color: var(--success); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; z-index: 1000; opacity: 0; transition: opacity 0.3s;';
        document.body.appendChild(newIndicator);
      }

      const ind = document.getElementById('autosaveIndicator');
      ind.textContent = message + ' ✓';
      ind.style.opacity = '1';

      setTimeout(() => {
        ind.style.opacity = '0';
      }, 2000);
    }

    function updateUI() {
      if (!currentSession) return;

      const currentPhase = currentSession.currentPhase;
      const completedPhases = currentSession.completedPhases;

      document.querySelectorAll('.phase-step').forEach(step => {
        const phaseId = step.dataset.phase;
        step.classList.remove('active', 'completed', 'locked');

        if (completedPhases.includes(phaseId)) {
          step.classList.add('completed');
          step.querySelector('.phase-icon').textContent = '✓';
        } else if (phaseId === currentPhase) {
          step.classList.add('active');
        } else {
          step.classList.add('locked');
        }
      });

      renderPhaseForm(currentPhase);

      const continueBtn = document.getElementById('continueBtn');
      continueBtn.disabled = true;
    }

    function renderPhaseForm(phaseId) {
      const phase = phases[phaseId];
      const formContainer = document.getElementById('phaseForm');

      document.getElementById('phaseTitle').textContent = phase.title;
      document.getElementById('phaseDescription').textContent = phase.description;

      formContainer.textContent = '';

      if (phase.multiStep) {
        renderMultiStepForm(phase, formContainer);
      } else {
        renderStandardForm(phase, formContainer, phaseId);
      }
    }

    function renderStandardForm(phase, formContainer, phaseId) {
      phase.fields.forEach(field => {
        const value = currentSession?.phaseData[phaseId]?.[field.name] || '';

        const inputGroup = createElement('div', 'input-group');

        const label = createElement('label');
        label.setAttribute('for', field.name);
        label.textContent = field.label + (field.required ? ' *' : '');

        let input;
        if (field.type === 'textarea') {
          input = createElement('textarea');
          input.rows = 4;
        } else {
          input = createElement('input');
          input.type = field.type;
        }

        input.id = field.name;
        input.name = field.name;
        input.placeholder = field.placeholder;
        input.value = value;
        if (field.required) input.required = true;

        input.addEventListener('input', checkFormValidity);

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        formContainer.appendChild(inputGroup);
      });

      checkFormValidity();
    }

    function renderMultiStepForm(phase, formContainer) {
      const progress = createElement('div', 'step-progress');
      progress.textContent = 'Step ' + currentStep + ' of ' + phase.steps.length;
      formContainer.appendChild(progress);

      phase.steps.forEach((step, index) => {
        const stepContainer = createElement('div', 'step-container');
        stepContainer.id = 'step-' + step.stepNumber;
        if (step.stepNumber === currentStep) {
          stepContainer.classList.add('active');
        }

        const stepTitle = createElement('h3', 'step-title');
        stepTitle.textContent = step.stepTitle;
        stepContainer.appendChild(stepTitle);

        step.fields.forEach(field => {
          renderField(field, stepContainer);
        });

        formContainer.appendChild(stepContainer);
      });

      const navContainer = createElement('div', 'step-nav');

      const backBtn = createElement('button', 'btn btn-secondary');
      backBtn.type = 'button';
      backBtn.textContent = 'Back';
      backBtn.id = 'stepBackBtn';
      backBtn.disabled = currentStep === 1;
      backBtn.addEventListener('click', goToPreviousStep);

      const continueBtn = createElement('button', 'btn');
      continueBtn.type = 'button';
      continueBtn.id = 'stepContinueBtn';
      continueBtn.textContent = currentStep === phase.steps.length ? 'Generate PRD' : 'Continue';
      continueBtn.addEventListener('click', goToNextStep);

      navContainer.appendChild(backBtn);
      navContainer.appendChild(continueBtn);
      formContainer.appendChild(navContainer);

      validateCurrentStep();
    }

    function renderField(field, container) {
      if (field.type === 'list') {
        renderListField(field, container);
      } else {
        renderTextFieldWithValidation(field, container);
      }
    }

    function renderTextFieldWithValidation(field, container) {
      const inputGroup = createElement('div', 'input-group');

      const label = createElement('label');
      label.setAttribute('for', field.name);
      label.textContent = field.label + (field.required ? ' *' : '');

      let input;
      if (field.type === 'textarea') {
        input = createElement('textarea');
        input.rows = 4;
      } else {
        input = createElement('input');
        input.type = field.type;
      }

      input.id = field.name;
      input.name = field.name;
      input.placeholder = field.placeholder;
      input.value = requirementsFormData[field.name] || '';
      if (field.required) input.required = true;

      input.addEventListener('input', (e) => {
        requirementsFormData[field.name] = e.target.value;
        updateCharCount(field, input);
        validateCurrentStep();
        markFormDirty();
      });

      input.addEventListener('blur', () => {
        validateField(field, input);
      });

      inputGroup.appendChild(label);
      inputGroup.appendChild(input);

      if (field.minLength || field.maxLength) {
        const charCount = createElement('div', 'char-count');
        charCount.id = field.name + '-count';
        inputGroup.appendChild(charCount);
        updateCharCount(field, input);
      }

      const errorMsg = createElement('div', 'field-error');
      errorMsg.id = field.name + '-error';
      inputGroup.appendChild(errorMsg);

      container.appendChild(inputGroup);
    }

    function renderListField(field, container) {
      const listField = createElement('div', 'list-field');

      const label = createElement('label');
      label.textContent = field.label + (field.required ? ' *' : '');
      listField.appendChild(label);

      const listItems = createElement('div', 'list-items');
      listItems.id = field.name + '-list';
      listField.appendChild(listItems);

      const errorMsg = createElement('div', 'field-error');
      errorMsg.id = field.name + '-error';
      listField.appendChild(errorMsg);

      container.appendChild(listField);

      renderListItems(field);
    }

    function renderListItems(field) {
      const listItems = document.getElementById(field.name + '-list');
      listItems.textContent = '';

      const items = requirementsFormData[field.name] || [''];

      items.forEach((item, index) => {
        const listItem = createElement('div', 'list-item');

        const input = createElement('input');
        input.type = 'text';
        input.placeholder = field.placeholder;
        input.value = item;
        input.addEventListener('input', (e) => {
          requirementsFormData[field.name][index] = e.target.value;
          validateCurrentStep();
          markFormDirty();
        });

        const addBtn = createElement('button', 'list-item-btn');
        addBtn.type = 'button';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
          requirementsFormData[field.name].push('');
          renderListItems(field);
          validateCurrentStep();
        });

        const removeBtn = createElement('button', 'list-item-btn remove');
        removeBtn.type = 'button';
        removeBtn.textContent = '×';
        removeBtn.disabled = items.length === 1 && field.required;
        removeBtn.addEventListener('click', () => {
          requirementsFormData[field.name].splice(index, 1);
          renderListItems(field);
          validateCurrentStep();
        });

        listItem.appendChild(input);
        if (index === items.length - 1) {
          listItem.appendChild(addBtn);
        }
        if (items.length > 1 || !field.required) {
          listItem.appendChild(removeBtn);
        }

        listItems.appendChild(listItem);
      });
    }

    function updateCharCount(field, input) {
      const countEl = document.getElementById(field.name + '-count');
      if (countEl) {
        const length = input.value.length;
        const max = field.maxLength || 0;
        countEl.textContent = length + (max ? ' / ' + max + ' characters' : ' characters');
        if (max && length > max) {
          countEl.classList.add('over-limit');
        } else {
          countEl.classList.remove('over-limit');
        }
      }
    }

    function validateField(field, input) {
      const errorEl = document.getElementById(field.name + '-error');
      const value = input.value.trim();

      let error = '';

      if (field.required && !value) {
        error = field.label + ' is required';
      } else if (field.minLength && value.length < field.minLength) {
        error = field.label + ' must be at least ' + field.minLength + ' characters';
      } else if (field.maxLength && value.length > field.maxLength) {
        error = field.label + ' must not exceed ' + field.maxLength + ' characters';
      }

      if (error) {
        input.classList.add('invalid');
        errorEl.textContent = error;
        errorEl.classList.add('visible');
        return false;
      } else {
        input.classList.remove('invalid');
        errorEl.classList.remove('visible');
        return true;
      }
    }

    function validateCurrentStep() {
      const phase = phases.requirements;
      const step = phase.steps[currentStep - 1];
      const continueBtn = document.getElementById('stepContinueBtn');

      if (!continueBtn) return;

      let allValid = true;

      step.fields.forEach(field => {
        if (field.type === 'list') {
          const items = requirementsFormData[field.name] || [];
          const validItems = items.filter(item => item.trim().length > 0);

          const errorEl = document.getElementById(field.name + '-error');
          if (field.required && validItems.length < (field.minItems || 1)) {
            allValid = false;
            if (errorEl) {
              errorEl.textContent = 'Please add at least ' + (field.minItems || 1) + ' item(s)';
              errorEl.classList.add('visible');
            }
          } else {
            if (errorEl) {
              errorEl.classList.remove('visible');
            }
          }
        } else {
          const value = requirementsFormData[field.name] || '';
          if (field.required && value.trim().length < (field.minLength || 1)) {
            allValid = false;
          }
        }
      });

      continueBtn.disabled = !allValid;
    }

    function goToPreviousStep() {
      if (currentStep > 1) {
        if (formDirty) {
          autosave();
        }

        document.getElementById('step-' + currentStep).classList.remove('active');
        currentStep--;
        document.getElementById('step-' + currentStep).classList.add('active');

        const progress = document.querySelector('.step-progress');
        progress.textContent = 'Step ' + currentStep + ' of ' + phases.requirements.steps.length;

        const backBtn = document.getElementById('stepBackBtn');
        backBtn.disabled = currentStep === 1;

        const continueBtn = document.getElementById('stepContinueBtn');
        continueBtn.textContent = currentStep === phases.requirements.steps.length ? 'Generate PRD' : 'Continue';

        validateCurrentStep();
      }
    }

    function goToNextStep() {
      const phase = phases.requirements;

      if (currentStep < phase.steps.length) {
        if (formDirty) {
          autosave();
        }

        document.getElementById('step-' + currentStep).classList.remove('active');
        currentStep++;
        document.getElementById('step-' + currentStep).classList.add('active');

        const progress = document.querySelector('.step-progress');
        progress.textContent = 'Step ' + currentStep + ' of ' + phase.steps.length;

        const backBtn = document.getElementById('stepBackBtn');
        backBtn.disabled = currentStep === 1;

        const continueBtn = document.getElementById('stepContinueBtn');
        continueBtn.textContent = currentStep === phase.steps.length ? 'Generate PRD' : 'Continue';

        validateCurrentStep();
      } else {
        handleGeneratePRD();
      }
    }

    async function handleGeneratePRD() {
      const continueBtn = document.getElementById('stepContinueBtn');
      if (!continueBtn) return;

      continueBtn.disabled = true;
      continueBtn.textContent = 'Generating PRD...';

      try {
        const response = await fetch('/api/planning/requirements/generate-prd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
          displayPRD(result.data.prd);
        } else {
          showStatus(result.error || 'Failed to generate PRD', 'error');
          continueBtn.disabled = false;
          continueBtn.textContent = 'Generate PRD';
        }
      } catch (error) {
        console.error('PRD generation failed:', error);
        showStatus('Failed to generate PRD. Please try again.', 'error');
        continueBtn.disabled = false;
        continueBtn.textContent = 'Generate PRD';
      }
    }

    function displayPRD(prdMarkdown) {
      const container = document.getElementById('phaseForm');
      container.textContent = '';

      const prdCard = createElement('div', 'glass-card');

      const header = createElement('div', 'prd-header');

      const title = createElement('h2');
      title.textContent = 'Generated PRD';
      header.appendChild(title);

      const actions = createElement('div', 'prd-actions');

      const regenerateBtn = createElement('button', 'btn btn-secondary');
      regenerateBtn.textContent = 'Regenerate';
      regenerateBtn.addEventListener('click', () => {
        renderPhaseForm('requirements');
        currentStep = 4;
        document.getElementById('step-4').classList.add('active');
        handleGeneratePRD();
      });

      const downloadBtn = createElement('button', 'btn btn-secondary');
      downloadBtn.textContent = 'Download PRD';
      downloadBtn.addEventListener('click', () => downloadPRD(prdMarkdown));

      const completeBtn = createElement('button', 'btn');
      completeBtn.textContent = 'Complete Requirements Phase';
      completeBtn.addEventListener('click', () => completePhase());

      actions.appendChild(regenerateBtn);
      actions.appendChild(downloadBtn);
      actions.appendChild(completeBtn);
      header.appendChild(actions);

      prdCard.appendChild(header);

      const contentDiv = createElement('div', 'prd-content');
      renderMarkdownSafely(prdMarkdown, contentDiv);

      prdCard.appendChild(contentDiv);
      container.appendChild(prdCard);
    }

    function renderMarkdownSafely(markdown, targetElement) {
      const lines = markdown.split('\n');
      let currentList = null;
      let currentListType = null;

      lines.forEach(line => {
        const trimmed = line.trim();

        if (!trimmed) {
          if (currentList) {
            targetElement.appendChild(currentList);
            currentList = null;
            currentListType = null;
          }
          const spacer = createElement('div');
          spacer.style.height = '0.5rem';
          targetElement.appendChild(spacer);
          return;
        }

        if (trimmed.startsWith('# ')) {
          const h1 = createElement('h1');
          h1.textContent = trimmed.substring(2);
          targetElement.appendChild(h1);
        } else if (trimmed.startsWith('## ')) {
          const h2 = createElement('h2');
          h2.textContent = trimmed.substring(3);
          targetElement.appendChild(h2);
        } else if (trimmed.startsWith('### ')) {
          const h3 = createElement('h3');
          h3.textContent = trimmed.substring(4);
          targetElement.appendChild(h3);
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!currentList || currentListType !== 'ul') {
            if (currentList) targetElement.appendChild(currentList);
            currentList = createElement('ul');
            currentListType = 'ul';
          }
          const li = createElement('li');
          const text = trimmed.substring(2);
          parseInlineFormatting(text, li);
          currentList.appendChild(li);
        } else if (/^\d+\.\s/.test(trimmed)) {
          if (!currentList || currentListType !== 'ol') {
            if (currentList) targetElement.appendChild(currentList);
            currentList = createElement('ol');
            currentListType = 'ol';
          }
          const li = createElement('li');
          const text = trimmed.replace(/^\d+\.\s/, '');
          parseInlineFormatting(text, li);
          currentList.appendChild(li);
        } else if (trimmed === '---' || trimmed === '***') {
          const hr = createElement('hr');
          targetElement.appendChild(hr);
        } else if (trimmed.startsWith('> ')) {
          const blockquote = createElement('blockquote');
          blockquote.textContent = trimmed.substring(2);
          targetElement.appendChild(blockquote);
        } else if (trimmed.startsWith('\`') && trimmed.endsWith('\`') && trimmed.length > 2) {
          const code = createElement('code');
          code.textContent = trimmed.slice(1, -1);
          targetElement.appendChild(code);
        } else if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**') && trimmed.length > 2) {
          const em = createElement('em');
          em.textContent = trimmed.slice(1, -1);
          targetElement.appendChild(em);
        } else {
          if (currentList) {
            targetElement.appendChild(currentList);
            currentList = null;
            currentListType = null;
          }
          const p = createElement('p');
          parseInlineFormatting(trimmed, p);
          targetElement.appendChild(p);
        }
      });

      if (currentList) {
        targetElement.appendChild(currentList);
      }
    }

    function parseInlineFormatting(text, targetElement) {
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\`.*?\`)/g);

      parts.forEach(part => {
        if (!part) return;

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const strong = createElement('strong');
          strong.textContent = part.slice(2, -2);
          targetElement.appendChild(strong);
        } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length > 2) {
          const em = createElement('em');
          em.textContent = part.slice(1, -1);
          targetElement.appendChild(em);
        } else if (part.startsWith('\`') && part.endsWith('\`') && part.length > 2) {
          const code = createElement('code');
          code.textContent = part.slice(1, -1);
          targetElement.appendChild(code);
        } else {
          targetElement.appendChild(document.createTextNode(part));
        }
      });
    }

    function downloadPRD(prdMarkdown) {
      const blob = new Blob([prdMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      const a = createElement('a');
      a.href = url;
      a.download = requirementsFormData.projectName.replace(/\s+/g, '-') + '-PRD.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async function completePhase() {
      try {
        const response = await fetch('/api/planning/phase/requirements/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phaseId: 'requirements',
            output: requirementsFormData
          })
        });

        const result = await response.json();

        if (result.success) {
          window.location.reload();
        } else {
          showStatus(result.error || 'Failed to complete phase', 'error');
        }
      } catch (error) {
        console.error('Phase completion failed:', error);
        showStatus('Failed to complete phase. Please try again.', 'error');
      }
    }

    function checkFormValidity() {
      const phase = phases[currentSession.currentPhase];
      const continueBtn = document.getElementById('continueBtn');

      let allValid = true;
      phase.fields.forEach(field => {
        if (field.required) {
          const input = document.getElementById(field.name);
          if (!input.value.trim()) {
            allValid = false;
          }
        }
      });

      continueBtn.disabled = !allValid;
    }

    function showStatus(message, type = 'success') {
      const statusEl = document.getElementById('statusMessage');
      statusEl.textContent = message;
      statusEl.className = 'status-message ' + type;
      statusEl.style.display = 'block';

      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 5000);
    }

    document.getElementById('saveDraftBtn').addEventListener('click', async () => {
      const phase = phases[currentSession.currentPhase];
      const formData = {};

      phase.fields.forEach(field => {
        const input = document.getElementById(field.name);
        formData[field.name] = input.value;
      });

      if (!currentSession.phaseData[currentSession.currentPhase]) {
        currentSession.phaseData[currentSession.currentPhase] = {};
      }
      Object.assign(currentSession.phaseData[currentSession.currentPhase], formData);

      showStatus('Progress saved successfully', 'success');
    });

    document.getElementById('continueBtn').addEventListener('click', async () => {
      const phase = phases[currentSession.currentPhase];
      const formData = {};

      phase.fields.forEach(field => {
        const input = document.getElementById(field.name);
        formData[field.name] = input.value;
      });

      try {
        const response = await fetch(API_BASE + '/phase/' + currentSession.currentPhase + '/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phaseId: currentSession.currentPhase,
            output: formData
          })
        });

        const data = await response.json();

        if (data.success) {
          currentSession = data.data;
          updateUI();
          showStatus('Phase completed! Moving to next phase.', 'success');
        } else {
          showStatus(data.error || 'Failed to complete phase', 'error');
        }
      } catch (error) {
        showStatus('Failed to complete phase: ' + error.message, 'error');
      }
    });

    initSession();
  </script>
</body>
</html>`)
})

/**
 * Initialize new planning session
 */
app.post('/api/planning/initialize', async (c) => {
  try {
    const body = await c.req.json()
    const validated = InitializePlanningSchema.parse(body)

    const sessionId = `planning-${Date.now()}`
    const session: PlanningSession = {
      id: sessionId,
      projectName: validated.projectName,
      description: validated.description,
      currentPhase: 'requirements',
      completedPhases: [],
      phaseData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }

    planningSessions.set(sessionId, session)

    return c.json({
      success: true,
      data: session
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Invalid request',
        details: error.errors
      }, 400)
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * Get current planning session state
 */
app.get('/api/planning/state', (c) => {
  try {
    const session = Array.from(planningSessions.values())[0]

    if (!session) {
      return c.json({
        success: false,
        error: 'No active planning session'
      }, 404)
    }

    return c.json({
      success: true,
      data: session
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * Autosave requirements form data
 */
const AutosaveRequirementsSchema = z.object({
  projectName: z.string().min(3).max(100),
  description: z.string().min(50).max(500),
  problemStatement: z.string().min(100).max(1000),
  targetAudience: z.string().min(50).max(500),
  features: z.array(z.string()).min(1).max(20),
  successMetrics: z.array(z.string()).min(1).max(10),
  outOfScope: z.array(z.string()).max(10).optional().default([])
})

app.post('/api/planning/requirements/autosave', async (c) => {
  try {
    const session = Array.from(planningSessions.values())[0]

    if (!session) {
      return c.json({
        success: false,
        error: 'No active planning session'
      }, 404)
    }

    const body = await c.req.json()
    const validated = AutosaveRequirementsSchema.parse(body)

    if (!session.phaseData.requirements) {
      session.phaseData.requirements = {
        projectName: '',
        description: '',
        problemStatement: '',
        targetAudience: '',
        features: [],
        successMetrics: [],
        outOfScope: []
      }
    }

    Object.assign(session.phaseData.requirements, validated)
    session.phaseData.requirements.lastSaved = new Date()
    session.updatedAt = new Date()

    planningSessions.set(session.id, session)

    return c.json({
      success: true,
      data: {
        lastSaved: session.phaseData.requirements.lastSaved
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, 400)
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * Generate PRD from requirements form data
 */
app.post('/api/planning/requirements/generate-prd', async (c) => {
  try {
    const session = Array.from(planningSessions.values())[0]

    if (!session) {
      return c.json({
        success: false,
        error: 'No planning session found'
      }, 404)
    }

    if (!session.phaseData.requirements) {
      return c.json({
        success: false,
        error: 'Requirements form not completed'
      }, 400)
    }

    const requirements = session.phaseData.requirements

    const validItems = (arr: string[]) => arr.filter(item => item.trim().length > 0)
    const hasCompleteData =
      requirements.projectName.length >= 3 &&
      requirements.description.length >= 50 &&
      requirements.problemStatement.length >= 100 &&
      requirements.targetAudience.length >= 50 &&
      validItems(requirements.features).length >= 1 &&
      validItems(requirements.successMetrics).length >= 1

    if (!hasCompleteData) {
      return c.json({
        success: false,
        error: 'Requirements form must be completed before generating PRD'
      }, 400)
    }

    const prd = await generatePRD(requirements)

    session.phaseData.requirements.generatedPRD = prd
    session.phaseData.requirements.generatedAt = new Date()
    session.updatedAt = new Date()

    planningSessions.set(session.id, session)

    return c.json({
      success: true,
      data: {
        prd,
        generatedAt: session.phaseData.requirements.generatedAt
      }
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
      return c.json({
        success: false,
        error: 'Claude API key not configured'
      }, 500)
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * Complete a phase and advance to next
 */
app.post('/api/planning/phase/:phaseId/complete', async (c) => {
  try {
    const phaseId = c.req.param('phaseId') as 'requirements' | 'design' | 'implementation'
    const body = await c.req.json()
    const validated = CompletePhaseSchema.parse({ phaseId, output: body.output })

    const session = Array.from(planningSessions.values())[0]
    if (!session) {
      return c.json({
        success: false,
        error: 'No active planning session'
      }, 404)
    }

    if (session.currentPhase !== phaseId) {
      return c.json({
        success: false,
        error: `Cannot complete ${phaseId} phase. Current phase is ${session.currentPhase}`
      }, 400)
    }

    session.phaseData[phaseId] = validated.output
    session.completedPhases.push(phaseId)

    const phaseOrder: Array<'requirements' | 'design' | 'implementation'> = ['requirements', 'design', 'implementation']
    const currentIndex = phaseOrder.indexOf(phaseId)
    if (currentIndex < phaseOrder.length - 1) {
      session.currentPhase = phaseOrder[currentIndex + 1]
    }

    session.updatedAt = new Date()
    planningSessions.set(session.id, session)

    return c.json({
      success: true,
      data: session
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: 'Invalid request',
        details: error.errors
      }, 400)
    }

    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// ========================================
// AUTONOMOUS TASK EXECUTION ENDPOINTS
// ========================================

/**
 * Create and execute autonomous task
 */
app.post('/api/autonomous/tasks', async (c) => {
  try {
    const body = await c.req.json();
    const { goal } = body;

    if (!goal) {
      return c.json({
        success: false,
        error: 'Goal is required'
      }, 400);
    }

    const executor = await initAutonomous();

    // Create task (breaks down into steps using Claude CLI)
    const task = await executor.createTask(goal);

    // Start execution in background using Claude CLI
    executor.executeTask(task.id).catch(error => {
      console.error(`Task ${task.id} execution error:`, error);
    });

    return c.json({
      success: true,
      data: task
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get task status
 */
app.get('/api/autonomous/tasks/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const executor = await initAutonomous();
    const task = executor.getTask(id);

    if (!task) {
      return c.json({
        success: false,
        error: 'Task not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: task
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * List all tasks
 */
app.get('/api/autonomous/tasks', async (c) => {
  try {
    const executor = await initAutonomous();
    const tasks = executor.getAllTasks();

    return c.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ========================================
// SDLC ENDPOINTS
// ========================================

/**
 * Create a new SDLC project
 */
app.post('/api/sdlc/projects', async (c) => {
  try {
    const body = await c.req.json();
    const { name, description } = body;

    if (!name || !description) {
      return c.json({
        success: false,
        error: 'Name and description are required'
      }, 400);
    }

    const project = await sdlcOrchestrator.startProject({ name, description });

    return c.json({
      success: true,
      data: project
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Launch a full SDLC Mission
 */
app.post('/api/sdlc/mission', async (c) => {
  try {
    const body = await c.req.json();
    const { goal } = body;

    if (!goal) {
      return c.json({
        success: false,
        error: 'Goal is required'
      }, 400);
    }

    const executor = await initAutonomous();

    // We don't await the full execution here as it might take time
    // But we return the task ID so the UI can poll progress
    const task = await executor.launchSDLCMission(goal);

    // Fire and forget the execution (the poll endpoint handles status)
    executor.executeTask(task.id).catch(err => console.error('Mission execution error:', err));

    return c.json({
      success: true,
      data: task
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get project details
 */
app.get('/api/sdlc/projects/:id', (c) => {
  try {
    const id = c.req.param('id');
    const project = sdlcOrchestrator.getProject(id);

    return c.json({
      success: true,
      data: project
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 404);
  }
});

/**
 * Assign deliverable to agent
 */
app.post('/api/sdlc/projects/:projectId/deliverables/:deliverableId/assign', async (c) => {
  try {
    const { projectId, deliverableId } = c.req.param();
    const body = await c.req.json();
    const { agentName } = body;

    if (!agentName) {
      return c.json({
        success: false,
        error: 'Agent name is required'
      }, 400);
    }

    await sdlcOrchestrator.assignDeliverable(deliverableId, agentName);

    return c.json({
      success: true,
      message: `Deliverable assigned to ${agentName}`
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Mark deliverable as complete
 */
app.post('/api/sdlc/projects/:projectId/deliverables/:deliverableId/complete', async (c) => {
  try {
    const { deliverableId } = c.req.param();
    const body = await c.req.json();
    const artifacts = body.artifacts || [];

    await sdlcOrchestrator.markDeliverableComplete(deliverableId, artifacts);

    return c.json({
      success: true,
      message: 'Deliverable marked as complete'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Approve a manual quality gate
 */
app.post('/api/sdlc/projects/:id/gates/:gateName/approve', async (c) => {
  try {
    const { id, gateName } = c.req.param();
    const body = await c.req.json();
    const { approvedBy } = body;

    if (!approvedBy) {
      return c.json({
        success: false,
        error: 'Approver name is required'
      }, 400);
    }

    await sdlcOrchestrator.approveManualGate(id, decodeURIComponent(gateName), approvedBy);

    return c.json({
      success: true,
      message: `Gate ${gateName} approved by ${approvedBy}`
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Check phase completion status
 */
app.get('/api/sdlc/projects/:id/completion', async (c) => {
  try {
    const id = c.req.param('id');
    const completion = await sdlcOrchestrator.checkPhaseCompletion(id);

    return c.json({
      success: true,
      data: completion
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Run quality gates for current phase
 */
app.post('/api/sdlc/projects/:id/gates/run', async (c) => {
  try {
    const id = c.req.param('id');
    const project = sdlcOrchestrator.getProject(id);

    const gateResults = await sdlcOrchestrator.runQualityGates(id, project.currentPhase);

    return c.json({
      success: true,
      data: gateResults
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Transition to next phase
 */
app.post('/api/sdlc/projects/:id/transition', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { fromPhase, toPhase, requestedBy, reason } = body;

    if (!fromPhase || !toPhase || !requestedBy || !reason) {
      return c.json({
        success: false,
        error: 'fromPhase, toPhase, requestedBy, and reason are required'
      }, 400);
    }

    const result = await sdlcOrchestrator.transitionPhase({
      projectId: id,
      fromPhase: fromPhase as SDLCPhase,
      toPhase: toPhase as SDLCPhase,
      requestedBy,
      reason
    });

    return c.json({
      success: result.success,
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * Get project statistics
 */
app.get('/api/sdlc/projects/:id/stats', (c) => {
  try {
    const id = c.req.param('id');
    const stats = sdlcOrchestrator.getProjectStats(id);

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Start server
const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Multi-Agent System API Server`);
console.log(`   Version: 2.0.0`);
console.log(`   Port: ${port}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`\n✓ Server running at http://localhost:${info.port}`);
  console.log(`\nAgent Endpoints:`);
  console.log(`   GET  /health                                    - Health check`);
  console.log(`   GET  /api/stats                                 - System statistics`);
  console.log(`   GET  /api/agents                                - List all agents`);
  console.log(`   GET  /api/agents/:name                          - Get agent details`);
  console.log(`   GET  /api/domains                               - List all domains`);
  console.log(`   POST /api/route                                 - Route a request`);
  console.log(`   POST /api/execute                               - Execute agent task`);
  console.log(`   GET  /api/test                                  - Run test cases`);
  console.log(`\nAutonomous Execution Endpoints:`);
  console.log(`   POST /api/autonomous/tasks                      - Create and execute task`);
  console.log(`   GET  /api/autonomous/tasks/:id                  - Get task status`);
  console.log(`   GET  /api/autonomous/tasks                      - List all tasks`);
  console.log(`\nSDLC Endpoints:`);
  console.log(`   POST /api/sdlc/mission                          - Launch full SDLC mission`);
  console.log(`   POST /api/sdlc/projects                         - Create SDLC project`);
  console.log(`   GET  /api/sdlc/projects/:id                     - Get project details`);
  console.log(`   POST /api/sdlc/projects/:id/deliverables/.../assign    - Assign deliverable`);
  console.log(`   POST /api/sdlc/projects/:id/deliverables/.../complete  - Complete deliverable`);
  console.log(`   POST /api/sdlc/projects/:id/gates/:name/approve - Approve manual gate`);
  console.log(`   GET  /api/sdlc/projects/:id/completion          - Check phase completion`);
  console.log(`   POST /api/sdlc/projects/:id/gates/run           - Run quality gates`);
  console.log(`   POST /api/sdlc/projects/:id/transition          - Transition phase`);
  console.log(`   GET  /api/sdlc/projects/:id/stats               - Project statistics`);
  console.log(`\n`);
});

export default app;
