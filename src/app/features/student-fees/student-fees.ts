import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { Invoices } from '../../core/services/invoices';
import type { InvoiceStatus, InvoiceType } from '../../core/models/campus.models';

type StatusFilter = 'all' | InvoiceStatus;

@Component({
  selector: 'app-student-fees',
  imports: [DecimalPipe, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './student-fees.html',
  styleUrl: './student-fees.scss',
})
export class StudentFees {
  readonly auth = inject(Auth);
  readonly invoicesService = inject(Invoices);
  private readonly fb = inject(FormBuilder);

  readonly searchQuery = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly successMessage = signal('');
  readonly invoiceError = signal('');

  readonly invoiceForm = this.fb.nonNullable.group({
    studentId: ['', [Validators.required, Validators.minLength(3)]],
    type: this.fb.nonNullable.control<InvoiceType>('tuition'),
    description: ['', [Validators.required, Validators.minLength(3)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    dueDate: ['', Validators.required],
  });

  readonly canManageInvoices = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'admin' || role === 'accounting';
  });

  readonly studentInvoices = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    const all = this.invoicesService.invoices();
    return this.canManageInvoices()
      ? all
      : all.filter(item => item.studentId === user.id);
  });

  readonly visiblePayments = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    const all = this.invoicesService.payments();
    const scoped = this.canManageInvoices()
      ? all
      : all.filter(item => item.studentId === user.id);
    return [...scoped].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  });

  readonly totalAmount = computed(() => this.studentInvoices()
    .reduce((sum, item) => sum + item.amount, 0));
  readonly paidAmount = computed(() => this.studentInvoices()
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0));
  readonly unpaidAmount = computed(() => this.studentInvoices()
    .filter(item => item.status === 'unpaid')
    .reduce((sum, item) => sum + item.amount, 0));

  readonly filteredInvoices = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    return this.studentInvoices().filter(item => {
      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.studentId.toLowerCase().includes(query);
      return matchesSearch && (status === 'all' || item.status === status);
    });
  });

  updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  updateStatus(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    if (next === 'all' || next === 'paid' || next === 'unpaid') {
      this.statusFilter.set(next);
    }
  }

  markAsPaid(invoiceId: string): void {
    this.successMessage.set('');
    this.invoiceError.set('');
    if (!this.canManageInvoices()) {
      this.invoiceError.set('You are not authorized to record payments.');
      return;
    }
    const actorId = this.auth.currentUser()?.id;
    if (!actorId) return;
    const updated = this.invoicesService.markAsPaid(invoiceId, actorId);
    if (updated) {
      this.successMessage.set(`Invoice ${invoiceId} marked as paid. A demo payment was recorded.`);
    } else {
      this.invoiceError.set('Invoice was not found or was already paid.');
    }
  }

  addInvoice(): void {
    this.invoiceError.set('');
    this.successMessage.set('');
    if (!this.canManageInvoices()) {
      this.invoiceError.set('You are not authorized to create invoices.');
      return;
    }
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }
    const data = this.invoiceForm.getRawValue();
    const invoice = this.invoicesService.addInvoice(
      data.studentId, data.type, data.description, data.amount, data.dueDate
    );
    if (!invoice) {
      this.invoiceError.set('Invalid invoice information. Check the date and amount.');
      return;
    }
    this.successMessage.set(`Invoice ${invoice.id} created successfully.`);
    this.invoiceForm.reset();
  }
}
