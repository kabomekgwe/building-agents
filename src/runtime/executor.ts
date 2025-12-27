/**
 * Agent Executor
 * Executes agent tasks using Claude API
 * Handles context management and handoff protocols
 */

import Anthropic from '@anthropic-ai/sdk';
import { Agent } from './router.js';
import { ContextManager } from './context.js';

export interface ExecutionRequest {
  agent: Agent;
  userRequest: string;
  context?: string;
  previousHandoff?: string;
}

export interface ExecutionResult {
  agent: string;
  domain: string;
  response: string;
  handoffNeeded: boolean;
  handoffTo?: string;
  handoffContext?: string;
  filesModified: string[];
  decisionsade: string[];
}

export class AgentExecutor {
  private client: Anthropic;
  private contextManager: ContextManager;

  constructor(apiKey: string, contextPath: string = '.claude/context') {
    this.client = new Anthropic({ apiKey });
    this.contextManager = new ContextManager(contextPath);
  }

  /**
   * Execute an agent task
   */
  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const { agent, userRequest, context, previousHandoff } = request;

    // Build system prompt from agent definition
    const systemPrompt = this.buildSystemPrompt(agent, context, previousHandoff);

    // Execute via Claude API
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userRequest
        }
      ]
    });

    const agentResponse = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse response for handoff signals
    const handoffInfo = this.detectHandoff(agentResponse);

    // Extract metadata
    const metadata = this.extractMetadata(agentResponse);

    // Create handoff record if needed
    if (handoffInfo.needed) {
      await this.contextManager.createHandoff({
        from: agent.name,
        to: handoffInfo.targetAgent || 'unknown',
        domain: agent.domain,
        workCompleted: metadata.filesModified.join(', '),
        decisionsade: metadata.decisions,
        nextSteps: handoffInfo.context || '',
        timestamp: new Date().toISOString()
      });
    }

    return {
      agent: agent.name,
      domain: agent.domain,
      response: agentResponse,
      handoffNeeded: handoffInfo.needed,
      handoffTo: handoffInfo.targetAgent,
      handoffContext: handoffInfo.context,
      filesModified: metadata.filesModified,
      decisionsade: metadata.decisions
    };
  }

  /**
   * Build system prompt from agent definition
   */
  private buildSystemPrompt(agent: Agent, context?: string, previousHandoff?: string): string {
    let prompt = agent.content;

    // Add context if provided
    if (context) {
      prompt += `\n\n## Domain Context\n${context}`;
    }

    // Add previous handoff information
    if (previousHandoff) {
      prompt += `\n\n## Previous Handoff\n${previousHandoff}`;
    }

    // Add execution guidelines
    prompt += `\n\n## Execution Guidelines

You are currently executing as the **${agent.name}** agent in the ${agent.domain} domain.

**Your Task**:
1. Complete the user's request following your agent definition above
2. Produce concrete deliverables (code, documentation, designs, etc.)
3. If work needs to continue with another agent, clearly indicate handoff

**Handoff Protocol**:
If you need to hand off to another agent, end your response with:
\`\`\`
## HANDOFF TO: [agent-name]

**Work Completed**: [Summary]
**Files Modified**: [List of files]
**Decisions Made**: [Key decisions]
**Next Steps**: [What the next agent should do]
\`\`\`

**Remember**:
- Follow DRY, KISS, YAGNI principles
- Single responsibility per function
- Reusable, parameterized code
- Production-ready quality
`;

    return prompt;
  }

  /**
   * Detect if agent response indicates a handoff is needed
   */
  private detectHandoff(response: string): { needed: boolean; targetAgent?: string; context?: string } {
    const handoffPattern = /## HANDOFF TO: ([\w-]+)\n\n([\s\S]*)/;
    const match = response.match(handoffPattern);

    if (match) {
      return {
        needed: true,
        targetAgent: match[1],
        context: match[2]
      };
    }

    return { needed: false };
  }

  /**
   * Extract metadata from agent response
   */
  private extractMetadata(response: string): { filesModified: string[]; decisions: string[] } {
    const filesModified: string[] = [];
    const decisions: string[] = [];

    // Extract files from "Files Modified" section
    const filesPattern = /\*\*Files Modified\*\*: (.*)/;
    const filesMatch = response.match(filesPattern);
    if (filesMatch) {
      filesModified.push(...filesMatch[1].split(',').map(f => f.trim()));
    }

    // Extract decisions from "Decisions Made" section
    const decisionsPattern = /\*\*Decisions Made\*\*:\n([\s\S]*?)(?=\n##|\n\*\*|$)/;
    const decisionsMatch = response.match(decisionsPattern);
    if (decisionsMatch) {
      const decisionLines = decisionsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
      decisions.push(...decisionLines.map(d => d.replace(/^- /, '').trim()));
    }

    return { filesModified, decisions };
  }

  /**
   * Execute multi-agent workflow
   */
  async executeWorkflow(initialRequest: string, maxHandoffs: number = 5): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    let currentRequest = initialRequest;
    let handoffContext: string | undefined;
    let handoffsCount = 0;

    // Import router dynamically to avoid circular dependency
    const { AgentRouter } = await import('./router.js');
    const router = new AgentRouter();

    while (handoffsCount < maxHandoffs) {
      // Route to appropriate agent
      const routing = await router.route(currentRequest);
      const agent = router.getAgent(routing.agent);

      if (!agent) {
        console.error(`Agent ${routing.agent} not found`);
        break;
      }

      // Execute agent task
      const result = await this.execute({
        agent,
        userRequest: currentRequest,
        previousHandoff: handoffContext
      });

      results.push(result);

      // Check if handoff is needed
      if (!result.handoffNeeded || !result.handoffTo) {
        break; // Workflow complete
      }

      // Prepare for next agent
      handoffContext = result.handoffContext;
      currentRequest = `Continue work from ${result.agent}: ${result.handoffContext}`;
      handoffsCount++;
    }

    if (handoffsCount >= maxHandoffs) {
      console.warn(`Workflow exceeded max handoffs (${maxHandoffs})`);
    }

    return results;
  }
}
