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
import { SDLCPhase } from '../sdlc/types.js';
import { z } from 'zod';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Serve static files from public directory
app.use('/*', serveStatic({ root: './public' }));

// Initialize router, executor, and SDLC orchestrator
const router = new AgentRouter();
const sdlcOrchestrator = new SDLCOrchestrator();
let routerInitialized = false;

const initRouter = async () => {
  if (!routerInitialized) {
    await router.loadAgents();
    routerInitialized = true;
  }
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
});

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
  console.log(`\nSDLC Endpoints:`);
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
