# Handoff: [from-agent] → [to-agent]

**Workflow**: [workflow-name or feature-name]
**Date**: [ISO-8601 timestamp]
**From Agent**: [full-agent-name with domain]
**To Agent**: [full-agent-name with domain]
**Domain Transition**: [from-domain] → [to-domain] (if crossing domains)
**Handoff ID**: [unique-id, e.g., HO-001]

---

## Work Completed

### Summary
[1-2 sentence summary of what was accomplished by the originating agent]

### Detailed Deliverables
1. **[Deliverable 1 Name]**:
   - Type: [file/document/decision/configuration/artifact]
   - Location: [absolute path or URL]
   - Status: [complete/partial/requires-review]
   - Description: [What this deliverable provides]

2. **[Deliverable 2 Name]**:
   - Type: [file/document/decision/configuration/artifact]
   - Location: [absolute path or URL]
   - Status: [complete/partial/requires-review]
   - Description: [What this deliverable provides]

3. **[Deliverable 3 Name]**:
   - Type: [file/document/decision/configuration/artifact]
   - Location: [absolute path or URL]
   - Status: [complete/partial/requires-review]
   - Description: [What this deliverable provides]

---

## Files Modified

| File Path | Action | Lines Changed | Description of Changes |
|-----------|--------|---------------|------------------------|
| [absolute/path/to/file1.ext] | [created/modified/deleted] | [+X/-Y] | [Brief description of what changed] |
| [absolute/path/to/file2.ext] | [created/modified/deleted] | [+X/-Y] | [Brief description of what changed] |
| [absolute/path/to/file3.ext] | [created/modified/deleted] | [+X/-Y] | [Brief description of what changed] |

### File Locations Quick Reference
```
# New files created:
[path/to/new-file-1]
[path/to/new-file-2]

# Modified files:
[path/to/modified-file-1]
[path/to/modified-file-2]

# Files to review:
[path/to/file-needing-review]
```

---

## Decisions Made

### Decision 1: [Decision Title]
**ID**: DEC-[unique-id]
**Context**: [Why this decision was needed - what problem it solves]

**Decision**: [What was decided - be specific and actionable]

**Rationale**: [Why this approach was chosen over alternatives]

**Alternatives Considered**:
1. [Alternative 1]: [Why not chosen]
2. [Alternative 2]: [Why not chosen]
3. [Alternative 3]: [Why not chosen]

**Impact**:
- **Scope**: [local/domain/system-wide]
- **Affects**: [What components/teams/users are impacted]
- **Reversibility**: [easy/moderate/hard/irreversible]
- **Dependencies**: [What depends on this decision]

**Documented In**: [Link to ADR or decision log if applicable]

---

### Decision 2: [Decision Title]
[Same structure as Decision 1]

---

## Context for [to-agent]

### Critical Information
[Most important things the next agent MUST know - top 3-5 items]

1. **[Critical Point 1]**: [Explanation]
2. **[Critical Point 2]**: [Explanation]
3. **[Critical Point 3]**: [Explanation]
4. **[Critical Point 4]**: [Explanation]
5. **[Critical Point 5]**: [Explanation]

### Technical Context
**Technology Stack Used**:
- [Technology 1]: [Version/Configuration]
- [Technology 2]: [Version/Configuration]
- [Technology 3]: [Version/Configuration]

**Patterns Applied**:
- [Pattern 1]: [Where/Why used]
- [Pattern 2]: [Where/Why used]

**Standards Followed**:
- [Standard 1]: [How applied]
- [Standard 2]: [How applied]

### Domain Context
**From [from-domain] perspective**:
- [Domain-specific context 1]
- [Domain-specific context 2]
- [Domain-specific context 3]

**For [to-domain] perspective**:
- [What [to-domain] needs to know about [from-domain]'s work]
- [Domain terminology translations if needed]
- [Domain-specific constraints to be aware of]

---

## Dependencies

### Upstream Dependencies
(What the previous agent's work depended on)

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| [Dependency 1] | [Feature/Service/Data] | [Complete/Partial/Blocked] | [Important notes] |
| [Dependency 2] | [Feature/Service/Data] | [Complete/Partial/Blocked] | [Important notes] |

### Downstream Dependencies
(What the next agent's work will depend on)

| Dependency | Provided By | Status | Notes |
|------------|-------------|--------|-------|
| [Dependency 1] | [from-agent deliverables] | [Ready/Needs review] | [Important notes] |
| [Dependency 2] | [from-agent deliverables] | [Ready/Needs review] | [Important notes] |

### External Dependencies
- **[External System 1]**: [Status, any issues encountered]
- **[External System 2]**: [Status, any issues encountered]

---

## Constraints

### Technical Constraints
- [Constraint 1]: [Specific technical limitation or requirement]
- [Constraint 2]: [Specific technical limitation or requirement]
- [Constraint 3]: [Specific technical limitation or requirement]

### Resource Constraints
- **Time**: [Time constraints if any]
- **Budget**: [Budget constraints if any]
- **Infrastructure**: [Infrastructure limitations if any]

### Architectural Constraints
- [Architectural boundary 1 that must be respected]
- [Architectural boundary 2 that must be respected]
- [Pattern 1 that must be followed]

### Exclusion Zones
Files/areas the next agent should NOT modify:
- `[path/to/excluded-file-1]` - Reason: [Why]
- `[path/to/excluded-dir/*]` - Reason: [Why]

---

## Success Criteria for [to-agent]

### Functional Success Criteria
The next agent's work will be considered complete when:

- [ ] [Specific outcome 1] - [How to verify]
- [ ] [Specific outcome 2] - [How to verify]
- [ ] [Specific outcome 3] - [How to verify]
- [ ] [Specific outcome 4] - [How to verify]

### Quality Gates
Before marking work complete, verify:

- [ ] [Quality check 1 specific to next agent's domain]
- [ ] [Quality check 2 specific to next agent's domain]
- [ ] [Quality check 3 specific to next agent's domain]
- [ ] All tests passing
- [ ] Performance requirements met
- [ ] Security requirements satisfied
- [ ] Documentation updated

### Performance Targets
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]
- [Metric 3]: [Target value]

---

## Artifacts

### Artifact 1: [Artifact Name]
- **ID**: ART-[unique-id]
- **Type**: [design/code/documentation/configuration/data]
- **Format**: [file format - .tsx, .md, .json, etc.]
- **Location**: [absolute path or URL]
- **Version**: [version number if applicable]
- **Created Date**: [ISO-8601]
- **Size**: [file size if relevant]

**Purpose**: [What this artifact is for]

**Usage Instructions for [to-agent]**:
1. [Step 1 on how to use this artifact]
2. [Step 2 on how to use this artifact]
3. [Step 3 on how to use this artifact]

**Dependencies**: [What this artifact depends on]

**Validates Against**: [Schema/Contract if applicable]

---

### Artifact 2: [Artifact Name]
[Same structure as Artifact 1]

---

## Next Steps for [to-agent]

### Immediate Actions (Start Here)
1. **[Action 1]**: [Specific task with clear completion criteria]
   - Why: [Purpose of this action]
   - Input: [What you need to complete this]
   - Output: [What this produces]

2. **[Action 2]**: [Specific task with clear completion criteria]
   - Why: [Purpose of this action]
   - Input: [What you need to complete this]
   - Output: [What this produces]

3. **[Action 3]**: [Specific task with clear completion criteria]
   - Why: [Purpose of this action]
   - Input: [What you need to complete this]
   - Output: [What this produces]

### Subsequent Actions
4. [Action 4]: [Description]
5. [Action 5]: [Description]
6. [Action 6]: [Description]

### Open Questions / Decision Points
Questions the next agent needs to answer or decisions to make:

- ❓ **[Question 1]**: [Context and why this needs answering]
  - Option A: [Pros/Cons]
  - Option B: [Pros/Cons]
  - Recommendation: [If any]

- ❓ **[Question 2]**: [Context and why this needs answering]
  - Option A: [Pros/Cons]
  - Option B: [Pros/Cons]
  - Recommendation: [If any]

---

## Testing Notes

### Tests Completed by [from-agent]
- [Test type 1]: [Status - Passing/Failing/Partial]
- [Test type 2]: [Status - Passing/Failing/Partial]
- [Test type 3]: [Status - Passing/Failing/Partial]

### Tests Needed by [to-agent]
- [ ] [Test type 1]: [What needs to be tested]
- [ ] [Test type 2]: [What needs to be tested]
- [ ] [Test type 3]: [What needs to be tested]

### Known Issues
- ⚠️ **[Issue 1]**: [Description]
  - Impact: [High/Medium/Low]
  - Workaround: [If any]
  - Needs: [What's needed to resolve]

- ⚠️ **[Issue 2]**: [Description]
  - Impact: [High/Medium/Low]
  - Workaround: [If any]
  - Needs: [What's needed to resolve]

---

## Domain Context Updates

### [from-domain] Context Updated
The following was updated in [from-domain] domain context:

- [Update 1]: [What changed in domain context]
- [Update 2]: [What changed in domain context]
- [Update 3]: [What changed in domain context]

**Location**: `.claude/context/domain-context/[from-domain]-context.md`

### [to-domain] Context to Update
The [to-agent] should update [to-domain] context upon completion:

- [What should be recorded in domain context when work completes]
- [Important patterns established]
- [Decisions that affect domain]

**Location**: `.claude/context/domain-context/[to-domain]-context.md`

---

## Workflow Status

### Overall Workflow Progress
**Workflow**: [workflow-name]
**Total Phases**: [X]
**Completed Phases**: [Y]
**Current Phase**: [phase-name]
**Next Phase**: [phase-name]
**Estimated Completion**: [date if known]

### Phase Status
- ✅ Phase 1: [name] ([agent]) - Complete
- ✅ Phase 2: [name] ([agent]) - Complete
- ✅ Phase 3: [name] ([agent]) - Complete ← [from-agent] just completed
- 🔄 Phase 4: [name] ([agent]) - IN PROGRESS ← [to-agent] starting now
- ⏸️ Phase 5: [name] ([agent]) - Pending

### Workflow Timeline
- Started: [ISO-8601]
- [from-agent] completed: [ISO-8601]
- [to-agent] starting: [ISO-8601]
- Target completion: [ISO-8601]

---

## Risk Flags

### Current Risks
[Any risks or blockers identified during the previous agent's work]

- ⚠️ **[Risk 1]**: [Description]
  - Probability: [High/Medium/Low]
  - Impact: [High/Medium/Low]
  - Mitigation: [Proposed approach]

- ⚠️ **[Risk 2]**: [Description]
  - Probability: [High/Medium/Low]
  - Impact: [High/Medium/Low]
  - Mitigation: [Proposed approach]

### Blockers
[Critical blockers that could prevent next agent from proceeding]

- 🚫 **[Blocker 1]**: [Description]
  - Severity: [Critical/High/Medium/Low]
  - Owner: [Who can unblock]
  - ETA to Resolve: [When it might be resolved]

---

## Communication & Collaboration

### Who to Contact
- **[Role/Agent 1]**: [When to contact and about what]
- **[Role/Agent 2]**: [When to contact and about what]
- **[Role/Agent 3]**: [When to contact and about what]

### Recommended Collaboration
- [to-agent] should coordinate with [other-agent] on [specific aspect]
- Consider parallel work with [other-agent] on [specific aspect]

### Escalation Path
If [to-agent] encounters issues:
1. Check [resource/documentation]
2. Consult [agent/team]
3. Escalate to [domain-coordinator/system-coordinator]

---

## Metadata

### Handoff Quality
**Completeness Score**: [0-100%]
- Work Summary: [Complete/Incomplete]
- Files Documented: [Complete/Incomplete]
- Decisions Recorded: [Complete/Incomplete]
- Context Provided: [Complete/Incomplete]
- Artifacts Attached: [Complete/Incomplete]
- Next Steps Defined: [Complete/Incomplete]

**Reviewed By**: [context-manager]
**Approved**: [Yes/No]

### Workflow References
- **Control Manifest**: [path-to-control-manifest.md] (if applicable)
- **Related Handoffs**: [List of related handoff records]
- **Parent Workflow**: [workflow-id if part of larger workflow]
- **Decision Log**: `.claude/context/decision-log.md` (DEC-[ids])
- **Artifact Registry**: `.claude/context/artifact-registry.md` (ART-[ids])

### Timestamps
- **Work Started by [from-agent]**: [ISO-8601]
- **Work Completed by [from-agent]**: [ISO-8601]
- **Handoff Created**: [ISO-8601]
- **Handoff to [to-agent]**: [ISO-8601]

---

## Validation Checklist

Before finalizing this handoff, verify:

- [ ] All deliverables listed and located
- [ ] All files modified documented
- [ ] All decisions recorded with rationale
- [ ] Critical context points provided (5+)
- [ ] Dependencies identified (upstream and downstream)
- [ ] Constraints documented
- [ ] Success criteria defined
- [ ] Artifacts attached with usage instructions
- [ ] Next steps specific and actionable (3+)
- [ ] Open questions identified
- [ ] Domain contexts updated
- [ ] Workflow status current
- [ ] Risks and blockers flagged
- [ ] Contact information provided
- [ ] Completeness score ≥ 85%

**Validation Result**: [Pass/Fail]
**Validated By**: [context-manager]
**Validation Date**: [ISO-8601]

---

## Notes

### Additional Context
[Any additional context that doesn't fit in structured sections above but is important for the next agent to know]

### Lessons Learned
[from-agent] observations:
- [Lesson 1]: [What worked well or didn't work]
- [Lesson 2]: [What worked well or didn't work]

### Recommendations for [to-agent]
- [Recommendation 1]: [Specific advice based on experience]
- [Recommendation 2]: [Specific advice based on experience]
