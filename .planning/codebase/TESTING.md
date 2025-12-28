# Testing Patterns

**Analysis Date:** 2025-01-28

## Test Framework

**Runner:**
- Vitest 2.1.8 (configured in `package.json`, no tests yet)
- Config: None (no vitest.config.ts)

**Assertion Library:**
- Vitest built-in expect (when tests are written)

**Run Commands:**
```bash
npm test                              # Run all tests (currently none)
```

## Test File Organization

**Location:**
- No test files currently exist
- Recommended: `src/**/*.test.ts` (co-located with source)

**Naming:**
- When created: `module-name.test.ts`
- Examples would be: `router.test.ts`, `executor.test.ts`, `orchestrator.test.ts`

**Structure:**
```
src/
  runtime/
    router.ts
    router.test.ts          # To be created
  sdlc/
    orchestrator.ts
    orchestrator.test.ts    # To be created
```

## Test Structure

**Not Yet Implemented:**
- No test files exist
- Framework configured but unused
- Test coverage: 0%

**Recommended Pattern:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { AgentRouter } from './router.js';

describe('AgentRouter', () => {
  let router: AgentRouter;

  beforeEach(async () => {
    router = new AgentRouter();
    await router.loadAgents();
  });

  describe('route()', () => {
    it('should route to engineering domain for code requests', () => {
      const result = router.route('Build a REST API');
      expect(result.domain).toBe('engineering');
    });
  });
});
```

## Mocking

**Framework:**
- Vitest vi (when tests are written)
- No mocks currently defined

**What Should Be Mocked:**
- Claude API calls (@anthropic-ai/sdk)
- File system operations (fs/promises)
- Shell execution (child_process - prefer execFile over exec for security)
- Environment variables (process.env)

## Fixtures and Factories

**Test Data:**
- None currently defined

**Recommended:**
```typescript
// Factory functions for test data
function createTestAgent(overrides?: Partial<Agent>): Agent {
  return {
    name: 'test-agent',
    domain: 'engineering',
    keywords: ['test', 'example'],
    path: '.claude/agents/test/test-agent.md',
    ...overrides
  };
}
```

## Coverage

**Requirements:**
- No coverage requirements currently set
- Recommended: Minimum 60-80% for production readiness

**Configuration:**
- None (no coverage thresholds)

**View Coverage:**
```bash
npm run test:coverage  # Not yet configured
```

## Test Types

**Unit Tests (Priority):**
- Router keyword extraction and scoring
- Executor handoff detection
- SDLC phase transition logic
- Task breakdown parsing

**Integration Tests (Needed):**
- Router → Executor workflow
- SDLC orchestration end-to-end
- API endpoint chains
- Autonomous task execution

**E2E Tests:**
- Full SDLC mission completion
- Multi-agent workflow
- CLI command execution

## Current Testing Status

**Test Coverage: 0%**
- Zero test files in codebase
- Vitest configured but unused
- Critical business logic untested:
  - Agent routing algorithm (`src/runtime/router.ts`)
  - Claude API integration (`src/runtime/executor.ts`)
  - SDLC orchestration (`src/sdlc/orchestrator.ts`)
  - Task execution (`src/autonomous/task-executor.ts`)

**Priority Test Areas:**
1. **AgentRouter.route()** - Routing algorithm correctness
2. **AgentExecutor.execute()** - Handoff detection, metadata extraction
3. **SDLCOrchestrator.transitionPhase()** - Phase transition logic
4. **AutonomousTaskExecutor.breakDownTask()** - Task parsing
5. **API validation** - Zod schema validation

## Common Patterns (Recommended)

**Async Testing:**
```typescript
it('should execute agent task', async () => {
  const result = await executor.execute(request);
  expect(result.success).toBe(true);
});
```

**Error Testing:**
```typescript
it('should throw on invalid agent', () => {
  expect(() => router.getAgent('nonexistent')).toThrow('Agent not found');
});
```

**Mocking Claude API:**
```typescript
import { vi } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ text: 'Mocked response' }]
      })
    }
  }))
}));
```

---

*Testing analysis: 2025-01-28*
*Update when test infrastructure is added*

**Note:** This project currently has NO tests. Testing infrastructure should be a top priority before production deployment.
