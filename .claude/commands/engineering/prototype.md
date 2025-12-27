# Build Rapid Prototype

I need you to quickly validate an idea with a working prototype (MVP).

## Context

**Idea to Prototype**: $ARGUMENTS

## Your Task

Route this to the **rapid-prototyper** agent who will:

1. **Clarify MVP Scope**:
   - Identify core value proposition
   - Define minimum feature set
   - Set time constraint (typically 1-3 days)

2. **Choose Stack** (optimized for speed):
   - Frontend: Next.js, React, or simple HTML/CSS
   - Backend: Serverless functions, Firebase, or minimal Express
   - Database: Supabase, Firebase, or SQLite
   - Auth: Clerk, Supabase Auth, or simple JWT

3. **Build MVP**:
   - Implement ONLY core features
   - Use existing libraries/components (no custom builds)
   - Hardcode reasonable defaults
   - Skip edge cases and error handling (document TODOs)
   - Focus on "happy path" user journey

4. **Deploy Quickly**:
   - Deploy to Vercel, Netlify, or similar
   - Public URL for testing
   - No CI/CD (manual deploy acceptable)

5. **Validate**:
   - Share with 5-10 test users
   - Gather feedback
   - Decide: Build further or pivot?

## Prototype Principles

- **Speed over perfection**: Ship in days, not weeks
- **Third-party services**: Use existing APIs (Stripe, SendGrid, etc.)
- **No custom auth**: Use Clerk or Supabase
- **Minimal styling**: Use shadcn/ui or Tailwind components
- **Hardcode**: Config, sample data, whatever speeds development

## Deliverables

- Working prototype (deployed, public URL)
- README with setup instructions
- List of shortcuts taken (for future cleanup)
- Feedback collection plan

**Route to**: System Coordinator → Engineering Coordinator → rapid-prototyper
