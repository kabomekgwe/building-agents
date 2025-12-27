# Evaluate Tool or Technology

I need you to evaluate a tool, library, or technology for potential adoption with comprehensive analysis and recommendation.

## Context

**Tool to Evaluate**: $ARGUMENTS

(Examples: "Evaluate Prisma ORM vs Drizzle ORM", "Should we adopt Tailwind CSS?", "Compare Vercel vs Railway for deployment", "Evaluate PostHog for product analytics", "React Query vs Redux Toolkit Query")

## Your Task

Route this to the **tool-evaluator** agent who will:

1. **Define Evaluation Criteria (MECE Framework)**:
   **Mutually Exclusive, Collectively Exhaustive**:
   - **Functional** (40%): Does it meet our needs?
   - **Performance** (25%): Is it fast enough?
   - **Cost** (20%): Can we afford it?
   - **Vendor & Support** (10%): Is it reliable and supported?
   - **Migration** (5%): How hard to adopt?

   **Custom Weighting** (adjust based on context):
   - Startup early-stage: Cost (30%), Functional (30%), Migration (20%)
   - Enterprise: Security (25%), Vendor (20%), Support (20%)
   - Performance-critical app: Performance (40%), Functional (30%)

2. **Research Phase**:
   **Documentation Review**:
   - Official docs (completeness, clarity, examples)
   - Quickstart guides (how easy to get started?)
   - API reference (comprehensive?)
   - Migration guides (from competitors)

   **Community & Ecosystem**:
   - GitHub stars, forks, contributors
   - Issue response time (< 48 hours?)
   - Recent commits (actively maintained?)
   - NPM downloads / package manager usage
   - Stack Overflow questions (sign of adoption)
   - Discord/Slack community (active, helpful?)

   **Competitor Comparison**:
   - Identify top 3-5 alternatives
   - Compare feature sets (table format)
   - Pricing comparison
   - Market share / adoption

3. **Functional Evaluation (40%)**:
   **Feature Completeness**:
   - Core features: [List must-have features]
     - [ ] Feature 1: Does it have this?
     - [ ] Feature 2: Does it have this?
     - [ ] Feature 3: Does it have this?
   - Nice-to-have features: [Bonus features]
   - Missing features: [Deal-breakers or workarounds needed]

   **Developer Experience (DX)**:
   - API design (intuitive, consistent?)
   - TypeScript support (types included, quality?)
   - Error messages (clear, actionable?)
   - Learning curve (hours, days, weeks?)
   - Debugging experience (source maps, dev tools?)

   **Integration**:
   - Works with our tech stack? (React, Node.js, PostgreSQL, etc.)
   - Third-party integrations available? (Stripe, Auth0, etc.)
   - Plugin/extension ecosystem (rich, active?)

   **Example** (ORM Evaluation):
   ```
   | Feature | Prisma | Drizzle | TypeORM |
   |---------|--------|---------|---------|
   | TypeScript-first | ✅ | ✅ | ⚠️ (partial) |
   | Schema as code | ✅ | ✅ | ⚠️ (decorators) |
   | Migrations | ✅ Auto | ✅ Manual | ✅ Auto |
   | Query builder | ✅ | ✅ | ✅ |
   | Relation loading | ✅ | ✅ | ✅ |
   | Edge runtime support | ❌ | ✅ | ❌ |
   | Performance | Medium | High | Medium |
   ```

4. **Performance Evaluation (25%)**:
   **Benchmarking**:
   - Create proof of concept (POC)
   - Measure key metrics:
     - Latency (response time, query time)
     - Throughput (requests/second, operations/second)
     - Memory usage (runtime, peak)
     - Bundle size (if frontend, KB gzipped)
     - Cold start time (if serverless)

   **Example Benchmark** (ORM query performance):
   ```javascript
   // Benchmark: Fetch 100 users with their orders
   console.time('Prisma')
   const prismaBatch Users = await prisma.user.findMany({
     take: 100,
     include: { orders: true }
   })
   console.timeEnd('Prisma') // 45ms

   console.time('Drizzle')
   const drizzleUsers = await db.query.users.findMany({
     limit: 100,
     with: { orders: true }
   })
   console.timeEnd('Drizzle') // 12ms

   // Result: Drizzle is 3.75x faster for this query
   ```

   **Scalability**:
   - Load testing (k6, Artillery)
   - Concurrent users (can it handle our scale?)
   - Resource consumption (CPU, memory at scale)

5. **Cost Evaluation (20%)**:
   **Pricing Tiers**:
   - Free tier: [Limits, restrictions]
   - Paid tiers: [$/month, included features]
   - Enterprise: [Custom pricing, volume discounts]

   **Total Cost of Ownership (TCO)**:
   - **License cost**: Free, subscription, per-seat, usage-based
   - **Infrastructure cost**: Does it require additional services? (database, Redis, etc.)
   - **Development time**: Hours to integrate, maintain
   - **Opportunity cost**: What else could we build in that time?

   **Example** (Analytics Tool Comparison):
   ```
   | Tool | Free Tier | Paid Tier | TCO (Year 1) |
   |------|-----------|-----------|--------------|
   | PostHog | 1M events/mo | $0.00045/event | $2,400 (hosting + events) |
   | Mixpanel | 20M events/mo | $25/mo base + overages | $300-1200 |
   | Amplitude | 10M events/mo | Custom pricing | $5,000+ (estimate) |
   ```

   **ROI Analysis**:
   - Time saved vs manual alternative
   - Revenue impact (faster features, better UX)
   - Cost avoidance (prevent downtime, security breaches)

6. **Vendor & Support Evaluation (10%)**:
   **Vendor Stability**:
   - Company funding (seed, Series A, profitable?)
   - Years in business (startup risk vs established)
   - Customer base (# of customers, notable companies)
   - Financial health (growing, stable, declining?)

   **Support Quality**:
   - Documentation quality (comprehensive, up-to-date?)
   - Response time (GitHub issues, support tickets)
   - Support channels (email, chat, dedicated account manager?)
   - SLA guarantees (uptime, support response time)

   **Security & Compliance**:
   - SOC 2 certified?
   - GDPR/CCPA compliant?
   - Penetration testing (bug bounty program?)
   - Security incident history (any breaches?)

7. **Migration Evaluation (5%)**:
   **Migration Effort**:
   - Time to migrate (hours, days, weeks?)
   - Breaking changes (API differences, rewrites needed)
   - Data migration (export/import, transformations)
   - Rollback plan (can we revert if issues?)

   **Migration Risk**:
   - 🟢 Low: Drop-in replacement, minimal changes
   - 🟡 Medium: Some refactoring, moderate risk
   - 🔴 High: Major rewrite, significant downtime risk

   **Example** (Database Migration):
   ```
   MySQL → PostgreSQL migration:
   - Effort: 2-3 weeks (schema conversion, query rewrites, testing)
   - Risk: Medium (data types differ, query syntax changes)
   - Rollback: Easy (keep MySQL running in parallel during migration)
   ```

8. **Proof of Concept (POC)**:
   **Build Small POC**:
   - Implement core use case (1-2 days max)
   - Test critical features
   - Measure performance
   - Assess developer experience

   **POC Checklist**:
   - [ ] Core feature works as expected
   - [ ] Performance meets requirements
   - [ ] Easy to understand and use
   - [ ] Integrates with existing stack
   - [ ] No major blockers or limitations

   **POC Report**:
   - What worked well
   - What was painful
   - Performance results (vs requirements)
   - Recommendation (adopt, reject, or try another tool)

9. **Decision Matrix**:
   **Score Each Criterion** (1-10 scale):
   ```
   | Criterion | Weight | Tool A | Tool B | Tool C |
   |-----------|--------|--------|--------|--------|
   | Functional | 40% | 9 (3.6) | 7 (2.8) | 8 (3.2) |
   | Performance | 25% | 7 (1.75) | 10 (2.5) | 6 (1.5) |
   | Cost | 20% | 8 (1.6) | 9 (1.8) | 5 (1.0) |
   | Vendor | 10% | 8 (0.8) | 6 (0.6) | 9 (0.9) |
   | Migration | 5% | 6 (0.3) | 9 (0.45) | 4 (0.2) |
   | **Total** | 100% | **8.05** | **8.15** | **6.8** |
   ```

   **Winner**: Tool B (8.15) - Best performance, low migration effort

   **Decision Rule**:
   - Score ≥ 8: Strongly recommend
   - Score 6-7.9: Recommend with caveats
   - Score < 6: Do not recommend

10. **Recommendation Report**:
    **Executive Summary** (1 paragraph):
    > "We recommend adopting [Tool B] for [use case]. It scores highest (8.15/10) due to excellent performance (10/10) and ease of migration (9/10). While functional features are slightly lower than Tool A, the 3.75x performance improvement and 2-day migration effort make it the clear winner."

    **Detailed Recommendation**:
    - **Choice**: [Tool name]
    - **Why**: [Top 3 reasons]
    - **Trade-offs**: [What we're giving up vs alternatives]
    - **Migration plan**: [High-level steps, timeline]
    - **Risks & mitigation**: [What could go wrong, how to prevent]

    **Next Steps**:
    1. Get stakeholder buy-in (present this report)
    2. Allocate 1 week for POC (validate assumptions)
    3. Plan migration (phased rollout or big bang?)
    4. Execute migration
    5. Monitor post-migration (performance, errors, team feedback)

## Deliverables

- Tool comparison matrix (feature, performance, cost comparison)
- Benchmark results (performance metrics, POC findings)
- Decision matrix (weighted scores by criterion)
- Recommendation report (choice, rationale, migration plan)
- POC code (if applicable, for reference)

## Evaluation Templates

**SaaS Tool Evaluation**:
- Functional: Does it integrate with our stack? Does it have required features?
- Performance: Response times, uptime SLA
- Cost: Pricing tiers, total cost of ownership
- Vendor: Company stability, support quality, security compliance
- Migration: Ease of onboarding, data import

**Open Source Library Evaluation**:
- Functional: Feature completeness, extensibility
- Performance: Benchmarks vs alternatives
- Cost: $0 license, but engineer time to integrate/maintain
- Vendor: Community size, maintainer responsiveness, longevity
- Migration: API compatibility, breaking changes

**Infrastructure/Cloud Provider Evaluation**:
- Functional: Services offered, regions, integrations
- Performance: Latency, throughput, uptime
- Cost: Pricing model (pay-as-you-go, reserved, spot), egress fees
- Vendor: SLA, support quality, compliance certifications
- Migration: Multi-cloud strategy, vendor lock-in, data export

## Common Pitfalls to Avoid

**Shiny Object Syndrome**:
- ❌ Adopt newest/trendiest tool without evaluation
- ✅ Evaluate based on criteria, not hype

**Ignoring Total Cost of Ownership**:
- ❌ Focus only on license cost, ignore integration time
- ✅ Calculate TCO (license + infrastructure + engineering time)

**Not Building POC**:
- ❌ Decide based on docs/marketing alone
- ✅ Build small POC to validate assumptions

**Analysis Paralysis**:
- ❌ Spend weeks evaluating, never decide
- ✅ Timebox evaluation (1-2 weeks max), make decision

**Sunk Cost Fallacy**:
- ❌ Keep using tool because we invested time, even if it's wrong
- ✅ Willing to migrate if better option exists

## Success Criteria

- **Data-driven decision**: Clear winner based on weighted criteria
- **Stakeholder alignment**: Team agrees with recommendation
- **Successful POC**: Core use case validated
- **No regrets**: No major surprises post-adoption
- **Improved outcomes**: Tool delivers expected benefits (performance, DX, cost savings)

**Route to**: System Coordinator → Testing Coordinator → tool-evaluator
