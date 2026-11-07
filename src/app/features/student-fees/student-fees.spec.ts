import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudentFees } from './student-fees';
import { Auth } from '../../core/services/auth';
import { Invoices } from '../../core/services/invoices';

describe('StudentFees', () => {
  let auth: Auth;
  let invoices: Invoices;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StudentFees],
      providers: [provideRouter([])],
    }).compileComponents();
    auth = TestBed.inject(Auth);
    invoices = TestBed.inject(Invoices);
    auth.logout();
  });

  afterEach(() => { auth.logout(); sessionStorage.clear(); });

  it('should create', () => {
    expect(TestBed.createComponent(StudentFees).componentInstance).toBeTruthy();
  });

  it('should show correct student invoice totals', () => {
    auth.login('student@demo.test', 'Student123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    expect(c.totalAmount()).toBe(91800);
    expect(c.paidAmount()).toBe(45000);
    expect(c.unpaidAmount()).toBe(46800);
  });

  it('should show no invoices or payments belonging to someone else', () => {
    auth.register('New Student', 'new.student@example.com', 'Student123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    expect(c.studentInvoices()).toEqual([]);
    expect(c.visiblePayments()).toEqual([]);
  });

  it('should allow accounting to mark as paid and create history', () => {
    auth.login('accounting@demo.test', 'Accounting123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.markAsPaid('INV002');
    expect(invoices.invoices().find(i => i.id === 'INV002')?.status).toBe('paid');
    expect(c.visiblePayments().find(p => p.invoiceId === 'INV002')?.recordedBy).toBe('ACCOUNTING');
  });

  it('should prevent students from changing payment status', () => {
    auth.login('student@demo.test', 'Student123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.markAsPaid('INV002');
    expect(invoices.invoices().find(i => i.id === 'INV002')?.status).toBe('unpaid');
    expect(c.invoiceError()).toContain('not authorized');
  });

  it('should filter by status and search', () => {
    auth.login('student@demo.test', 'Student123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.statusFilter.set('paid');
    expect(c.filteredInvoices().length).toBe(1);
    c.statusFilter.set('all');
    c.searchQuery.set('winter');
    expect(c.filteredInvoices().map(i => i.id)).toEqual(['INV002']);
  });

  it('should allow accounting to create an invoice', () => {
    auth.login('accounting@demo.test', 'Accounting123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.invoiceForm.patchValue({
      studentId: 'STU001', type: 'tuition', description: 'Library Fees', amount: 1500, dueDate: '2026-12-20',
    });
    c.addInvoice();
    expect(invoices.getStudentInvoices('STU001').length).toBe(4);
    expect(c.successMessage()).toContain('created successfully');
  });

  it('should reject invoice creation by students', () => {
    auth.login('student@demo.test', 'Student123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.invoiceForm.patchValue({
      studentId: 'STU001', description: 'Library Fees', amount: 1500, dueDate: '2026-12-20',
    });
    c.addInvoice();
    expect(invoices.invoices().length).toBe(3);
    expect(c.invoiceError()).toContain('not authorized');
  });

  it('should reject invalid invoice form', () => {
    auth.login('accounting@demo.test', 'Accounting123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.invoiceForm.patchValue({ studentId: 'STU001', description: 'Library Fees', amount: -100, dueDate: '' });
    c.addInvoice();
    expect(c.invoiceForm.invalid).toBeTrue();
    expect(invoices.invoices().length).toBe(3);
  });

  it('should not duplicate a payment from repeated clicks', () => {
    auth.login('accounting@demo.test', 'Accounting123!');
    const c = TestBed.createComponent(StudentFees).componentInstance;
    c.markAsPaid('INV002');
    c.markAsPaid('INV002');
    expect(c.visiblePayments().filter(p => p.invoiceId === 'INV002').length).toBe(1);
    expect(c.invoiceError()).toContain('already paid');
  });

  it('should display payment history in the rendered view', () => {
    auth.login('student@demo.test', 'Student123!');
    const fixture = TestBed.createComponent(StudentFees);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Payment History');
    expect(fixture.nativeElement.textContent).toContain('PAY001');
  });
});
