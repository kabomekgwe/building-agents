# System-Level Routing Logic

**Purpose**: Define how user requests route from system coordinator to domain coordinators
**Last Updated**: 2025-12-27
**Version**: 1.0.0

---

## Overview

This file contains the master routing table used by the system coordinator to route user requests to the appropriate domain coordinator.

---

## Primary Routing Table

| Keywords | Domain | Priority | Confidence Threshold |
|----------|--------|----------|---------------------|
| code, API, build, frontend, backend, mobile, AI, deploy, prototype, implement, develop, React, Next.js, database, server | **engineering** | 1 | 70% |
| design, UI, UX, brand, visual, interface, wireframe, mockup, user research, Figma, screen, component, layout | **design** | 2 | 70% |
| marketing, TikTok, Instagram, Twitter, Reddit, growth, campaign, ASO, content, social, viral, engagement | **marketing** | 3 | 70% |
| product, research, feedback, trends, analysis, market, user, competitive, insight, opportunity | **product** | 4 | 70% |
| plan, sprint, ship, feature, experiment, track, studio, produce, project, launch, release, deploy | **project-management** | 5 | 70% |
| support, analytics, infrastructure, legal, compliance, finance, operations, ticket, monitoring, uptime | **studio-operations** | 6 | 70% |
| test, benchmark, evaluate, performance, workflow, tool, quality, QA, load, stress, coverage | **testing** | 7 | 70% |

---

## Routing Algorithm

### Step 1: Keyword Extraction

Extract all potential routing keywords from user request (case-insensitive):

```python
def extract_keywords(request: str) -> list[str]:
    # Lowercase the request
    request_lower = request.lower()

    # Extract words (split on whitespace and punctuation)
    words = re.findall(r'\b\w+\b', request_lower)

    return words
```

---

### Step 2: Domain Scoring

Score each domain based on keyword matches:

```python
def score_domain(request_words: list[str], domain_keywords: list[str]) -> int:
    score = 0

    for keyword in domain_keywords:
        # Exact word match: +10 points
        if keyword in request_words:
            score += 10
        # Partial match within a word: +5 points
        elif any(keyword in word for word in request_words):
            score += 5

    return score
```

---

### Step 3: Domain Selection

```python
def select_domain(scores: dict[str, int]) -> str | None:
    # Get domain with highest score
    max_score = max(scores.values())

    # If no matches, return None (request clarification)
    if max_score == 0:
        return None

    # Get all domains with max score
    top_domains = [d for d, s in scores.items() if s == max_score]

    # If single winner, return it
    if len(top_domains) == 1:
        return top_domains[0]

    # If tie, use priority order
    priority_order = ['engineering', 'design', 'marketing', 'product',
                      'project-management', 'studio-operations', 'testing']

    for domain in priority_order:
        if domain in top_domains:
            return domain

    return None
```

---

## Multi-Domain Detection

Detect when a request requires multiple domains:

### Indicators

1. **Multiple high-scoring domains** (within 20% of each other)
2. **Sequential keywords**: "and", "then", "after", "→"
3. **Explicit multi-domain phrases**: "design and build", "research then create", "from X to Y"

### Example

```
Request: "Design and build a landing page"

Scores:
- design: 10 (keyword: "design")
- engineering: 10 (keyword: "build")
- Others: 0

Detection: Two domains with equal scores → Multi-domain workflow
Sequence: design → engineering
```

---

## Routing Confidence

Calculate confidence in routing decision:

```python
def calculate_confidence(selected_score: int, total_score: int) -> float:
    if total_score == 0:
        return 0.0

    confidence = (selected_score / total_score) * 100
    return confidence
```

### Confidence Thresholds

- **95-100%**: Very High - Route immediately
- **75-94%**: High - Route with note
- **50-74%**: Medium - Route but flag for review
- **25-49%**: Low - Ask user to confirm domain
- **0-24%**: No Confidence - Request clarification

---

## Special Routing Cases

### Case 1: Ambiguous Keywords

Some keywords could apply to multiple domains:

| Keyword | Could Route To | Resolution |
|---------|---------------|------------|
| "create" | engineering (build), design (mockup), marketing (content) | Look for context words |
| "optimize" | engineering (performance), testing (workflow), marketing (conversion) | Check object being optimized |
| "test" | engineering (unit tests), testing (QA), product (A/B test) | Check test type mentioned |

**Resolution Strategy**: Look at surrounding context words to disambiguate

---

### Case 2: Cross-Domain Requests

Requests that explicitly need multiple domains:

**Pattern**: "[Action1] and [Action2]"

**Examples**:
- "Design and build" → design + engineering
- "Research and create content" → product + marketing
- "Build and deploy" → engineering (may handle both internally)

**Handling**: System coordinator orchestrates sequential or parallel execution

---

### Case 3: Domain-Specific Variants

Some requests use domain jargon:

**Engineering**: "scaffold", "refactor", "compile", "containerize"
**Design**: "kerning", "whitespace", "hierarchy", "affordance"
**Marketing**: "CTR", "impressions", "engagement rate", "virality"
**Product**: "persona", "user journey", "jobs to be done"

**Action**: Add these to domain keyword lists in their respective coordinators

---

## Routing Examples

### Example 1: Clear Single Domain

```
Request: "Build a React component for user authentication"

Keyword Extraction: [build, react, component, user, authentication]

Domain Scoring:
- engineering: 30 (build=10, react=10, component=10)
- design: 5 (component=5)
- Others: 0

Selected: engineering (30/35 = 86% confidence)
Route to: engineering coordinator
```

---

### Example 2: Multi-Domain

```
Request: "Design a landing page mockup, then implement it in Next.js"

Keyword Extraction: [design, landing, page, mockup, implement, next.js]

Domain Scoring:
- design: 20 (design=10, mockup=10)
- engineering: 20 (implement=10, next.js=10)

Selected: Multi-domain workflow (tie detected, sequential keywords "then")
Route to: design coordinator first, then engineering coordinator
```

---

### Example 3: Ambiguous Request

```
Request: "Make it better"

Keyword Extraction: [make, better]

Domain Scoring:
- All domains: 0 (no routing keywords)

Selected: None (0% confidence)
Action: Request clarification from user
```

---

## Fallback Strategies

### Strategy 1: Recent Context

If no clear match, check recent conversation:
- What was the last domain used?
- Is this a follow-up request?
- If yes, route to same domain

---

### Strategy 2: User Clarification

Ask user to specify domain:

```
Unable to route request automatically.

Your request: "[request]"

Which domain should handle this?
1. Engineering (code, APIs, apps)
2. Design (UI, UX, brand)
3. Marketing (social, campaigns, content)
4. Product (research, feedback, planning)
5. Project Management (shipping, experiments)
6. Operations (support, analytics, infrastructure)
7. Testing (QA, performance, benchmarks)

Or provide more specific keywords.
```

---

### Strategy 3: Default to General Agent

For truly ambiguous requests that need general help:
- Route to user's global coordinator (if exists)
- Or prompt user to rephrase with domain-specific keywords

---

## Routing Metrics

Track these metrics to improve routing over time:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Routing Accuracy | > 95% | Correct domain on first try |
| Avg Confidence | > 80% | Average confidence score |
| Clarification Rate | < 5% | % of requests needing clarification |
| Multi-Domain Detection | > 90% | Correctly identify multi-domain needs |

---

## Keyword Maintenance

### Adding New Keywords

When adding keywords to a domain:

1. Ensure keyword is specific to that domain
2. Check for conflicts with other domains
3. Add to domain coordinator routing table
4. Test with sample requests
5. Monitor routing accuracy

---

### Removing Keywords

When a keyword causes mis-routing:

1. Identify which requests it mis-routes
2. Consider making it context-dependent
3. If truly problematic, remove from routing table
4. Document in change log

---

## Change Log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| 2025-12-27 | Initial routing table | System launch | Baseline |

---

## References

- **System Coordinator**: `.claude/agents/_core/system-coordinator.md`
- **Domain Coordinators**: `.claude/agents/[domain]/_coordinator.md`
- **Routing Logic Docs**: `.claude/docs/ROUTING_LOGIC.md`
