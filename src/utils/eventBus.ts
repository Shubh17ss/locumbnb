// Event Bus - Central Event-Driven Architecture System

import { PlatformEvent, EventType, EventHandler, EventSubscription } from '../types/event';

class EventBus {
  private handlers: Map<EventType, EventHandler[]> = new Map();
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventQueue: PlatformEvent[] = [];
  private processing = false;

  // Register event handler
  registerHandler(handler: EventHandler): void {
    const handlers = this.handlers.get(handler.eventType) || [];
    handlers.push(handler);
    handlers.sort((a, b) => a.priority - b.priority);
    this.handlers.set(handler.eventType, handlers);
  }

  // Subscribe to events
  subscribe(eventTypes: EventType[], callback: (event: PlatformEvent) => void): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscription: EventSubscription = {
      id,
      eventTypes,
      callback,
      active: true
    };
    this.subscriptions.set(id, subscription);
    return id;
  }

  // Unsubscribe
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  // Emit event
  async emit(type: EventType, data: Record<string, any>, userId?: string, userType?: 'physician' | 'facility' | 'vendor' | 'admin'): Promise<void> {
    const event: PlatformEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      source: userId ? 'user' : 'system',
      userId,
      userType,
      data,
      metadata: {
        sessionId: this.getSessionId()
      },
      processed: false
    };

    this.eventQueue.push(event);
    this.logEvent(event);
    
    // Notify subscribers
    this.notifySubscribers(event);

    // Process queue
    if (!this.processing) {
      await this.processQueue();
    }
  }

  // Process event queue
  private async processQueue(): Promise<void> {
    if (this.processing || this.eventQueue.length === 0) return;

    this.processing = true;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (!event) continue;

      try {
        await this.processEvent(event);
        event.processed = true;
        event.processedAt = new Date().toISOString();
      } catch (error) {
        event.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing event ${event.id}:`, error);
      }
    }

    this.processing = false;
  }

  // Process single event
  private async processEvent(event: PlatformEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    
    for (const handler of handlers) {
      try {
        await handler.handler(event);
      } catch (error) {
        console.error(`Handler error for ${event.type}:`, error);
      }
    }
  }

  // Notify subscribers
  private notifySubscribers(event: PlatformEvent): void {
    this.subscriptions.forEach(subscription => {
      if (subscription.active && subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error('Subscription callback error:', error);
        }
      }
    });
  }

  // Log event
  private logEvent(event: PlatformEvent): void {
    console.log(`[EVENT] ${event.type}`, {
      id: event.id,
      timestamp: event.timestamp,
      userId: event.userId,
      data: event.data
    });
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  // Get queue size
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  // Clear queue (for testing)
  clearQueue(): void {
    this.eventQueue = [];
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Register core event handlers
eventBus.registerHandler({
  eventType: 'application.submitted',
  priority: 1,
  handler: async (event) => {
    // Block calendar dates
    await eventBus.emit('calendar.dates_blocked', {
      userId: event.userId,
      dates: event.data.dates,
      assignmentId: event.data.assignmentId
    });
    
    // Send notification to facility
    await eventBus.emit('notification.dashboard_created', {
      recipientId: event.data.facilityId,
      recipientType: 'facility',
      title: 'New Application Received',
      message: `${event.data.physicianName} has applied to your posting`,
      link: `/facility/applications/${event.data.applicationId}`
    });
  }
});

eventBus.registerHandler({
  eventType: 'application.approved',
  priority: 1,
  handler: async (event) => {
    // Send contract
    await eventBus.emit('contract.sent', {
      assignmentId: event.data.assignmentId,
      physicianId: event.data.physicianId,
      facilityId: event.data.facilityId,
      contractId: event.data.contractId
    });
    
    // Notify physician
    await eventBus.emit('notification.email_sent', {
      recipientId: event.data.physicianId,
      subject: 'Application Approved - Contract Ready',
      template: 'application_approved'
    });
  }
});

eventBus.registerHandler({
  eventType: 'application.rejected',
  priority: 1,
  handler: async (event) => {
    // Unblock calendar dates
    await eventBus.emit('calendar.dates_unblocked', {
      userId: event.data.physicianId,
      dates: event.data.dates,
      assignmentId: event.data.assignmentId
    });
    
    // Notify physician
    await eventBus.emit('notification.dashboard_created', {
      recipientId: event.data.physicianId,
      recipientType: 'physician',
      title: 'Application Update',
      message: 'Your application was not selected for this assignment'
    });
  }
});

eventBus.registerHandler({
  eventType: 'contract.executed',
  priority: 1,
  handler: async (event) => {
    // Update assignment status
    await eventBus.emit('assignment.scheduled', {
      assignmentId: event.data.assignmentId,
      physicianId: event.data.physicianId,
      facilityId: event.data.facilityId,
      startDate: event.data.startDate,
      endDate: event.data.endDate
    });
    
    // Request escrow funding
    await eventBus.emit('payment.escrow_funded', {
      assignmentId: event.data.assignmentId,
      amount: event.data.amount,
      facilityId: event.data.facilityId
    });
  }
});

eventBus.registerHandler({
  eventType: 'assignment.completed',
  priority: 1,
  handler: async (event) => {
    // Schedule payment release (4 days)
    setTimeout(async () => {
      await eventBus.emit('payment.escrow_released', {
        assignmentId: event.data.assignmentId,
        physicianId: event.data.physicianId,
        amount: event.data.amount
      });
      
      // Request reviews
      await eventBus.emit('review.requested', {
        assignmentId: event.data.assignmentId,
        physicianId: event.data.physicianId,
        facilityId: event.data.facilityId
      });
    }, 4 * 24 * 60 * 60 * 1000); // 4 days
  }
});

eventBus.registerHandler({
  eventType: 'dispute.initiated',
  priority: 1,
  handler: async (event) => {
    // Charge dispute fee
    await eventBus.emit('payment.fee_collected', {
      userId: event.userId,
      amount: 300,
      reason: 'dispute_fee',
      disputeId: event.data.disputeId
    });
    
    // Hold escrow payment
    await eventBus.emit('payment.escrow_held', {
      assignmentId: event.data.assignmentId,
      reason: 'dispute',
      disputeId: event.data.disputeId
    });
    
    // Escalate to admin
    await eventBus.emit('dispute.escalated', {
      disputeId: event.data.disputeId,
      assignmentId: event.data.assignmentId
    });
  }
});

eventBus.registerHandler({
  eventType: 'cancellation.requested',
  priority: 1,
  handler: async (event) => {
    // Calculate penalty
    const penalty = event.data.penaltyAmount || 0;
    
    if (penalty > 0) {
      await eventBus.emit('cancellation.penalty_applied', {
        userId: event.userId,
        assignmentId: event.data.assignmentId,
        amount: penalty,
        reason: event.data.reason
      });
    }
    
    // Unblock calendar
    await eventBus.emit('calendar.dates_unblocked', {
      userId: event.data.physicianId,
      dates: event.data.dates,
      assignmentId: event.data.assignmentId
    });
  }
});

eventBus.registerHandler({
  eventType: 'violation.detected',
  priority: 1,
  handler: async (event) => {
    // Escalate to admin
    await eventBus.emit('violation.reported', {
      violationId: event.data.violationId,
      violatorId: event.data.violatorId,
      type: event.data.type
    });
    
    // Notify compliance team
    await eventBus.emit('notification.dashboard_created', {
      recipientType: 'admin',
      title: 'Violation Detected',
      message: `Potential ${event.data.type} violation detected`,
      priority: 'high'
    });
  }
});
