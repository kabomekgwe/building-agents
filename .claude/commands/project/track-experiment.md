# Track Product Experiment

I need you to set up tracking, run, and analyze a product experiment (A/B test, feature flag, beta launch).

## Context

**Experiment Details**: $ARGUMENTS

(Examples: "A/B test new onboarding flow", "Beta launch for enterprise features", "Feature flag for AI assistant", "Pricing experiment for annual plans")

## Your Task

Route this to the **experiment-tracker** agent who will:

1. **Experiment Setup**:
   **Define Hypothesis**:
   - **Current state**: [metric] is at [current value]
   - **Hypothesis**: "We believe that [change] will result in [outcome] because [reason]"
   - **Primary metric**: [KPI to move, e.g., conversion rate, retention, revenue]
   - **Secondary metrics**: [other metrics to watch, including guardrails]
   - **Success criteria**: [specific improvement target, e.g., "+10% conversion"]

   **Example**:
   > "We believe that simplifying onboarding from 5 steps to 3 steps will increase activation rate by 15% because users currently drop off due to friction."

   **Experiment Type**:
   - **A/B Test**: Compare two variants (control vs treatment)
   - **Multivariate Test**: Test multiple variables simultaneously
   - **Feature Flag**: Gradual rollout to increasing % of users
   - **Beta Launch**: Limited release to specific user segment

2. **Sample Size & Duration**:
   **Sample Size Calculation**:
   - Baseline metric: [current value, e.g., 20% conversion]
   - Minimum detectable effect: [e.g., +10% relative lift]
   - Statistical power: 80% (standard)
   - Significance level: 95% (p < 0.05)
   - Use calculator: Evan Miller, Optimizely, or custom

   **Duration Calculation**:
   - Traffic volume: [daily users exposed]
   - Days to significance: [sample size ÷ daily traffic]
   - Minimum runtime: 1 week (account for weekly seasonality)
   - Maximum runtime: 4 weeks (if no result, declare inconclusive)

   **Example**:
   > With 1000 daily signups, 20% baseline conversion, and targeting +10% lift:
   > - Need ~5000 users per variant (10,000 total)
   > - Runtime: 10 days minimum

3. **Variant Design**:
   **Control (A) - Existing Experience**:
   - Current user flow
   - Baseline measurement
   - No changes

   **Treatment (B) - New Experience**:
   - Clear description of change
   - Hypothesis-driven variation
   - Only ONE major change (isolate variable)

   **Multi-Variant Setup** (if testing multiple ideas):
   - A: Control
   - B: Treatment 1
   - C: Treatment 2
   - D: Treatment 3
   - Note: Requires larger sample size (split traffic 4 ways)

4. **Implementation** (feature flags or A/B test tool):
   **Feature Flag Setup**:
   - Create feature flag (LaunchDarkly, Unleash, PostHog, or custom)
   - Define targeting rules:
     - Random allocation (50/50, 90/10, etc.)
     - User segment (new users, power users, specific cohorts)
     - Geographic (US-only, EU-only, etc.)
   - Implement flag checks in code:
     ```typescript
     if (featureFlag.isEnabled('new-onboarding')) {
       // Show treatment experience
     } else {
       // Show control experience
     }
     ```

   **A/B Test Tool Setup** (Optimizely, VWO, Google Optimize):
   - Define variations (control vs treatment)
   - Set traffic allocation (50/50 or custom)
   - Install tracking snippet
   - Define conversion goals

5. **Tracking Setup**:
   **Event Instrumentation**:
   - Track key events:
     - Experiment exposure (user sees variant A or B)
     - Primary conversion event (signup, purchase, activation)
     - Secondary events (engagement, time on page, feature usage)
     - Guardrail metrics (errors, support tickets, churn)
   - Implementation:
     ```typescript
     // Track experiment exposure
     analytics.track('Experiment Viewed', {
       experimentId: 'onboarding-v2',
       variant: 'treatment',
       userId: user.id
     })

     // Track conversion
     analytics.track('Signup Completed', {
       experimentId: 'onboarding-v2',
       variant: 'treatment',
       userId: user.id
     })
     ```

   **Metrics Dashboard**:
   - Real-time metrics (exposures, conversions by variant)
   - Statistical significance indicator
   - Confidence intervals
   - Visualizations (funnel, time series)

6. **Pre-Launch Checklist**:
   - [ ] Hypothesis documented
   - [ ] Sample size calculated
   - [ ] Variants defined (A vs B)
   - [ ] Feature flag/A/B test configured
   - [ ] Tracking events firing correctly (QA test on staging)
   - [ ] Dashboard set up (Mixpanel, Amplitude, or custom)
   - [ ] No bias in assignment (truly random)
   - [ ] Team aligned on success criteria
   - [ ] Guardrail metrics identified (watch for negative impacts)
   - [ ] Rollback plan defined (how to turn off quickly)

7. **Run Experiment**:
   **Launch**:
   - Enable feature flag or start A/B test
   - Verify traffic split (50/50 or desired allocation)
   - Monitor first hour (no errors, tracking working)

   **No Peeking Rule**:
   - Don't check results daily (increases false positives)
   - Wait for statistical significance (p < 0.05)
   - Minimum runtime (1 week or sample size met)

   **Daily Monitoring** (operational health, not results):
   - Tracking events firing correctly?
   - Error rates normal?
   - Traffic allocation as expected?
   - No system degradation?

8. **Statistical Analysis**:
   **Conversion Rate Calculation**:
   - Control: [conversions A] / [users A] = X%
   - Treatment: [conversions B] / [users B] = Y%
   - Relative lift: (Y - X) / X × 100%

   **Statistical Significance**:
   - Run Chi-square test or t-test
   - p-value < 0.05 = statistically significant
   - Confidence interval: [lower bound, upper bound]

   **Example Results**:
   > Control: 1000 users, 200 conversions = 20.0%
   > Treatment: 1000 users, 230 conversions = 23.0%
   > Relative lift: +15%
   > p-value: 0.03 (statistically significant!)

   **Guardrail Metrics Check**:
   - Did treatment harm any important metrics?
   - Error rates, support tickets, churn, revenue
   - If guardrails violated, consider not shipping

9. **Decision Framework**:
   **Ship (100% rollout)**:
   - ✅ Statistically significant positive result (p < 0.05)
   - ✅ Meaningful lift (> 5% relative improvement)
   - ✅ No negative impact on guardrail metrics
   - ✅ Practical to maintain (engineering cost justified)

   **Kill (revert to control)**:
   - ❌ Statistically significant negative result
   - ❌ Positive result but high engineering cost
   - ❌ Violates guardrail metrics (increased errors, churn)

   **Iterate (test variation)**:
   - 🔄 Inconclusive result (not statistically significant)
   - 🔄 Positive trend but needs refinement
   - 🔄 Learned something valuable, test new hypothesis

   **Segment Analysis** (before final decision):
   - Does treatment work for specific segments? (new users vs returning, mobile vs desktop, geography)
   - Consider targeted rollout (ship only to winning segment)

10. **Post-Experiment Actions**:
    **If Shipping (100% rollout)**:
    - Disable feature flag (remove technical debt)
    - Clean up variant code (remove old experience)
    - Update documentation
    - Announce results to team
    - Add learnings to experiment knowledge base

    **If Iterating**:
    - Document learnings (what worked, what didn't)
    - Design follow-up experiment
    - Refine hypothesis based on data

    **If Killing**:
    - Turn off experiment
    - Remove treatment code
    - Document why it failed (prevent future repeats)
    - Celebrate learning (failed experiments teach valuable lessons)

## Deliverables

- Experiment brief (hypothesis, metrics, variants)
- Sample size and duration calculation
- Implementation (feature flag or A/B test setup)
- Tracking verification (events firing correctly)
- Metrics dashboard (real-time experiment results)
- Statistical analysis report (results, significance, confidence interval)
- Decision recommendation (ship, kill, or iterate)
- Experiment documentation (learnings, next steps)

## Experiment Types

**Onboarding Experiments**:
- Signup flow (steps, fields, CTAs)
- Activation flow (time to first value)
- Tutorial content (tooltips, videos, walkthroughs)

**Monetization Experiments**:
- Pricing (price points, plans, discounts)
- Upgrade prompts (timing, messaging, incentives)
- Payment page (layout, trust signals, urgency)

**Engagement Experiments**:
- Feature discovery (placement, prominence)
- Email cadence (frequency, content, timing)
- Notifications (in-app, push, email)

**Retention Experiments**:
- Re-engagement campaigns (win-back offers)
- Habit formation (streaks, reminders)
- Churn prevention (exit surveys, offers)

## Experiment Tracking Dashboard

**Key Metrics to Display**:
- Exposures: [users shown control vs treatment]
- Conversions: [users who converted, by variant]
- Conversion rate: [% conversion, by variant]
- Relative lift: [% improvement of treatment vs control]
- Statistical significance: [p-value, confidence interval]
- Days running: [time elapsed]
- Sample size progress: [% of target sample size reached]

**Visualization**:
- Funnel chart (steps in user journey, drop-off by variant)
- Time series (daily conversion rate trends)
- Confidence interval chart (range of likely true effect)

## Common Pitfalls to Avoid

**Peeking Too Early**:
- ❌ Checking results daily increases false positives
- ✅ Wait for statistical significance (p < 0.05) and minimum sample size

**Multiple Comparisons**:
- ❌ Testing 20 metrics increases chance of false positive
- ✅ Define ONE primary metric before experiment starts

**Insufficient Sample Size**:
- ❌ Stopping too early (not enough power to detect effect)
- ✅ Calculate sample size upfront, run until reached

**Novelty Effect**:
- ❌ Treatment wins because it's new (effect fades over time)
- ✅ Run for minimum 1-2 weeks to normalize

**Selection Bias**:
- ❌ Non-random assignment (e.g., new users get treatment)
- ✅ Truly random allocation (50/50 split)

## Success Criteria

- **Statistical rigor**: p < 0.05, minimum sample size met
- **Actionable result**: Clear decision (ship, kill, or iterate)
- **Knowledge capture**: Learnings documented for future experiments
- **Velocity**: Run 2-4 experiments per month (build experimentation culture)

**Route to**: System Coordinator → Project Management Coordinator → experiment-tracker
