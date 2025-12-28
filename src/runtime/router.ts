/**
 * Multi-Agent System Router
 * Implements 3-tier routing: System → Domain → Specialist
 * Based on keyword extraction and scoring algorithm from ROUTING_LOGIC.md
 */

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export interface RoutingResult {
  domain: string;
  agent: string;
  confidence: number;
  reasoning: string;
  keywords: string[];
}

export interface Agent {
  name: string;
  domain: string;
  keywords: string[];
  path: string;
  content: string;
}

/**
 * Domain routing configuration from system-coordinator.md
 */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  engineering: ['code', 'API', 'build', 'frontend', 'backend', 'deploy', 'implement', 'develop', 'react', 'component'],
  design: ['design', 'UI', 'UX', 'brand', 'visual', 'wireframe', 'mockup', 'user research', 'prototype'],
  marketing: ['marketing', 'TikTok', 'Instagram', 'growth', 'campaign', 'content', 'social', 'ads', 'SEO'],
  product: ['product', 'research', 'feedback', 'trends', 'roadmap', 'sprint', 'prioritize', 'backlog'],
  'project-management': ['plan', 'sprint', 'ship', 'track', 'deliver', 'timeline', 'milestone', 'coordinate'],
  'studio-operations': ['support', 'analytics', 'compliance', 'infrastructure', 'legal', 'finance', 'operations'],
  testing: ['test', 'benchmark', 'evaluate', 'QA', 'quality', 'performance', 'validate']
};

export class AgentRouter {
  private agents: Agent[] = [];
  private agentsPath: string;

  constructor(agentsPath: string = '.claude/agents') {
    this.agentsPath = agentsPath;
  }

  /**
   * Load all agents from .claude/agents directory
   */
  async loadAgents(): Promise<void> {
    const domains = await readdir(this.agentsPath);

    for (const domain of domains) {
      if (domain.startsWith('_')) continue; // Skip _core, _meta

      const domainPath = join(this.agentsPath, domain);
      const files = await readdir(domainPath);

      for (const file of files) {
        if (file.startsWith('_') || !file.endsWith('.md')) continue;

        const agentPath = join(domainPath, file);
        const content = await readFile(agentPath, 'utf-8');
        const agentName = file.replace('.md', '');

        // Extract keywords from agent file
        const keywords = this.extractKeywordsFromAgent(content);

        this.agents.push({
          name: agentName,
          domain,
          keywords,
          path: agentPath,
          content
        });
      }
    }

    console.log(`✓ Loaded ${this.agents.length} agents across ${domains.length} domains`);
  }

  /**
   * Extract keywords from agent markdown file
   */
  private extractKeywordsFromAgent(content: string): string[] {
    const keywords: string[] = [];

    // Extract from title (agent name)
    const title = content.match(/# (.*)/)?.[1] || '';
    const titleWords = title.toLowerCase().split(/[\s-]+/);
    keywords.push(...titleWords);

    // Extract from Tech Stack section - these are very specific keywords
    const techStackSection = content.match(/## Tech Stack\n([\s\S]*?)(?=\n##|$)/);
    if (techStackSection) {
      const techMatch = techStackSection[1].matchAll(/\*\*(.*?)\*\*:?\s*(.*?)(?:\n|$)/g);
      for (const match of techMatch) {
        const tech = match[2].toLowerCase();
        // Extract technology names like React, Next.js, etc.
        const techs = tech.match(/[\w.]+/g) || [];
        keywords.push(...techs);
      }
    }

    // Extract key action words from Core Responsibilities
    const responsibilitiesSection = content.match(/## Core Responsibilities\n([\s\S]*?)(?=\n##|$)/);
    if (responsibilitiesSection) {
      const responsibilities = responsibilitiesSection[1];
      // Extract action verbs and key nouns
      const actionWords = responsibilities.matchAll(/\*\*(.*?)\*\*:/g);
      for (const match of actionWords) {
        keywords.push(...match[1].toLowerCase().split(/[\s-]+/));
      }
    }

    // Extract from first paragraph (agent description)
    const firstParagraph = content.match(/# .*\n\n(.*?)(?=\n\n|$)/s);
    if (firstParagraph) {
      const words = firstParagraph[1].toLowerCase().match(/\b[\w]+\b/g) || [];
      // Filter for meaningful words (4+ characters)
      keywords.push(...words.filter(w => w.length >= 4 && !['you', 'are', 'the', 'and', 'with'].includes(w)));
    }

    return [...new Set(keywords)]; // Remove duplicates
  }

  /**
   * Extract keywords from user request
   */
  private extractKeywords(request: string): string[] {
    const normalized = request.toLowerCase();

    // Remove common stop words
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'can', 'could', 'should', 'would', 'i', 'me', 'my', 'we', 'us', 'our'];
    const words = normalized.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);

    // Extract multi-word phrases (bigrams)
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }

    return [...words, ...phrases];
  }

  /**
   * Calculate score for keyword matching
   * +10 for exact match, +5 for partial match
   */
  private calculateScore(keywords: string[], targetKeywords: string[]): number {
    let score = 0;

    for (const keyword of keywords) {
      for (const target of targetKeywords) {
        if (keyword === target) {
          score += 10; // Exact match
        } else if (keyword.includes(target) || target.includes(keyword)) {
          score += 5; // Partial match
        }
      }
    }

    return score;
  }

  /**
   * Route request to appropriate domain (Level 1)
   */
  private routeToDomain(keywords: string[]): { domain: string; score: number } {
    const scores: Record<string, number> = {};

    for (const [domain, domainKeywords] of Object.entries(DOMAIN_KEYWORDS)) {
      scores[domain] = this.calculateScore(keywords, domainKeywords);
    }

    // Find domain with highest score
    const bestDomain = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];

    return { domain: bestDomain[0], score: bestDomain[1] };
  }

  /**
   * Route to specialist agent within domain (Level 2)
   */
  private routeToAgent(keywords: string[], domain: string): { agent: Agent; score: number } {
    const domainAgents = this.agents.filter(a => a.domain === domain);
    const scores: Map<Agent, number> = new Map();

    for (const agent of domainAgents) {
      const score = this.calculateScore(keywords, agent.keywords);
      scores.set(agent, score);
    }

    // Find agent with highest score
    const bestAgent = Array.from(scores.entries()).sort(([, a], [, b]) => b - a)[0];

    return { agent: bestAgent[0], score: bestAgent[1] };
  }

  /**
   * Calculate confidence level based on score
   */
  private calculateConfidence(score: number, maxPossible: number): number {
    if (maxPossible === 0) return 0;
    return Math.min(100, Math.round((score / maxPossible) * 100));
  }

  /**
   * Main routing function
   * Implements 3-tier routing: System → Domain → Specialist
   */
  async route(request: string): Promise<RoutingResult> {
    if (this.agents.length === 0) {
      await this.loadAgents();
    }

    // Extract keywords from request
    const keywords = this.extractKeywords(request);

    // Level 1: Route to domain
    const { domain, score: domainScore } = this.routeToDomain(keywords);

    // Level 2: Route to specialist agent
    const { agent, score: agentScore } = this.routeToAgent(keywords, domain);

    // Calculate confidence
    const maxDomainScore = keywords.length * 10; // Max if all exact matches
    const confidence = this.calculateConfidence(domainScore + agentScore, maxDomainScore * 2);

    return {
      domain,
      agent: agent.name,
      confidence,
      reasoning: `Matched keywords: ${keywords.join(', ')} → ${domain} (${domainScore} points) → ${agent.name} (${agentScore} points)`,
      keywords
    };
  }

  /**
   * Get agent by name
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.find(a => a.name === name);
  }

  /**
   * Get all agents in a domain
   */
  getAgentsByDomain(domain: string): Agent[] {
    return this.agents.filter(a => a.domain === domain);
  }

  /**
   * Get routing statistics
   */
  getStats() {
    const domainCounts: Record<string, number> = {};
    for (const agent of this.agents) {
      domainCounts[agent.domain] = (domainCounts[agent.domain] || 0) + 1;
    }

    return {
      totalAgents: this.agents.length,
      domains: Object.keys(domainCounts).length,
      agentsPerDomain: domainCounts
    };
  }
}
