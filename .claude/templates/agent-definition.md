# [Agent Name]

[One-sentence identity statement describing who this agent is and their primary focus]

## Core Responsibilities

1. **[Responsibility Area 1]**: [Description of primary responsibility]
2. **[Responsibility Area 2]**: [Description of secondary responsibility]
3. **[Responsibility Area 3]**: [Description of tertiary responsibility]
4. **[Responsibility Area 4]**: [Description of additional responsibility]
5. **[Responsibility Area 5]**: [Description of final core responsibility]

## Tech Stack

- **Primary**: [Main tools, frameworks, platforms this agent uses]
- **Alternatives**: [Fallback or alternative tools]
- **Domain Tools**: [Specialized tools for this agent's domain]
  - [Tool 1]: [Purpose]
  - [Tool 2]: [Purpose]
  - [Tool 3]: [Purpose]

## Key Principles

### Always Apply

| Principle | Application in This Domain |
|-----------|----------------------------|
| **DRY** | [How this agent avoids duplication - specific examples] |
| **KISS** | [How this agent maintains simplicity - specific examples] |
| **YAGNI** | [How this agent avoids over-engineering - specific examples] |
| **SRP** | [How this agent maintains single responsibility - specific examples] |
| **Fail Fast** | [How this agent validates early and fails clearly] |

### Domain-Specific Principles

[2-3 principles unique to this agent's domain with concrete examples]

**Example 1**:
```[language]
// Bad: [Example of what NOT to do]
[code example]

// Good: [Example of correct approach]
[code example with explanation]
```

**Example 2**:
```[language]
// Pattern: [Name of pattern]
[code example demonstrating the pattern]
```

## Development Patterns

### Pattern 1: [Pattern Name]
[Description of when and why to use this pattern]

```[language]
[Code example demonstrating the pattern]
```

### Pattern 2: [Pattern Name]
[Description of when and why to use this pattern]

```[language]
[Code example demonstrating the pattern]
```

### Pattern 3: [Workflow/Process Pattern]
```
[Visual representation of workflow]
Step 1 → Step 2 → Step 3 → Step 4
  ↓        ↓         ↓         ↓
[What]  [What]   [What]    [What]
```

## Quality Checklists

### Pre-Implementation Checklist
Before starting work, verify:
- [ ] [Domain-specific check 1]
- [ ] [Domain-specific check 2]
- [ ] [Domain-specific check 3]
- [ ] Control Manifest exists (for Standard/Enterprise scale)
- [ ] Dependencies identified and available
- [ ] Success criteria defined

### During Implementation
While working, ensure:
- [ ] Following DRY principle (no code duplication)
- [ ] Maintaining KISS (simplest solution)
- [ ] Applying YAGNI (only required features)
- [ ] [Domain-specific quality check 1]
- [ ] [Domain-specific quality check 2]
- [ ] [Domain-specific quality check 3]

### Pre-Handoff Checklist
Before passing work to next agent:
- [ ] All tests passing (if applicable)
- [ ] Code reviewed for quality
- [ ] Documentation updated
- [ ] [Domain-specific completion check 1]
- [ ] [Domain-specific completion check 2]
- [ ] Handoff record created with full context
- [ ] Next agent tagged with clear instructions

## Collaboration Protocol

### Receives From

| Agent | Artifacts | When |
|-------|-----------|------|
| [upstream-agent-1] | [What they provide - be specific] | [Trigger condition] |
| [upstream-agent-2] | [What they provide - be specific] | [Trigger condition] |
| [upstream-agent-3] | [What they provide - be specific] | [Trigger condition] |

### Hands Off To

| Agent | Artifacts | When |
|-------|-----------|------|
| [downstream-agent-1] | [What you provide - be specific] | [Completion condition] |
| [downstream-agent-2] | [What you provide - be specific] | [Completion condition] |
| [downstream-agent-3] | [What you provide - be specific] | [Completion condition] |

### Skills to Reference

**Core Skills** (applicable to all agents):
- `DRY, KISS, YAGNI principles` - Foundation principles
- `SOLID principles` - Object-oriented design
- `Error handling patterns` - Graceful failure management
- `Testing strategies` - Quality assurance

**Domain Skills** (specific to this agent):
- `[domain]/[skill-1]` - [Brief description]
- `[domain]/[skill-2]` - [Brief description]
- `[domain]/[skill-3]` - [Brief description]

## Communication Style

**Tone**: [Professional/Technical/Creative/etc.]

**Focus Areas**:
1. [Primary focus when communicating]
2. [Secondary focus when communicating]
3. [How to present decisions and recommendations]

**Deliverables Format**:
- [What format for code deliverables]
- [What format for documentation]
- [What format for reports/analysis]

## Native Features Support

### Background Execution
**Eligible**: [Yes/No]

**When to use background mode**:
- [Scenario 1 where background execution makes sense]
- [Scenario 2 where background execution makes sense]
- [Scenario 3 where background execution makes sense]

**When NOT to use background**:
- [Scenario requiring interactive/synchronous execution]
- [Scenario requiring user input/decisions]

### Async Coordination
**Pattern**: [How this agent coordinates with other agents asynchronously]

```
[Agent 1] completes work → [This Agent] processes in background →
[Agent 2] picks up results without blocking [Agent 1]
```

### Checkpoint Strategy
**Checkpoint Frequency**: [After each major step / Every N actions / etc.]

**What to save**:
- [State element 1 to preserve]
- [State element 2 to preserve]
- [State element 3 to preserve]

**Recovery Process**: [How to resume from checkpoint if interrupted]

### Session Persistence
**Multi-day support**: [Yes/No]

**Session naming convention**: `[domain]-[agent-name]-[feature]-[phase]`

**What persists across sessions**:
- [Element 1 that persists]
- [Element 2 that persists]
- [Element 3 that persists]

### Git Handoff Protocol
**Commit message format**:
```
[type]([scope]): [description]

Agent: [this-agent-name]
Domain: [domain-name]
Feature: [feature-name if applicable]
Story: [story-ref if applicable]
Manifest: [manifest-ref if applicable]
Handoff-To: [next-agent-name]
```

**Types**: feat, fix, refactor, docs, test, chore, style

**When to commit**:
- [Checkpoint 1 - when to save progress]
- [Checkpoint 2 - when to save progress]
- [Before handing off to another agent]

---

## Domain Context Reference

This agent operates within the **[Domain Name]** domain.

**Domain Coordinator**: `agents/[domain]/_coordinator.md`
**Domain Context**: `.claude/context/domain-context/[domain]-context.md`

Always check domain context before starting work to:
- Understand active projects
- Review recent decisions
- Align with current priorities
- Follow domain-specific standards

---

## Usage Examples

### Example 1: [Common Use Case]
**User Request**: "[Example request]"

**Agent Response**:
1. [Step 1 agent takes]
2. [Step 2 agent takes]
3. [Step 3 agent takes]
4. [Deliverable produced]

### Example 2: [Edge Case]
**User Request**: "[Example edge case request]"

**Agent Response**:
1. [How agent handles unusual scenario]
2. [Clarification questions asked]
3. [Adjusted approach]
4. [Deliverable produced]

### Example 3: [Multi-Agent Workflow]
**User Request**: "[Request requiring collaboration]"

**Agent Response**:
1. Coordinate with [domain] coordinator
2. Receive [artifacts] from [upstream-agent]
3. Process and produce [deliverables]
4. Hand off to [downstream-agent] with full context

---

## Notes for Implementation

**When creating an agent from this template**:
1. Replace all `[placeholders]` with agent-specific content
2. Keep structure intact - don't remove sections
3. Adapt examples to agent's domain
4. Ensure collaboration protocol is complete
5. Verify tech stack is current (check versions)
6. Add domain-specific patterns and checklists
7. Test routing keywords in domain coordinator

**Quality bar**:
- Agent definition should be 250-300 lines
- Include 3+ code examples
- Define 3+ incoming and outgoing collaborations
- Specify at least 5 core responsibilities
- Document all quality checklists
