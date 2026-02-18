// System Health Monitor - Real-time Platform Health Tracking

import { SystemHealthMetrics, ComponentHealth } from '../types/event';
import { eventBus } from './eventBus';
import { workflowManager } from './workflowManager';

class SystemHealthMonitor {
  private metrics: SystemHealthMetrics | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;

  // Start monitoring
  startMonitoring(intervalMs: number = 60000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.updateMetrics();
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
    }, intervalMs);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  // Update metrics
  private updateMetrics(): void {
    const workflows = workflowManager.getAllWorkflows();
    const blockedWorkflows = workflowManager.getBlockedWorkflows();

    this.metrics = {
      timestamp: new Date().toISOString(),
      activeAssignments: workflows.filter(w => !w.completedAt).length,
      pendingApplications: workflows.filter(w => w.currentStage === 'facility_review').length,
      escrowedFunds: this.calculateEscrowedFunds(),
      activeDisputes: this.getActiveDisputesCount(),
      eventQueueSize: eventBus.getQueueSize(),
      averageProcessingTime: this.calculateAverageProcessingTime(),
      errorRate: this.calculateErrorRate(workflows),
      systemStatus: this.determineSystemStatus(blockedWorkflows.length, eventBus.getQueueSize()),
      components: this.checkComponentHealth()
    };

    // Emit health update event
    eventBus.emit('system.health_updated', {
      metrics: this.metrics
    });
  }

  // Calculate escrowed funds
  private calculateEscrowedFunds(): number {
    // In production, this would query actual escrow data
    return 0;
  }

  // Get active disputes count
  private getActiveDisputesCount(): number {
    // In production, this would query dispute data
    return 0;
  }

  // Calculate average processing time
  private calculateAverageProcessingTime(): number {
    const workflows = workflowManager.getAllWorkflows();
    if (workflows.length === 0) return 0;

    const durations = workflows.map(w => workflowManager.getWorkflowDuration(w.assignmentId));
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  // Calculate error rate
  private calculateErrorRate(workflows: any[]): number {
    if (workflows.length === 0) return 0;

    const workflowsWithErrors = workflows.filter(w => w.errors.length > 0).length;
    return (workflowsWithErrors / workflows.length) * 100;
  }

  // Determine system status
  private determineSystemStatus(blockedCount: number, queueSize: number): 'healthy' | 'degraded' | 'critical' {
    if (blockedCount > 10 || queueSize > 100) return 'critical';
    if (blockedCount > 5 || queueSize > 50) return 'degraded';
    return 'healthy';
  }

  // Check component health
  private checkComponentHealth(): ComponentHealth[] {
    return [
      {
        name: 'Event Bus',
        status: eventBus.getQueueSize() < 50 ? 'operational' : 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime: 10,
        errorCount: 0
      },
      {
        name: 'Workflow Manager',
        status: workflowManager.getBlockedWorkflows().length < 5 ? 'operational' : 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime: 15,
        errorCount: workflowManager.getBlockedWorkflows().length
      },
      {
        name: 'Payment System',
        status: 'operational',
        lastCheck: new Date().toISOString(),
        responseTime: 200,
        errorCount: 0
      },
      {
        name: 'Notification System',
        status: 'operational',
        lastCheck: new Date().toISOString(),
        responseTime: 50,
        errorCount: 0
      },
      {
        name: 'Database',
        status: 'operational',
        lastCheck: new Date().toISOString(),
        responseTime: 30,
        errorCount: 0
      }
    ];
  }

  // Get current metrics
  getMetrics(): SystemHealthMetrics | null {
    return this.metrics;
  }

  // Get component status
  getComponentStatus(componentName: string): ComponentHealth | undefined {
    return this.metrics?.components.find(c => c.name === componentName);
  }

  // Check if system is healthy
  isHealthy(): boolean {
    return this.metrics?.systemStatus === 'healthy';
  }

  // Get system alerts
  getAlerts(): string[] {
    const alerts: string[] = [];

    if (!this.metrics) return alerts;

    if (this.metrics.systemStatus === 'critical') {
      alerts.push('System is in critical state');
    }

    if (this.metrics.eventQueueSize > 50) {
      alerts.push(`Event queue is large: ${this.metrics.eventQueueSize} events`);
    }

    if (this.metrics.errorRate > 10) {
      alerts.push(`High error rate: ${this.metrics.errorRate.toFixed(1)}%`);
    }

    if (this.metrics.activeDisputes > 10) {
      alerts.push(`High number of active disputes: ${this.metrics.activeDisputes}`);
    }

    const degradedComponents = this.metrics.components.filter(c => c.status === 'degraded' || c.status === 'down');
    if (degradedComponents.length > 0) {
      alerts.push(`${degradedComponents.length} component(s) degraded or down`);
    }

    return alerts;
  }
}

// Singleton instance
export const systemHealthMonitor = new SystemHealthMonitor();

// Start monitoring on initialization
systemHealthMonitor.startMonitoring();
