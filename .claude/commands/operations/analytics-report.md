# Generate Analytics Report

I need you to create a comprehensive analytics report with insights and recommendations.

## Context

**Report Type**: $ARGUMENTS

(Examples: "Monthly product metrics", "User acquisition analysis", "Feature adoption report", "Churn analysis", "Revenue dashboard", "Experiment results summary")

## Your Task

Route this to the **analytics-reporter** agent who will:

1. **Define Report Scope**:
   **Report Type**:
   - **Executive Summary** (high-level metrics for leadership)
   - **Product Analytics** (feature usage, engagement, retention)
   - **Growth Metrics** (acquisition, activation, referral)
   - **Revenue Analysis** (MRR, ARR, LTV, CAC)
   - **User Behavior** (cohorts, funnels, paths)
   - **Experiment Results** (A/B tests, feature flags)
   - **Custom Analysis** (specific question or hypothesis)

   **Time Period**:
   - Daily: Real-time monitoring
   - Weekly: Trend tracking
   - Monthly: Business reviews
   - Quarterly: Strategic planning
   - YoY: Long-term trends

   **Audience**:
   - Executives: High-level, business impact
   - Product team: Feature-level, user behavior
   - Engineering: Performance, errors, technical metrics
   - Marketing: Acquisition, conversion, campaigns
   - Sales: Pipeline, revenue, customer health

2. **Data Collection**:
   **Data Sources**:
   - Product analytics: Mixpanel, Amplitude, PostHog
   - Web analytics: Google Analytics, Plausible
   - Database: PostgreSQL, MySQL (user data, transactions)
   - CRM: HubSpot, Salesforce (customer data)
   - Support: Zendesk, Intercom (ticket data)
   - Finance: Stripe, Chargebee (revenue data)
   - Marketing: Google Ads, Facebook Ads, email platforms

   **Data Quality Checks**:
   - Completeness: Any missing data? (e.g., tracking not firing)
   - Accuracy: Do numbers make sense? (no anomalies or outliers)
   - Consistency: Do sources agree? (reconcile discrepancies)
   - Timeliness: Is data fresh? (check last updated timestamp)

3. **Key Metrics by Category**:

   ### **AARRR Pirate Metrics** (Acquisition, Activation, Retention, Revenue, Referral):

   **Acquisition**:
   - Traffic sources (organic, paid, referral, direct)
   - Cost per acquisition (CPA) by channel
   - Signup conversion rate (visitors → signups)
   - Top landing pages (conversion rate)

   **Activation**:
   - Activation rate (signups → activated users)
   - Time to activation (how long to first value)
   - Onboarding completion rate (% completing tutorial)
   - Aha moment triggers (actions correlated with activation)

   **Retention**:
   - Day 1, 7, 30, 90 retention rates
   - Cohort retention curves (by signup month)
   - Churn rate (monthly, annual)
   - Resurrection rate (churned users coming back)

   **Revenue**:
   - Monthly Recurring Revenue (MRR)
   - Annual Recurring Revenue (ARR)
   - Average Revenue Per User (ARPU)
   - Customer Lifetime Value (LTV)
   - LTV:CAC ratio (target: > 3:1)

   **Referral**:
   - Referral rate (% users referring others)
   - Viral coefficient (k-factor, target: > 1)
   - Referrals per user
   - Referral conversion rate (invites → signups)

   ### **Product Health Metrics**:
   - Daily Active Users (DAU)
   - Weekly Active Users (WAU)
   - Monthly Active Users (MAU)
   - DAU/MAU ratio (stickiness, target: > 20%)
   - Session duration (time spent per visit)
   - Sessions per user (visit frequency)
   - Feature adoption (% users using feature)
   - Power user actions (key behaviors of top 10% users)

   ### **Business Metrics**:
   - Gross Merchandise Value (GMV) (if marketplace)
   - Burn rate (monthly cash spend)
   - Runway (months until $0)
   - Growth rate (MoM, YoY)
   - Net Revenue Retention (NRR) (target: > 100%)

4. **Data Visualization**:
   **Chart Types by Use Case**:
   - **Line chart**: Trends over time (DAU, MRR growth)
   - **Bar chart**: Comparisons (traffic by source, feature usage)
   - **Pie chart**: Composition (user segments, plan distribution)
   - **Funnel chart**: Conversion flows (signup → activation → paid)
   - **Cohort table**: Retention by signup month
   - **Heatmap**: Activity patterns (time of day, day of week)
   - **Scatter plot**: Correlations (engagement vs retention)

   **Visualization Best Practices**:
   - Clear titles (what is being shown)
   - Axis labels (units, time period)
   - Legend (if multiple series)
   - Annotations (highlight key events, e.g., "Feature launch")
   - Color coding (green for good, red for bad)
   - Comparison lines (vs last period, vs target)

5. **Analysis & Insights**:
   **Identify Trends**:
   - What's going up? (positive signals)
   - What's going down? (red flags)
   - What's flat? (stagnation, need action)
   - Seasonality: Weekly, monthly, yearly patterns
   - Anomalies: Spikes or drops (explain why)

   **Segment Analysis**:
   - Compare cohorts (new users vs power users)
   - Compare channels (organic vs paid)
   - Compare plans (free vs paid, starter vs pro)
   - Compare geographies (US vs EU vs APAC)
   - Compare devices (mobile vs desktop)

   **Correlation Analysis**:
   - What behaviors predict retention?
   - What actions lead to conversion?
   - What features drive engagement?
   - What user attributes correlate with LTV?

   **Root Cause Analysis** (for negative trends):
   - Why is churn increasing? (exit surveys, cohort analysis)
   - Why did signups drop? (traffic analysis, funnel breakdown)
   - Why is feature adoption low? (UX issues, discoverability)

6. **Report Structure**:
   **Executive Summary** (1 page):
   - Top 3-5 key findings (bullet points)
   - Most important metric (headline number)
   - Key recommendations (action items)

   **Main Report**:
   - **Overview**: Time period, data sources, methodology
   - **Key Metrics Dashboard**: Scorecard with vs last period
   - **Detailed Analysis by Category**:
     - Acquisition: Traffic, signups, CPA
     - Activation: Onboarding, time to value
     - Retention: Cohorts, churn
     - Revenue: MRR, ARPU, LTV
     - Referral: K-factor, viral loops
   - **Insights**: What the data is telling us
   - **Recommendations**: Specific actions with expected impact

   **Appendix**:
   - Data definitions (how metrics calculated)
   - Methodology notes (assumptions, limitations)
   - Raw data tables (for deep dives)

7. **Insights Framework** (So What? Test):
   **Transform Data → Insights → Actions**:
   - ❌ **Data**: "Signups increased 20%"
   - ✅ **Insight**: "Signups increased 20% due to viral TikTok video, but activation rate dropped 10% because new users don't match our ideal customer profile"
   - ✅ **Action**: "Target similar viral content but add qualification questions to onboarding to filter out unqualified users"

   **Insight Quality Checklist**:
   - [ ] Specific (not vague)
   - [ ] Actionable (what should we do?)
   - [ ] Supported by data (not just opinion)
   - [ ] Surprising or non-obvious (not "water is wet")

8. **Recommendations**:
   **Prioritization** (Impact × Confidence × Ease):
   - **Quick Wins**: High impact, high confidence, low effort (do immediately)
   - **Big Bets**: High impact, high confidence, high effort (plan sprint)
   - **Maybes**: Medium impact, medium confidence (test with experiment)
   - **Deprioritize**: Low impact (backlog or ignore)

   **Recommendation Format**:
   ```
   **Recommendation**: [Action to take]

   **Why**: [Data insight supporting this]

   **Expected Impact**: [Metric improvement, e.g., "+10% retention"]

   **Effort**: [Low/Medium/High]

   **Owner**: [Team or person]

   **Timeline**: [When to implement]
   ```

9. **Report Formats**:
   **Static Report** (PDF, Slides):
   - Best for: Monthly/quarterly reviews, presentations
   - Tools: Google Slides, PowerPoint, Notion, Canva
   - Include: Charts, insights, recommendations

   **Interactive Dashboard** (Live Data):
   - Best for: Real-time monitoring, self-service analytics
   - Tools: Metabase, Redash, Looker, Tableau, PowerBI
   - Include: Filters, drill-downs, date ranges

   **Email Digest** (Automated):
   - Best for: Daily/weekly updates, alerts
   - Tools: Custom scripts, Zapier, Make
   - Include: Key metrics, changes vs last period, anomalies

10. **Distribution & Follow-Up**:
    **Share Report**:
    - Email to stakeholders (PDF or link)
    - Present in team meeting (deck + discussion)
    - Post in Slack (summary + link to full report)
    - Archive in knowledge base (historical reference)

    **Review Meeting Agenda**:
    - 5 min: Review key metrics
    - 10 min: Discuss insights (Q&A)
    - 10 min: Prioritize recommendations (vote, assign owners)
    - 5 min: Action items and follow-up

    **Track Impact**:
    - Monitor metrics after implementing recommendations
    - Measure ROI (did the action move the metric?)
    - Iterate (double down on what works, kill what doesn't)

## Deliverables

- Executive summary (1-page key findings)
- Full analytics report (charts, insights, recommendations)
- Interactive dashboard (if applicable)
- Action items (prioritized, with owners)
- Data files (for further analysis)

## Sample Report Templates

**Monthly Product Report**:
```
# Monthly Product Metrics - [Month Year]

## Executive Summary
- MAU: 10,000 (+15% MoM)
- Retention (D30): 45% (+3% vs last month)
- Top feature: [Feature X] used by 60% of users
- Key insight: New onboarding flow improved activation by 20%

## Acquisition
- Signups: 1,500 (+20% MoM)
- Top channel: Organic search (60%), TikTok (25%)
- CPA: $15 (down from $18 last month)

## Activation
- Activation rate: 70% (+10% MoM)
- Time to activation: 2.5 days (down from 4 days)
- Insight: New tutorial reduced friction

## Retention
- D1: 80%, D7: 55%, D30: 45%
- Churn rate: 5% (stable)
- Power users (10+ sessions/month): 15% of base

## Revenue
- MRR: $50,000 (+12% MoM)
- ARPU: $5
- LTV: $150, CAC: $20, LTV:CAC = 7.5:1 ✅

## Recommendations
1. **Scale TikTok**: Viral content driving quality signups → Invest $5k in TikTok ads
2. **Onboarding experiment**: Test removing step 2 → Expected +5% activation
3. **Power user study**: Interview 10 power users → Identify retention drivers
```

**Experiment Results Report**:
```
# Experiment Results: New Pricing Page

## Hypothesis
Removing 3-tier pricing and showing single "Pro" plan will increase conversion by 20%

## Results
- Control: 1000 users, 50 conversions = 5.0%
- Treatment: 1000 users, 65 conversions = 6.5%
- Relative lift: +30% ✅
- Statistical significance: p = 0.02 (significant)

## Insights
- Treatment reduced decision paralysis
- Mobile conversion improved most (+40%)
- No impact on revenue per user (ARPU stable)

## Recommendation
**Ship to 100%**: Roll out new pricing page to all users
```

## Success Criteria

- **Actionable insights**: Clear recommendations with data support
- **Stakeholder engagement**: Report read and discussed by team
- **Impact tracking**: Actions taken, metrics improved
- **Cadence**: Reports delivered on time (monthly, weekly)

## Analytics Tools Reference

**Product Analytics**: Mixpanel, Amplitude, PostHog, Heap
**Web Analytics**: Google Analytics, Plausible, Umami
**Dashboards**: Metabase, Redash, Looker, Tableau
**Visualization**: Chart.js, D3.js, Plotly, Google Charts
**Experimentation**: Optimizely, VWO, LaunchDarkly, PostHog

**Route to**: System Coordinator → Studio Operations Coordinator → analytics-reporter
