# Multi-Agent System Testing Guide

This guide documents how to test the multi-agent system to ensure routing, handoffs, and workflows function correctly.

## Testing Strategy

### Test Pyramid
- **Unit Tests**: Agent routing logic, keyword matching (70%)
- **Integration Tests**: Multi-agent handoffs, context preservation (20%)
- **E2E Tests**: Complete workflows from user request to completion (10%)

### Test Coverage Goals
- All 46 agents have verified routing keywords
- All 7 domain coordinators route correctly
- All 23 slash commands execute successfully
- All 3 multi-domain workflows complete end-to-end

---

## 1. Routing Logic Tests

### System Coordinator Routing

**Test Cases**:

| Test ID | Input Keywords | Expected Domain | Expected Agent |
|---------|---------------|-----------------|----------------|
| R-001 | "build API endpoint" | engineering | backend-architect |
| R-002 | "design landing page" | design | ui-designer |
| R-003 | "TikTok strategy" | marketing | tiktok-strategist |
| R-004 | "plan sprint" | product | sprint-prioritizer |
| R-005 | "ship feature" | project-management | project-shipper |
| R-006 | "handle support ticket" | studio-operations | support-responder |
| R-007 | "test workflow" | testing | workflow-optimizer |

**Test Procedure**:
1. Read `.claude/agents/_core/system-coordinator.md`
2. Verify routing table contains all 7 domains
3. Test keyword scoring algorithm:
   - Exact match: +10 points
   - Partial match: +5 points
   - Context bonus: +3 points
4. Verify highest-scoring domain is selected

**Expected Results**:
- ✅ All domain keywords recognized
- ✅ Scoring algorithm correctly prioritizes domains
- ✅ Fallback to general-purpose when confidence < 50%

---

### Domain Coordinator Routing

**Engineering Domain Tests**:

| Test ID | Input Keywords | Expected Specialist |
|---------|---------------|---------------------|
| E-001 | "React component" | frontend-developer |
| E-002 | "REST API, database" | backend-architect |
| E-003 | "iOS app, Swift" | mobile-app-builder |
| E-004 | "LLM integration" | ai-engineer |
| E-005 | "CI/CD pipeline" | devops-automator |
| E-006 | "quick prototype" | rapid-prototyper |

**Marketing Domain Tests**:

| Test ID | Input Keywords | Expected Specialist |
|---------|---------------|---------------------|
| M-001 | "TikTok viral strategy" | tiktok-strategist |
| M-002 | "Instagram Reels" | instagram-curator |
| M-003 | "Twitter engagement" | twitter-engager |
| M-004 | "Reddit community" | reddit-community-builder |
| M-005 | "App Store ranking" | app-store-optimizer |
| M-006 | "blog post, SEO" | content-creator |
| M-007 | "A/B test, conversion" | growth-hacker |

**Design Domain Tests**:

| Test ID | Input Keywords | Expected Specialist |
|---------|---------------|---------------------|
| D-001 | "design system, components" | ui-designer |
| D-002 | "user research, interviews" | ux-researcher |
| D-003 | "brand guidelines" | brand-guardian |
| D-004 | "infographic, visual story" | visual-storyteller |
| D-005 | "playful, delightful UI" | whimsy-injector |

**Test Procedure** (for each domain):
1. Read domain coordinator file (e.g., `.claude/agents/engineering/_coordinator.md`)
2. Verify routing table completeness (all specialists listed)
3. Test keyword matching for each specialist
4. Verify scoring and selection logic

**Expected Results**:
- ✅ All specialists have unique routing keywords
- ✅ No keyword conflicts (same keyword routing to multiple specialists)
- ✅ Confidence thresholds prevent incorrect routing

---

## 2. Agent Selection Validation

### Keyword Coverage Test

**Test Procedure**:
1. Extract all routing keywords from all 46 agent files
2. Verify no duplicate keywords across specialists in same domain
3. Ensure common use cases covered by keywords

**Test Script** (conceptual):
```bash
# Extract keywords from all agents
grep -r "Keywords:" .claude/agents/

# Check for duplicates within domains
# Verify common use cases have routing keywords
```

**Expected Results**:
- ✅ No duplicate specialist keywords within domain
- ✅ Common use cases covered (React, API, database, design, TikTok, etc.)
- ✅ All 37 specialists have at least 3 routing keywords

---

### Agent Metadata Validation

**Test Cases**:

| Agent File | Has Identity | Has Responsibilities | Has Tech Stack | Has Collaboration |
|------------|--------------|---------------------|----------------|-------------------|
| frontend-developer.md | ✅ | ✅ | ✅ | ✅ |
| backend-architect.md | ✅ | ✅ | ✅ | ✅ |
| ... (all 37) | ✅ | ✅ | ✅ | ✅ |

**Test Procedure**:
1. Read each agent file
2. Verify presence of required sections:
   - Identity statement (1-2 sentences)
   - Core Responsibilities (4-5 bullet points)
   - Tech Stack (tools and frameworks)
   - Collaboration Protocol (handoffs)

**Expected Results**:
- ✅ All 37 specialist agents have complete metadata
- ✅ All 7 domain coordinators have complete routing tables
- ✅ All agents follow standardized template structure

---

## 3. Handoff Protocol Tests

### Context Preservation Test

**Test Scenario**: Backend → Frontend Handoff

**Test Procedure**:
1. Simulate backend-architect completing API design
2. Create handoff record with:
   - Work completed (API endpoints designed)
   - Files modified (api/routes.ts, db/schema.ts)
   - Decisions made (using JWT auth, PostgreSQL)
   - Next steps for frontend-developer
3. Verify frontend-developer receives full context

**Expected Handoff Record**:
```markdown
# Handoff: backend-architect → frontend-developer

**Date**: 2025-01-15
**Feature**: User Authentication

## Work Completed
- Designed REST API endpoints: /auth/login, /auth/logout, /auth/refresh
- Created database schema: users, sessions tables
- Implemented token validation middleware

## Files Modified
- src/api/auth/routes.ts (new)
- src/api/auth/middleware.ts (new)
- db/schema/auth.ts (new)

## Decisions Made
- Using JWT with 15-minute access tokens
- Refresh tokens stored in Redis
- Rate limiting: 5 login attempts / 15 minutes

## Next Steps
Frontend needs to:
1. Build login form component
2. Implement token storage (localStorage)
3. Add auth headers to API calls
4. Handle token refresh logic

## Context
API expects:
- POST /auth/login: { email, password }
- Returns: { accessToken, refreshToken, user }
- Authorization header: "Bearer {accessToken}"
```

**Expected Results**:
- ✅ Handoff record contains complete context (work done, decisions, next steps)
- ✅ No information loss between agents
- ✅ Receiving agent can continue work without additional questions

---

### Multi-Agent Handoff Chain Test

**Test Scenario**: Design → Engineering → QA → DevOps

**Test Procedure**:
1. ui-designer creates mockups → hands off to frontend-developer
2. frontend-developer builds components → hands off to qa-engineer
3. qa-engineer tests → hands off to devops-automator
4. devops-automator deploys

**Validation Points**:
- [ ] Design handoff includes: Figma link, component specs, responsive breakpoints
- [ ] Engineering handoff includes: Code merged, staging deployed, test accounts
- [ ] QA handoff includes: All tests passing, bug reports, sign-off
- [ ] DevOps handoff includes: Deployment complete, monitoring active

**Expected Results**:
- ✅ Each handoff contains necessary artifacts
- ✅ Context preserved across 4 agents
- ✅ Final output meets original design intent

---

## 4. End-to-End Workflow Tests

### E2E Test 1: `/engineering/build-feature` Workflow

**Test Scenario**: Build user authentication feature

**Workflow Steps**:
1. User requests: `/engineering/build-feature User login with email and password`
2. System routes to: System Coordinator → Engineering Coordinator → Multiple specialists
3. Expected agent sequence:
   - backend-architect: API design
   - frontend-developer: Login UI
   - qa-engineer: Testing
   - devops-automator: Deployment

**Success Criteria**:
- ✅ Correct agents selected in sequence
- ✅ Handoffs contain complete context
- ✅ Final deliverable matches requirements

---

### E2E Test 2: `/marketing/launch-campaign` Workflow

**Test Scenario**: Launch product on TikTok and Instagram

**Workflow Steps**:
1. User requests: `/marketing/launch-campaign Product launch for AI writing tool`
2. System routes to: System Coordinator → Marketing Coordinator → Multiple specialists
3. Expected agent sequence:
   - content-creator: Campaign strategy
   - tiktok-strategist: TikTok content plan
   - instagram-curator: Instagram content plan
   - analytics-reporter: Performance tracking

**Success Criteria**:
- ✅ Campaign strategy defined
- ✅ Platform-specific content created
- ✅ Analytics tracking configured
- ✅ Content calendar populated

---

### E2E Test 3: `/project/ship-feature` Workflow

**Test Scenario**: Ship complete feature from planning to production

**Workflow Steps**:
1. User requests: `/project/ship-feature Dark mode toggle`
2. System routes to: System Coordinator → Project Management Coordinator → project-shipper
3. Expected orchestration:
   - Coordinates across Design, Engineering, Testing
   - Manages timeline and dependencies
   - Ensures quality gates passed
   - Deploys to production

**Success Criteria**:
- ✅ All phases completed (design, build, test, deploy)
- ✅ Quality gates passed (tests, performance, accessibility)
- ✅ Feature deployed to production successfully

---

## 5. Slash Command Validation

### Command Routing Tests

| Command | Expected Domain | Expected Agent |
|---------|----------------|----------------|
| `/engineering/build-api` | Engineering | backend-architect |
| `/product/research-trends` | Product | trend-researcher |
| `/marketing/tiktok-strategy` | Marketing | tiktok-strategist |
| `/design/user-research` | Design | ux-researcher |
| `/project/track-experiment` | Project Management | experiment-tracker |
| `/operations/analytics-report` | Studio Operations | analytics-reporter |
| `/testing/benchmark-performance` | Testing | performance-benchmarker |

**Test Procedure**:
1. Read each slash command file
2. Verify routing path documented
3. Test argument parsing ($ARGUMENTS)
4. Verify deliverables specified

**Expected Results**:
- ✅ All 23 commands have clear routing
- ✅ Arguments passed correctly to agents
- ✅ Deliverables clearly specified

---

## 6. Performance Benchmarks

### Routing Performance

**Metrics to Measure**:
- Time to select domain (target: < 100ms)
- Time to select specialist (target: < 50ms)
- Total routing time (target: < 150ms)

**Test Procedure**:
1. Measure keyword matching algorithm performance
2. Test with 100 sample requests
3. Calculate p50, p95, p99 latency

**Expected Results**:
- ✅ p95 routing time < 150ms
- ✅ No timeout errors
- ✅ Routing accuracy > 95%

---

### Context Preservation Performance

**Metrics to Measure**:
- Handoff record creation time (target: < 200ms)
- Handoff record retrieval time (target: < 100ms)
- Context completeness (target: > 85%)

**Test Procedure**:
1. Create 50 handoff records
2. Measure creation and retrieval time
3. Validate completeness checklist

**Expected Results**:
- ✅ Fast handoff record operations
- ✅ High context completeness (> 85%)
- ✅ No data loss during handoffs

---

## 7. Known Issues and Edge Cases

### Edge Case 1: Ambiguous Routing

**Scenario**: Request contains keywords for multiple domains
- Example: "Design and build API for user authentication"
- Keywords match: Design (ui-designer) AND Engineering (backend-architect)

**Expected Behavior**:
- System coordinator detects multi-domain request
- Routes to highest-scoring domain first
- Handoff to second domain after completion

**Test Status**: ⚠️ Needs validation

---

### Edge Case 2: No Matching Keywords

**Scenario**: Request contains no recognized keywords
- Example: "Help me with miscellaneous task"

**Expected Behavior**:
- All domain scores < 50 (low confidence)
- Falls back to general-purpose agent
- Asks clarifying questions

**Test Status**: ⚠️ Needs validation

---

### Edge Case 3: Specialist Unavailable

**Scenario**: Required specialist doesn't exist
- Example: "Build Elixir backend" (no Elixir specialist)

**Expected Behavior**:
- Routes to closest match (backend-architect)
- Agent indicates limitation (no Elixir expertise)
- Offers alternative (Node.js, Python) or general guidance

**Test Status**: ⚠️ Needs validation

---

## 8. Test Execution Checklist

### Pre-Testing Setup
- [ ] All 46 agents created and accessible
- [ ] All 7 domain coordinators configured
- [ ] All 23 slash commands defined
- [ ] Test data prepared (sample requests)

### Unit Tests
- [ ] System coordinator routing tested (7 domains)
- [ ] Engineering domain routing tested (6 specialists)
- [ ] Marketing domain routing tested (7 specialists)
- [ ] Design domain routing tested (5 specialists)
- [ ] Product domain routing tested (3 specialists)
- [ ] Project Management routing tested (3 specialists)
- [ ] Studio Operations routing tested (5 specialists)
- [ ] Testing domain routing tested (5 specialists)

### Integration Tests
- [ ] Handoff protocol tested (3 scenarios)
- [ ] Context preservation validated
- [ ] Multi-agent chains tested (2-4 agents)

### End-to-End Tests
- [ ] `/engineering/build-feature` workflow completed
- [ ] `/marketing/launch-campaign` workflow completed
- [ ] `/project/ship-feature` workflow completed

### Documentation
- [ ] Testing guide created
- [ ] Known issues documented
- [ ] Edge cases identified
- [ ] Performance benchmarks recorded

---

## 9. Test Results Template

### Test Execution Report

**Test Date**: [YYYY-MM-DD]
**Tester**: [Name]
**System Version**: Week 8 (Testing & Validation)

#### Summary
- Total Tests Run: [number]
- Passed: [number] (XX%)
- Failed: [number] (XX%)
- Skipped: [number]

#### Critical Failures
- [List any P0 failures that block system usage]

#### Non-Critical Issues
- [List P1/P2 issues for future improvement]

#### Performance Metrics
- Average routing time: [Xms]
- Routing accuracy: [XX%]
- Context preservation rate: [XX%]

#### Recommendations
1. [Priority fixes]
2. [Nice-to-have improvements]
3. [Future enhancements]

---

## 10. Continuous Testing

### Regression Testing
- Run routing tests after any agent modifications
- Validate handoffs after template changes
- Re-test workflows after adding new specialists

### Performance Monitoring
- Track routing performance over time
- Monitor agent selection accuracy
- Measure user satisfaction with routing

### Test Automation
- Automate routing keyword validation
- Automated handoff protocol checks
- CI/CD integration (future enhancement)

---

## Next Steps

After completing Week 8 testing:
1. Fix all critical issues (P0 bugs)
2. Document workarounds for known limitations
3. Proceed to Week 9 (Documentation & Polish)
