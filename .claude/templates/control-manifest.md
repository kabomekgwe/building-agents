# Control Manifest: [Feature Name]

**Feature**: [Feature/Story Name]
**Created**: [ISO-8601 Date]
**Owner**: [Responsible Agent/Domain]
**Status**: [Planning/Active/Complete/Archived]

---

## Overview

**Purpose**: [1-2 sentences describing what this feature does and why it's needed]

**Scope**: [What's included and what's explicitly excluded]

**Target Completion**: [Date or milestone, if known]

---

## Technology Constraints

### Required Technologies
- **[Technology 1]**: [Specific version/requirement]
  - Reason: [Why this is required]
  - Impact: [What depends on this]

- **[Technology 2]**: [Specific version/requirement]
  - Reason: [Why this is required]
  - Impact: [What depends on this]

### Prohibited Technologies
- **[Technology X]**: [Do NOT use]
  - Reason: [Why it's prohibited - technical debt, deprecation, license, etc.]
  - Alternative: [What to use instead]

### Technology Stack Summary
```
Frontend: [Framework/Version]
Backend: [Framework/Version]
Database: [Type/Version]
Cache: [Type/Version]
Auth: [Library/Version]
Deployment: [Platform/Method]
```

---

## Performance Requirements

### Response Time Targets
| Operation | Target (p95) | Critical Threshold |
|-----------|--------------|-------------------|
| [Operation 1] | [< Xms] | [Critical if > Yms] |
| [Operation 2] | [< Xms] | [Critical if > Yms] |
| [Operation 3] | [< Xms] | [Critical if > Yms] |

### Scalability Requirements
- **Concurrent Users**: [Target number]
- **Requests/Second**: [Target RPS]
- **Data Volume**: [Expected data size/growth]
- **Geographic Distribution**: [Regions to support]

### Resource Constraints
- **Bundle Size**: [Max size for frontend]
- **Memory**: [Max memory usage]
- **Database**: [Max query time, connection pool size]
- **API Rate Limits**: [Calls per minute/hour]

---

## Architecture Boundaries

### Architectural Principles
1. **[Principle 1]**: [Specific requirement]
   - Rationale: [Why this matters]
   - Validation: [How to verify compliance]

2. **[Principle 2]**: [Specific requirement]
   - Rationale: [Why this matters]
   - Validation: [How to verify compliance]

### Service Boundaries
```
[Service/Module A]
├── Responsibilities: [What it does]
├── Must NOT: [What it must NOT do]
└── Interfaces: [How others interact with it]

[Service/Module B]
├── Responsibilities: [What it does]
├── Must NOT: [What it must NOT do]
└── Interfaces: [How others interact with it]
```

### Data Flow Constraints
```
User → [Component A] → [Component B] → [Component C] → Database
         ↓              ↓              ↓
      [Cache]      [Validation]   [Transform]

Rules:
- [Component A] must validate before passing to [Component B]
- [Component B] must NOT directly access Database
- Cache invalidation is responsibility of [Component C]
```

---

## Exclusion Zones

### Files NOT to Modify
| File/Directory | Reason | Alternative |
|----------------|--------|-------------|
| [path/to/file] | [Legacy/Deprecated/Owned by other team] | [What to do instead] |
| [path/to/dir/*] | [Being refactored/Critical production code] | [What to do instead] |

### Features NOT to Implement
- ❌ **[Feature X]**: [Why not] - [Alternative approach]
- ❌ **[Feature Y]**: [Why not] - [Alternative approach]

### Patterns to Avoid
1. **[Anti-pattern 1]**: [Description]
   - Why avoid: [Specific problems it causes]
   - Instead use: [Correct pattern]

2. **[Anti-pattern 2]**: [Description]
   - Why avoid: [Specific problems it causes]
   - Instead use: [Correct pattern]

---

## Dependencies

### Upstream Dependencies
(What this feature depends on)

| Dependency | Type | Owner | Status | Impact if Delayed |
|------------|------|-------|--------|-------------------|
| [Dependency 1] | [Feature/Service/Data] | [Agent/Team] | [Ready/In Progress/Blocked] | [High/Medium/Low] |
| [Dependency 2] | [Feature/Service/Data] | [Agent/Team] | [Ready/In Progress/Blocked] | [High/Medium/Low] |

### Downstream Dependencies
(What depends on this feature)

| Dependent | Type | Owner | Impact |
|-----------|------|-------|--------|
| [Dependent 1] | [Feature/Service] | [Agent/Team] | [Blocks critical path/Nice to have] |
| [Dependent 2] | [Feature/Service] | [Agent/Team] | [Blocks critical path/Nice to have] |

### External Dependencies
- **[External Service 1]**: [API/Library/Platform]
  - Version: [Specific version required]
  - SLA: [Availability/Performance guarantees]
  - Fallback: [What happens if unavailable]

---

## Security Requirements

### Authentication & Authorization
- **Auth Method**: [OAuth2/JWT/Session/etc.]
- **User Roles**: [List of roles and permissions]
- **Protected Resources**: [What requires auth]
- **Token Management**: [Lifetime, refresh strategy, storage]

### Data Security
- **Encryption at Rest**: [Yes/No - What data]
- **Encryption in Transit**: [HTTPS/TLS version]
- **PII Handling**: [What PII is involved, how to protect it]
- **Data Retention**: [How long to keep, when to delete]

### Input Validation
- **Validation Layer**: [Where validation happens]
- **Schema**: [Zod/Yup/Other - specific schemas required]
- **Sanitization**: [XSS prevention, SQL injection prevention]
- **Rate Limiting**: [Per user/IP limits]

### Security Checklist
- [ ] All user input validated at API boundary
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output sanitization)
- [ ] CSRF tokens implemented (if stateful)
- [ ] Secrets NOT in code (environment variables)
- [ ] Sensitive data encrypted
- [ ] Least privilege access enforced
- [ ] Security headers configured

---

## Testing Requirements

### Coverage Targets
- **Unit Tests**: [Target %]
- **Integration Tests**: [Required scenarios]
- **E2E Tests**: [Critical user paths]

### Required Test Scenarios
1. **[Scenario 1]**: [Happy path]
   - Given: [Preconditions]
   - When: [Action]
   - Then: [Expected outcome]

2. **[Scenario 2]**: [Edge case]
   - Given: [Preconditions]
   - When: [Action]
   - Then: [Expected outcome]

3. **[Scenario 3]**: [Error handling]
   - Given: [Preconditions]
   - When: [Error occurs]
   - Then: [Expected error handling]

### Performance Tests
- [ ] Load test: [X concurrent users]
- [ ] Stress test: [Breaking point]
- [ ] Soak test: [Y hours sustained load]
- [ ] Spike test: [Sudden traffic increase]

---

## Quality Gates

### Pre-Implementation
- [ ] Architecture reviewed (if enterprise scale)
- [ ] Control manifest approved
- [ ] Dependencies available
- [ ] Technology stack confirmed

### During Implementation
- [ ] Code follows DRY/KISS/YAGNI principles
- [ ] All exclusion zones respected
- [ ] Performance requirements met
- [ ] Security requirements implemented
- [ ] Tests written and passing

### Pre-Merge
- [ ] Code review complete
- [ ] All tests passing (unit + integration + E2E)
- [ ] Performance benchmarks met
- [ ] Security checklist complete
- [ ] Documentation updated
- [ ] No prohibited technologies used
- [ ] Exclusion zones untouched

---

## Success Criteria

### Functional Requirements
- [ ] [Requirement 1]: [Specific measurable outcome]
- [ ] [Requirement 2]: [Specific measurable outcome]
- [ ] [Requirement 3]: [Specific measurable outcome]

### Non-Functional Requirements
- [ ] Performance targets met (see Performance Requirements above)
- [ ] Security requirements implemented (see Security Requirements above)
- [ ] Scalability requirements validated
- [ ] Documentation complete

### User Acceptance
- [ ] [User story 1]: [Acceptance criteria]
- [ ] [User story 2]: [Acceptance criteria]
- [ ] [User story 3]: [Acceptance criteria]

---

## Agents Involved

### Primary Agents
| Agent | Role | Responsibilities |
|-------|------|-----------------|
| [agent-1] | [Role] | [What they'll do] |
| [agent-2] | [Role] | [What they'll do] |
| [agent-3] | [Role] | [What they'll do] |

### Agent Handoff Sequence
```
[agent-1] (does X) →
[agent-2] (does Y) →
[agent-3] (does Z) →
Complete
```

---

## Timeline

### Phases
| Phase | Agent | Duration | Deliverables |
|-------|-------|----------|--------------|
| 1. [Phase name] | [agent] | [Est. time] | [What's delivered] |
| 2. [Phase name] | [agent] | [Est. time] | [What's delivered] |
| 3. [Phase name] | [agent] | [Est. time] | [What's delivered] |

### Milestones
- **[Milestone 1]**: [Date] - [What's achieved]
- **[Milestone 2]**: [Date] - [What's achieved]
- **[Milestone 3]**: [Date] - [What's achieved]

---

## Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| [Risk 1] | [High/Med/Low] | [High/Med/Low] | [How to mitigate] | [Agent/Team] |
| [Risk 2] | [High/Med/Low] | [High/Med/Low] | [How to mitigate] | [Agent/Team] |

---

## Notes

### Implementation Notes
- [Important detail 1]
- [Important detail 2]
- [Important detail 3]

### Known Issues
- [Known limitation 1]
- [Known limitation 2]

### Future Enhancements
- [Enhancement 1]: [Description - YAGNI, not implementing now]
- [Enhancement 2]: [Description - YAGNI, not implementing now]

---

## Approval

**Created By**: [Agent/Person]
**Reviewed By**: [Agent/Person] (if applicable)
**Approved By**: [Agent/Person] (if applicable)
**Date Approved**: [ISO-8601]

---

## Change Log

| Date | Change | Changed By | Reason |
|------|--------|------------|--------|
| [Date] | Initial creation | [Agent] | - |
| [Date] | [Change description] | [Agent] | [Why changed] |
