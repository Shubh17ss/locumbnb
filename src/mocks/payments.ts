import { EscrowPayment, PaymentStatus } from '../types/payment';

// Production: Start with empty payments - will be created when facilities fund escrow
export const mockEscrowPayments: EscrowPayment[] = [];

export function getPaymentsByStatus(status: PaymentStatus): EscrowPayment[] {
  return mockEscrowPayments.filter(payment => payment.status === status);
}

export function getPaymentsByPhysician(physicianId: string): EscrowPayment[] {
  return mockEscrowPayments.filter(payment => payment.physicianId === physicianId);
}

export function getPaymentsByFacility(facilityId: string): EscrowPayment[] {
  return mockEscrowPayments.filter(payment => payment.facilityId === facilityId);
}

export function getPaymentById(paymentId: string): EscrowPayment | undefined {
  return mockEscrowPayments.find(payment => payment.id === paymentId);
}
