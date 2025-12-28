# Phase 3: Design Phase UI - Discovery

**Research Date:** 2025-12-28
**Phase Goal:** Implement technical specification and Architecture Decision Record (ADR) creation interface
**Research Topics:** ADR template formats, technical specification best practices, system design documentation patterns, component breakdown UI patterns

---

## Discovery Summary

**Recommendation:** Build a guided interface similar to Phase 2's pattern - collect structured design inputs through multi-step form, then use Claude API to generate both a Technical Specification and ADRs (Architecture Decision Records).

**Key Decision:** Follow the **Nygard ADR template** (industry standard since 2011) + modern technical spec structure. Generate multiple outputs: (1) Technical Spec (system design), (2) ADRs (key architectural decisions).

---

## 1. ADR Template Formats

### Michael Nygard's ADR Template (Industry Standard)

From [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) and [ADR GitHub Repository](https://github.com/joelparkerhenderson/architecture-decision-record):

**Core Structure:**
1. **Title** - Short noun phrase (e.g., "Use React for Frontend Framework")
2. **Status** - proposed | accepted | deprecated | superseded
3. **Context** - Forces at play (technological, political, social). Value-neutral description of facts and tensions.
4. **Decision** - Response to forces. Full sentences, active voice (e.g., "We will use...")
5. **Consequences** - Resulting context after applying decision (both positive and negative)

**Why This Template:**
- **Simplest format** - 5 sections, clear structure
- **Industry standard** - Used by Google, Microsoft, AWS teams
- **Self-documenting** - Context explains "why", not just "what"
- **Future-proof** - Status field allows evolution (superseded by ADR-XXX)

**Modern Alternatives (2025):**
- **MADR** (Markdown ADR) - More structured with additional fields
- **Y-Statements** - Ultra-concise format
- **Recommendation**: Stick with Nygard for **simplicity and recognition**

### Key Insight for Our UI

**Generate multiple ADRs, not one giant document:**
- User identifies 3-5 key architectural decisions during design phase
- Each decision gets its own ADR file (e.g., ADR-001-database-choice.md)
- Claude generates each ADR following Nygard template
- UI allows adding/removing decisions dynamically

---

## 2. Technical Specification Best Practices

### Modern Tech Spec Structure (2025)

From [Archbee Guide](https://www.archbee.com/blog/technical-specification), [Stack Overflow Best Practices](https://stackoverflow.blog/2020/04/06/a-practical-guide-to-writing-technical-specs/), and [Atlassian Software Design Docs](https://www.atlassian.com/work-management/knowledge-sharing/documentation/software-design-document):

**Essential Sections:**
1. **Overview** - High-level system description (1-2 paragraphs)
2. **System Architecture** - Architectural patterns, component diagram, data flow
3. **Component Breakdown** - Key modules/services and their responsibilities
4. **Data Models** - Database schema, API contracts, data structures
5. **Technology Stack** - Languages, frameworks, infrastructure choices
6. **Non-Functional Requirements** - Performance, security, scalability, availability
7. **API Specifications** - Endpoints, request/response formats (if applicable)
8. **Dependencies** - External services, libraries, integrations
9. **Deployment Strategy** - How the system will be deployed and operated
10. **Testing Strategy** - Unit, integration, E2E testing approach

**Key Best Practices:**
- **Living Document** - Treat as evolving, not static
- **Collaborative** - Engineers, designers, stakeholders contribute
- **Clear Language** - Avoid jargon, be specific
- **Diagrams** - Visual representations of architecture (ASCII art, mermaid)
- **Small Project Template** - Summary, scope, functional requirements, architecture sketch, risks, test plan

### Difference from PRD

| PRD (Phase 2) | Technical Spec (Phase 3) |
|---------------|--------------------------|
| **WHAT** to build | **HOW** to build it |
| Business requirements | Technical design |
| User-facing features | System architecture |
| Success metrics | Performance targets |
| Out of scope | Implementation constraints |

**PRD answers:** "What problem are we solving? For whom?"
**Tech Spec answers:** "How will we architect this? What are the trade-offs?"

### Key Insight for Our UI

**Two-part output:**
1. **Technical Specification** - Comprehensive system design document
2. **ADRs** - Individual decisions with context and consequences

**Input Collection:**
- System architecture patterns (monolith, microservices, serverless)
- Component breakdown (what modules/services exist)
- Data models (database schema, API contracts)
- Technology stack (languages, frameworks, infrastructure)
- Non-functional requirements (performance, security, scalability)
- Key architectural decisions (for ADRs)

---

## 3. System Design Documentation Patterns

### Component Breakdown UI Patterns (2025)

From [UXPin Design System Guide](https://www.uxpin.com/studio/blog/design-system-documentation-guide/) and [UI Deploy Component Documentation](https://ui-deploy.com/blog/ui-component-documentation-best-practices-for-design-systems):

**Best Practices for Component Documentation:**
1. **Anatomy Breakdown** - Identify all component parts, variants, states
2. **Usage Guidelines** - When/how to use the component effectively
3. **Code Examples** - HTML/CSS/JS (or React/Vue) implementation
4. **Progressive Disclosure** - Overview first, details on demand
5. **Visual Examples** - Screenshots or live demos
6. **Do's and Don'ts** - Appropriate vs inappropriate usage

**Benefits:**
- Well-documented components speed up development by **40%**
- Reduce miscommunication between designers and developers by **60%**
- Organizations report **70% faster implementation** and **65% fewer support questions**

### Key Insight for Our UI

**Multi-step form for design phase:**
1. **System Overview** - High-level description, architectural pattern
2. **Component Breakdown** - List key modules/services with responsibilities
3. **Data Design** - Database schema, API contracts
4. **Technology Choices** - Stack, infrastructure, deployment
5. **Architectural Decisions** - 3-5 key decisions (for ADRs)
6. **Generate Outputs** - Claude creates Tech Spec + ADRs

**UI Elements:**
- Dynamic list for components (similar to Phase 2 features list)
- Dynamic list for architectural decisions (each becomes an ADR)
- Textarea inputs for longer descriptions
- Dropdown for common choices (architecture patterns, databases, etc.)

---

## 4. Claude API Prompt Engineering for Tech Spec + ADRs

### Prompt Structure for Technical Specification

**Pattern (extends Phase 2 approach):**
```
<context>
User has completed requirements phase (PRD) and is now designing the technical solution.

Previous Context:
- PRD: [from Phase 2 session data]
- Project Name: [from Phase 2]
- Features: [from Phase 2]

Design Inputs:
- System Architecture: [from form]
- Component Breakdown: [from form]
- Data Models: [from form]
- Technology Stack: [from form]
- Non-Functional Requirements: [from form]
</context>

<task>
Generate a professional Technical Specification Document based on the information above.
Follow modern software engineering best practices for 2025 - be comprehensive but maintainable.
Include all standard sections: Overview, System Architecture, Component Breakdown, Data Models, Technology Stack, Non-Functional Requirements, API Specifications, Dependencies, Deployment Strategy, Testing Strategy.
Format as markdown with clear headings, bullet points, and code blocks for schemas.
</task>

<format>
# [Project Name] - Technical Specification

## Overview
[2-3 paragraphs...]

## System Architecture
...
</format>

Ask for any clarifications needed to generate the highest quality Technical Specification.
```

### Prompt Structure for ADRs

**Generate each ADR separately:**
```
<context>
Project: [Project Name]
PRD: [Summary from Phase 2]
Technical Spec: [Just generated above]

Architectural Decision:
- Title: [from form]
- Context Description: [from form]
- Decision Made: [from form]
- Rationale: [from form]
</context>

<task>
Generate an Architecture Decision Record (ADR) following the Michael Nygard template.
Include: Title, Status (proposed/accepted), Context (forces at play), Decision (our response), Consequences (resulting context).
Format as markdown.
</task>

<format>
# ADR-001: [Title]

**Status:** proposed

## Context
[Describe forces at play...]

## Decision
[State decision in full sentences, active voice...]

## Consequences
[Describe resulting context, both positive and negative...]
</format>
```

### Key Insight for Our UI

**Sequential Generation:**
1. User fills design form (system architecture, components, tech stack, decisions)
2. Click "Generate Tech Spec" → Claude generates Technical Specification
3. For each architectural decision:
   - User provides: Title, Context, Decision, Rationale
   - Click "Generate ADR" → Claude creates individual ADR
4. Display all outputs, allow download as .md files

**Model Configuration:**
- Model: claude-sonnet-4-20250514 (same as Phase 2)
- Max tokens: 6000 for Tech Spec (larger than PRD), 2000 per ADR
- Temperature: 0.7 (balanced creativity/consistency)
- System prompt: "You are an expert software architect writing professional technical specifications and ADRs"

---

## Implementation Recommendations

### Phase 3 UI Flow

**Step 1: Design Form (Multi-Step)**
- Step 1: System Architecture (pattern, high-level design)
- Step 2: Component Breakdown (modules, services, responsibilities)
- Step 3: Data & APIs (database schema, API contracts)
- Step 4: Technology Stack (languages, frameworks, infrastructure)
- Step 5: Architectural Decisions (3-5 key decisions for ADRs)
- Step 6: Review & Generate

**Step 2: Tech Spec Generation**
- Loading state: "Claude is generating your Technical Specification..."
- Claude API call with design inputs + PRD context
- Display generated Tech Spec in markdown

**Step 3: ADR Generation (For Each Decision)**
- User reviews architectural decisions list
- For each decision:
  - Provide additional context if needed
  - Click "Generate ADR" → Individual ADR created
  - Display ADR with edit capability
- Download all ADRs as separate .md files

**Step 4: Review & Complete Phase**
- Show Tech Spec + all ADRs
- Allow downloads (.md files)
- Store in planning session state
- Enable "Complete Design Phase" button → Advances to Implementation phase

### Technical Implementation

**Frontend (extends Phase 2 patterns):**
- Reuse glassmorphic UI + multi-step form pattern
- Dynamic lists for components, decisions (similar to Phase 2 features)
- Dropdown selects for common choices (architecture patterns: monolith, microservices, serverless)
- Code editor textarea for schema definitions (with monospace font)
- Autosave form state (30-second timer, same as Phase 2)

**Backend:**
- POST `/api/planning/design/autosave` - Save form inputs
- POST `/api/planning/design/generate-techspec` - Call Claude API, return Tech Spec
- POST `/api/planning/design/generate-adr` - Call Claude API for individual ADR
- Extend DesignFormData interface in `src/sdlc/types.ts`
- Zod validation schemas for all inputs

**Data Model (src/sdlc/types.ts):**
```typescript
export interface DesignFormData {
  systemArchitecture: string; // e.g., "Microservices with event-driven communication"
  components: ComponentDefinition[]; // Module/service breakdown
  dataModels: string; // Database schema, API contracts (textarea)
  technologyStack: TechStack; // Languages, frameworks, infrastructure
  nonFunctionalRequirements: string[]; // Performance, security, scalability
  architecturalDecisions: ArchitecturalDecision[]; // For ADR generation
  generatedTechSpec?: string; // Claude-generated Tech Spec
  generatedADRs?: GeneratedADR[]; // Claude-generated ADRs
  lastSaved?: Date;
}

export interface ComponentDefinition {
  name: string;
  responsibility: string;
  dependencies?: string[];
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  infrastructure: string[];
}

export interface ArchitecturalDecision {
  title: string;
  contextDescription: string;
  decisionMade: string;
  rationale: string;
}

export interface GeneratedADR {
  id: string; // ADR-001, ADR-002, etc.
  title: string;
  content: string; // Full markdown content
}
```

**Claude API Integration:**
- Reuse existing `@anthropic-ai/sdk` integration
- Model: claude-sonnet-4-20250514
- Tech Spec: max_tokens 6000, temperature 0.7
- ADRs: max_tokens 2000, temperature 0.7
- System prompt: "You are an expert software architect..."

---

## Decision Log

**Chosen Approach:** Multi-step form → Claude Tech Spec generation → Claude ADR generation (per decision) → Review/download flow

**Why this approach:**
1. **Parallel to Phase 2** - Reuses proven UI patterns, reduces implementation risk
2. **Nygard ADRs** - Industry standard, simple, widely recognized
3. **Separate ADRs** - Each decision gets own file (best practice for versioning/evolution)
4. **Claude API** - Reuses existing integration, generates professional outputs
5. **Markdown output** - Compatible with Claude Code CLI workflows
6. **Session state** - Stores Tech Spec + ADRs for Phase 3→4 handoff

**Alternatives Considered:**
- **Single combined document** (Tech Spec + ADRs in one file)
  - **Rejected because**: ADRs should be separate for version control, superseding
- **Manual ADR writing** (user writes ADRs themselves)
  - **Rejected because**: Defeats purpose of guided workflow, Claude adds value

---

## Sources

- [Documenting Architecture Decisions - Cognitect](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [Architecture Decision Record (ADR) Examples - GitHub](https://github.com/joelparkerhenderson/architecture-decision-record)
- [ADR Templates - ADR GitHub](https://adr.github.io/adr-templates/)
- [How to Write a Technical Specification - Archbee](https://www.archbee.com/blog/technical-specification)
- [A Practical Guide to Writing Technical Specs - Stack Overflow](https://stackoverflow.blog/2020/04/06/a-practical-guide-to-writing-technical-specs/)
- [Software Design Document Best Practices - Atlassian](https://www.atlassian.com/work-management/knowledge-sharing/documentation/software-design-document)
- [Design System Documentation Guide - UXPin](https://www.uxpin.com/studio/blog/design-system-documentation-guide/)
- [UI Component Documentation Best Practices - UI Deploy](https://ui-deploy.com/blog/ui-component-documentation-best-practices-for-design-systems)

---

**Discovery Complete:** Ready to plan Phase 3 implementation based on these findings.
