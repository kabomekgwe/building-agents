# External Integrations

**Analysis Date:** 2025-01-28

## APIs & External Services

**Claude AI API:**
- Anthropic Claude API - Core agent execution
  - SDK/Client: @anthropic-ai/sdk v0.32.1 (`src/runtime/executor.ts`)
  - Model: claude-sonnet-4-20250514 (hardcoded in `src/runtime/executor.ts:49`)
  - Max Tokens: 8192
  - Auth: ANTHROPIC_API_KEY environment variable
  - Endpoints used: Messages API for agent task execution
  - Usage: Execute agent tasks, generate autonomous task breakdowns, SDLC deliverables

**Claude Code CLI:**
- Local Claude Code CLI (must be installed separately)
  - Integration method: Shell execution via `src/autonomous/task-executor.ts:68-75`
  - Command: `echo '<prompt>' | claude --print`
  - Auth: Inherits from system Claude Code installation
  - Usage: Break down high-level goals into executable steps, autonomous task planning
  - **Security Note**: Currently uses exec() - should migrate to execFile() for safety

## Data Storage

**Databases:**
- None (in-memory only)
  - Projects: Map<string, Project> in `src/sdlc/orchestrator.ts`
  - Tasks: Map<string, Task> in `src/autonomous/task-executor.ts`
  - Note: All data lost on server restart

**File Storage:**
- File system - Agent definitions and context
  - Agent definitions: `.claude/agents/[domain]/[agent-name].md`
  - Handoff records: `.claude/context/handoffs/*.md` (`src/runtime/context.ts`)
  - Domain context: `.claude/context/domain-context/*.md`

**Caching:**
- None currently

## Authentication & Identity

**Auth Provider:**
- API Key authentication only
  - ANTHROPIC_API_KEY for Claude API
  - No user authentication system
  - Assumes trusted environment

**CORS:**
- Enabled via Hono middleware (`src/api/server.ts`)
- Allows all origins (development configuration)

## Monitoring & Observability

**Error Tracking:**
- None (console.error only)
  - Logs to stdout/stderr
  - No centralized error tracking

**Analytics:**
- None detected

**Logs:**
- Console logging with Hono logger middleware
  - HTTP request logging (`src/api/server.ts`)
  - Chalk for colored terminal output
  - No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Local Node.js server
  - Port: 3000 (configurable via PORT env var)
  - Static files served from `public/` directory

**CI Pipeline:**
- Not detected

## Environment Configuration

**Development:**
- Required env vars: ANTHROPIC_API_KEY, PORT (optional)
- Secrets location: .env file (gitignored, documented in .env.example)
- Mock/stub services: None

**Production:**
- Same as development
- No environment-specific differences detected
- No secrets management infrastructure

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## API Endpoints

**Agent Management:**
- GET /health - Health check
- GET /api/stats - System statistics
- GET /api/agents - List all agents
- GET /api/agents/:name - Get agent details
- GET /api/domains - List all domains
- POST /api/route - Route request to agent
- POST /api/execute - Execute agent task

**Autonomous Tasks:**
- POST /api/autonomous/tasks - Create autonomous task
- GET /api/autonomous/tasks/:id - Get task status
- GET /api/autonomous/tasks - List all tasks

**SDLC Projects:**
- POST /api/sdlc/mission - Launch full SDLC mission
- POST /api/sdlc/projects - Create project
- GET /api/sdlc/projects/:id - Get project details
- POST /api/sdlc/projects/:id/deliverables/:deliverableId/assign - Assign deliverable
- POST /api/sdlc/projects/:id/deliverables/:deliverableId/complete - Complete deliverable
- POST /api/sdlc/projects/:id/gates/:gateName/approve - Approve quality gate
- POST /api/sdlc/projects/:id/gates/run - Run quality gates
- POST /api/sdlc/projects/:id/transition - Transition to next phase
- GET /api/sdlc/projects/:id/completion - Check completion status
- GET /api/sdlc/projects/:id/stats - Get project stats

---

*Integration audit: 2025-01-28*
*Update when adding/removing external services*
