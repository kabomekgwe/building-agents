/**
 * Autonomous Task Execution Engine
 * Inspired by get-shit-done and Auto-Claude
 * Breaks down complex tasks and executes them autonomously until completion
 * Uses Claude Code CLI instead of direct API calls
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { AgentRouter } from '../runtime/router.js';
import { randomUUID } from 'crypto';
import { SDLCOrchestrator } from '../sdlc/orchestrator.js';
import { SDLCPhase, DeliverableStatus } from '../sdlc/types.js';

const execAsync = promisify(exec);

export interface TaskStep {
  id: string;
  stepNumber: number;
  description: string;
  agent?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Task {
  id: string;
  goal: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  steps: TaskStep[];
  currentStep: number;
  createdAt: Date;
  completedAt?: Date;
  output?: string;
  error?: string;
}

export interface TaskProgress {
  taskId: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  message: string;
  timestamp: Date;
}

export class AutonomousTaskExecutor {
  private router: AgentRouter;
  private tasks: Map<string, Task> = new Map();
  private progressCallbacks: Map<string, (progress: TaskProgress) => void> = new Map();
  private orchestrator: SDLCOrchestrator;

  constructor(orchestrator?: SDLCOrchestrator) {
    this.router = new AgentRouter();
    this.orchestrator = orchestrator || new SDLCOrchestrator();
  }

  async initialize() {
    await this.router.loadAgents();
  }

  /**
   * Execute a Claude Code CLI command and return the response
   */
  private async executeClaude(prompt: string): Promise<string> {
    try {
      // Escape single quotes in the prompt for shell safety
      const escapedPrompt = prompt.replace(/'/g, "'\\''");

      // Execute Claude CLI with the prompt in print mode (non-interactive)
      const { stdout, stderr } = await execAsync(`echo '${escapedPrompt}' | claude --print`);

      if (stderr && !stderr.includes('Warning')) {
        console.error('Claude CLI stderr:', stderr);
      }

      return stdout.trim();
    } catch (error) {
      console.error('Claude CLI execution error:', error);
      throw new Error(`Failed to execute Claude CLI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new task from a high-level goal
   */
  async createTask(goal: string): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      goal,
      status: 'planning',
      steps: [],
      currentStep: 0,
      createdAt: new Date()
    };

    this.tasks.set(task.id, task);
    this.emitProgress(task.id, 'planning', 0, 0, 'Breaking down task into steps...');

    // Break down the goal into executable steps
    const steps = await this.breakDownTask(goal);
    task.steps = steps;
    task.status = 'executing';

    this.emitProgress(task.id, 'executing', 0, steps.length, `Task broken into ${steps.length} steps`);

    return task;
  }

  /**
   * Break down a high-level goal into executable steps using Claude CLI
   */
  private async breakDownTask(goal: string): Promise<TaskStep[]> {
    const prompt = `You are a task planning expert. Break down this goal into 5-10 specific, executable steps.

Goal: ${goal}

Requirements:
1. Each step should be concrete and actionable
2. Steps should be ordered logically
3. Each step should be something a software agent can execute
4. Be specific about what needs to be done

Return ONLY a JSON array of steps in this exact format:
[
  { "description": "Step 1 description", "agent": "suggested-agent-name" },
  { "description": "Step 2 description", "agent": "suggested-agent-name" },
  ...
]

Available agent domains: engineering, product, marketing, design, project-management, studio-operations, testing`;

    const response = await this.executeClaude(prompt);

    // Parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const stepsData = JSON.parse(jsonMatch[0]);

    return stepsData.map((step: any, index: number): TaskStep => ({
      id: randomUUID(),
      stepNumber: index + 1,
      description: step.description,
      agent: step.agent,
      status: 'pending'
    }));
  }

  /**
   * Execute a task autonomously until completion using Claude CLI
   */
  async executeTask(taskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    for (let i = 0; i < task.steps.length; i++) {
      const step = task.steps[i];
      task.currentStep = i;

      this.emitProgress(
        taskId,
        'executing',
        i + 1,
        task.steps.length,
        `Executing step ${i + 1}: ${step.description}`
      );

      step.status = 'in_progress';
      step.startedAt = new Date();

      try {
        // Always route through router to get the correct specialist agent
        // (Claude may suggest domain names like "engineering" instead of specific agents)
        const routing = await this.router.route(step.description);
        const agent = this.router.getAgent(routing.agent);

        if (!agent) {
          throw new Error(`Agent ${routing.agent} not found for step: ${step.description}`);
        }

        // Execute the step using Claude CLI with agent context
        const prompt = `${agent.content}\n\nTask: ${step.description}\n\nExecute this task and provide the result.`;
        const result = await this.executeClaude(prompt);

        step.status = 'completed';
        step.result = result;
        step.completedAt = new Date();

        this.emitProgress(
          taskId,
          'executing',
          i + 1,
          task.steps.length,
          `✓ Step ${i + 1} completed`
        );

      } catch (error) {
        step.status = 'failed';
        step.error = error instanceof Error ? error.message : 'Unknown error';
        step.completedAt = new Date();

        // Try to recover from error
        const recovered = await this.handleStepFailure(task, step);
        if (!recovered) {
          task.status = 'failed';
          task.error = `Step ${i + 1} failed: ${step.error}`;
          this.emitProgress(taskId, 'failed', i + 1, task.steps.length, task.error);
          return task;
        }
      }
    }

    // All steps completed
    task.status = 'completed';
    task.completedAt = new Date();
    task.output = this.generateTaskSummary(task);

    this.emitProgress(
      taskId,
      'completed',
      task.steps.length,
      task.steps.length,
      '✅ Task completed successfully!'
    );

    return task;
  }

  /**
   * Launch a full SDLC Mission
   * Documentation-first autonomous development
   */
  async launchSDLCMission(goal: string): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      goal,
      status: 'planning',
      steps: [],
      currentStep: 0,
      createdAt: new Date()
    };

    this.tasks.set(task.id, task);
    this.emitProgress(task.id, 'planning', 0, 0, 'Initializing SDLC Mission...');

    try {
      // 1. Start SDLC Project
      const project = await this.orchestrator.startProject({
        name: `Mission: ${goal.substring(0, 30)}...`,
        description: goal
      });

      this.emitProgress(task.id, 'executing', 0, 0, `SDLC Project Created: ${project.id}`);

      // 2. Iterate through phases
      const phases = [SDLCPhase.REQUIREMENTS, SDLCPhase.DESIGN, SDLCPhase.IMPLEMENTATION];

      for (const phase of phases) {
        this.emitProgress(task.id, 'executing', phases.indexOf(phase) + 1, phases.length, `Entering ${phase} phase...`);

        // Ensure project is in the right phase
        if (project.currentPhase !== phase) {
          await this.orchestrator.transitionPhase({
            projectId: project.id,
            fromPhase: project.currentPhase,
            toPhase: phase,
            requestedBy: 'AutonomousTaskExecutor',
            reason: 'Autonomous progression',
            skipGates: true // Auto-progress during mission
          });
        }

        // Get deliverables for this phase
        const deliverables = project.deliverables.filter(d => d.phase === phase && d.required);

        for (const deliverable of deliverables) {
          this.emitProgress(task.id, 'executing', phases.indexOf(phase) + 1, phases.length, `Generating deliverable: ${deliverable.name}`);

          await this.orchestrator.assignDeliverable(deliverable.id, 'AutonomousAgent');

          const prompt = `Goal: ${goal}\nPhase: ${phase}\nDeliverable: ${deliverable.name}\nDescription: ${deliverable.description}\n\nProduce a professional, production-ready document or code artifact for this deliverable. Output ONLY the content of the deliverable.`;

          const output = await this.executeClaude(prompt);

          await this.orchestrator.markDeliverableComplete(deliverable.id, [
            {
              id: randomUUID(),
              deliverableId: deliverable.id,
              type: deliverable.type as any,
              name: deliverable.name,
              content: output,
              createdAt: new Date(),
              createdBy: 'AutonomousAgent'
            }
          ]);

          // Add to task steps for visualization
          task.steps.push({
            id: randomUUID(),
            stepNumber: task.steps.length + 1,
            description: `${phase.toUpperCase()}: ${deliverable.name}`,
            status: 'completed',
            result: `Generated ${deliverable.name}`,
            completedAt: new Date()
          });
        }

        // Run quality gates
        await this.orchestrator.runQualityGates(project.id, phase);
      }

      task.status = 'completed';
      task.completedAt = new Date();
      task.output = `SDLC Mission Completed Successfully.\nProject ID: ${project.id}\nAll phases Requirements, Design, and Implementation completed with production-ready artifacts.`;

      this.emitProgress(task.id, 'completed', 3, 3, '✅ SDLC Mission completed!');
      return task;

    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      this.emitProgress(task.id, 'failed', 0, 0, `❌ Mission failed: ${task.error}`);
      throw error;
    }
  }

  /**
   * Handle step failure with autonomous recovery using Claude CLI
   */
  private async handleStepFailure(task: Task, failedStep: TaskStep): Promise<boolean> {
    const prompt = `A task step failed. Analyze the error and suggest recovery steps.

Failed Step: ${failedStep.description}
Error: ${failedStep.error}

Goal: ${task.goal}

Should we:
1. Retry the step with modifications
2. Skip this step and continue
3. Fail the entire task

Return JSON: { "action": "retry" | "skip" | "fail", "reason": "explanation", "modifiedStep": "new description if retry" }`;

    try {
      const response = await this.executeClaude(prompt);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return false;
      }

      const recovery = JSON.parse(jsonMatch[0]);

      if (recovery.action === 'skip') {
        this.emitProgress(
          task.id,
          'executing',
          task.currentStep + 1,
          task.steps.length,
          `⚠️ Skipping failed step: ${recovery.reason}`
        );
        return true;
      } else if (recovery.action === 'retry' && recovery.modifiedStep) {
        failedStep.description = recovery.modifiedStep;
        failedStep.status = 'pending';
        failedStep.error = undefined;
        this.emitProgress(
          task.id,
          'executing',
          task.currentStep + 1,
          task.steps.length,
          `🔄 Retrying with modification: ${recovery.modifiedStep}`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during failure recovery:', error);
      return false;
    }
  }

  /**
   * Generate a summary of task execution
   */
  private generateTaskSummary(task: Task): string {
    const completedSteps = task.steps.filter(s => s.status === 'completed');
    const failedSteps = task.steps.filter(s => s.status === 'failed');

    let summary = `Task: ${task.goal}\n\n`;
    summary += `Status: ${task.status}\n`;
    summary += `Completed: ${completedSteps.length}/${task.steps.length} steps\n\n`;

    summary += 'Steps:\n';
    task.steps.forEach(step => {
      const icon = step.status === 'completed' ? '✓' : step.status === 'failed' ? '✗' : '○';
      summary += `${icon} ${step.stepNumber}. ${step.description}\n`;
      if (step.result) {
        summary += `   Result: ${step.result.substring(0, 100)}...\n`;
      }
      if (step.error) {
        summary += `   Error: ${step.error}\n`;
      }
    });

    if (failedSteps.length > 0) {
      summary += `\nWarning: ${failedSteps.length} step(s) failed\n`;
    }

    return summary;
  }

  /**
   * Register a progress callback for real-time updates
   */
  onProgress(taskId: string, callback: (progress: TaskProgress) => void) {
    this.progressCallbacks.set(taskId, callback);
  }

  /**
   * Emit progress update
   */
  private emitProgress(taskId: string, status: string, currentStep: number, totalSteps: number, message: string) {
    const progress: TaskProgress = {
      taskId,
      status,
      currentStep,
      totalSteps,
      message,
      timestamp: new Date()
    };

    const callback = this.progressCallbacks.get(taskId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Get task status
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}
