# Documentation-First Planning UI

## Vision

A web-based UI that enforces professional planning workflows before code implementation. Built for solo developers who use Claude Code CLI but want a structured, guided process to prevent skipping critical planning steps.

The core problem: jumping straight to code without proper requirements, design, or architectural planning. This tool acts as a forcing function—you can't skip steps. The UI walks you through a structured SDLC workflow, generating professional documentation (PRDs, technical specs, ADRs) that's compatible with Claude Code CLI workflows.

This isn't about autonomous code generation or team collaboration. It's about individual discipline: ensuring you do the planning work before writing a single line of code, then handing clean specifications to yourself (or Claude Code CLI) for implementation.

## Problem

**Current State:**
- Using Claude Code CLI from terminal for development
- Often skip planning/documentation phase and jump straight to coding
- Results in poorly-thought-out implementations, technical debt, and rework
- No structured workflow to enforce "documentation first" approach
- Creating PRDs, specs, and ADRs manually is time-consuming and easy to skip

**Who Has It:**
- Solo developers and technical founders
- Engineers who use Claude Code CLI for development
- Anyone who knows they *should* plan but struggle with discipline

**Why It Matters:**
- Skipping planning leads to 3-5x rework cycles
- Poor upfront design creates technical debt that compounds
- Missing documentation makes projects hard to resume after breaks
- Professional documentation helps communicate with future self, contractors, or team members

## Success Criteria

How we know this worked:

- [ ] UI successfully guides through all SDLC phases (Requirements → Design → Implementation Planning)
- [ ] Generated documentation files are compatible with Claude Code CLI workflows
- [ ] Cannot proceed to next phase without completing current phase documentation
- [ ] Output includes: PRD, System Design, ADRs, and implementation plan
- [ ] Web-based interface accessible via browser (no desktop app installation)
- [ ] Single user can complete full planning workflow in under 30 minutes

## Scope

### Building

- **Guided SDLC Workflow UI**: Step-by-step interface through Requirements → Design → Implementation Planning phases
- **Documentation Generation**: Create PRDs, technical specs, architecture decision records (ADRs)
- **Phase Gating**: Cannot skip or bypass phases; must complete current phase to proceed
- **Claude Code Integration**: Output files formatted for Claude Code CLI consumption
- **Browser-Based Interface**: Web UI that extends existing building-agents Hono server
- **Template System**: Professional document templates for each phase/deliverable type
- **Progress Tracking**: Visual indication of workflow completion status

### Not Building

- **Team Collaboration**: No sharing, comments, approvals, or multi-user features (single-user tool)
- **External Integrations**: No sync with Jira, GitHub, Notion, or other platforms
- **Code Generation**: UI creates documentation only; user writes code manually (or via separate Claude Code CLI session)
- **Authentication System**: No user accounts, login, or access control (local/trusted environment)
- **Real-time Collaboration**: No WebSockets, presence indicators, or concurrent editing
- **Version Control Integration**: No automatic git commits or branch management from UI

## Context

**Current Environment:**
- Existing building-agents codebase with:
  - Multi-agent routing system (3-tier: domain → specialist)
  - SDLC orchestrator with 6-phase workflow
  - Autonomous task executor
  - Hono web server on port 3000
  - TypeScript 5.7.2 with strict mode
  - Claude API integration (@anthropic-ai/sdk)
  - Zero test coverage (identified technical debt)
  - In-memory storage (no persistence layer)

**User Workflow:**
- Primary development environment: Claude Code CLI in terminal
- Wants to **add** UI-based planning phase **before** coding
- Generated docs should be consumable by Claude Code CLI for implementation
- Solo developer, not building for teams

**Why This Approach:**
- Leverages existing SDLC orchestrator infrastructure
- Builds on proven 6-phase workflow (requirements → design → implementation → testing → deployment → maintenance)
- Extends current web dashboard (`public/index.html`) with planning capabilities
- Can reuse agent definitions from `.claude/agents/` for documentation generation via Claude API

## Constraints

- **Technical Stack**: Must use existing building-agents stack (TypeScript, Hono, Claude API)
- **Web-Based**: Browser interface only (no desktop app, no CLI-only solution)
- **Claude Code Compatibility**: Output must be consumable by Claude Code CLI workflows
- **Single User**: No multi-user or collaboration features in v1
- **No External Dependencies**: Cannot require external services beyond Claude API (already integrated)

## Decisions Made

Key decisions from project exploration:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Platform** | Extend existing web dashboard | Leverage current Hono server and UI; don't build standalone app |
| **Documentation Format** | Markdown with frontmatter | Compatible with Claude Code CLI, human-readable, version-control friendly |
| **Phase Enforcement** | Hard gates (cannot skip phases) | Core value is forcing discipline; soft gates would defeat purpose |
| **Storage** | File-based output to disk | Aligns with Claude Code CLI workflow; user controls versioning via git |
| **Generation Method** | Claude API with phase-specific prompts | Reuse existing executor infrastructure; consistent with agent system |

## Open Questions

Things to figure out during execution:

- [ ] Where should generated docs be written? (`.planning/`, project root, or user-specified directory?)
- [ ] Should UI integrate with existing SDLC orchestrator or be a separate workflow?
- [ ] Do we need a "resume from phase" feature if user closes browser mid-workflow?
- [ ] Should generated docs include placeholders for user to fill in, or be complete first drafts?
- [ ] How much interactivity in each phase? (e.g., Q&A forms vs. free-text prompts vs. AI conversation)

---
*Initialized: 2025-01-28*
