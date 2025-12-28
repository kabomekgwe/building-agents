# Codebase Structure

**Analysis Date:** 2025-01-28

## Directory Layout

```
building-agents/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main entry, exports
│   ├── cli/               # CLI interface
│   ├── api/               # REST API server
│   ├── runtime/           # Core routing & execution
│   ├── autonomous/        # Task breakdown & orchestration
│   └── sdlc/              # SDLC project management
├── dist/                  # Compiled JavaScript output
├── public/                # Web dashboard static files
├── .claude/               # Agent definitions & context
│   ├── agents/           # Agent definitions by domain
│   └── context/          # Handoff records, domain context
├── examples/              # Example usage files
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── .env.example           # Environment variable template
```

## Directory Purposes

**src/**
- Purpose: TypeScript source code
- Contains: All application logic
- Key files: index.ts, cli/index.ts, api/server.ts
- Subdirectories: cli/, api/, runtime/, autonomous/, sdlc/

**src/cli/**
- Purpose: Command-line interface
- Contains: CLI commands and terminal UI
- Key files: `index.ts` - Commander.js setup, all CLI commands
- Commands: route, exec, list, info, stats, test

**src/api/**
- Purpose: REST API server
- Contains: Hono web server and all HTTP endpoints
- Key files: `server.ts` - Complete API implementation
- Port: 3000 (configurable)

**src/runtime/**
- Purpose: Core agent system (routing, execution, context)
- Contains: Router, Executor, ContextManager classes
- Key files:
  - `router.ts` - 3-tier agent routing
  - `executor.ts` - Claude API integration
  - `context.ts` - Handoff persistence

**src/autonomous/**
- Purpose: Multi-step task automation
- Contains: AutonomousTaskExecutor class
- Key files: `task-executor.ts` - Task breakdown and execution via Claude CLI

**src/sdlc/**
- Purpose: Software Development Life Cycle management
- Contains: Project orchestration, types, quality gates
- Key files:
  - `types.ts` - Type definitions, phase definitions, agent compatibility
  - `orchestrator.ts` - Project lifecycle management

**dist/**
- Purpose: Compiled JavaScript output
- Source: Built from `src/` via TypeScript compiler
- Committed: No (in .gitignore)

**public/**
- Purpose: Web dashboard static files
- Contains: HTML, embedded CSS/JS for UI
- Key files: `index.html` - Single-page dashboard

**.claude/agents/**
- Purpose: Agent definition files (markdown)
- Contains: 7 domains with ~28 agent definitions
- Subdirectories: engineering/, design/, marketing/, product/, testing/, project-management/, studio-operations/

**.claude/context/**
- Purpose: Runtime context storage
- Contains: Handoff records, domain context
- Subdirectories: handoffs/, domain-context/

## Key File Locations

**Entry Points:**
- `src/index.ts` - Library exports (AgentRouter, AgentExecutor, ContextManager)
- `src/cli/index.ts` - CLI entry point
- `src/api/server.ts` - API server entry point

**Configuration:**
- `tsconfig.json` - TypeScript strict mode, ES2022 target
- `package.json` - Dependencies, scripts, bin entry
- `.env.example` - Environment variable documentation

**Core Logic:**
- `src/runtime/router.ts` - Agent routing algorithm
- `src/runtime/executor.ts` - Agent execution via Claude API
- `src/autonomous/task-executor.ts` - Task orchestration
- `src/sdlc/orchestrator.ts` - SDLC project management

**Testing:**
- None currently (Vitest configured but no test files)

**Documentation:**
- `.env.example` - Environment setup guide
- Agent definitions in `.claude/agents/` are self-documenting

## Naming Conventions

**Files:**
- kebab-case.ts: All TypeScript source files
- index.ts: Main entry points for modules
- Examples: `task-executor.ts`, `router.ts`, `server.ts`

**Directories:**
- kebab-case: All directories
- Examples: `autonomous/`, `studio-operations/`

**Special Patterns:**
- `index.ts` - Module entry point and exports
- `types.ts` - Type definitions only
- `*.md` - Agent definitions and context files

## Where to Add New Code

**New CLI Command:**
- Primary code: Add to `src/cli/index.ts` (Commander command registration)
- Tests: Create `src/cli/index.test.ts` (when test infrastructure exists)

**New API Endpoint:**
- Primary code: Add route handler in `src/api/server.ts`
- Validation: Define Zod schema for request body
- Tests: Create `src/api/server.test.ts` (when test infrastructure exists)

**New Agent:**
- Implementation: Create `.claude/agents/[domain]/[agent-name].md`
- Format: Markdown with frontmatter (expertise, keywords)
- Router will auto-discover on next loadAgents() call

**New SDLC Phase:**
- Types: Add to SDLCPhase enum in `src/sdlc/types.ts`
- Definition: Add to PHASE_DEFINITIONS in `src/sdlc/types.ts`
- Compatibility: Update AGENT_PHASE_COMPATIBILITY matrix

**Utilities:**
- No separate utils/ directory yet
- Add to relevant module (e.g., router helpers in `src/runtime/router.ts`)

## Special Directories

**.claude/**
- Purpose: Agent system knowledge base and runtime state
- Source: Loaded by AgentRouter and ContextManager at runtime
- Committed: Agents should be committed, context is gitignored

**dist/**
- Purpose: Build artifacts
- Source: Auto-generated by `tsc` compiler
- Committed: No (in .gitignore)

**examples/**
- Purpose: Usage examples
- Source: Manually created demo files
- Contains: `sdlc-demo.ts` - Example SDLC project workflow

---

*Structure analysis: 2025-01-28*
*Update when directory structure changes*
