# Domain Boundaries and Definitions

**Purpose**: Define clear boundaries between domains to prevent overlap and confusion
**Last Updated**: 2025-12-27
**Version**: 1.0.0

---

## Domain Taxonomy

```
Multi-Agent System (46 agents)
├── System Level (1 agent)
│   └── system-coordinator
├── Core Services (1 agent)
│   └── context-manager
└── Domains (7 domains, 44 agents total)
    ├── Engineering (6 specialists + 1 coordinator)
    ├── Product (3 specialists + 1 coordinator)
    ├── Marketing (7 specialists + 1 coordinator)
    ├── Design (5 specialists + 1 coordinator)
    ├── Project Management (3 specialists + 1 coordinator)
    ├── Studio Operations (5 specialists + 1 coordinator)
    └── Testing (5 specialists + 1 coordinator)
```

---

## Domain 1: Engineering

**Primary Responsibility**: Software development and technical implementation

**Scope**:
- ✅ Building code (frontend, backend, mobile)
- ✅ API design and implementation
- ✅ Database schema design
- ✅ AI/ML feature integration
- ✅ Infrastructure and deployment
- ✅ Technical prototyping

**NOT Responsible For**:
- ❌ Visual design (→ design domain)
- ❌ User research (→ product/design domain)
- ❌ Marketing content (→ marketing domain)
- ❌ Quality assurance testing (→ testing domain, though engineers write unit tests)

**Boundaries**:
- **With Design**: Receives mockups/specs, implements UI. Does NOT create visual designs.
- **With Product**: Receives requirements, builds features. Does NOT define what to build.
- **With Testing**: Writes unit tests, hands off for integration/E2E testing.

**Specialists**: frontend-developer, backend-architect, mobile-app-builder, ai-engineer, devops-automator, rapid-prototyper

---

## Domain 2: Design

**Primary Responsibility**: Visual and user experience design

**Scope**:
- ✅ UI design (mockups, components, screens)
- ✅ UX research (user testing, usability)
- ✅ Brand identity (logo, colors, typography)
- ✅ Visual storytelling (imagery, creative direction)
- ✅ Delightful details (animations, micro-interactions)

**NOT Responsible For**:
- ❌ Code implementation (→ engineering domain)
- ❌ Market research (→ product domain)
- ❌ Social media content (→ marketing domain, though provides visual assets)

**Boundaries**:
- **With Engineering**: Creates mockups/specs, hands off for implementation. Does NOT write code.
- **With Marketing**: Provides visual assets for campaigns. Does NOT create marketing strategy.
- **With Product**: Conducts UX research, visualizes requirements. Does NOT define business requirements.

**Specialists**: ui-designer, ux-researcher, brand-guardian, visual-storyteller, whimsy-injector

---

## Domain 3: Marketing

**Primary Responsibility**: Marketing strategy and content distribution

**Scope**:
- ✅ Social media strategy (TikTok, Instagram, Twitter, Reddit)
- ✅ Content creation (copy, captions, scripts)
- ✅ Growth experiments (acquisition funnels, viral tactics)
- ✅ App store optimization
- ✅ Campaign planning and execution

**NOT Responsible For**:
- ❌ Visual design (→ design domain, though marketing uses design assets)
- ❌ Engineering implementation (→ engineering domain)
- ❌ Product strategy (→ product domain)

**Boundaries**:
- **With Design**: Receives visual assets, creates content. Does NOT design visual identity.
- **With Product**: Receives positioning/messaging, creates campaigns. Does NOT define product strategy.
- **With Engineering**: May request landing pages. Does NOT build them.

**Specialists**: tiktok-strategist, instagram-curator, twitter-engager, reddit-community-builder, app-store-optimizer, content-creator, growth-hacker

---

## Domain 4: Product

**Primary Responsibility**: Product strategy and user insights

**Scope**:
- ✅ Market research and trend analysis
- ✅ User feedback synthesis
- ✅ Feature prioritization and roadmap
- ✅ Sprint planning and backlog management
- ✅ Competitive analysis

**NOT Responsible For**:
- ❌ Design execution (→ design domain)
- ❌ Engineering implementation (→ engineering domain)
- ❌ Marketing campaigns (→ marketing domain)

**Boundaries**:
- **With Engineering**: Defines requirements, hands off for implementation. Does NOT build features.
- **With Design**: Provides user needs, receives design solutions. Does NOT create visual designs.
- **With Marketing**: Provides product positioning, receives campaign results. Does NOT create campaigns.

**Specialists**: trend-researcher, feedback-synthesizer, sprint-prioritizer

---

## Domain 5: Project Management

**Primary Responsibility**: Feature delivery and coordination

**Scope**:
- ✅ Feature shipping and rollout
- ✅ Experiment tracking (A/B tests)
- ✅ Multi-project coordination
- ✅ Launch orchestration
- ✅ Timeline and resource management

**NOT Responsible For**:
- ❌ Feature definition (→ product domain)
- ❌ Feature implementation (→ engineering domain)
- ❌ Design creation (→ design domain)

**Boundaries**:
- **With Engineering**: Coordinates deployment, does NOT write code or deploy (devops-automator deploys).
- **With Product**: Executes roadmap, does NOT define strategy.
- **With Marketing**: Coordinates launch timing, does NOT create campaigns.

**Specialists**: experiment-tracker, project-shipper, studio-producer

---

## Domain 6: Studio Operations

**Primary Responsibility**: Operational support and infrastructure

**Scope**:
- ✅ Customer support and ticket resolution
- ✅ Analytics reporting and dashboards
- ✅ Infrastructure monitoring and incidents
- ✅ Legal compliance and review
- ✅ Financial tracking and budgets

**NOT Responsible For**:
- ❌ Feature development (→ engineering domain)
- ❌ Product strategy (→ product domain)
- ❌ Design work (→ design domain)

**Boundaries**:
- **With Engineering**: Reports infrastructure issues, does NOT fix code bugs.
- **With Product**: Provides analytics data, does NOT define product direction.
- **With All Domains**: Provides operational support as needed.

**Specialists**: support-responder, analytics-reporter, infrastructure-maintainer, legal-compliance-checker, finance-tracker

---

## Domain 7: Testing

**Primary Responsibility**: Quality assurance and validation

**Scope**:
- ✅ API and integration testing
- ✅ Performance benchmarking and load testing
- ✅ Workflow optimization
- ✅ Tool evaluation and comparison
- ✅ Test result analysis

**NOT Responsible For**:
- ❌ Feature implementation (→ engineering domain)
- ❌ Unit test writing (→ engineering domain writes unit tests)
- ❌ User testing/research (→ design/product domain)

**Boundaries**:
- **With Engineering**: Tests engineering output, does NOT write production code.
- **With Design**: Can test usability, but UX research is design domain.
- **With Product**: Validates experiments, does NOT define experiment parameters.

**Specialists**: tool-evaluator, api-tester, workflow-optimizer, performance-benchmarker, test-results-analyzer

---

## Cross-Domain Workflows

### Workflow 1: Feature Development
```
product (requirements) →
design (mockups) →
engineering (implementation) →
testing (validation) →
project-management (ship)
```

### Workflow 2: Marketing Campaign
```
product (positioning) →
design (visual assets) →
marketing (campaign) →
studio-operations (analytics)
```

### Workflow 3: Bug Fix
```
studio-operations (support ticket) →
engineering (bug fix) →
testing (regression test) →
studio-operations (customer notification)
```

---

## Overlap Resolution

### When Domains Overlap

Some responsibilities naturally span domains. Resolution strategies:

**Case 1: Content Creation**
- **Question**: Who creates social media post copy?
- **Answer**: Marketing (content-creator) creates copy, Design (visual-storyteller) creates visuals
- **Resolution**: Collaborate via handoff

**Case 2: Performance**
- **Question**: Who handles performance optimization?
- **Answer**: Testing (benchmarks and identifies issues), Engineering (implements fixes)
- **Resolution**: Testing identifies, Engineering fixes

**Case 3: User Research**
- **Question**: Who conducts user interviews?
- **Answer**: Design (ux-researcher) for UX, Product (feedback-synthesizer) for product strategy
- **Resolution**: Route based on purpose (UX vs. strategy)

**Case 4: Analytics**
- **Question**: Who creates analytics reports?
- **Answer**: Studio Operations (analytics-reporter) for operational metrics, Product for product metrics
- **Resolution**: Route based on audience (operations vs. product team)

---

## Domain Expansion Strategy

When a domain grows beyond 15 specialists, subdivide:

### Example: Engineering Subdivision

```
engineering/ (20 specialists)
├── frontend/
│   ├── _coordinator.md
│   ├── react-specialist.md
│   ├── vue-specialist.md
│   └── ... (5 specialists)
├── backend/
│   ├── _coordinator.md
│   ├── nodejs-specialist.md
│   └── ... (5 specialists)
├── mobile/
│   └── ... (4 specialists)
└── infrastructure/
    └── ... (3 specialists)
```

**New routing**: engineering coordinator → sub-domain coordinator → specialist

---

## Domain Governance

### Adding New Domains

When to create a new domain:

1. **Sufficient specialists** (3+ specialists needed)
2. **Clear responsibility** (distinct from existing domains)
3. **Frequent requests** (enough demand to justify)
4. **Minimal overlap** (doesn't duplicate existing domains)

**Process**:
1. Identify 3-5 specialist roles
2. Define domain boundaries clearly
3. Create domain coordinator from template
4. Update system-coordinator routing table
5. Create domain context file
6. Document in this file

---

### Merging Domains

When to merge domains:

1. **Low utilization** (< 10% of total requests)
2. **High overlap** (frequently routing to wrong domain)
3. **Insufficient specialists** (< 3 specialists, can't subdivide)

**Process**:
1. Identify target domain for merge
2. Move specialists to target domain
3. Update routing tables
4. Archive old domain coordinator
5. Notify users of change

---

## Domain Health Metrics

Track these per domain:

| Metric | Healthy Range | Action if Outside |
|--------|---------------|-------------------|
| Request Volume | 10-40% of total | Investigate if < 5% (consider merge) or > 50% (consider subdivision) |
| Routing Accuracy | > 90% | Review keyword overlaps with other domains |
| Specialist Utilization | 20-40% per specialist | Rebalance if any specialist > 60% |
| Cross-Domain Handoffs | < 30% of requests | High handoffs suggest boundary issues |

---

## Responsibility Matrix (RACI)

For common tasks, who is Responsible, Accountable, Consulted, Informed:

| Task | Engineering | Design | Marketing | Product | PM | Operations | Testing |
|------|-------------|--------|-----------|---------|----|-----------|----|
| Build feature | **R** | C | I | C | A | I | C |
| Design UI | C | **R/A** | I | C | I | I | I |
| Create content | I | C | **R/A** | C | I | I | I |
| Define requirements | C | C | I | **R/A** | C | I | I |
| Ship feature | C | I | I | I | **R/A** | I | C |
| Support tickets | C | I | I | I | I | **R/A** | I |
| QA testing | C | I | I | I | I | I | **R/A** |

**Legend**: R = Responsible (does the work), A = Accountable (decision maker), C = Consulted, I = Informed

---

## Domain Contact Points

Each domain coordinator serves as the primary contact for:
- Routing decisions within domain
- Domain standards enforcement
- Cross-domain collaboration coordination
- Domain metrics and health

---

## References

- **System Coordinator**: `.claude/agents/_core/system-coordinator.md`
- **Domain Coordinators**: `.claude/agents/[domain]/_coordinator.md`
- **Routing Table**: `.claude/agents/_meta/routing.md`
- **Agent Catalog**: `.claude/agents/_meta/index.md`
