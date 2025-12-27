# Run Growth Experiment

I need you to design and execute a data-driven growth experiment to improve a key metric.

## Context

**Experiment Goal**: $ARGUMENTS

(Examples: "Increase signup conversion by 20%", "Reduce churn from 5% to 3%", "Improve activation rate", "Double referral rate")

## Your Task

Route this to the **growth-hacker** agent who will:

1. **Define Hypothesis**:
   - Current state: [metric] is at [current value]
   - Problem: [root cause analysis]
   - Hypothesis: "We believe that [change] will result in [outcome] because [reason]"
   - Success metric: [specific KPI] improves by [target %]
   - Secondary metrics: [other metrics to track]

   **Example**:
   > "We believe that adding social proof (testimonials + user count) to the signup page will increase conversion by 15% because users need trust signals before committing their email."

2. **Prioritize with ICE Framework**:
   - **Impact**: How much will this move the needle? (1-10)
   - **Confidence**: How sure are we this will work? (1-10)
   - **Ease**: How easy is this to implement? (1-10)
   - **ICE Score**: (Impact + Confidence + Ease) / 3
   - Run highest-scoring experiments first

3. **Design Experiment**:
   **A/B Test Setup**:
   - Control group (A): Current experience
   - Treatment group (B): Your hypothesis
   - Sample size calculator: Ensure statistical significance
   - Test duration: Minimum 1-2 weeks (or until significance)
   - Traffic split: 50/50 (or 90/10 for risky changes)

   **Variables to Test** (pick ONE per experiment):
   - Messaging (headline, value prop, CTA copy)
   - Design (layout, colors, button size/placement)
   - Pricing (price points, plans, discounts)
   - Onboarding (steps, friction points, time-to-value)
   - Referral mechanics (incentives, sharing flow)

4. **Implementation Plan**:
   - Define variants (A vs B)
   - Set up tracking (Google Analytics, Mixpanel, Amplitude)
   - Create experiment in tool (Optimizely, VWO, PostHog, or custom)
   - QA checklist:
     - [ ] Tracking fires correctly
     - [ ] Both variants render properly
     - [ ] No edge case bugs
     - [ ] Random assignment working

5. **Run Experiment**:
   **No Peeking Rule**: Don't stop early even if results look good
   - Minimum runtime: 1 week or 100 conversions per variant
   - Statistical significance: p-value < 0.05
   - Confidence interval: 95%

   **Monitor Daily**:
   - Sample size progress
   - Technical errors (tracking failures, broken variants)
   - Outliers (unusual traffic spikes, bot traffic)

6. **Analyze Results**:
   **Statistical Analysis**:
   - Conversion rate: A vs B
   - Relative uplift: (B - A) / A × 100%
   - Statistical significance: p < 0.05?
   - Confidence interval: [lower bound, upper bound]

   **Decision Framework**:
   - ✅ **Ship it**: Significant positive result (p < 0.05, uplift > 5%)
   - ❌ **Kill it**: Significant negative result
   - 🔄 **Iterate**: Inconclusive, test variation
   - 📊 **Segment**: Analyze by user cohort (new vs returning, mobile vs desktop)

7. **Document Learnings**:
   - What we tested
   - What we learned
   - What we're doing next
   - Add to experiment knowledge base

## Experiment Types

**Acquisition Experiments**:
- Landing page optimization (headline, hero image, social proof)
- Ad creative testing (copy, visuals, CTAs)
- SEO experiments (title tags, meta descriptions, content)
- Referral program mechanics (incentives, sharing flow)

**Activation Experiments**:
- Onboarding flow (steps, friction, time-to-aha moment)
- Email nurture sequences (timing, content, CTAs)
- In-app tooltips and guidance
- First-run experience (tutorials, sample data)

**Retention Experiments**:
- Email cadence (daily, weekly, triggered)
- Feature adoption nudges
- Re-engagement campaigns
- Churn prevention (exit surveys, win-back offers)

**Revenue Experiments**:
- Pricing tests (price points, anchoring, discounts)
- Upgrade prompts (timing, messaging, incentives)
- Upsell/cross-sell flows
- Payment page optimization

**Referral Experiments**:
- Referral incentives (both sides, one side, no incentive)
- Sharing mechanisms (email, social, link)
- Referral ask timing (after success moment, post-purchase)

## Growth Hacking Tactics Library

**Quick Wins** (low effort, high impact):
- Add social proof to CTAs ("Join 10,000+ users")
- Reduce form fields (remove unnecessary inputs)
- Improve button copy ("Get Started Free" vs "Sign Up")
- Add exit-intent popups (discount offer, value reminder)
- Implement referral program (give $10, get $10)

**Medium Effort**:
- Email drip campaigns (onboarding, activation, retention)
- Product-led growth (free trial → paid conversion)
- Viral loops (invite friends to unlock features)
- Community building (Slack, Discord, forums)

**High Effort** (big swings):
- Build marketplace/platform (two-sided network effects)
- Content marketing machine (SEO, blog, YouTube)
- Partnerships and integrations (embed in other tools)
- Freemium model with viral sharing

## Deliverables

- Experiment brief (hypothesis, metrics, variants)
- A/B test setup (tracking, variants, sample size)
- Daily monitoring dashboard
- Statistical analysis report (results, significance, decision)
- Experiment documentation (what we learned, next steps)

## Success Criteria

- **Statistical rigor**: p < 0.05, minimum sample size met
- **Actionable insight**: Clear decision (ship, kill, iterate)
- **Knowledge capture**: Documented for future experiments
- **Metric improvement**: [target metric] improved by [target %]

## Experimentation Velocity

- Run 2-4 experiments per month
- Ship winners immediately
- Build experiment backlog (20+ ideas)
- Celebrate wins AND losses (learning is the goal)

**Route to**: System Coordinator → Marketing Coordinator → growth-hacker
