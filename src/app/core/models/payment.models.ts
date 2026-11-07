/** Mock tuition and meal-plan payment audit record (no real money is moved). */
export interface PaymentRecord {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  paidAt: string; // ISO 8601 timestamp
  recordedBy: string; // user id or demo seed identifier
  method: 'demo-manual';
}
