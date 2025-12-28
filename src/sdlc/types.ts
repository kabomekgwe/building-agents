/**
 * SDLC Type Definitions
 * Core types for Software Development Life Cycle orchestration
 */

export enum SDLCPhase {
  REQUIREMENTS = 'requirements',
  DESIGN = 'design',
  IMPLEMENTATION = 'implementation',
  TESTING = 'testing',
  DEPLOYMENT = 'deployment',
  MAINTENANCE = 'maintenance'
}

export enum DeliverableStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export enum QualityGateStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed'
}

export enum BugSeverity {
  P0_CRITICAL = 'p0_critical',
  P1_HIGH = 'p1_high',
  P2_MEDIUM = 'p2_medium',
  P3_LOW = 'p3_low'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  currentPhase: SDLCPhase;
  phaseStartedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deliverables: Deliverable[];
  qualityGates: QualityGate[];
  approvals: Approval[];
  metrics: ProjectMetrics;
  auditLog: AuditEvent[];
}

export interface Deliverable {
  id: string;
  projectId: string;
  phase: SDLCPhase;
  name: string;
  description: string;
  required: boolean;
  type: 'document' | 'code' | 'test' | 'design' | 'report';
  status: DeliverableStatus;
  artifacts: Artifact[];
  assignedAgent?: string;
  assignedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  blockers?: string[];
}

export interface Artifact {
  id: string;
  deliverableId: string;
  type: 'document' | 'code' | 'test' | 'design' | 'report';
  name: string;
  path?: string;
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  createdBy: string; // Agent or user
}

export interface QualityGate {
  id: string;
  projectId: string;
  phase: SDLCPhase;
  name: string;
  description: string;
  type: 'automated' | 'manual';
  criteria: GateCriteria[];
  status: QualityGateStatus;
  blocksTransition: boolean;
  runAt?: Date;
  passedAt?: Date;
  failedAt?: Date;
  evidence?: string[];
}

export interface GateCriteria {
  name: string;
  description: string;
  metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  actual?: number;
  passed?: boolean;
  evidence?: string;
}

export interface Approval {
  id: string;
  projectId: string;
  phase: SDLCPhase;
  type: 'phase_transition' | 'deliverable' | 'exception';
  requester: string;
  approvers: string[];
  approvedBy?: string[];
  rejectedBy?: string[];
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
  comments?: string;
}

export interface ProjectMetrics {
  // Timeline metrics
  plannedDuration: number; // days
  actualDuration: number; // days
  percentComplete: number;

  // Quality metrics
  testCoverage: number; // percentage
  codeQualityScore: number; // 0-100
  securityScore: number; // 0-100
  performanceScore: number; // 0-100

  // Delivery metrics
  deliverablesComplete: number;
  deliverablesTotal: number;
  gatesPassed: number;
  gatesTotal: number;

  // Issue metrics
  bugsFound: number;
  bugsResolved: number;
  criticalBugs: number;

  // Velocity metrics
  storyPoints: number;
  velocity: number; // points per sprint
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  projectId: string;
  phase: SDLCPhase;
  eventType: 'phase_transition' | 'deliverable_complete' | 'gate_result' | 'approval' | 'agent_assignment';
  actor: string; // User or agent name
  details: Record<string, any>;
  signature?: string; // For compliance
}

export interface PhaseTransitionRequest {
  projectId: string;
  fromPhase: SDLCPhase;
  toPhase: SDLCPhase;
  requestedBy: string;
  reason: string;
  skipGates?: boolean; // Emergency override
}

export interface PhaseTransitionResult {
  success: boolean;
  newPhase?: SDLCPhase;
  blockers?: string[];
  missingDeliverables?: Deliverable[];
  failedGates?: QualityGate[];
  message: string;
}

export interface CompletionStatus {
  phase: SDLCPhase;
  isComplete: boolean;
  completionPercentage: number;
  missingDeliverables: Deliverable[];
  pendingGates: QualityGate[];
  blockers: string[];
}

export interface GateResults {
  phase: SDLCPhase;
  totalGates: number;
  passedGates: number;
  failedGates: number;
  results: QualityGate[];
  overallPass: boolean;
  blockers: string[];
}

/**
 * Phase definitions with default deliverables and gates
 */
export const PHASE_DEFINITIONS: Record<SDLCPhase, PhaseDefinition> = {
  [SDLCPhase.REQUIREMENTS]: {
    phase: SDLCPhase.REQUIREMENTS,
    name: 'Requirements & Planning',
    duration: 5, // days
    deliverables: [
      {
        name: 'Product Requirements Document (PRD)',
        description: 'Comprehensive requirements specification',
        required: true,
        type: 'document'
      },
      {
        name: 'User Stories',
        description: 'User stories with acceptance criteria',
        required: true,
        type: 'document'
      },
      {
        name: 'Success Metrics',
        description: 'Measurable success criteria',
        required: true,
        type: 'document'
      },
      {
        name: 'Risk Assessment',
        description: 'Technical and business risks',
        required: false,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Requirements Completeness',
        description: 'All requirements have acceptance criteria',
        type: 'manual',
        blocksTransition: true
      },
      {
        name: 'Stakeholder Approval',
        description: 'Product owner approval obtained',
        type: 'manual',
        blocksTransition: true
      }
    ]
  },

  [SDLCPhase.DESIGN]: {
    phase: SDLCPhase.DESIGN,
    name: 'System Design',
    duration: 7, // days
    deliverables: [
      {
        name: 'System Architecture Diagram',
        description: 'High-level system architecture',
        required: true,
        type: 'design'
      },
      {
        name: 'Database Schema',
        description: 'ERD and migration scripts',
        required: true,
        type: 'code'
      },
      {
        name: 'API Contracts',
        description: 'OpenAPI/Swagger specifications',
        required: true,
        type: 'document'
      },
      {
        name: 'UI/UX Mockups',
        description: 'Figma designs and wireframes',
        required: true,
        type: 'design'
      },
      {
        name: 'Security Design',
        description: 'Threat model and security controls',
        required: true,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Architecture Review',
        description: 'SOLID principles, scalability validated',
        type: 'manual',
        blocksTransition: true
      },
      {
        name: 'Security Review',
        description: 'Threat model approved, no critical risks',
        type: 'manual',
        blocksTransition: true
      },
      {
        name: 'Design System Compliance',
        description: 'UI follows design system standards',
        type: 'automated',
        blocksTransition: false
      }
    ]
  },

  [SDLCPhase.IMPLEMENTATION]: {
    phase: SDLCPhase.IMPLEMENTATION,
    name: 'Implementation',
    duration: 21, // days
    deliverables: [
      {
        name: 'Source Code',
        description: 'Production-ready code',
        required: true,
        type: 'code'
      },
      {
        name: 'Unit Tests',
        description: 'Unit tests with >80% coverage',
        required: true,
        type: 'test'
      },
      {
        name: 'Integration Tests',
        description: 'API and service integration tests',
        required: true,
        type: 'test'
      },
      {
        name: 'API Documentation',
        description: 'Auto-generated API docs',
        required: true,
        type: 'document'
      },
      {
        name: 'Code Review Approvals',
        description: 'Peer review approvals',
        required: true,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Test Coverage',
        description: 'Unit test coverage >= 80%',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'All Tests Passing',
        description: '100% test pass rate',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Code Quality',
        description: 'Maintainability index >= 70',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Security Scan',
        description: 'Zero critical/high CVEs',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Code Review',
        description: 'Approved by 2+ reviewers',
        type: 'manual',
        blocksTransition: true
      }
    ]
  },

  [SDLCPhase.TESTING]: {
    phase: SDLCPhase.TESTING,
    name: 'Testing & QA',
    duration: 10, // days
    deliverables: [
      {
        name: 'E2E Test Suite',
        description: 'Automated E2E tests for critical paths',
        required: true,
        type: 'test'
      },
      {
        name: 'Load Test Results',
        description: 'Performance benchmarks',
        required: true,
        type: 'report'
      },
      {
        name: 'Security Audit',
        description: 'Penetration test results',
        required: true,
        type: 'report'
      },
      {
        name: 'Accessibility Audit',
        description: 'WCAG 2.1 AA compliance report',
        required: true,
        type: 'report'
      },
      {
        name: 'Bug Reports',
        description: 'All bugs documented and triaged',
        required: true,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Zero P0 Bugs',
        description: 'No critical bugs blocking release',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'E2E Pass Rate',
        description: 'E2E tests passing >= 95%',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Performance SLA',
        description: 'p95 latency within targets',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Security Cleared',
        description: 'Pen test passed, no critical findings',
        type: 'manual',
        blocksTransition: true
      },
      {
        name: 'Accessibility Compliant',
        description: 'WCAG 2.1 AA compliance achieved',
        type: 'automated',
        blocksTransition: false
      }
    ]
  },

  [SDLCPhase.DEPLOYMENT]: {
    phase: SDLCPhase.DEPLOYMENT,
    name: 'Deployment',
    duration: 2, // days
    deliverables: [
      {
        name: 'Deployment Plan',
        description: 'Step-by-step deployment procedure',
        required: true,
        type: 'document'
      },
      {
        name: 'Rollback Plan',
        description: 'Rollback procedures and criteria',
        required: true,
        type: 'document'
      },
      {
        name: 'Monitoring Dashboards',
        description: 'Production monitoring configured',
        required: true,
        type: 'code'
      },
      {
        name: 'Runbook',
        description: 'Operations runbook',
        required: true,
        type: 'document'
      },
      {
        name: 'Release Notes',
        description: 'Customer-facing release notes',
        required: true,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Staging Validated',
        description: 'Staging deployment successful',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Smoke Tests Passing',
        description: 'Production smoke tests green',
        type: 'automated',
        blocksTransition: true
      },
      {
        name: 'Rollback Tested',
        description: 'Rollback procedure validated',
        type: 'manual',
        blocksTransition: true
      }
    ]
  },

  [SDLCPhase.MAINTENANCE]: {
    phase: SDLCPhase.MAINTENANCE,
    name: 'Maintenance & Monitoring',
    duration: 0, // ongoing
    deliverables: [
      {
        name: 'Health Reports',
        description: 'Daily/weekly system health reports',
        required: true,
        type: 'report'
      },
      {
        name: 'Incident Logs',
        description: 'Incident response documentation',
        required: true,
        type: 'document'
      },
      {
        name: 'Performance Metrics',
        description: 'Uptime, latency, error rates',
        required: true,
        type: 'report'
      },
      {
        name: 'User Feedback',
        description: 'Aggregated user feedback and NPS',
        required: true,
        type: 'document'
      }
    ],
    qualityGates: [
      {
        name: 'Uptime SLA',
        description: 'Uptime >= 99.9%',
        type: 'automated',
        blocksTransition: false
      },
      {
        name: 'Error Rate',
        description: 'Error rate < 0.1%',
        type: 'automated',
        blocksTransition: false
      },
      {
        name: 'Customer Satisfaction',
        description: 'NPS > 40 or CSAT > 85%',
        type: 'manual',
        blocksTransition: false
      }
    ]
  }
};

export interface PhaseDefinition {
  phase: SDLCPhase;
  name: string;
  duration: number; // days
  deliverables: DeliverableTemplate[];
  qualityGates: QualityGateTemplate[];
}

export interface DeliverableTemplate {
  name: string;
  description: string;
  required: boolean;
  type: 'document' | 'code' | 'test' | 'design' | 'report';
}

export interface QualityGateTemplate {
  name: string;
  description: string;
  type: 'automated' | 'manual';
  blocksTransition: boolean;
}

// ========================================
// PLANNING SESSION TYPES
// ========================================

export interface RequirementsFormData {
  projectName: string
  description: string
  problemStatement: string
  targetAudience: string
  features: string[]
  successMetrics: string[]
  outOfScope: string[]
  lastSaved?: Date
  generatedPRD?: string
  generatedAt?: Date
}

export interface PlanningSession {
  id: string
  projectName: string
  description?: string
  currentPhase: 'requirements' | 'design' | 'implementation'
  completedPhases: string[]
  phaseData: {
    requirements?: RequirementsFormData
    design?: any
    implementation?: any
  }
  createdAt: Date
  updatedAt: Date
}

export interface PlanningPhaseDefinition {
  id: string
  name: string
  description: string
  order: number
  requiredFields: string[]
}

/**
 * Agent phase compatibility matrix
 */
export const AGENT_PHASE_COMPATIBILITY: Record<string, SDLCPhase[]> = {
  // Product agents
  'trend-researcher': [SDLCPhase.REQUIREMENTS],
  'feedback-synthesizer': [SDLCPhase.REQUIREMENTS, SDLCPhase.MAINTENANCE],
  'sprint-prioritizer': [SDLCPhase.REQUIREMENTS],

  // Design agents
  'ui-designer': [SDLCPhase.DESIGN],
  'ux-researcher': [SDLCPhase.REQUIREMENTS, SDLCPhase.DESIGN],
  'brand-guardian': [SDLCPhase.DESIGN],
  'visual-storyteller': [SDLCPhase.DESIGN],
  'whimsy-injector': [SDLCPhase.DESIGN],

  // Engineering agents
  'frontend-developer': [SDLCPhase.DESIGN, SDLCPhase.IMPLEMENTATION],
  'backend-architect': [SDLCPhase.DESIGN, SDLCPhase.IMPLEMENTATION],
  'mobile-app-builder': [SDLCPhase.DESIGN, SDLCPhase.IMPLEMENTATION],
  'ai-engineer': [SDLCPhase.IMPLEMENTATION],
  'devops-automator': [SDLCPhase.DEPLOYMENT, SDLCPhase.MAINTENANCE],
  'rapid-prototyper': [SDLCPhase.DESIGN],

  // Testing agents
  'tool-evaluator': [SDLCPhase.TESTING],
  'api-tester': [SDLCPhase.TESTING],
  'workflow-optimizer': [SDLCPhase.TESTING],
  'performance-benchmarker': [SDLCPhase.TESTING],
  'test-results-analyzer': [SDLCPhase.TESTING],

  // Operations agents
  'support-responder': [SDLCPhase.MAINTENANCE],
  'analytics-reporter': [SDLCPhase.MAINTENANCE],
  'infrastructure-maintainer': [SDLCPhase.MAINTENANCE],

  // Project management
  'project-shipper': [SDLCPhase.DEPLOYMENT],
  'experiment-tracker': [SDLCPhase.MAINTENANCE],
  'studio-producer': [SDLCPhase.REQUIREMENTS, SDLCPhase.DEPLOYMENT]
};
