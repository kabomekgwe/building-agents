# Edge Cases and Troubleshooting Guide

This document covers edge cases, known limitations, and troubleshooting steps for the multi-agent system.

## Table of Contents
1. [Edge Cases](#edge-cases)
2. [Troubleshooting Common Issues](#troubleshooting)
3. [Workarounds](#workarounds)
4. [Known Limitations](#limitations)

---

## Edge Cases

### 1. Multi-Domain Requests

**Scenario**: User request spans multiple domains

**Examples**:
- "Design and build a mobile app with TikTok integration"
  - Involves: Design, Engineering, Marketing
- "Research competitors and create marketing campaign"
  - Involves: Product, Marketing

**Current Behavior**:
- System routes to highest-scoring domain based on keyword matching
- May not capture full multi-domain intent

**Workaround**:
1. Break request into sequential steps:
   - First: "Design mobile app UI" → Design domain
   - Then: "Build mobile app" → Engineering domain
   - Finally: "Create TikTok strategy" → Marketing domain

2. Use multi-domain workflow commands:
   - `/workflows/design-to-launch` (coordinates Design → Engineering → Testing)
   - `/workflows/feature-development` (coordinates Product → Engineering → QA)
   - `/workflows/marketing-campaign` (coordinates Marketing → Design → Analytics)

**Future Enhancement**: Automatic multi-domain detection and sequential orchestration

---

### 2. Technology-Specific Requests (No Specialist)

**Scenario**: Request requires technology not covered by specialists

**Examples**:
- "Build Rust backend service" (no Rust specialist)
- "Create Elixir API" (no Elixir specialist)
- "Deploy to Kubernetes" (devops-automator covers Kubernetes, but specializes in cloud platforms)

**Current Behavior**:
- Routes to closest generalist specialist
- Agent may provide general guidance but lack deep expertise

**Workaround**:
1. Generalist agent provides architectural guidance
2. User implements with technology-specific documentation
3. Generalist agent reviews and provides feedback

**When to Add New Specialist**:
- Demand exceeds 20% of requests in domain
- Technology significantly different from existing specialists
- Clear ROI for dedicated specialist

---

### 3. Vague or Ambiguous Requests

**Scenario**: Request lacks specificity

**Examples**:
- "Help me with my project"
- "I need something built"
- "Can you assist with marketing?"

**Current Behavior**:
- Low confidence scores across all domains
- Routes to general-purpose agent
- Asks clarifying questions

**Best Practice**:
Provide specific context in requests:
- ❌ "Help with design"
- ✅ "Design user onboarding flow for mobile app"

- ❌ "Build feature"
- ✅ "Build REST API for user authentication with JWT"

- ❌ "Marketing help"
- ✅ "Create TikTok content strategy for SaaS product launch"

---

### 4. Conflicting Requirements

**Scenario**: Request contains contradictory requirements

**Examples**:
- "Build quickly but with production-grade quality"
- "Make it perfect but ship today"
- "Maximize features but minimize cost"

**Current Behavior**:
- Agent highlights trade-offs
- Asks user to prioritize (speed vs quality, features vs cost)

**Resolution Process**:
1. Agent identifies conflicting constraints
2. Presents trade-off options:
   - Option A: Quick prototype (ship in 3 days, limited features)
   - Option B: Production-ready (ship in 2 weeks, full features)
3. User selects priority
4. Agent proceeds with aligned approach

---

### 5. Out-of-Scope Requests

**Scenario**: Request outside agent expertise

**Examples**:
- "Help me with personal taxes" (no finance specialist for personal taxes)
- "Debug my hardware issue" (software-focused agents)
- "Write a novel" (content-creator focuses on marketing content, not creative fiction)

**Current Behavior**:
- Agent politely declines
- Suggests alternative resources or specialists

**Response Template**:
> "This request is outside my area of expertise. I specialize in [domain]. For [out-of-scope topic], I recommend [alternative resource or specialist]."

---

## Troubleshooting Common Issues

### Issue 1: Wrong Agent Selected

**Symptoms**:
- User requests frontend work, gets backend-architect
- User requests TikTok strategy, gets Instagram curator

**Root Causes**:
- Insufficient or ambiguous keywords in request
- Keyword overlap between specialists
- User expectation mismatch

**Troubleshooting Steps**:
1. Review request keywords:
   - Did request use specific technology names? (React, API, TikTok, etc.)
   - Were keywords generic? (build, create, help)

2. Check routing logic:
   - Read domain coordinator routing table
   - Verify specialist keywords
   - Check scoring algorithm

3. Improve request specificity:
   - ❌ "Build app"
   - ✅ "Build React frontend with Next.js for e-commerce site"

**Resolution**:
- Re-route to correct agent
- Update routing keywords if systematic issue
- Train users on effective request formulation

---

### Issue 2: Handoff Context Loss

**Symptoms**:
- Second agent doesn't have full context from first agent
- Work needs to be repeated
- Questions already answered need re-answering

**Root Causes**:
- Incomplete handoff record
- Missing artifacts (files, links, decisions)
- Handoff record not read by receiving agent

**Troubleshooting Steps**:
1. Verify handoff record exists:
   - Check `.claude/context/handoffs/` directory
   - Verify file naming: `[timestamp]-[from]-to-[to].md`

2. Check handoff completeness:
   - [ ] Work completed documented
   - [ ] Files modified listed
   - [ ] Decisions made recorded
   - [ ] Next steps for receiving agent
   - [ ] Context and artifacts provided

3. Ensure receiving agent accesses handoff:
   - Agent should read handoff record before starting
   - Verify handoff path provided to agent

**Resolution**:
- Create complete handoff record (use template)
- Explicitly pass handoff record to receiving agent
- Update handoff protocol if systematic issue

---

### Issue 3: Routing Confidence Too Low

**Symptoms**:
- Valid requests route to general-purpose agent
- "I don't understand" responses when request is clear

**Root Causes**:
- Request uses non-standard terminology
- Keywords not in routing tables
- Domain/specialist keywords too narrow

**Troubleshooting Steps**:
1. Check confidence scores:
   - All domains < 50%? → Keyword coverage gap
   - Highest score 50-70%? → Borderline match, may need clarification

2. Review routing keywords:
   - Are industry-standard terms included?
   - Are common synonyms covered?

3. Test with alternative phrasing:
   - Try using technology names (React, PostgreSQL, TikTok)
   - Use action verbs (build, design, analyze, optimize)

**Resolution**:
- Add missing keywords to routing tables
- Create keyword synonym mappings
- Update domain coordinator keyword lists

---

### Issue 4: Agent Overload (Too Many Requests)

**Symptoms**:
- Single agent receiving majority of requests
- Other specialists underutilized
- Bottleneck in one domain

**Root Causes**:
- Routing keywords too broad (matches everything)
- Actual demand concentrated in one area
- Other specialists' keywords too narrow

**Troubleshooting Steps**:
1. Analyze request distribution:
   - Count requests per agent (last 30 days)
   - Identify overloaded agents (> 40% of traffic)
   - Identify underutilized agents (< 5% of traffic)

2. Review keyword balance:
   - Overloaded agent: Keywords too generic?
   - Underutilized agent: Keywords too specific?

3. Assess actual demand:
   - Is workload distribution expected?
   - Does it reflect real user needs?

**Resolution**:
- Rebalance routing keywords
- Add sub-specialists if demand justifies
- Merge underutilized specialists if low demand
- Create domain sub-coordinators for 15+ specialists

---

## Workarounds

### Workaround 1: Manual Agent Selection

**When to Use**: Routing selects wrong agent consistently

**Steps**:
1. Bypass system coordinator
2. Directly specify domain: "Engineering domain: [request]"
3. Or specify agent: "backend-architect: [request]"

**Example**:
- Instead of: "Build API"
- Use: "Engineering → backend-architect: Build REST API for users"

---

### Workaround 2: Sequential Multi-Domain Execution

**When to Use**: Request spans multiple domains

**Steps**:
1. Break into phases:
   - Phase 1 (Design): "Design mobile app UI"
   - Phase 2 (Engineering): "Build mobile app from design"
   - Phase 3 (Testing): "Test mobile app"

2. Execute sequentially with handoffs

**Example**:
- Multi-domain request: "Design, build, and launch mobile app"
- Broken down:
  1. `/design/user-research` → UX research
  2. `/design/design-system` → UI design
  3. `/engineering/build-mobile` → Build app
  4. `/testing/test-workflow` → QA testing
  5. `/project/ship-feature` → Launch

---

### Workaround 3: Custom Slash Commands

**When to Use**: Frequently need same multi-agent workflow

**Steps**:
1. Create custom command file in `.claude/commands/custom/`
2. Define workflow with specific agent sequence
3. Use custom command for repeatable workflows

**Example**:
Create `/custom/ship-mobile-feature`:
1. Design → ui-designer (mockups)
2. Engineering → mobile-app-builder (build)
3. Testing → qa-engineer (test)
4. DevOps → devops-automator (deploy)

---

## Known Limitations

### Limitation 1: No Automatic Multi-Domain Orchestration

**Description**: System cannot automatically coordinate work across multiple domains in a single request.

**Impact**: Multi-domain requests require manual coordination or multi-domain workflow commands.

**Timeline**: Future enhancement (post-Week 9)

---

### Limitation 2: Technology-Specific Specialists Limited

**Description**: Specialists cover major technologies (React, Python, Node.js) but not all (Rust, Elixir, Go).

**Impact**: Requests for unsupported technologies route to generalists with limited expertise.

**Mitigation**:
- Generalists provide architectural guidance
- Consider adding specialist if demand ≥ 20% of domain traffic

**Timeline**: Add specialists based on demand

---

### Limitation 3: No Real-Time Collaboration Between Agents

**Description**: Agents work sequentially via handoffs, not simultaneously.

**Impact**: Cannot have two agents actively collaborating in real-time (e.g., designer and engineer pair programming).

**Mitigation**: Use studio-producer for facilitated work sessions where human mediates collaboration.

**Timeline**: Architecture limitation, not planned for current version

---

### Limitation 4: Context Window Constraints

**Description**: Very long conversations may exceed context limits.

**Impact**: Older context may be lost in extremely long sessions.

**Mitigation**:
- Create checkpoints (summaries) at major milestones
- Use handoff records to preserve critical context
- Break large projects into multiple sessions

**Timeline**: Architectural constraint

---

### Limitation 5: No Automated Quality Gates

**Description**: System doesn't automatically enforce quality checks (tests passing, code review approved) before proceeding.

**Impact**: Agents can hand off incomplete or low-quality work without validation.

**Mitigation**:
- Manual quality checks at handoff points
- Use project-shipper to enforce quality gates for production releases
- qa-engineer validates before deployment

**Timeline**: Future enhancement (automated quality gates)

---

## Escalation Paths

### When to Escalate

**Escalate to User** when:
- Agent cannot complete task (missing expertise, blocked)
- Decision required (multiple valid approaches, trade-offs)
- Conflicting requirements (prioritization needed)
- Out of scope (request outside agent capabilities)

**Escalate to System Coordinator** when:
- Routing error (wrong agent selected repeatedly)
- Multi-domain coordination needed
- Agent unavailable or overloaded

**Escalate to Documentation** when:
- Common issue not documented
- Workaround needed for frequent edge case
- New pattern or anti-pattern identified

---

## Feedback Loop

### Reporting Issues

**How to Report**:
1. Describe issue (what happened vs what was expected)
2. Provide context (request that triggered issue, agent involved)
3. Include relevant files (handoff records, routing logs)
4. Suggest improvement (if applicable)

**Where to Report**:
- GitHub Issues (if project tracked there)
- `.claude/docs/KNOWN_ISSUES.md` (update this document)
- Team Slack/Discord (for discussion)

### Continuous Improvement

**Metrics to Track**:
- Routing accuracy (% of requests routed correctly)
- Handoff completeness (% of handoffs with full context)
- User satisfaction (quality of agent responses)
- Agent utilization (balanced vs overloaded)

**Review Cadence**:
- Weekly: Review new issues
- Monthly: Analyze routing metrics, identify patterns
- Quarterly: Major improvements and specialist additions

---

## Quick Reference

### Emergency Contacts

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| Wrong routing | System Coordinator | Immediate |
| Context loss | Context Manager | Within 1 hour |
| Agent unavailable | Domain Coordinator | Within 4 hours |
| Quality issue | QA Engineer | Within 24 hours |

### Most Common Issues

1. **Vague request** → Add specific keywords (technology names, action verbs)
2. **Wrong agent** → Specify domain in request, use more specific keywords
3. **Multi-domain** → Use workflow commands or break into sequential steps
4. **Context loss** → Ensure complete handoff records, verify receiving agent reads them
5. **Unsupported tech** → Use generalist, consider adding specialist if recurring

### Helpful Commands

- `/help` - Show available commands and agents
- Check routing: Read system coordinator and domain coordinator files
- Verify specialist: Read agent file in `.claude/agents/[domain]/[specialist].md`
- Review handoffs: Check `.claude/context/handoffs/` directory
- Debug routing: Check keyword match scores, verify confidence thresholds

---

**Last Updated**: 2025-01-15
**Version**: Week 8 (Testing & Validation)
