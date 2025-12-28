# Codebase Concerns

**Analysis Date:** 2025-01-28

## Tech Debt

**No Test Coverage:**
- Issue: Zero test files despite Vitest configured in `package.json`
- Why: Rapid prototyping phase, tests not yet written
- Impact: No safety net for refactoring, regressions go undetected
- Fix approach: Create test infrastructure, prioritize tests for core logic (router, executor, orchestrator)

**Private Field Access via String Key:**
- Issue: Direct access to private class field in `src/api/server.ts:102`
- Code: `router['agents']` to get all agents
- Why: No public API to retrieve all agents
- Impact: Breaks encapsulation, fragile if AgentRouter internals change
- Fix approach: Add public `getAllAgents()` method to AgentRouter class

**Shell Command Construction:**
- Issue: User input embedded in shell command in `src/autonomous/task-executor.ts:68-75`
- Code: `echo '${escapedPrompt}' | claude --print`
- Why: Quick integration with Claude CLI
- Impact: Potential command injection if escape is insufficient
- Fix approach: Use proper shell escaping library or direct process spawning without shell

**Hardcoded Model Name:**
- Issue: Claude model hardcoded in `src/runtime/executor.ts:49`
- Code: `model: 'claude-sonnet-4-20250514'`
- Why: Quick setup during development
- Impact: Cannot change model without code modification
- Fix approach: Use environment variable `CLAUDE_MODEL` with fallback

## Known Bugs

**Type-Unsafe Casting:**
- Symptoms: Loss of type safety with `as any` casts
- Trigger: Data transformation in `src/autonomous/task-executor.ts:146,297` and `src/sdlc/orchestrator.ts:262,271`
- Files: `src/autonomous/task-executor.ts`, `src/sdlc/orchestrator.ts`, `src/api/server.ts`
- Workaround: Code works but types are not checked
- Root cause: Complex data shapes from Claude API responses
- Fix: Add Zod schemas for runtime validation and proper type narrowing

**Missing Input Validation:**
- Symptoms: Some API endpoints accept unvalidated input
- Trigger: POST requests without Zod schema validation
- Files: `src/api/server.ts` - `/api/autonomous/tasks` endpoint
- Workaround: None (accepts any input currently)
- Root cause: Incremental API development
- Fix: Add Zod schemas for all request bodies with max length limits

**Unhandled Background Task Failures:**
- Symptoms: Background task errors only logged, not persisted
- Trigger: Task execution failure in fire-and-forget mode
- Files: `src/api/server.ts:354, 474`
- Code: `.catch(error => console.error(...))`
- Workaround: Check console logs manually
- Root cause: No persistence layer for error tracking
- Fix: Update task status on error, add retry mechanism

## Security Considerations

**Shell Injection Risk:**
- Risk: User prompts executed via shell could contain malicious commands
- Files: `src/autonomous/task-executor.ts:68-75`
- Current mitigation: Basic escape of single quotes (`replace(/'/g, "'\\''")`)
- Recommendations:
  - Use child_process.spawn() with argument array instead of shell string
  - Validate prompt length and character set
  - Consider using Claude API directly instead of CLI

**No Authentication System:**
- Risk: API endpoints have no authentication
- Files: `src/api/server.ts` - all endpoints are public
- Current mitigation: Assumes trusted environment
- Recommendations:
  - Add API key authentication for production
  - Implement rate limiting
  - Add CORS restrictions (currently allows all origins)

**Type Safety Gaps:**
- Risk: `any` types bypass TypeScript safety checks
- Files: `src/autonomous/task-executor.ts:146,297`, `src/sdlc/orchestrator.ts:262,271`
- Current mitigation: None
- Recommendations: Replace `any` with explicit types or Zod validation

## Performance Bottlenecks

**O(n) Agent Lookup:**
- Problem: Linear search for agent by name
- Files: `src/runtime/router.ts:242-244`
- Measurement: With 100+ agents, noticeable on every routing request
- Cause: Array.find() on agents array
- Improvement path: Use Map<string, Agent> for O(1) lookup

**O(p × d) Project-Deliverable Search:**
- Problem: Nested loop to find project by deliverable ID
- Files: `src/sdlc/orchestrator.ts:586-590`
- Measurement: Slow with many projects and deliverables
- Cause: No index from deliverable to project
- Improvement path: Maintain Map<deliverableId, projectId>

**No Timeout on Shell Execution:**
- Problem: Claude CLI calls can hang indefinitely
- Files: `src/autonomous/task-executor.ts:68-75`
- Measurement: Unknown (no timeout configured)
- Cause: No timeout in execAsync() call
- Improvement path: Add Promise.race() with timeout

## Fragile Areas

**Handoff Protocol Regex:**
- File: `src/runtime/executor.ts:144`
- Why fragile: Assumes exact markdown format `## HANDOFF TO: agent-name`
- Common failures: Different heading levels, case variations, extra whitespace
- Safe modification: Make regex case-insensitive and flexible on whitespace
- Test coverage: None

**SDLC Quality Gates:**
- File: `src/sdlc/orchestrator.ts:258-343`
- Why fragile: Gates check hardcoded metrics that are never updated
- Common failures: All gates based on uninitialized metrics (testCoverage always 0)
- Safe modification: Either implement metric tracking or remove unused gates
- Test coverage: None

**Task Retry Logic:**
- File: `src/autonomous/task-executor.ts:338-391`
- Why fragile: Asks Claude if retry should happen, no max retry limit
- Common failures: Infinite retry loops, failed steps never reset
- Safe modification: Add explicit retry counter, max 3 retries
- Test coverage: None

## Scaling Limits

**In-Memory Storage:**
- Current capacity: Unlimited projects/tasks in RAM
- Limit: Server restart loses all data
- Symptoms at limit: Out of memory errors with many projects
- Scaling path: Add database (PostgreSQL, SQLite) for persistence

**No Concurrency Limits:**
- Current capacity: Unlimited concurrent task executions
- Limit: Claude API rate limits, system resources
- Symptoms at limit: API rate limit errors, high memory usage
- Scaling path: Add task queue with concurrency control

## Dependencies at Risk

**No Critical Dependency Risks Detected:**
- All dependencies are actively maintained
- Versions are recent (2024-2025)
- No known major vulnerabilities

## Missing Critical Features

**Persistence Layer:**
- Problem: All data lost on server restart
- Current workaround: None (data is ephemeral)
- Blocks: Production deployment, audit trail, recovery
- Implementation complexity: Medium (add database, migration logic)

**Error Recovery:**
- Problem: No retry mechanism for failed tasks
- Current workaround: Manual re-execution
- Blocks: Reliable autonomous execution
- Implementation complexity: Low (add retry counter and logic)

**Metrics Tracking:**
- Problem: SDLC metrics (testCoverage, codeQuality, security) never updated
- Current workaround: Quality gates always use default values
- Blocks: Real quality gate enforcement
- Implementation complexity: High (integrate with testing/scanning tools)

## Test Coverage Gaps

**All Critical Code Untested:**
- What's not tested: Routing algorithm, execution logic, SDLC orchestration, task breakdown
- Risk: Regressions undetected, bugs in production
- Priority: **Critical**
- Difficulty to test: Low (unit tests straightforward)

**No Integration Tests:**
- What's not tested: End-to-end workflows, API endpoint chains
- Risk: Integration failures between components
- Priority: High
- Difficulty to test: Medium (requires test infrastructure setup)

**No E2E Tests:**
- What's not tested: Complete SDLC missions, multi-agent workflows
- Risk: User-facing workflows could break
- Priority: Medium
- Difficulty to test: Medium (requires environment setup)

---

*Concerns audit: 2025-01-28*
*Update as issues are fixed or new ones discovered*

**Overall Assessment:** Early-stage prototype with good structure but critical gaps in testing, security, and persistence. Not production-ready without addressing test coverage, authentication, and data persistence.
