# Coding Conventions

**Analysis Date:** 2025-01-28

## Naming Patterns

**Files:**
- kebab-case for all TypeScript files
- Examples: `task-executor.ts`, `router.ts`, `server.ts`
- Module exports: `index.ts`
- Type definitions: `types.ts`

**Functions:**
- camelCase for all functions and methods
- Examples: `loadAgents()`, `executeTask()`, `routeToDomain()`, `createHandoff()`
- Private methods: Underscore prefix `_extractMetadata()`, `_calculateScore()`
- Async functions: No special prefix (use `async` keyword)

**Variables:**
- camelCase for all variables
- Examples: `agentRouter`, `projectId`, `currentPhase`
- Constants: SCREAMING_SNAKE_CASE
- Examples: `DOMAIN_KEYWORDS`, `PHASE_DEFINITIONS`, `AGENT_PHASE_COMPATIBILITY`

**Types:**
- PascalCase for interfaces: `RoutingResult`, `Agent`, `ExecutionRequest`, `Project`
- PascalCase for type aliases: `HandoffRecord`, `DomainContext`
- PascalCase for enums: `SDLCPhase`, `QualityGateStatus`, `DeliverableStatus`
- Enum values: SCREAMING_SNAKE_CASE
  - Example: `SDLCPhase.REQUIREMENTS`, `QualityGateStatus.PASSED`

## Code Style

**Formatting:**
- 2 spaces for indentation (standard across all files)
- Unix line endings (LF)
- No trailing semicolons (inferred from code)
- Single quotes for strings (CLI), double quotes for JSON/Zod schemas

**Linting:**
- None configured (no .eslintrc, .prettierrc, biome.json)
- Code style is consistent but unenforced

## Import Organization

**Order:**
1. External packages (`@anthropic-ai/sdk`, `hono`, `zod`, `commander`)
2. Internal modules (relative imports `./router.js`, `./executor.js`)
3. Type imports (when using `import type` syntax)

**Grouping:**
- No blank lines between imports (dense grouping)
- Alphabetical within groups not enforced

**Path Aliases:**
- None configured
- All imports use relative paths (`.js` extension for ESM)

## Error Handling

**Patterns:**
- Try-catch at function boundaries
- Throw errors with descriptive messages
- API endpoints return `{ success: false, error: string }`
- Example from `src/api/server.ts`:
  ```typescript
  try {
    const result = await router.route(request);
    return c.json({ success: true, result });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
  ```

**Error Types:**
- Throw on invalid input, missing dependencies
- Zod validation errors caught separately
- Shell execution errors logged with context

## Logging

**Framework:**
- Console.log/error for application logging
- Hono logger middleware for HTTP requests
- Chalk for colored CLI output

**Patterns:**
- CLI: `chalk.green('✓')`, `chalk.red('✗')`, `chalk.blue.bold()`
- API: Hono logger automatically logs requests
- Errors: `console.error('Context:', error)`

## Comments

**When to Comment:**
- JSDoc for public methods and classes
- Inline comments for complex logic
- TODOs for incomplete implementations
- Example from `src/runtime/context.ts`:
  ```typescript
  /**
   * Manages handoff records and domain-specific context
   * Stores context in markdown files for persistence
   */
  export class ContextManager { }
  ```

**JSDoc/TSDoc:**
- Used for public API methods
- Minimal (often just function purpose, no @param/@returns)
- Example from `src/runtime/executor.ts`:
  ```typescript
  /**
   * Execute an agent task
   */
  async execute(request: ExecutionRequest): Promise<ExecutionResult>
  ```

**TODO Comments:**
- Format: `// TODO: description` or `// Simplified for now - in production...`
- No issue links
- Examples in `src/runtime/context.ts` (lines 93-99, 221-229)

## Function Design

**Size:**
- Functions vary from 10-100 lines
- Larger functions extract helper methods
- Example: `AgentRouter.route()` delegates to `_routeToDomain()` and `_routeToAgent()`

**Parameters:**
- Generally 1-4 parameters
- Options objects for complex inputs
- Example: `execute(request: ExecutionRequest)` instead of multiple params

**Return Values:**
- Explicit return types always specified
- Early returns for guard clauses
- Result objects for complex returns: `{ success: boolean, result?: T, error?: string }`

## Module Design

**Exports:**
- Named exports preferred
- No default exports
- Example from `src/index.ts`:
  ```typescript
  export { AgentRouter } from './runtime/router.js';
  export { AgentExecutor } from './runtime/executor.js';
  export { ContextManager } from './runtime/context.js';
  ```

**Barrel Files:**
- `index.ts` re-exports public API
- Used in: `src/index.ts` (main library exports)

## Type Safety

**TypeScript Usage:**
- Strict mode enabled in `tsconfig.json`
- No `any` types except in isolated cases (see CONCERNS.md)
- All functions have explicit type annotations
- Interfaces for all data structures

**Validation:**
- Zod schemas at API boundaries
- Example from `src/api/server.ts`:
  ```typescript
  const RouteRequestSchema = z.object({
    request: z.string().min(1),
    verbose: z.boolean().optional()
  });
  ```

---

*Convention analysis: 2025-01-28*
*Update when patterns change*
