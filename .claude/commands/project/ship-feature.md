# Ship Feature End-to-End

I need you to coordinate the complete feature delivery lifecycle from planning to production release.

## Context

**Feature to Ship**: $ARGUMENTS

(Examples: "User authentication system", "Dark mode toggle", "Payment integration", "Real-time notifications", "Mobile app onboarding")

## Your Task

Route this to the **project-shipper** agent who will orchestrate across multiple domains:

1. **Pre-Flight Checklist**:
   **Requirements Validation**:
   - [ ] User story defined (As a... I want... So that...)
   - [ ] Acceptance criteria clear (Given/When/Then)
   - [ ] Success metrics identified (how will we measure success?)
   - [ ] Stakeholders aligned (product, design, engineering, QA)

   **Dependencies Identified**:
   - [ ] Upstream dependencies (what must be done first?)
   - [ ] Downstream impacts (what will this affect?)
   - [ ] Third-party integrations (APIs, services)
   - [ ] Data migrations (schema changes, backfills)

   **Risk Assessment**:
   - 🔴 High Risk: Breaking changes, payment flows, security-critical
   - 🟡 Medium Risk: New features, UI changes, performance impacts
   - 🟢 Low Risk: Bug fixes, copy changes, minor tweaks

2. **Planning Phase** (Days 1-2):
   **Technical Design** (backend-architect, frontend-developer):
   - API design (endpoints, request/response schemas)
   - Database changes (migrations, indexes, performance)
   - Frontend architecture (components, state management, routing)
   - Integration points (third-party APIs, internal services)

   **UX Design** (ui-designer, ux-researcher):
   - User flows and wireframes
   - Visual design (mockups, components)
   - Accessibility considerations
   - Mobile responsiveness

   **Effort Estimation**:
   - Engineering: [story points or hours]
   - Design: [hours]
   - QA: [hours]
   - Buffer: 20-30% for unknowns

3. **Implementation Phase** (Days 3-8):
   **Backend Development**:
   - Database migrations (test on staging first)
   - API endpoints (with input validation)
   - Business logic (service layer)
   - Error handling and logging
   - Unit tests (> 80% coverage)

   **Frontend Development**:
   - UI components (reusable, accessible)
   - State management (local vs global)
   - API integration (error states, loading states)
   - Responsive design (mobile, tablet, desktop)
   - Unit and integration tests

   **Daily Standup Updates**:
   - What was completed yesterday?
   - What's planned for today?
   - Any blockers or dependencies?

4. **Quality Assurance Phase** (Days 9-10):
   **Testing Checklist** (qa-engineer):
   - [ ] Unit tests passing (backend, frontend)
   - [ ] Integration tests passing (API, database)
   - [ ] E2E tests passing (critical user flows)
   - [ ] Manual QA (exploratory testing)
   - [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
   - [ ] Mobile testing (iOS, Android)
   - [ ] Accessibility audit (WCAG AA compliance)
   - [ ] Performance testing (load times, API response times)
   - [ ] Security review (OWASP top 10)

   **Bug Triage**:
   - 🔴 P0: Blocks release (must fix before ship)
   - 🟡 P1: Important but not blocking (fix in 1-2 weeks)
   - 🟢 P2: Nice to have (backlog)

5. **Code Review & Approval**:
   **Pull Request Checklist**:
   - [ ] Code follows style guide (linting passes)
   - [ ] No TODO comments or console.logs
   - [ ] Tests added and passing
   - [ ] Documentation updated (README, API docs, comments)
   - [ ] Screenshots/video for UI changes
   - [ ] Breaking changes called out

   **Review Process**:
   - At least 1 engineer approval
   - QA sign-off
   - Product owner approval (for UX changes)

6. **Deployment Strategy**:
   **Staging Deployment** (validate first):
   - Deploy to staging environment
   - Run smoke tests (critical flows)
   - Product/design review on staging
   - Fix any issues found

   **Production Deployment Plan**:
   - **Timing**: Off-peak hours (minimize user impact)
   - **Rollout Strategy**:
     - 🎯 Big Bang: Ship to 100% at once (low-risk changes)
     - 🎲 Canary: Ship to 5% → 25% → 50% → 100% (medium risk)
     - 🚀 Feature Flag: Ship code, enable for 0% → gradual rollout (high risk)
   - **Rollback Plan**: How to revert if things go wrong?
   - **Monitoring**: What metrics to watch post-deploy?

7. **Pre-Launch Checklist**:
   - [ ] All P0 bugs fixed
   - [ ] Tests passing (unit, integration, E2E)
   - [ ] Staging deployment successful
   - [ ] Database migrations tested
   - [ ] Feature flags configured (if using gradual rollout)
   - [ ] Monitoring dashboards set up
   - [ ] On-call engineer identified
   - [ ] Rollback plan documented
   - [ ] Customer support team briefed
   - [ ] Marketing/comms ready (if public launch)

8. **Launch Day**:
   **Deployment Execution** (devops-engineer):
   - Run database migrations (if any)
   - Deploy backend services
   - Deploy frontend assets
   - Clear caches (CDN, application caches)
   - Enable feature flags (if gradual rollout)
   - Verify deployment (smoke tests)

   **Post-Deploy Monitoring** (first 24 hours):
   - **Error Rates**: Spike in errors? (target: < 1%)
   - **Performance**: Response times degraded? (p95 < 200ms)
   - **Traffic**: Unexpected traffic patterns?
   - **User Metrics**: Engagement, conversion, retention
   - **Support Tickets**: Influx of user complaints?

   **Go/No-Go Decision Points**:
   - After 5% rollout: Metrics look good? Continue to 25%
   - After 25% rollout: Still good? Continue to 50%
   - After 50% rollout: All systems green? Full rollout

9. **Post-Launch Activities** (Days 12-14):
   **Measure Success**:
   - Track success metrics (defined in step 1)
   - Compare to baseline (before feature shipped)
   - User feedback (support tickets, NPS, surveys)
   - Analytics review (Mixpanel, Amplitude)

   **Iterate Based on Data**:
   - What's working well? (double down)
   - What's not working? (fix or kill)
   - What did users request? (backlog for v2)

   **Documentation**:
   - Update user docs (help center, changelog)
   - Internal docs (runbooks, troubleshooting)
   - Demo video or screenshots
   - Announcement (blog post, email, social media)

10. **Retrospective** (Day 15):
    **What Went Well**:
    - Wins to celebrate
    - Processes that worked

    **What Didn't Go Well**:
    - Delays or blockers
    - Bugs found in production
    - Miscommunications

    **Action Items**:
    - Process improvements
    - Tools or automation to adopt
    - Team learnings

## Deliverables

- Feature specification (requirements, design, architecture)
- Implementation (backend, frontend, tests)
- QA sign-off (all tests passing, bugs triaged)
- Deployment plan (strategy, rollback, monitoring)
- Launch checklist (completed)
- Post-launch report (metrics, user feedback, learnings)

## Timeline (Standard Feature)

**Week 1: Plan & Design**
- Day 1-2: Requirements, technical design, UX design

**Week 2: Implement & Test**
- Day 3-8: Backend + frontend development
- Day 9-10: QA and bug fixes

**Week 3: Deploy & Monitor**
- Day 11: Staging deployment
- Day 12: Production deployment
- Day 13-14: Monitor and iterate
- Day 15: Retrospective

## Feature Types & Timelines

**Quick Feature** (3-5 days):
- Simple UI changes, copy updates, minor fixes
- Example: Add new button, update form field

**Standard Feature** (2 weeks):
- New functionality, moderate complexity
- Example: User profile page, notification system

**Complex Feature** (4-6 weeks):
- Multiple systems, integrations, high risk
- Example: Payment integration, real-time chat

**Epic** (3+ months):
- Multiple features, requires phased rollout
- Example: Complete product redesign, new platform

## Success Criteria

- **On-Time**: Feature shipped within estimated timeline
- **On-Quality**: All acceptance criteria met, < 5 bugs in first week
- **On-Budget**: Effort within 20% of estimate
- **User Impact**: Success metrics achieved (e.g., +10% conversion)
- **Team Velocity**: Didn't block other work, sustainable pace

## Coordination Points

**Cross-Domain Handoffs**:
- Product → Design: Requirements to wireframes
- Design → Engineering: Mockups to implementation
- Engineering → QA: Pull request to testing
- QA → DevOps: Approval to deployment
- DevOps → Product: Launch to metrics

**Communication Channels**:
- Daily: Slack updates, standup
- Weekly: Sprint review, demo
- Ad-hoc: Blockers, questions (don't wait)

**Route to**: System Coordinator → Project Management Coordinator → project-shipper (orchestrates engineering, design, qa, devops agents)
