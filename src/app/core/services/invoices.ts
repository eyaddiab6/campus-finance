
import { Injectable, signal } from '@angular/core';
import type { Invoice, InvoiceType } from '../models/campus.models';

@Injectable({
  providedIn: 'root',
})
export class Invoices {
  private readonly invoiceState = signal<Invoice[]>([
    {
      id: 'INV001',
      studentId: 'STU001',
      type: 'tuition',
      description: 'Fall Semester Tuition Fees',
      amount: 45000,
      dueDate: '2026-09-15',
      status: 'paid',
    },
    {
      id: 'INV002',
      studentId: 'STU001',
      type: 'tuition',
      description: 'Winter Semester Tuition Fees',
      amount: 45000,
      dueDate: '2026-12-15',
      status: 'unpaid',
    },
    {
      id: 'INV003',
      studentId: 'STU001',
      type: 'meal-plan',
      description: 'Monthly Cafeteria Meal Plan',
      amount: 1800,
      dueDate: '2026-11-20',
      status: 'unpaid',
    },
  ]);

  readonly invoices = this.invoiceState.asReadonly();

  getStudentInvoices(studentId: string): Invoice[] {
    return this.invoiceState().filter(
      invoice => invoice.studentId === studentId
    );
  }

  getTotalAmount(studentId: string): number {
    return this.getStudentInvoices(studentId).reduce(
      (total, invoice) => total + invoice.amount,
      0
    );
  }

  getPaidAmount(studentId: string): number {
    return this.getStudentInvoices(studentId)
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0);
  }

  getUnpaidAmount(studentId: string): number {
    return this.getStudentInvoices(studentId)
      .filter(invoice => invoice.status === 'unpaid')
      .reduce((total, invoice) => total + invoice.amount, 0);
  }

  markAsPaid(invoiceId: string): boolean {
    const invoice = this.invoiceState().find(
      item => item.id === invoiceId
    );

    if (!invoice || invoice.status === 'paid') {
      return false;
    }

    this.invoiceState.update(invoices =>
      invoices.map(item =>
        item.id === invoiceId
          ? { ...item, status: 'paid' as const }
          : item
      )
    );

    return true;
  }

  addInvoice(
    studentId: string,
    type: InvoiceType,
    description: string,
    amount: number,
    dueDate: string
  ): Invoice | null {
    const cleanStudentId = studentId.trim();
    const cleanDescription = description.trim();

    if (
      !cleanStudentId ||
      !cleanDescription ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
      Number.isNaN(Date.parse(dueDate))
    ) {
      return null;
    }

    const invoice: Invoice = {
      id: 'INV-' + crypto.randomUUID(),
      studentId: cleanStudentId,
      type,
      description: cleanDescription,
      amount,
      dueDate,
      status: 'unpaid',
    };

    this.invoiceState.update(invoices => [...invoices, invoice]);

    return invoice;
  }
}
