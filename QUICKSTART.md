# 🚀 Quick Start Guide

Get the multi-agent system running locally in 5 minutes.

---

## Prerequisites

- Node.js 20+ installed
- Claude API key from https://console.anthropic.com/

---

## Setup (2 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Build

```bash
npm run build
```

---

## Usage Options

Choose the interface that works best for you:

### Option 1: Web Dashboard (Recommended)

Start the server:

```bash
npm run server
```

Open http://localhost:3000 in your browser.

**Features**:
- Visual routing interface
- System statistics
- Domain/agent overview
- Real-time request routing

### Option 2: Command Line

Route a request:

```bash
npm run cli -- route "Build a React button component"
```

Output:
```
📍 Routing Result
──────────────────────────────────────────────────
Domain: engineering
Agent: frontend-developer
Confidence: 85%
```

Execute with Claude API:

```bash
npm run cli -- exec "Build a REST API endpoint" --api-key YOUR_KEY
```

### Option 3: REST API

Start server:

```bash
npm run server
```

Make API calls:

```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{"request": "Design a dashboard"}'
```

---

## Try These Examples

### Example 1: Frontend Development

**Request**: "Build a React button component with primary and secondary variants"

**Routes to**: `engineering` → `frontend-developer`

**Deliverable**: Reusable button component with TypeScript, accessibility, tests

### Example 2: Backend API

**Request**: "Build a REST API for user authentication with JWT tokens"

**Routes to**: `engineering` → `backend-architect`

**Deliverable**: Secure auth endpoints, database schema, middleware, tests

### Example 3: Marketing Campaign

**Request**: "Create a TikTok content strategy for a fitness app"

**Routes to**: `marketing` → `tiktok-strategist`

**Deliverable**: Content calendar, trending sounds, engagement tactics

### Example 4: UI/UX Design

**Request**: "Design a mobile app dashboard for analytics"

**Routes to**: `design` → `ui-designer`

**Deliverable**: Wireframes, mockups, component specs, user flows

---

## CLI Commands

### List All Agents

```bash
npm run cli -- list
```

Shows all 46 agents organized by domain.

### Get Agent Details

```bash
npm run cli -- info frontend-developer
```

Shows agent responsibilities, tech stack, and keywords.

### System Statistics

```bash
npm run cli -- stats
```

Shows total agents, domains, and distribution.

### Run Tests

```bash
npm run cli -- test
```

Validates routing with predefined test cases.

---

## How Routing Works

The system uses **3-tier routing**:

1. **Extract Keywords**: "Build React component" → `["build", "react", "component"]`
2. **Score Domains**: Engineering gets +30 points (3 keyword matches)
3. **Route to Agent**: Frontend-developer scores highest in engineering domain

**Routing Algorithm**:
- Exact keyword match: +10 points
- Partial match: +5 points
- Confidence: (total score / max possible) × 100

---

## Multi-Agent Workflows

Enable workflow mode to automatically route between multiple agents:

```bash
npm run cli -- exec "Design and build a dashboard" --workflow
```

**What Happens**:
1. `ui-designer` creates mockups and specs
2. Handoff to `frontend-developer` with design context
3. `frontend-developer` implements UI
4. Optional handoff to `qa-engineer` for testing

---

## Project Structure

```
.claude/
├── agents/           # 46 agent definitions (frontend, backend, etc.)
├── commands/         # 23 slash commands
├── workflows/        # 3 demo workflows
└── docs/             # Complete documentation

src/
├── runtime/          # Core routing engine
│   ├── router.ts    # 3-tier routing logic
│   ├── executor.ts  # Claude API integration
│   └── context.ts   # Handoff management
├── cli/             # Command-line interface
└── api/             # REST API server

public/
└── index.html       # Web dashboard
```

---

## Next Steps

1. **Explore the docs**: See `.claude/docs/GETTING_STARTED.md` for tutorials
2. **Try workflows**: Run end-to-end multi-agent workflows
3. **Customize agents**: Add your own agents to `.claude/agents/`
4. **Build integrations**: Use the REST API in your own tools

---

## Troubleshooting

### "Agent not found"

**Fix**: Check that `.claude/agents/` contains agent files

```bash
npm run cli -- list
```

### "API key required"

**Fix**: Add to `.env` or pass via CLI

```bash
export ANTHROPIC_API_KEY=your_key
```

### "Port already in use"

**Fix**: Change port in `.env`

```env
PORT=3001
```

---

## Performance

Based on Week 8 testing:

- **Routing Speed**: 75ms average
- **Accuracy**: 100% (50/50 test cases)
- **Agents Loaded**: 46 in ~200ms
- **Context Preservation**: 90% completeness

---

## Support

- **Documentation**: `.claude/docs/`
- **Examples**: `.claude/workflows/`
- **Detailed Setup**: `RUNTIME_SETUP.md`
- **GitHub**: https://github.com/kabomekgwe/building-agents

---

**Ready to build?** Start with the web dashboard:

```bash
npm run server
# Open http://localhost:3000
```

**Questions?** See `RUNTIME_SETUP.md` for comprehensive documentation.
