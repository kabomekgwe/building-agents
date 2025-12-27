# Analyze User Feedback

I need you to synthesize user feedback and extract actionable product insights.

## Context

**Feedback Source**: $ARGUMENTS

(Examples: Support tickets, user interviews, NPS surveys, app reviews, social media)

## Your Task

Route this to the **feedback-synthesizer** agent who will:

1. **Collect Feedback**:
   - Gather from specified sources
   - Support tickets (Zendesk, Intercom)
   - User interviews and research sessions
   - NPS/CSAT surveys
   - App store reviews (iOS, Android)
   - Social media mentions

2. **Categorize & Theme**:
   - Group feedback by theme (feature requests, bugs, UX issues)
   - Tag by severity (critical, high, medium, low)
   - Identify patterns and recurring issues
   - Segment by user type (free, paid, enterprise)

3. **Quantify Impact**:
   - Count frequency of each issue/request
   - Estimate affected users
   - Calculate NPS impact
   - Prioritize by impact × frequency

4. **Extract Insights**:
   - Top 5 user pain points
   - Most requested features
   - Common UX friction points
   - Churn reasons (from exit surveys)
   - Delight moments (what users love)

5. **Recommendations**:
   - Quick wins (high impact, low effort)
   - Strategic initiatives (high impact, high effort)
   - Bugs to fix immediately
   - Features to prioritize

## Deliverables

- Feedback analysis report
- Thematic breakdown with counts
- User quotes (supporting evidence)
- Prioritized action items
- Roadmap recommendations

## Analysis Framework

**Categorization**:
- Feature Requests
- Bug Reports
- UX/Usability Issues
- Performance Complaints
- Documentation Gaps
- Pricing Feedback

**Prioritization** (RICE):
- Reach: How many users affected?
- Impact: How much does it move key metrics?
- Confidence: How certain are we?
- Effort: How hard to implement?

**Route to**: System Coordinator → Product Coordinator → feedback-synthesizer
