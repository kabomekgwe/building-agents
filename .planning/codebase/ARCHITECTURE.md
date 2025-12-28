# Architecture

**Analysis Date:** 2025-01-28

## Pattern Overview

**Overall:** Multi-Agent System with Layered Runtime Architecture

**Key Characteristics:**
- Modular monolith with three execution models
- 3-tier agent routing (System → Domain → Specialist)
- Multi-agent workflow orchestration with handoff protocol
- SDLC lifecycle management with quality gates
- Autonomous task execution with Claude CLI integration

## Layers

**User Interface Layer:**
- Purpose: Accept user requests via CLI or REST API
- Contains: CLI commands, HTTP endpoints
- Depends on: Routing and Execution layers
- Used by: End users, external systems
- Files: `src/cli/index.ts`, `src/api/server.ts`

**Routing Layer:**
- Purpose: Select appropriate agent for user requests
- Contains: 3-tier routing algorithm, keyword extraction, domain scoring
- Depends on: Agent definitions from file system
- Used by: CLI interface, API endpoints
- Files: `src/runtime/router.ts`
- Pattern: Keyword-based scoring (+10 exact match, +5 partial match)

**Execution Layer:**
- Purpose: Execute agent tasks via Claude API
- Contains: Claude API integration, handoff detection, multi-agent workflow
- Depends on: Context Manager, Agent Router
- Used by: CLI, API, Autonomous Executor
- Files: `src/runtime/executor.ts`
- Pattern: Single agent execution + multi-agent workflow orchestration

**Context Management Layer:**
- Purpose: Persist handoff records and domain context
- Contains: Handoff storage, domain context updates
- Depends on: File system (markdown files)
- Used by: Agent Executor
- Files: `src/runtime/context.ts`
- Storage: `.claude/context/handoffs/*.md`, `.claude/context/domain-context/*.md`

**Orchestration Layer:**
- Purpose: Manage SDLC project lifecycle
- Contains: Phase transitions, deliverable tracking, quality gates
- Depends on: In-memory Maps for storage
- Used by: API endpoints, Autonomous Executor
- Files: `src/sdlc/orchestrator.ts`, `src/sdlc/types.ts`
- Pattern: 6-phase lifecycle (requirements → design → implementation → testing → deployment → maintenance)

**Autonomous Execution Layer:**
- Purpose: Break down goals and execute multi-step tasks
- Contains: Task breakdown via Claude CLI, step execution, SDLC integration
- Depends on: Claude CLI (shell), Agent Router, SDLC Orchestrator
- Used by: API endpoints
- Files: `src/autonomous/task-executor.ts`

## Data Flow

**Single Agent Execution:**

1. User request received (CLI: `agent exec "<request>"` or API: `POST /api/execute`)
2. AgentRouter.route() analyzes request
   - Extract keywords from request
   - Score against 7 domains
   - Score against agents within winning domain
   - Return routing decision with confidence
3. AgentExecutor.execute() runs agent
   - Build system prompt from agent definition + context
   - Call Claude API (model: claude-sonnet-4-20250514)
   - Parse response for handoff signals
   - Extract metadata (files modified, decisions made)
4. ContextManager.createHandoff() persists conversation
5. Return ExecutionResult to user

**Multi-Agent Workflow:**

1. User request with workflow=true
2. Loop (max 5 handoffs):
   - Route current request to agent
   - Execute agent task
   - Check for handoff signal: `## HANDOFF TO: agent-name`
   - If handoff: Update context, set next agent, continue
   - If no handoff: Break loop
3. Return array of ExecutionResults

**SDLC Mission Flow:**

1. POST /api/sdlc/mission with goal
2. AutonomousTaskExecutor.launchSDLCMission()
   - Break goal into steps via Claude CLI
   - Initialize SDLC project in requirements phase
3. For each step:
   - Route to appropriate agent
   - Execute within current SDLC phase context
   - Update deliverables and metrics
4. Run quality gates for phase
5. Check phase completion criteria
6. Transition to next phase
7. Repeat until all phases complete
8. Return completed project

**State Management:**
- Projects: In-memory Map<string, Project> (lost on restart)
- Tasks: In-memory Map<string, Task> (lost on restart)
- Handoffs: Persistent markdown files
- Agent definitions: Static markdown files

## Key Abstractions

**AgentRouter:**
- Purpose: Intelligent agent selection
- Examples: `src/runtime/router.ts`
- Pattern: 3-tier routing with keyword scoring
- Methods: route(), getAgent(), getAgentsByDomain(), getStats()

**AgentExecutor:**
- Purpose: Execute agents via Claude API
- Examples: `src/runtime/executor.ts`
- Pattern: Builder pattern for system prompts, observer pattern for handoffs
- Methods: execute(), executeWorkflow()

**ContextManager:**
- Purpose: Handoff and domain context persistence
- Examples: `src/runtime/context.ts`
- Pattern: File-based state persistence (markdown)
- Methods: createHandoff(), updateDomainContext(), getDomainContext()

**SDLCOrchestrator:**
- Purpose: Project lifecycle management
- Examples: `src/sdlc/orchestrator.ts`
- Pattern: State machine (6 phases with transitions)
- Methods: startProject(), transitionPhase(), runQualityGates(), markDeliverableComplete()

**AutonomousTaskExecutor:**
- Purpose: Multi-step task automation
- Examples: `src/autonomous/task-executor.ts`
- Pattern: Task decomposition + sequential execution
- Methods: createTask(), executeTask(), launchSDLCMission()

## Entry Points

**CLI Entry:**
- Location: `src/cli/index.ts`
- Triggers: User runs `agent <command>`
- Responsibilities: Parse commands, format output, invoke router/executor
- Commands: route, exec, list, info, stats, test

**API Server Entry:**
- Location: `src/api/server.ts`
- Triggers: HTTP requests to port 3000
- Responsibilities: Route HTTP requests, validate input, invoke services
- Static files: Serves `public/` directory

**Library Entry:**
- Location: `src/index.ts`
- Triggers: Import as npm package
- Responsibilities: Export core classes for programmatic use
- Exports: AgentRouter, AgentExecutor, ContextManager

## Error Handling

**Strategy:** Try-catch at boundaries, structured JSON responses for API

**Patterns:**
- CLI: Catch errors, log with chalk.red(), exit(1)
- API: Catch errors, return JSON with success: false
- Validation: Zod schema validation with error details
- Shell execution: Catch exec errors, provide context in error message

## Cross-Cutting Concerns

**Logging:**
- Hono logger middleware for HTTP requests
- Console.log/error for application logging
- Chalk for colored CLI output
- No structured logging framework

**Validation:**
- Zod schemas at API boundaries (`src/api/server.ts`)
- Request validation for /api/route and /api/execute
- Incomplete validation for some endpoints (autonomous tasks, SDLC projects)

**Authentication:**
- None (assumes trusted environment)
- API key required only for Claude API (ANTHROPIC_API_KEY)

**File Operations:**
- fs/promises for reading agent definitions (`src/runtime/router.ts`)
- File-based context storage (`src/runtime/context.ts`)

---

*Architecture analysis: 2025-01-28*
*Update when major patterns change*
