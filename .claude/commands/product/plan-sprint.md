# Plan Sprint

I need you to plan a sprint and prioritize the backlog for the next iteration.

## Context

**Sprint Duration**: 2 weeks (default)

**Team Capacity**: $ARGUMENTS

(Examples: "5 developers, 40 hours each", "Team of 3, half capacity due to holidays", "Full team available")

## Your Task

Route this to the **sprint-prioritizer** agent who will:

1. **Gather Context**:
   - Review backlog items (user stories, bugs, tech debt)
   - Understand team capacity and velocity
   - Identify dependencies and blockers
   - Review previous sprint outcomes

2. **Prioritize Backlog** (RICE Framework):
   - **Reach**: How many users affected? (1-10 scale)
   - **Impact**: How much does it move key metrics? (Massive=3, High=2, Medium=1, Low=0.5, Minimal=0.25)
   - **Confidence**: How certain are we? (High=100%, Medium=80%, Low=50%)
   - **Effort**: Story points (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
   - **RICE Score**: (Reach × Impact × Confidence) / Effort

3. **Sprint Planning**:
   - Define sprint goal (1-2 sentences, customer-focused)
   - Select top-priority items fitting team capacity
   - Break down large stories (> 8 points)
   - Identify risks and mitigation strategies
   - Plan daily standup format

4. **Create Sprint Backlog**:
   - Selected user stories with acceptance criteria
   - Tasks broken down (< 1 day each)
   - Assigned to team members (or unassigned)
   - Dependencies mapped
   - Definition of Done verified

5. **Plan Ceremonies**:
   - Sprint kickoff meeting agenda
   - Daily standup format (What did you do? What will you do? Any blockers?)
   - Sprint review demo plan
   - Retrospective format (Start, Stop, Continue)

## Deliverables

- Sprint goal statement
- Prioritized sprint backlog (ranked by RICE score)
- Capacity allocation (per team member)
- Risk register with mitigation plans
- Sprint calendar (ceremonies scheduled)

## User Story Template

```markdown
**As a** [user type]
**I want** [goal]
**So that** [benefit]

**Acceptance Criteria**:
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

**Story Points**: [Fibonacci number]
**Priority**: [RICE score]
**Dependencies**: [Other stories or systems]
```

## Sprint Health Metrics

**Velocity Tracking**:
- Last 3 sprints average: [points completed]
- Current sprint capacity: [team capacity × velocity]
- Stretch goals: 10-20% above capacity

**Quality Gates**:
- All stories have acceptance criteria
- No story > 8 points (split if larger)
- Tech debt ≤ 20% of sprint
- Dependencies identified and resolved

**Risk Indicators**:
- 🔴 High: Unclear requirements, external dependencies, new technology
- 🟡 Medium: Tight timeline, partial team availability
- 🟢 Low: Well-understood work, full team, no blockers

**Route to**: System Coordinator → Product Coordinator → sprint-prioritizer
