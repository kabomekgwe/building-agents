# Engineering Domain Context

**Last Updated**: [ISO-8601 timestamp]
**Updated By**: engineering coordinator
**Domain**: Engineering
**Specialists**: 6 (frontend-developer, backend-architect, mobile-app-builder, ai-engineer, devops-automator, rapid-prototyper)

---

## Active Projects

| Project ID | Name | Status | Specialists Involved | Started | Target Completion |
|------------|------|--------|---------------------|---------|-------------------|
| - | - | - | - | - | - |

*No active projects yet*

---

## Recent Decisions

### Technical Decisions (Last 30 Days)

No decisions recorded yet.

<!--
Template for future decisions:

### DEC-XXX: [Decision Title]
**Date**: [ISO-8601]
**Made By**: [specialist-name]
**Impact**: [local/domain/system-wide]

**Decision**: [What was decided]
**Rationale**: [Why]
**Affects**: [Components/Projects]
-->

---

## Current Priorities

### Top 3 Priorities
1. *Not yet set*
2. *Not yet set*
3. *Not yet set*

### Upcoming Work
- *No upcoming work scheduled*

---

## Domain Standards

### Code Quality
- **TypeScript**: Strict mode enabled
- **Linting**: Biome (preferred over ESLint)
- **Formatting**: Biome
- **Testing**: Vitest for unit/integration, Playwright for E2E
- **Minimum Coverage**: 80% for critical paths

### Architecture Patterns
- **Frontend**: Component-based architecture, React Server Components where applicable
- **Backend**: Service layer pattern, dependency injection
- **API Design**: RESTful principles, OpenAPI/Swagger documentation
- **State Management**: TanStack Query for server state, Zustand/Context for client state
- **Error Handling**: Typed errors, graceful degradation

### Technology Stack
**Frontend**:
- React 19 / Next.js 15
- TypeScript 5+
- Tailwind CSS 4
- shadcn/ui components

**Backend**:
- Hono v4 on Cloudflare Workers
- Drizzle ORM
- Zod validation
- better-auth v1

**Mobile**:
- React Native (latest)
- Expo (managed workflow)

**AI/ML**:
- Vercel AI SDK 4.0
- Cloudflare AI
- OpenAI SDK / Anthropic Claude SDK

**DevOps**:
- GitHub Actions
- Cloudflare Workers/Pages
- Docker (for local dev)

---

## Specialist Utilization

### Last 30 Days

| Specialist | Tasks Completed | Current Load | Availability |
|------------|----------------|--------------|--------------|
| frontend-developer | 0 | 0% | Available |
| backend-architect | 0 | 0% | Available |
| mobile-app-builder | 0 | 0% | Available |
| ai-engineer | 0 | 0% | Available |
| devops-automator | 0 | 0% | Available |
| rapid-prototyper | 0 | 0% | Available |

---

## Common Patterns

### Established Patterns in This Domain

*No patterns established yet - will be populated as work progresses*

<!--
Template for future patterns:

### Pattern: [Pattern Name]
**Used In**: [Projects/Components]
**When to Use**: [Scenarios]
**Example**:
```[language]
[code example]
```
-->

---

## Cross-Domain Collaboration

### Recent Handoffs FROM Other Domains

*No handoffs received yet*

### Recent Handoffs TO Other Domains

*No handoffs sent yet*

---

## Known Issues

*No known issues currently*

<!--
Template for issues:

### Issue: [Issue Title]
**Severity**: [Critical/High/Medium/Low]
**Affected**: [Components/Projects]
**Workaround**: [If any]
**Status**: [Open/In Progress/Resolved]
-->

---

## Domain Metrics

### Performance
- **Average API Response Time**: N/A
- **Build Time**: N/A
- **Test Suite Duration**: N/A
- **Deployment Frequency**: N/A

### Quality
- **Test Coverage**: N/A
- **Code Review Turnaround**: N/A
- **Bug Rate**: N/A
- **Technical Debt**: N/A

---

## Notes

This context file is maintained by the engineering domain coordinator and updated after each specialist completes work.

**Update Protocol**:
1. Specialist completes work
2. Domain coordinator reviews deliverables
3. Extract key decisions → add to "Recent Decisions"
4. Update project status → update "Active Projects"
5. Record any new patterns → add to "Common Patterns"
6. Update specialist utilization
7. Save context file
