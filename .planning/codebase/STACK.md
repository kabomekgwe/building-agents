# Technology Stack

**Analysis Date:** 2025-01-28

## Languages

**Primary:**
- TypeScript 5.7.2 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- JavaScript (ES2022) - Build output in `dist/`
- HTML5/CSS3 - Web dashboard (`public/index.html`)

## Runtime

**Environment:**
- Node.js (ES modules, type: "module" in `package.json`)
- ES2022 target, ESNext modules

**Package Manager:**
- npm - Standard package manager
- Lockfile: package-lock.json (standard npm)

## Frameworks

**Core:**
- Hono v4.6.14 - `src/api/server.ts` (lightweight web framework)
- @hono/node-server v1.13.7 - `src/api/server.ts` (Node.js adapter)

**CLI:**
- Commander v12.1.0 - `src/cli/index.ts` (CLI framework)

**Testing:**
- Vitest v2.1.8 - `package.json` (dev dependency, no tests yet)

**Build/Dev:**
- TypeScript v5.7.2 - Compilation
- tsx v4.19.2 - TypeScript executor for development

## Key Dependencies

**Critical:**
- @anthropic-ai/sdk v0.32.1 - `src/runtime/executor.ts` (Claude API client)
- hono v4.6.14 - `src/api/server.ts` (web server)
- zod v3.24.1 - `src/api/server.ts` (schema validation)
- commander v12.1.0 - `src/cli/index.ts` (CLI framework)

**Infrastructure:**
- @hono/node-server v1.13.7 - HTTP server adapter
- dotenv v16.4.7 - `src/index.ts` (environment variables)

**UI/UX:**
- chalk v5.3.0 - `src/cli/index.ts` (terminal colors)
- ora v8.1.1 - `src/cli/index.ts` (loading spinners)

## Configuration

**Environment:**
- `.env.example` documents required variables
- Required variables:
  - `ANTHROPIC_API_KEY` - Claude API authentication
  - `PORT` - Server port (default: 3000)
  - `NODE_ENV` - development/production
- Optional variables:
  - `AGENTS_PATH` - Custom agents directory
  - `CONTEXT_PATH` - Custom context directory

**Build:**
- `tsconfig.json` - TypeScript strict mode, ES2022 target
- Output directory: `dist/`
- Entry points: `dist/index.js`, `dist/cli/index.js`, `dist/api/server.js`

## Platform Requirements

**Development:**
- Any platform with Node.js
- No external dependencies beyond npm packages

**Production:**
- Node.js runtime
- File system access for agent definitions (`.claude/agents/`)
- Network access for Claude API

---

*Stack analysis: 2025-01-28*
*Update after major dependency changes*
