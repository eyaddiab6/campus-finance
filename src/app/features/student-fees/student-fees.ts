
import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Auth } from '../../core/services/auth';
import { Invoices } from '../../core/services/invoices';
import type { InvoiceStatus } from '../../core/models/campus.models';

type StatusFilter = 'all' | InvoiceStatus;

@Component({
  selector: 'app-student-fees',
  imports: [DecimalPipe],
  templateUrl: './student-fees.html',
  styleUrl: './student-fees.scss',
})
export class StudentFees {
  readonly auth = inject(Auth);
  readonly invoicesService = inject(Invoices);

  readonly searchQuery = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly successMessage = signal('');

  readonly canManageInvoices = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'admin' || role === 'accounting';
  });

  readonly studentInvoices = computed(() => {
    const user = this.auth.currentUser();

    if (!user) return [];

    const invoices = this.invoicesService.invoices();

    if (this.canManageInvoices()) {
      return invoices;
    }

    return invoices.filter(
      invoice => invoice.studentId === user.id
    );
  });

  readonly totalAmount = computed(() =>
    this.studentInvoices().reduce(
      (total, invoice) => total + invoice.amount,
      0
    )
  );

  readonly paidAmount = computed(() =>
    this.studentInvoices()
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0)
  );

  readonly unpaidAmount = computed(() =>
    this.studentInvoices()
      .filter(invoice => invoice.status === 'unpaid')
      .reduce((total, invoice) => total + invoice.amount, 0)
  );

  readonly filteredInvoices = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();

    return this.studentInvoices().filter(invoice => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(query) ||
        invoice.description.toLowerCase().includes(query) ||
        invoice.studentId.toLowerCase().includes(query);

      const matchesStatus =
        status === 'all' || invoice.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  updateStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (value === 'all' || value === 'paid' || value === 'unpaid') {
      this.statusFilter.set(value);
    }
  }

  markAsPaid(invoiceId: string): void {
    if (!this.canManageInvoices()) return;

    const updated = this.invoicesService.markAsPaid(invoiceId);

    if (updated) {
      this.successMessage.set(
        `Invoice ${invoiceId} marked as paid successfully.`
      );
    }
  }
}
