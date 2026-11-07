import { Injectable, signal } from '@angular/core';
import type { Invoice, InvoiceType } from '../models/campus.models';
import type { PaymentRecord } from '../models/payment.models';

/** In-memory mock invoice ledger. No payments are processed. */
@Injectable({ providedIn: 'root' })
export class Invoices {
  private readonly invoiceState = signal<Invoice[]>([
    {
      id: 'INV001', studentId: 'STU001', type: 'tuition',
      description: 'Fall Semester Tuition Fees', amount: 45000,
      dueDate: '2026-09-15', status: 'paid',
    },
    {
      id: 'INV002', studentId: 'STU001', type: 'tuition',
      description: 'Winter Semester Tuition Fees', amount: 45000,
      dueDate: '2026-12-15', status: 'unpaid',
    },
    {
      id: 'INV003', studentId: 'STU001', type: 'meal-plan',
      description: 'Monthly Cafeteria Meal Plan', amount: 1800,
      dueDate: '2026-11-20', status: 'unpaid',
    },
  ]);

  private readonly paymentState = signal<PaymentRecord[]>([
    {
      id: 'PAY001', invoiceId: 'INV001', studentId: 'STU001',
      amount: 45000, paidAt: '2026-09-10T12:00:00.000Z',
      recordedBy: 'DEMO-SEED', method: 'demo-manual',
    },
  ]);

  readonly invoices = this.invoiceState.asReadonly();
  readonly payments = this.paymentState.asReadonly();

  getStudentInvoices(studentId: string): Invoice[] {
    return this.invoices().filter(item => item.studentId === studentId);
  }

  getStudentPayments(studentId: string): PaymentRecord[] {
    return this.payments().filter(item => item.studentId === studentId);
  }

  getTotalAmount(studentId: string): number {
    return this.getStudentInvoices(studentId).reduce((sum, item) => sum + item.amount, 0);
  }

  getPaidAmount(studentId: string): number {
    return this.getStudentInvoices(studentId)
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  getUnpaidAmount(studentId: string): number {
    return this.getStudentInvoices(studentId)
      .filter(item => item.status === 'unpaid')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  /** Returns false for missing or already-paid invoices; prevents duplicate records. */
  markAsPaid(invoiceId: string, recordedBy = 'DEMO-OPERATOR'): boolean {
    const invoice = this.invoices().find(item => item.id === invoiceId);
    if (!invoice || invoice.status === 'paid' || !recordedBy.trim()) return false;

    this.invoiceState.update(items => items.map(item =>
      item.id === invoiceId ? { ...item, status: 'paid' as const } : item
    ));

    this.paymentState.update(items => [...items, {
      id: `PAY-${crypto.randomUUID()}`,
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      amount: invoice.amount,
      paidAt: new Date().toISOString(),
      recordedBy: recordedBy.trim(),
      method: 'demo-manual' as const,
    }]);
    return true;
  }

  addInvoice(
    studentId: string,
    type: InvoiceType,
    description: string,
    amount: number,
    dueDate: string,
  ): Invoice | null {
    const cleanStudentId = studentId.trim();
    const cleanDescription = description.trim();
    if (
      !cleanStudentId || cleanDescription.length < 3 ||
      (type !== 'tuition' && type !== 'meal-plan') ||
      !Number.isFinite(amount) || amount <= 0 ||
      !this.isValidDate(dueDate)
    ) return null;

    const invoice: Invoice = {
      id: `INV-${crypto.randomUUID()}`,
      studentId: cleanStudentId,
      type,
      description: cleanDescription,
      amount,
      dueDate,
      status: 'unpaid',
    };
    this.invoiceState.update(items => [...items, invoice]);
    return invoice;
  }

  private isValidDate(date: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year &&
      parsed.getUTCMonth() === month - 1 &&
      parsed.getUTCDate() === day;
  }
}
