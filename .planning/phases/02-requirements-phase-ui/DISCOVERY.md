# Phase 2: Requirements Phase UI - Discovery

**Research Date:** 2025-12-28
**Phase Goal:** Build guided interface for PRD generation with Claude API integration
**Research Topics:** PRD templates, requirements gathering Q&A patterns, Claude API prompt engineering

---

## Discovery Summary

**Recommendation:** Build a multi-step requirements gathering form that collects structured inputs through guided questions, then uses Claude API with a carefully crafted prompt template to generate a professional PRD.

**Key Decision:** Use a **progressive disclosure pattern** - start with high-level questions, then expand based on answers. Don't overwhelm users with a giant form upfront.

---

## 1. Professional PRD Template Structure

### Core Components (Modern 2025 Standards)

Based on research from [Product School](https://productschool.com/blog/product-strategy/product-template-requirements-document-prd), [Aha!](https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-good-product-requirements-document-template), and [Atlassian](https://www.atlassian.com/agile/product-management/requirements), professional PRDs should include:

**Essential Sections:**
1. **Title & Metadata** - Project name, version, date, author
2. **Overview** - High-level project description and rationale
3. **Purpose/Objectives** - Problem being solved, goals
4. **Success Metrics** - KPIs and measurable outcomes
5. **Target Audience** - User personas, market segments
6. **Features** - Specific capabilities and user benefits
7. **Scope** - What's in/out for this release
8. **Timeline** - Milestones and release planning
9. **Competition** - Competitive analysis (optional)
10. **Out of Scope** - Explicitly stated non-goals

### Modern PRD Best Practices

**Lean & Agile Approach** ([Leanware Guide](https://www.leanware.co/insights/how-to-write-a-prd)):
- PRDs should be **living documents** that evolve with feedback
- Avoid overly detailed specs - focus on shared understanding
- Use modular structure to allow changes without disrupting the whole
- Include goals, assumptions, user stories, and clear out-of-scope items

**Collaborative Process:**
- PRD is a **single source of truth** for stakeholders
- Should be reviewed and iterated with design and engineering
- Balance structure with flexibility
- Avoid being rigid - adapt to your methodology

### Key Insight for Our UI

**Don't ask users to fill in a giant form.** Instead, gather information through a conversational flow:
1. Start with high-level (What are you building? Why?)
2. Expand into details (Who is it for? What problems does it solve?)
3. Define scope (What's included? What's explicitly out?)
4. Set success criteria (How will you measure success?)

---

## 2. Requirements Gathering Q&A Patterns

### Effective Elicitation Techniques

Research from [Bridging the Gap](https://www.bridging-the-gap.com/what-questions-do-i-ask-during-requirements-elicitation/), [Practical Analyst](https://practicalanalyst.com/requirements-elicitation-most-valuable-questions/), and [Requiment](https://www.requiment.com/eliciting-requirements-techniques/) identified these patterns:

**Core Technique: The 5 Whys**
- Ask "why" repeatedly to determine needs versus desires
- Example: "Why do you need X?" → "To achieve Y" → "Why is Y important?" → Reveals true requirement

**Open vs. Closed Questions:**
- **Open-ended**: "Tell me about your workflow" → Prompts detailed responses
- **Closed**: "Do you need feature X?" → Yes/no answer (less useful upfront)
- **Best practice**: Start open, narrow with closed questions for confirmation

**"Points of Pain" Pattern:**
- Don't ask: "What is the business problem?" (too vague)
- Ask: "What pain points are you experiencing right now?" (more specific)
- Follow up: "Walk me through what happens when this problem occurs"

### Practical Question Sequences

**For Product Requirements:**
1. **Problem Space**: "What problem are you trying to solve?"
2. **Impact**: "Who is affected by this problem?"
3. **Current State**: "How are you handling this today?"
4. **Desired State**: "What would the ideal solution look like?"
5. **Success**: "How would you know if this worked?"
6. **Scope**: "What should we explicitly NOT build?"

**For User Stories:**
- "As a [persona], I want to [action] so that [benefit]"
- Follow with: "What does success look like for this user?"

### Key Insight for Our UI

**Progressive disclosure with guided questions:**
- Group questions into logical sections (Problem → Solution → Success)
- Use follow-up questions based on previous answers
- Include helpful tooltips/examples for complex questions
- Allow users to skip and come back (autosave state)
- Show progress indicator (e.g., "Step 2 of 5")

---

## 3. Claude API Prompt Engineering for PRD Generation

### Official Anthropic Guidance

From [Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices) and [AWS Blog](https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock/):

**Best Practices:**
1. **Be Clear and Direct** - Use simple, explicit instructions without ambiguity
2. **Use Examples** - Include 3-5 examples for structured outputs
3. **Let Claude Think** - Use Chain of Thought for complex tasks
4. **XML Tags** - Structure prompts with `<context>`, `<task>`, `<format>` tags
5. **Request Clarification** - End with "Ask for anything you need to generate the best PRD"

**Long Context Handling:**
- Claude supports 200K+ tokens - can process extensive inputs
- Feed all form responses as context, ask for professional PRD as output

### Prompt Structure for PRD Generation

**Recommended Pattern:**
```
<context>
User is planning a new project and has answered the following questions:

Project Name: [from form]
Problem Statement: [from form]
Target Audience: [from form]
Key Features: [from form]
Success Metrics: [from form]
Out of Scope: [from form]
</context>

<task>
Generate a professional Product Requirements Document (PRD) based on the information above.
Follow modern PRD best practices for 2025 - be concise but comprehensive.
Include all standard sections: Overview, Purpose, Success Metrics, Features, Scope, Timeline, Out of Scope.
Format as markdown with clear headings and bullet points.
</task>

<format>
# [Project Name] - Product Requirements Document

## Overview
[2-3 paragraphs...]

## Purpose
...
</format>

Ask for any clarifications needed to generate the highest quality PRD.
```

### Key Insight for Our UI

**Two-step process:**
1. **Form Collection** - Gather structured inputs from user
2. **Claude Generation** - Send inputs to Claude with well-crafted prompt template
3. **Review & Edit** - Show generated PRD, allow user to refine

**Prompt Engineering Details:**
- Use XML tags to structure the prompt clearly
- Include all form responses as `<context>`
- Specify desired format with example headings
- Request clarification if inputs are incomplete
- Use temperature: 0.7 for creative but consistent output

---

## 4. Form Validation Patterns

### Client-Side Validation

**Required for Our UI:**
- Mark required fields clearly (`*` or "Required" label)
- Real-time validation on blur (not every keystroke - too annoying)
- Inline error messages below fields (don't use alerts)
- Disable "Continue" button until required fields complete

**Validation Rules:**
- Project name: Min 3 characters, alphanumeric + spaces/dashes
- Problem statement: Min 50 characters (force thoughtful answers)
- Features: At least 1 feature listed
- Success metrics: At least 1 metric defined

### Server-Side Validation

**Use Zod schemas** (consistent with existing codebase):
```typescript
const RequirementsInputSchema = z.object({
  projectName: z.string().min(3),
  problemStatement: z.string().min(50),
  targetAudience: z.string().min(10),
  features: z.array(z.string()).min(1),
  successMetrics: z.array(z.string()).min(1),
  outOfScope: z.array(z.string()).optional()
});
```

---

## Implementation Recommendations

### Phase 2 UI Flow

**Step 1: Requirements Form**
- Multi-step form (progressive disclosure)
- Group questions into 4-5 steps:
  1. Project Basics (name, high-level description)
  2. Problem & Solution (problem statement, target audience)
  3. Features & Capabilities (what you're building)
  4. Success & Scope (metrics, out-of-scope)
  5. Review & Generate

**Step 2: PRD Generation**
- Show loading state: "Claude is generating your PRD..."
- Use Claude API with structured prompt template
- Display progress indicator

**Step 3: Review & Edit**
- Show generated PRD in markdown format
- Allow inline editing (optional enhancement)
- Download as .md file
- Store in planning session state

### Technical Implementation

**Frontend:**
- Reuse glassmorphic UI from Phase 1
- Multi-step form with "Back" and "Continue" buttons
- Autosave form state to session (in case user refreshes)
- Textarea inputs with character count hints

**Backend:**
- POST `/api/planning/requirements/submit` - Save form inputs
- POST `/api/planning/requirements/generate` - Call Claude API, return PRD
- Use existing `@anthropic-ai/sdk` integration
- Zod validation for all inputs

**Claude API Integration:**
- Model: claude-sonnet-4 (same as executor.ts)
- Max tokens: 4000 (PRDs typically 500-2000 tokens)
- Temperature: 0.7 (balanced creativity)
- System prompt: "You are an expert product manager writing professional PRDs"

---

## Decision Log

**Chosen Approach:** Multi-step form → Claude API generation → Review/edit flow

**Why this approach:**
1. **Progressive disclosure** - Doesn't overwhelm users with giant form
2. **Claude API** - Reuses existing integration, generates professional output
3. **Markdown output** - Compatible with Claude Code CLI workflows
4. **Session state** - Stores PRD in planning session for Phase 2→3 handoff

**Alternative Considered:**
- AI conversation interface (chat-style Q&A)
- **Rejected because**: Harder to implement, less structured, doesn't align with "hard gates" philosophy

---

## Sources

- [The Only PRD Template You Need (with Example) - Product School](https://productschool.com/blog/product-strategy/product-template-requirements-document-prd)
- [PRD Templates: What To Include for Success - Aha!](https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-good-product-requirements-document-template)
- [What is a Product Requirements Document (PRD)? - Atlassian](https://www.atlassian.com/agile/product-management/requirements)
- [How to Write a PRD: Ultimate PRD Guide & Template 2025 - Leanware](https://www.leanware.co/insights/how-to-write-a-prd)
- [What Questions Do I Ask During Requirements Elicitation? - Bridging the Gap](https://www.bridging-the-gap.com/what-questions-do-i-ask-during-requirements-elicitation/)
- [Requirements Elicitation: Most Valuable Questions - Practical Analyst](https://practicalanalyst.com/requirements-elicitation-most-valuable-questions/)
- [Eliciting Requirements Techniques - Requiment](https://www.requiment.com/eliciting-requirements-techniques/)
- [Prompting best practices - Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)
- [Prompt engineering overview - Claude Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
- [Prompt Engineering Techniques - AWS Blog](https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock/)

---

**Discovery Complete:** Ready to plan Phase 2 implementation based on these findings.
