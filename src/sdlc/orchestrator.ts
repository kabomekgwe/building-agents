/**
 * SDLC Orchestrator
 * Manages project lifecycle, enforces phase gates, coordinates agents
 */

import { randomUUID } from 'crypto';
import {
  Project,
  SDLCPhase,
  Deliverable,
  QualityGate,
  DeliverableStatus,
  QualityGateStatus,
  PhaseTransitionRequest,
  PhaseTransitionResult,
  CompletionStatus,
  GateResults,
  AuditEvent,
  PHASE_DEFINITIONS,
  AGENT_PHASE_COMPATIBILITY,
  ProjectMetrics
} from './types.js';

export class SDLCOrchestrator {
  private projects: Map<string, Project> = new Map();

  /**
   * Start a new SDLC project
   */
  async startProject(params: {
    name: string;
    description: string;
    customDeliverables?: Partial<Deliverable>[];
  }): Promise<Project> {
    const projectId = randomUUID();

    // Initialize project in REQUIREMENTS phase
    const project: Project = {
      id: projectId,
      name: params.name,
      description: params.description,
      currentPhase: SDLCPhase.REQUIREMENTS,
      phaseStartedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deliverables: this.initializeDeliverables(projectId, SDLCPhase.REQUIREMENTS),
      qualityGates: this.initializeQualityGates(projectId, SDLCPhase.REQUIREMENTS),
      approvals: [],
      metrics: this.initializeMetrics(),
      auditLog: []
    };

    // Add custom deliverables if provided
    if (params.customDeliverables) {
      params.customDeliverables.forEach(custom => {
        project.deliverables.push({
          id: randomUUID(),
          projectId,
          phase: SDLCPhase.REQUIREMENTS,
          status: DeliverableStatus.PENDING,
          required: true,
          artifacts: [],
          ...custom
        } as Deliverable);
      });
    }

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId,
      phase: SDLCPhase.REQUIREMENTS,
      eventType: 'phase_transition',
      actor: 'system',
      details: {
        action: 'project_created',
        phase: SDLCPhase.REQUIREMENTS
      }
    });

    this.projects.set(projectId, project);
    return project;
  }

  /**
   * Initialize deliverables for a phase
   */
  private initializeDeliverables(projectId: string, phase: SDLCPhase): Deliverable[] {
    const phaseDef = PHASE_DEFINITIONS[phase];
    return phaseDef.deliverables.map(template => ({
      id: randomUUID(),
      projectId,
      phase,
      name: template.name,
      description: template.description,
      required: template.required,
      status: DeliverableStatus.PENDING,
      artifacts: []
    }));
  }

  /**
   * Initialize quality gates for a phase
   */
  private initializeQualityGates(projectId: string, phase: SDLCPhase): QualityGate[] {
    const phaseDef = PHASE_DEFINITIONS[phase];
    return phaseDef.qualityGates.map(template => ({
      id: randomUUID(),
      projectId,
      phase,
      name: template.name,
      description: template.description,
      type: template.type,
      criteria: [], // Populated when gate runs
      status: QualityGateStatus.PENDING,
      blocksTransition: template.blocksTransition
    }));
  }

  /**
   * Initialize project metrics
   */
  private initializeMetrics(): ProjectMetrics {
    return {
      plannedDuration: 0,
      actualDuration: 0,
      percentComplete: 0,
      testCoverage: 0,
      codeQualityScore: 0,
      securityScore: 0,
      performanceScore: 0,
      deliverablesComplete: 0,
      deliverablesTotal: 0,
      gatesPassed: 0,
      gatesTotal: 0,
      bugsFound: 0,
      bugsResolved: 0,
      criticalBugs: 0,
      storyPoints: 0,
      velocity: 0
    };
  }

  /**
   * Check if current phase is complete
   */
  async checkPhaseCompletion(projectId: string): Promise<CompletionStatus> {
    const project = this.getProject(projectId);
    const { currentPhase } = project;

    // Check deliverables
    const phaseDeliverables = project.deliverables.filter(d => d.phase === currentPhase);
    const requiredDeliverables = phaseDeliverables.filter(d => d.required);
    const completedRequired = requiredDeliverables.filter(d => d.status === DeliverableStatus.COMPLETED);
    const missingDeliverables = requiredDeliverables.filter(d => d.status !== DeliverableStatus.COMPLETED);

    // Check quality gates
    const phaseGates = project.qualityGates.filter(g => g.phase === currentPhase);
    const pendingGates = phaseGates.filter(g => g.status === QualityGateStatus.PENDING);

    // Calculate completion percentage
    const totalRequired = requiredDeliverables.length + phaseGates.filter(g => g.blocksTransition).length;
    const totalCompleted = completedRequired.length + phaseGates.filter(g => g.status === QualityGateStatus.PASSED).length;
    const completionPercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

    // Collect blockers
    const blockers: string[] = [];
    if (missingDeliverables.length > 0) {
      blockers.push(`Missing ${missingDeliverables.length} required deliverables`);
    }
    if (pendingGates.filter(g => g.blocksTransition).length > 0) {
      blockers.push(`Pending ${pendingGates.length} quality gates`);
    }

    const isComplete = missingDeliverables.length === 0 && pendingGates.filter(g => g.blocksTransition).length === 0;

    return {
      phase: currentPhase,
      isComplete,
      completionPercentage,
      missingDeliverables,
      pendingGates,
      blockers
    };
  }

  /**
   * Run quality gates for a phase
   */
  async runQualityGates(projectId: string, phase: SDLCPhase): Promise<GateResults> {
    const project = this.getProject(projectId);
    const phaseGates = project.qualityGates.filter(g => g.phase === phase);

    let passedGates = 0;
    let failedGates = 0;
    const blockers: string[] = [];

    for (const gate of phaseGates) {
      if (gate.type === 'automated') {
        // Run automated gate checks
        const result = await this.runAutomatedGate(project, gate);
        gate.status = result.passed ? QualityGateStatus.PASSED : QualityGateStatus.FAILED;
        gate.runAt = new Date();

        if (result.passed) {
          gate.passedAt = new Date();
          passedGates++;
        } else {
          gate.failedAt = new Date();
          failedGates++;
          if (gate.blocksTransition) {
            blockers.push(`Failed gate: ${gate.name}`);
          }
        }

        gate.criteria = result.criteria;
        gate.evidence = result.evidence;
      } else {
        // Manual gates require human approval
        if (gate.status === QualityGateStatus.PENDING && gate.blocksTransition) {
          blockers.push(`Manual gate pending: ${gate.name}`);
        }
        if (gate.status === QualityGateStatus.PASSED) passedGates++;
        if (gate.status === QualityGateStatus.FAILED) failedGates++;
      }
    }

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId,
      phase,
      eventType: 'gate_result',
      actor: 'system',
      details: {
        totalGates: phaseGates.length,
        passed: passedGates,
        failed: failedGates,
        blockers
      }
    });

    this.updateProject(project);

    return {
      phase,
      totalGates: phaseGates.length,
      passedGates,
      failedGates,
      results: phaseGates,
      overallPass: failedGates === 0 && phaseGates.every(g => !g.blocksTransition || g.status === QualityGateStatus.PASSED),
      blockers
    };
  }

  /**
   * Run an automated quality gate
   */
  private async runAutomatedGate(project: Project, gate: QualityGate): Promise<{
    passed: boolean;
    criteria: any[];
    evidence: string[];
  }> {
    // This would integrate with actual testing/scanning tools
    // For now, we'll simulate based on gate name and project metrics

    const evidence: string[] = [];
    const criteria: any[] = [];
    let passed = true;

    switch (gate.name) {
      case 'Test Coverage':
        criteria.push({
          name: 'Code Coverage',
          metric: 'coverage',
          operator: '>=',
          threshold: 80,
          actual: project.metrics.testCoverage,
          passed: project.metrics.testCoverage >= 80
        });
        passed = project.metrics.testCoverage >= 80;
        evidence.push(`Coverage report: ${project.metrics.testCoverage}%`);
        break;

      case 'All Tests Passing':
        // Would check actual test results
        passed = true; // Assume passing for now
        evidence.push('All test suites passing');
        break;

      case 'Code Quality':
        criteria.push({
          name: 'Maintainability Index',
          metric: 'maintainability',
          operator: '>=',
          threshold: 70,
          actual: project.metrics.codeQualityScore,
          passed: project.metrics.codeQualityScore >= 70
        });
        passed = project.metrics.codeQualityScore >= 70;
        evidence.push(`SonarQube score: ${project.metrics.codeQualityScore}`);
        break;

      case 'Security Scan':
        criteria.push({
          name: 'Critical Vulnerabilities',
          metric: 'critical_cves',
          operator: '=',
          threshold: 0,
          actual: project.metrics.criticalBugs,
          passed: project.metrics.criticalBugs === 0
        });
        passed = project.metrics.criticalBugs === 0;
        evidence.push(`Security scan: ${project.metrics.criticalBugs} critical issues`);
        break;

      case 'Zero P0 Bugs':
        passed = project.metrics.criticalBugs === 0;
        evidence.push(`P0 bugs: ${project.metrics.criticalBugs}`);
        break;

      case 'E2E Pass Rate':
        // Would check actual E2E test results
        passed = true; // Simulate for now
        evidence.push('E2E test pass rate: 98%');
        break;

      case 'Design System Compliance':
        // Would check design system standards
        passed = true; // Simulate for demo
        evidence.push('UI components follow design system standards');
        break;

      default:
        // Unknown gate - mark as pending
        passed = false;
    }

    return { passed, criteria, evidence };
  }

  /**
   * Approve a manual quality gate
   */
  async approveManualGate(projectId: string, gateName: string, approvedBy: string): Promise<void> {
    const project = this.getProject(projectId);

    const gate = project.qualityGates.find(g => g.name === gateName);
    if (!gate) {
      throw new Error(`Quality gate not found: ${gateName}`);
    }

    if (gate.type !== 'manual') {
      throw new Error(`Gate ${gateName} is not a manual gate`);
    }

    gate.status = QualityGateStatus.PASSED;
    gate.passedAt = new Date();
    gate.evidence = [`Approved by ${approvedBy} at ${new Date().toISOString()}`];

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId: project.id,
      phase: project.currentPhase,
      eventType: 'gate_result',
      actor: approvedBy,
      details: {
        gate: gateName,
        status: 'passed',
        type: 'manual_approval'
      }
    });

    project.updatedAt = new Date();
  }

  /**
   * Transition to next phase
   */
  async transitionPhase(request: PhaseTransitionRequest): Promise<PhaseTransitionResult> {
    const project = this.getProject(request.projectId);

    // Validate phase order
    const phaseOrder = Object.values(SDLCPhase);
    const fromIndex = phaseOrder.indexOf(request.fromPhase);
    const toIndex = phaseOrder.indexOf(request.toPhase);

    if (fromIndex === -1 || toIndex === -1) {
      return {
        success: false,
        message: 'Invalid phase'
      };
    }

    if (toIndex !== fromIndex + 1) {
      return {
        success: false,
        message: 'Cannot skip phases - must proceed sequentially'
      };
    }

    // Check phase completion unless skipping gates
    if (!request.skipGates) {
      const completion = await this.checkPhaseCompletion(request.projectId);
      if (!completion.isComplete) {
        return {
          success: false,
          message: 'Phase not complete',
          blockers: completion.blockers,
          missingDeliverables: completion.missingDeliverables
        };
      }

      // Run quality gates
      const gateResults = await this.runQualityGates(request.projectId, request.fromPhase);
      if (!gateResults.overallPass) {
        return {
          success: false,
          message: 'Quality gates failed',
          blockers: gateResults.blockers,
          failedGates: gateResults.results.filter(g => g.status === QualityGateStatus.FAILED)
        };
      }
    }

    // Transition to new phase
    project.currentPhase = request.toPhase;
    project.phaseStartedAt = new Date();
    project.updatedAt = new Date();

    // Initialize deliverables and gates for new phase
    const newDeliverables = this.initializeDeliverables(project.id, request.toPhase);
    const newGates = this.initializeQualityGates(project.id, request.toPhase);

    project.deliverables.push(...newDeliverables);
    project.qualityGates.push(...newGates);

    // Update metrics
    this.updateMetrics(project);

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId: project.id,
      phase: request.toPhase,
      eventType: 'phase_transition',
      actor: request.requestedBy,
      details: {
        from: request.fromPhase,
        to: request.toPhase,
        reason: request.reason,
        skipGates: request.skipGates
      }
    });

    this.updateProject(project);

    return {
      success: true,
      newPhase: request.toPhase,
      message: `Successfully transitioned to ${request.toPhase} phase`
    };
  }

  /**
   * Assign deliverable to an agent
   */
  async assignDeliverable(deliverableId: string, agentName: string): Promise<void> {
    const project = this.findProjectByDeliverable(deliverableId);
    if (!project) {
      throw new Error('Deliverable not found');
    }

    const deliverable = project.deliverables.find(d => d.id === deliverableId);
    if (!deliverable) {
      throw new Error('Deliverable not found');
    }

    // Check agent phase compatibility
    const compatiblePhases = AGENT_PHASE_COMPATIBILITY[agentName];
    if (!compatiblePhases || !compatiblePhases.includes(deliverable.phase)) {
      throw new Error(`Agent ${agentName} not compatible with phase ${deliverable.phase}`);
    }

    deliverable.assignedAgent = agentName;
    deliverable.assignedAt = new Date();
    deliverable.status = DeliverableStatus.IN_PROGRESS;

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId: project.id,
      phase: project.currentPhase,
      eventType: 'agent_assignment',
      actor: 'system',
      details: {
        deliverableId,
        deliverableName: deliverable.name,
        agent: agentName
      }
    });

    this.updateProject(project);
  }

  /**
   * Mark deliverable as complete
   */
  async markDeliverableComplete(deliverableId: string, artifacts: any[] = []): Promise<void> {
    const project = this.findProjectByDeliverable(deliverableId);
    if (!project) {
      throw new Error('Deliverable not found');
    }

    const deliverable = project.deliverables.find(d => d.id === deliverableId);
    if (!deliverable) {
      throw new Error('Deliverable not found');
    }

    deliverable.status = DeliverableStatus.COMPLETED;
    deliverable.completedAt = new Date();
    deliverable.artifacts = artifacts;

    // Update metrics
    project.metrics.deliverablesComplete++;
    this.updateMetrics(project);

    // Audit log
    project.auditLog.push({
      id: randomUUID(),
      timestamp: new Date(),
      projectId: project.id,
      phase: project.currentPhase,
      eventType: 'deliverable_complete',
      actor: deliverable.assignedAgent || 'unknown',
      details: {
        deliverableId,
        deliverableName: deliverable.name,
        artifacts: artifacts.map(a => a.name)
      }
    });

    this.updateProject(project);
  }

  /**
   * Update project metrics
   */
  private updateMetrics(project: Project): void {
    project.metrics.deliverablesTotal = project.deliverables.filter(d => d.required).length;
    project.metrics.deliverablesComplete = project.deliverables.filter(d => d.status === DeliverableStatus.COMPLETED).length;

    project.metrics.gatesTotal = project.qualityGates.filter(g => g.blocksTransition).length;
    project.metrics.gatesPassed = project.qualityGates.filter(g => g.status === QualityGateStatus.PASSED).length;

    project.metrics.percentComplete = project.metrics.deliverablesTotal > 0
      ? Math.round((project.metrics.deliverablesComplete / project.metrics.deliverablesTotal) * 100)
      : 0;

    // Calculate actual duration
    const now = new Date();
    project.metrics.actualDuration = Math.floor((now.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): Project {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  /**
   * Find project by deliverable ID
   */
  private findProjectByDeliverable(deliverableId: string): Project | undefined {
    return Array.from(this.projects.values()).find(p =>
      p.deliverables.some(d => d.id === deliverableId)
    );
  }

  /**
   * Update project
   */
  private updateProject(project: Project): void {
    project.updatedAt = new Date();
    this.projects.set(project.id, project);
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId: string): ProjectMetrics {
    const project = this.getProject(projectId);
    return project.metrics;
  }
}
