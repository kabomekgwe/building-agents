# Local Runtime Setup Guide

**Version**: 2.0.0
**Last Updated**: 2025-01-15

This guide explains how to run the multi-agent system locally with Claude Code CLI integration.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Claude API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from: https://console.anthropic.com/

### 3. Run Demo

```bash
npm run dev
```

This will:
- Load all 46 agents
- Test routing with sample requests
- Display routing results

---

## 💻 CLI Usage

The CLI provides interactive access to the multi-agent system.

### Route a Request

Find which agent should handle a request:

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
──────────────────────────────────────────────────
```

### Execute an Agent Task

Route and execute using Claude API:

```bash
npm run cli -- exec "Build a REST API for user authentication"
```

For multi-agent workflows:

```bash
npm run cli -- exec "Design and implement a dashboard" --workflow
```

### List All Agents

```bash
npm run cli -- list
```

Filter by domain:

```bash
npm run cli -- list --domain engineering
```

### Get Agent Details

```bash
npm run cli -- info frontend-developer
```

### System Statistics

```bash
npm run cli -- stats
```

### Run Tests

```bash
npm run cli -- test
```

---

## 🌐 Web API Usage

Start the REST API server:

```bash
npm run server
```

The API runs at `http://localhost:3000` with these endpoints:

### Health Check

```bash
curl http://localhost:3000/health
```

### Route a Request

```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{"request": "Build a React component"}'
```

### Execute Agent Task

```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "request": "Build a REST API",
    "apiKey": "your_api_key_here"
  }'
```

### List Agents

```bash
curl http://localhost:3000/api/agents
```

Filter by domain:

```bash
curl http://localhost:3000/api/agents?domain=engineering
```

### Get Agent Details

```bash
curl http://localhost:3000/api/agents/frontend-developer
```

### System Stats

```bash
curl http://localhost:3000/api/stats
```

### Run Tests

```bash
curl http://localhost:3000/api/test
```

---

## 🔧 Development

### Project Structure

```
src/
├── runtime/           # Core runtime engine
│   ├── router.ts     # 3-tier routing engine
│   ├── executor.ts   # Claude API integration
│   └── context.ts    # Context & handoff management
├── cli/              # CLI interface
│   └── index.ts      # Command-line tool
├── api/              # Web API
│   └── server.ts     # Hono REST API
└── index.ts          # Main entry point
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Type Checking

TypeScript is configured in strict mode. All code is type-safe.

---

## 📚 How It Works

### 3-Tier Routing

The system implements the routing logic from `.claude/docs/ROUTING_LOGIC.md`:

1. **System-Level**: Extract keywords → Score domains → Select best domain
2. **Domain-Level**: Score agents within domain → Select specialist
3. **Execution**: Execute task using Claude API

### Routing Algorithm

```typescript
// Extract keywords from request
const keywords = ["build", "REST", "API"]

// Score domains (exact match +10, partial +5)
Engineering: 30 points (build, REST, API all exact)
Design: 0 points
Marketing: 0 points

// Route to Engineering domain → backend-architect
```

### Context Preservation

The system maintains context through:
- **Handoff Records**: `.claude/context/handoffs/`
- **Domain Context**: `.claude/context/domain-context/`
- **90% Completeness**: Validated in Week 8 testing

### Workflow Execution

Multi-agent workflows automatically:
1. Route to first agent
2. Execute task
3. Detect handoff signal
4. Route to next agent
5. Repeat until complete

---

## 🔌 Claude Code CLI Integration

### Option 1: Use as Node Package

```typescript
import { AgentRouter, AgentExecutor } from './src/index.js';

const router = new AgentRouter();
await router.loadAgents();

const result = await router.route("Build a component");
console.log(result); // { domain, agent, confidence }
```

### Option 2: Use CLI Commands

Add to your shell scripts:

```bash
#!/bin/bash
# Deploy script with agent routing

TASK="Deploy to production with zero downtime"
AGENT=$(npm run cli -- route "$TASK" | grep "Agent:" | cut -d: -f2)

echo "Routing to: $AGENT"
npm run cli -- exec "$TASK"
```

### Option 3: Use REST API

Integrate with any tool via HTTP:

```python
import requests

response = requests.post('http://localhost:3000/api/route', json={
    'request': 'Build a dashboard'
})

result = response.json()
print(f"Route to: {result['data']['agent']}")
```

---

## 🧪 Testing

### Routing Tests

Verify routing accuracy:

```bash
npm run cli -- test
```

Expected output:
```
Test: Build a React button component
✓ engineering → frontend-developer (85% confidence)

Test: Design a mobile app dashboard
✓ design → ui-designer (90% confidence)

Test: Create TikTok marketing strategy
✓ marketing → tiktok-strategist (95% confidence)
```

### Integration Tests

Test with real Claude API:

```bash
npm run cli -- exec "Build a simple button component" --api-key YOUR_KEY
```

### Load Testing

Test API performance:

```bash
# Install hey
brew install hey

# Test routing endpoint
hey -n 1000 -c 10 http://localhost:3000/api/stats
```

---

## 📊 Performance

Based on Week 8 testing:

- **Routing Speed**: 75ms average (2x faster than target)
- **Accuracy**: 100% (50/50 test cases)
- **Context Preservation**: 90% completeness
- **Agents Loaded**: 46 agents in ~200ms

---

## 🐛 Troubleshooting

### Error: "Agent not found"

**Cause**: Agent file missing or incorrectly named

**Fix**: Check `.claude/agents/` directory structure

```bash
npm run cli -- list
```

### Error: "Claude API key required"

**Cause**: Missing or invalid API key

**Fix**: Set environment variable

```bash
export ANTHROPIC_API_KEY=your_key_here
npm run cli -- exec "your request"
```

Or add to `.env` file.

### Error: "Routing confidence too low"

**Cause**: Request doesn't match any agent keywords

**Fix**: Make request more specific

```
❌ "Do something"
✅ "Build a React component"
```

### Error: "Port already in use"

**Cause**: Another process using port 3000

**Fix**: Change port in `.env`

```env
PORT=3001
```

---

## 🔐 Security

### API Key Protection

- Never commit `.env` file
- Use environment variables in production
- Rotate keys regularly

### Rate Limiting

The API server does not include rate limiting by default. For production:

```typescript
import { rateLimiter } from 'hono-rate-limiter';

app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));
```

### Input Validation

All API endpoints use Zod for input validation:

```typescript
const RouteRequestSchema = z.object({
  request: z.string().min(1)
});
```

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Cloudflare Workers

The Hono server is compatible with Cloudflare Workers:

```typescript
export default {
  async fetch(request: Request, env: Env) {
    return app.fetch(request, env);
  }
};
```

---

## 🎯 Next Steps

1. **Try the CLI**: `npm run cli -- route "your request"`
2. **Start the API**: `npm run server`
3. **Read the docs**: See `.claude/docs/GETTING_STARTED.md`
4. **Explore agents**: `npm run cli -- list`
5. **Run workflows**: `npm run cli -- exec "your request" --workflow`

---

## 📞 Support

- **Documentation**: `.claude/docs/`
- **Examples**: `.claude/workflows/`
- **Issues**: https://github.com/kabomekgwe/building-agents/issues

---

**Built with Claude Code** | **Version 2.0.0** | **Production-Ready**
