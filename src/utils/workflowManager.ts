// Workflow Manager - End-to-End Assignment Workflow Orchestration

import { WorkflowState, WorkflowStage, WorkflowStageStatus, WorkflowError } from '../types/event';
import { eventBus } from './eventBus';

class WorkflowManager {
  private workflows: Map<string, WorkflowState> = new Map();

  // Initialize workflow for new assignment
  initializeWorkflow(assignmentId: string): WorkflowState {
    const workflow: WorkflowState = {
      assignmentId,
      currentStage: 'application_submitted',
      stages: this.getInitialStages(),
      startedAt: new Date().toISOString(),
      errors: []
    };

    this.workflows.set(assignmentId, workflow);
    this.updateStageStatus(assignmentId, 'application_submitted', 'completed');
    this.moveToNextStage(assignmentId, 'facility_review');

    return workflow;
  }

  // Get initial stages
  private getInitialStages(): WorkflowStageStatus[] {
    const stages: WorkflowStage[] = [
      'application_submitted',
      'facility_review',
      'contract_sent',
      'physician_signature',
      'facility_signature',
      'escrow_funding',
      'assignment_scheduled',
      'assignment_active',
      'assignment_completed',
      'payment_release',
      'review_period',
      'workflow_complete'
    ];

    return stages.map(stage => ({
      stage,
      status: 'pending'
    }));
  }

  // Move to next stage
  moveToNextStage(assignmentId: string, nextStage: WorkflowStage): void {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow) return;

    workflow.currentStage = nextStage;
    this.updateStageStatus(assignmentId, nextStage, 'in_progress');
    this.workflows.set(assignmentId, workflow);

    // Emit event
    eventBus.emit('workflow.stage_changed', {
      assignmentId,
      stage: nextStage,
      timestamp: new Date().toISOString()
    });
  }

  // Update stage status
  updateStageStatus(
    assignmentId: string,
    stage: WorkflowStage,
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped',
    error?: string
  ): void {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow) return;

    const stageStatus = workflow.stages.find(s => s.stage === stage);
    if (!stageStatus) return;

    stageStatus.status = status;
    
    if (status === 'in_progress' && !stageStatus.startedAt) {
      stageStatus.startedAt = new Date().toISOString();
    }
    
    if (status === 'completed' || status === 'failed' || status === 'skipped') {
      stageStatus.completedAt = new Date().toISOString();
    }

    if (error) {
      stageStatus.error = error;
      workflow.errors.push({
        stage,
        error,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }

    this.workflows.set(assignmentId, workflow);
  }

  // Handle application approval
  async handleApplicationApproval(assignmentId: string, contractId: string): Promise<void> {
    this.updateStageStatus(assignmentId, 'facility_review', 'completed');
    this.moveToNextStage(assignmentId, 'contract_sent');
    
    await eventBus.emit('contract.sent', {
      assignmentId,
      contractId
    });

    this.updateStageStatus(assignmentId, 'contract_sent', 'completed');
    this.moveToNextStage(assignmentId, 'physician_signature');
  }

  // Handle physician signature
  async handlePhysicianSignature(assignmentId: string): Promise<void> {
    this.updateStageStatus(assignmentId, 'physician_signature', 'completed');
    this.moveToNextStage(assignmentId, 'facility_signature');
  }

  // Handle facility signature (contract execution)
  async handleFacilitySignature(assignmentId: string, amount: number): Promise<void> {
    this.updateStageStatus(assignmentId, 'facility_signature', 'completed');
    
    await eventBus.emit('contract.executed', {
      assignmentId,
      amount
    });

    this.moveToNextStage(assignmentId, 'escrow_funding');
  }

  // Handle escrow funding
  async handleEscrowFunding(assignmentId: string): Promise<void> {
    this.updateStageStatus(assignmentId, 'escrow_funding', 'completed');
    this.moveToNextStage(assignmentId, 'assignment_scheduled');
    
    await eventBus.emit('assignment.scheduled', {
      assignmentId
    });

    this.updateStageStatus(assignmentId, 'assignment_scheduled', 'completed');
  }

  // Handle assignment start
  async handleAssignmentStart(assignmentId: string): Promise<void> {
    this.moveToNextStage(assignmentId, 'assignment_active');
    
    await eventBus.emit('assignment.started', {
      assignmentId
    });
  }

  // Handle assignment completion
  async handleAssignmentCompletion(assignmentId: string): Promise<void> {
    this.updateStageStatus(assignmentId, 'assignment_active', 'completed');
    this.moveToNextStage(assignmentId, 'assignment_completed');
    
    await eventBus.emit('assignment.completed', {
      assignmentId
    });

    // Schedule payment release (4 days)
    setTimeout(() => {
      this.handlePaymentRelease(assignmentId);
    }, 4 * 24 * 60 * 60 * 1000);
  }

  // Handle payment release
  async handlePaymentRelease(assignmentId: string): Promise<void> {
    this.updateStageStatus(assignmentId, 'assignment_completed', 'completed');
    this.moveToNextStage(assignmentId, 'payment_release');
    
    await eventBus.emit('payment.escrow_released', {
      assignmentId
    });

    this.updateStageStatus(assignmentId, 'payment_release', 'completed');
    this.moveToNextStage(assignmentId, 'review_period');
    
    await eventBus.emit('review.requested', {
      assignmentId
    });
  }

  // Handle workflow completion
  async handleWorkflowCompletion(assignmentId: string): Promise<void> {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow) return;

    this.updateStageStatus(assignmentId, 'review_period', 'completed');
    this.updateStageStatus(assignmentId, 'workflow_complete', 'completed');
    
    workflow.completedAt = new Date().toISOString();
    this.workflows.set(assignmentId, workflow);
  }

  // Handle workflow error
  handleWorkflowError(assignmentId: string, stage: WorkflowStage, error: string): void {
    this.updateStageStatus(assignmentId, stage, 'failed', error);
    
    const workflow = this.workflows.get(assignmentId);
    if (workflow) {
      workflow.blockedBy = error;
      this.workflows.set(assignmentId, workflow);
    }
  }

  // Get workflow state
  getWorkflowState(assignmentId: string): WorkflowState | undefined {
    return this.workflows.get(assignmentId);
  }

  // Get all workflows
  getAllWorkflows(): WorkflowState[] {
    return Array.from(this.workflows.values());
  }

  // Get workflows by stage
  getWorkflowsByStage(stage: WorkflowStage): WorkflowState[] {
    return Array.from(this.workflows.values()).filter(w => w.currentStage === stage);
  }

  // Get blocked workflows
  getBlockedWorkflows(): WorkflowState[] {
    return Array.from(this.workflows.values()).filter(w => w.blockedBy);
  }

  // Resolve workflow error
  resolveWorkflowError(assignmentId: string, errorIndex: number): void {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow || !workflow.errors[errorIndex]) return;

    workflow.errors[errorIndex].resolved = true;
    workflow.errors[errorIndex].resolvedAt = new Date().toISOString();
    workflow.blockedBy = undefined;

    this.workflows.set(assignmentId, workflow);
  }

  // Calculate workflow progress
  calculateProgress(assignmentId: string): number {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow) return 0;

    const completedStages = workflow.stages.filter(s => s.status === 'completed').length;
    const totalStages = workflow.stages.length;

    return Math.round((completedStages / totalStages) * 100);
  }

  // Get workflow duration
  getWorkflowDuration(assignmentId: string): number {
    const workflow = this.workflows.get(assignmentId);
    if (!workflow) return 0;

    const start = new Date(workflow.startedAt).getTime();
    const end = workflow.completedAt ? new Date(workflow.completedAt).getTime() : Date.now();

    return Math.round((end - start) / (1000 * 60 * 60 * 24)); // Days
  }
}

// Singleton instance
export const workflowManager = new WorkflowManager();
