# Agent Catalog and Selection Guide

**Purpose**: Complete catalog of all 46 agents with selection guidance
**Last Updated**: 2025-01-15
**Version**: 2.0.0
**System Status**: ✅ Production-Ready (Week 8 Testing Complete)

---

## Quick Reference

**Total Agents**: 46
- System Level: 1 (system-coordinator)
- Core Services: 1 (context-manager)
- Domain Coordinators: 7
- Specialist Agents: 37

---

## System-Level Agents (2)

### system-coordinator
**Location**: `.claude/agents/_core/system-coordinator.md`
**Role**: Meta-orchestrator, primary entry point for all requests
**Use When**: You make any request (automatic routing)
**Keywords**: N/A (handles all requests)
**Background Eligible**: No

### context-manager
**Location**: `.claude/agents/_core/context-manager.md`
**Role**: Context preservation across agent handoffs
**Use When**: Multi-agent workflows (automatic invocation)
**Keywords**: N/A (invoked by coordinators)
**Background Eligible**: Yes (always runs in background)

---

## Engineering Domain (6 specialists + 1 coordinator)

### Engineering Coordinator
**Location**: `.claude/agents/engineering/_coordinator.md`
**Routes to**: 6 engineering specialists

### frontend-developer
**Focus**: React, Next.js, UI components, client-side logic
**Use When**: Building web UIs, React/Vue/Angular components, frontend features
**Keywords**: React, Next.js, component, UI, frontend, JSX, CSS, Tailwind
**Background Eligible**: Yes (for non-critical features)
**Typical Deliverables**: Component code, tests, usage documentation

### backend-architect
**Focus**: API design, databases, server-side logic
**Use When**: Building APIs, designing databases, server-side services
**Keywords**: API, backend, database, server, REST, GraphQL, SQL
**Background Eligible**: Yes (for non-architecture decisions)
**Typical Deliverables**: API code, database schema, API documentation

### mobile-app-builder
**Focus**: iOS, Android, React Native apps
**Use When**: Building mobile applications
**Keywords**: mobile, iOS, Android, app, React Native, Flutter, Expo
**Background Eligible**: Yes
**Typical Deliverables**: Mobile app code, platform-specific implementations

### ai-engineer
**Focus**: LLM integration, RAG systems, AI features
**Use When**: Integrating AI/ML capabilities, building AI-powered features
**Keywords**: AI, LLM, RAG, GPT, Claude, vector, embedding, prompt
**Background Eligible**: Yes
**Typical Deliverables**: AI integration code, prompts, embeddings setup

### devops-automator
**Focus**: CI/CD, deployment, infrastructure
**Use When**: Setting up CI/CD, deploying to production, managing infrastructure
**Keywords**: deploy, CI/CD, pipeline, Docker, K8s, cloud, infrastructure
**Background Eligible**: No (deployments need monitoring)
**Typical Deliverables**: CI/CD configs, deployment scripts, infrastructure code

### rapid-prototyper
**Focus**: MVPs, quick validation, prototypes
**Use When**: Need quick proof-of-concept or feasibility testing
**Keywords**: prototype, MVP, quick, fast, validate, experiment
**Background Eligible**: No (iterative with feedback)
**Typical Deliverables**: Working prototype, validation insights

---

## Design Domain (5 specialists + 1 coordinator)

### Design Coordinator
**Location**: `.claude/agents/design/_coordinator.md`
**Routes to**: 5 design specialists

### ui-designer
**Focus**: Interface design, mockups, components, design systems
**Use When**: Designing user interfaces, creating mockups, building design systems
**Keywords**: UI, interface, mockup, screen, component, layout, Figma
**Background Eligible**: No (needs user feedback)
**Typical Deliverables**: Figma mockups, component specs, design tokens

### ux-researcher
**Focus**: User research, testing, usability studies
**Use When**: Conducting user research, usability testing, creating personas
**Keywords**: UX, research, user, testing, usability, interview, persona
**Background Eligible**: No (interactive research)
**Typical Deliverables**: Research reports, personas, usability findings

### brand-guardian
**Focus**: Brand identity, visual guidelines, consistency
**Use When**: Defining brand identity, creating brand guidelines, ensuring consistency
**Keywords**: brand, identity, logo, color, typography, style guide
**Background Eligible**: Yes (for documentation)
**Typical Deliverables**: Brand guidelines, logo files, color palettes

### visual-storyteller
**Focus**: Visual narratives, imagery, creative direction
**Use When**: Creating visual stories, art direction, imagery strategy
**Keywords**: story, narrative, visual, imagery, creative, illustration
**Background Eligible**: Yes
**Typical Deliverables**: Visual concepts, creative direction docs, imagery

### whimsy-injector
**Focus**: Delightful details, animations, micro-interactions
**Use When**: Adding delight to user experience, designing animations
**Keywords**: delight, animation, micro-interaction, whimsy, fun, playful
**Background Eligible**: Yes
**Typical Deliverables**: Animation specs, interaction details, delight moments

---

## Marketing Domain (7 specialists + 1 coordinator)

### Marketing Coordinator
**Location**: `.claude/agents/marketing/_coordinator.md`
**Routes to**: 7 marketing specialists

### tiktok-strategist
**Focus**: TikTok content strategy, trends, viral campaigns
**Use When**: Creating TikTok strategy or content
**Keywords**: TikTok, short-form video, viral, trending, sound
**Background Eligible**: Yes (for strategy docs)
**Typical Deliverables**: TikTok strategy, content calendar, trend analysis

### instagram-curator
**Focus**: Instagram content, aesthetics, engagement
**Use When**: Managing Instagram presence, creating visual feed strategy
**Keywords**: Instagram, IG, Reels, Stories, carousel, aesthetic
**Background Eligible**: Yes
**Typical Deliverables**: Instagram content plan, caption templates, grid strategy

### twitter-engager
**Focus**: Twitter strategy, threads, community engagement
**Use When**: Building Twitter presence, creating threads, engaging community
**Keywords**: Twitter, X, thread, tweet, engagement, community
**Background Eligible**: Yes
**Typical Deliverables**: Twitter strategy, thread templates, engagement tactics

### reddit-community-builder
**Focus**: Reddit presence, community engagement, value-first content
**Use When**: Building Reddit community, engaging in subreddits
**Keywords**: Reddit, subreddit, community, karma, discussion
**Background Eligible**: Yes
**Typical Deliverables**: Reddit strategy, community guidelines, content ideas

### app-store-optimizer
**Focus**: ASO, app store presence, ratings/reviews
**Use When**: Optimizing app store listings, improving app store visibility
**Keywords**: ASO, app store, Google Play, App Store, rating, review
**Background Eligible**: Yes
**Typical Deliverables**: ASO strategy, optimized listings, review response templates

### content-creator
**Focus**: Multi-platform content, copywriting, creative
**Use When**: Creating content for any platform, writing copy, developing creative
**Keywords**: content, copy, writing, caption, script, hook, CTA
**Background Eligible**: Yes (for non-interactive content)
**Typical Deliverables**: Content pieces, copy templates, creative concepts

### growth-hacker
**Focus**: Acquisition funnels, viral growth, experiments
**Use When**: Running growth experiments, optimizing funnels, viral tactics
**Keywords**: growth, funnel, acquisition, conversion, viral, experiment
**Background Eligible**: Yes
**Typical Deliverables**: Growth experiments, funnel optimization, viral strategies

---

## Product Domain (3 specialists + 1 coordinator)

### Product Coordinator
**Location**: `.claude/agents/product/_coordinator.md`
**Routes to**: 3 product specialists

### trend-researcher
**Focus**: Market trends, competitive analysis, opportunities
**Use When**: Researching market trends, analyzing competitors, identifying opportunities
**Keywords**: trend, market, competitor, research, analysis, industry
**Background Eligible**: Yes
**Typical Deliverables**: Trend reports, competitive analysis, opportunity assessments

### feedback-synthesizer
**Focus**: User feedback analysis, themes, insights
**Use When**: Analyzing user feedback, synthesizing insights, identifying patterns
**Keywords**: feedback, user, review, survey, interview, sentiment, theme
**Background Eligible**: Yes
**Typical Deliverables**: Feedback synthesis reports, theme analysis, user insights

### sprint-prioritizer
**Focus**: Backlog management, sprint planning, roadmap
**Use When**: Planning sprints, prioritizing backlog, creating roadmaps
**Keywords**: sprint, backlog, priority, roadmap, plan, epic, story
**Background Eligible**: No (needs team input)
**Typical Deliverables**: Sprint plans, prioritized backlog, product roadmap

---

## Project Management Domain (3 specialists + 1 coordinator)

### Project Management Coordinator
**Location**: `.claude/agents/project-management/_coordinator.md`
**Routes to**: 3 PM specialists

### experiment-tracker
**Focus**: A/B tests, experiments, hypothesis validation
**Use When**: Running experiments, tracking A/B tests, validating hypotheses
**Keywords**: experiment, A/B test, hypothesis, validate, test, metric
**Background Eligible**: Yes
**Typical Deliverables**: Experiment setup, tracking dashboards, results analysis

### project-shipper
**Focus**: Feature delivery, rollouts, launch coordination
**Use When**: Shipping features to production, coordinating launches
**Keywords**: ship, deploy, launch, release, rollout, deliver
**Background Eligible**: No (needs monitoring)
**Typical Deliverables**: Deployment plans, rollout strategies, launch checklists

### studio-producer
**Focus**: Multi-project coordination, resource allocation
**Use When**: Coordinating multiple projects, managing resources across projects
**Keywords**: studio, produce, coordinate, resource, schedule, multi-project
**Background Eligible**: No (interactive coordination)
**Typical Deliverables**: Project plans, resource allocation, timelines

---

## Studio Operations Domain (5 specialists + 1 coordinator)

### Studio Operations Coordinator
**Location**: `.claude/agents/studio-operations/_coordinator.md`
**Routes to**: 5 operations specialists

### support-responder
**Focus**: Customer support, ticket resolution, issue handling
**Use When**: Handling support tickets, resolving customer issues
**Keywords**: support, ticket, issue, help, customer, problem
**Background Eligible**: No (interactive support)
**Typical Deliverables**: Ticket responses, issue resolutions, customer updates

### analytics-reporter
**Focus**: Analytics dashboards, reports, insights
**Use When**: Creating analytics reports, building dashboards, extracting insights
**Keywords**: analytics, report, dashboard, metrics, data, insights, KPI
**Background Eligible**: Yes
**Typical Deliverables**: Analytics reports, dashboards, data insights

### infrastructure-maintainer
**Focus**: System health, monitoring, uptime, incident response
**Use When**: Managing infrastructure, responding to incidents, monitoring systems
**Keywords**: infrastructure, uptime, monitoring, incident, outage, performance
**Background Eligible**: No (critical operations)
**Typical Deliverables**: Incident reports, monitoring setup, system health reports

### legal-compliance-checker
**Focus**: Legal review, compliance, privacy, regulations
**Use When**: Reviewing for legal compliance, ensuring GDPR/CCPA compliance
**Keywords**: legal, compliance, privacy, GDPR, terms, policy, regulation
**Background Eligible**: Yes
**Typical Deliverables**: Compliance reviews, legal opinions, policy docs

### finance-tracker
**Focus**: Budget tracking, expenses, financial reporting
**Use When**: Tracking budgets, managing expenses, financial reporting
**Keywords**: finance, budget, expense, cost, invoice, payment, revenue
**Background Eligible**: Yes
**Typical Deliverables**: Financial reports, budget tracking, expense summaries

---

## Testing Domain (5 specialists + 1 coordinator)

### Testing Coordinator
**Location**: `.claude/agents/testing/_coordinator.md`
**Routes to**: 5 testing specialists

### tool-evaluator
**Focus**: Tool comparisons, evaluations, recommendations
**Use When**: Evaluating tools, comparing options, making tool selections
**Keywords**: tool, evaluate, compare, review, assessment, recommendation
**Background Eligible**: Yes
**Typical Deliverables**: Tool comparison matrices, evaluation reports, recommendations

### api-tester
**Focus**: API testing, integration tests, contract testing
**Use When**: Testing APIs, integration points, API contracts
**Keywords**: API, endpoint, integration, contract, REST, GraphQL, test
**Background Eligible**: Yes
**Typical Deliverables**: API test suites, integration tests, test reports

### workflow-optimizer
**Focus**: Workflow analysis, process optimization, efficiency
**Use When**: Optimizing workflows, analyzing processes, improving efficiency
**Keywords**: workflow, process, optimize, efficiency, bottleneck, improve
**Background Eligible**: Yes
**Typical Deliverables**: Workflow analysis, optimization recommendations, process improvements

### performance-benchmarker
**Focus**: Performance testing, benchmarks, load/stress testing
**Use When**: Benchmarking performance, load testing, finding performance issues
**Keywords**: performance, benchmark, load, stress, speed, latency, throughput
**Background Eligible**: Yes
**Typical Deliverables**: Performance reports, benchmark results, optimization recommendations

### test-results-analyzer
**Focus**: Test failure analysis, quality trends, coverage
**Use When**: Analyzing test results, investigating failures, tracking quality
**Keywords**: test, failure, analysis, result, flaky, quality, coverage
**Background Eligible**: Yes
**Typical Deliverables**: Test analysis reports, quality trends, coverage reports

---

## Agent Selection Decision Tree

```
Start: What do you need?
├─ Build something in code?
│  ├─ YES → Engineering Domain
│  │  ├─ Web UI? → frontend-developer
│  │  ├─ API/Backend? → backend-architect
│  │  ├─ Mobile app? → mobile-app-builder
│  │  ├─ AI feature? → ai-engineer
│  │  ├─ Deploy/Infrastructure? → devops-automator
│  │  └─ Quick prototype? → rapid-prototyper
│  │
│  └─ NO → Continue
│
├─ Design visual interface?
│  ├─ YES → Design Domain
│  │  ├─ UI mockups? → ui-designer
│  │  ├─ User research? → ux-researcher
│  │  ├─ Brand identity? → brand-guardian
│  │  ├─ Visual storytelling? → visual-storyteller
│  │  └─ Delightful details? → whimsy-injector
│  │
│  └─ NO → Continue
│
├─ Marketing/content?
│  ├─ YES → Marketing Domain
│  │  ├─ TikTok? → tiktok-strategist
│  │  ├─ Instagram? → instagram-curator
│  │  ├─ Twitter? → twitter-engager
│  │  ├─ Reddit? → reddit-community-builder
│  │  ├─ App Store? → app-store-optimizer
│  │  ├─ Multi-platform content? → content-creator
│  │  └─ Growth experiments? → growth-hacker
│  │
│  └─ NO → Continue
│
├─ Research/analyze?
│  ├─ YES → Product Domain
│  │  ├─ Market trends? → trend-researcher
│  │  ├─ User feedback? → feedback-synthesizer
│  │  └─ Sprint planning? → sprint-prioritizer
│  │
│  └─ NO → Continue
│
├─ Ship/coordinate projects?
│  ├─ YES → Project Management Domain
│  │  ├─ Run experiment? → experiment-tracker
│  │  ├─ Ship feature? → project-shipper
│  │  └─ Coordinate multiple projects? → studio-producer
│  │
│  └─ NO → Continue
│
├─ Operations/support?
│  ├─ YES → Studio Operations Domain
│  │  ├─ Customer support? → support-responder
│  │  ├─ Analytics? → analytics-reporter
│  │  ├─ Infrastructure? → infrastructure-maintainer
│  │  ├─ Legal/compliance? → legal-compliance-checker
│  │  └─ Finance? → finance-tracker
│  │
│  └─ NO → Continue
│
└─ Testing/quality?
   └─ YES → Testing Domain
      ├─ Tool evaluation? → tool-evaluator
      ├─ API testing? → api-tester
      ├─ Workflow optimization? → workflow-optimizer
      ├─ Performance testing? → performance-benchmarker
      └─ Test analysis? → test-results-analyzer
```

---

## Agent Availability Status

**All 46 agents complete and production-ready** (as of Week 9):

**System-Level (2)**: ✅ Complete
- system-coordinator (meta-orchestrator)
- context-manager (context preservation)

**Domain Coordinators (7)**: ✅ Complete
- engineering, product, marketing, design, project-management, studio-operations, testing

**Specialist Agents (37)**: ✅ Complete
- Engineering (6): frontend-developer, backend-architect, mobile-app-builder, ai-engineer, devops-automator, rapid-prototyper
- Product (3): trend-researcher, feedback-synthesizer, sprint-prioritizer
- Marketing (7): tiktok-strategist, instagram-curator, twitter-engager, reddit-community-builder, app-store-optimizer, content-creator, growth-hacker
- Design (5): ui-designer, ux-researcher, brand-guardian, visual-storyteller, whimsy-injector
- Project Management (3): experiment-tracker, project-shipper, studio-producer
- Studio Operations (5): support-responder, analytics-reporter, infrastructure-maintainer, legal-compliance-checker, finance-tracker
- Testing (5): tool-evaluator, api-tester, workflow-optimizer, performance-benchmarker, test-results-analyzer

**System Performance** (from Week 8 testing):
- Routing accuracy: 100% (50/50 test cases)
- Context preservation: 90% completeness (exceeded 85% target)
- Handoff success: 100% (zero context loss)
- Command execution: 100% (23/23 slash commands working)
- Test coverage: 318+ tests, 100% pass rate
- Status: ✅ APPROVED FOR PRODUCTION

---

## References

- **Routing Logic**: `.claude/agents/_meta/routing.md`
- **Domain Boundaries**: `.claude/agents/_meta/domains.md`
- **Agent Guide**: `.claude/docs/AGENT_GUIDE.md`
- **Architecture**: `.claude/docs/ARCHITECTURE.md`
