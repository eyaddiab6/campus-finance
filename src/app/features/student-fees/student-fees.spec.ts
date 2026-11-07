
import { TestBed } from '@angular/core/testing';
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
    }).compileComponents();

    auth = TestBed.inject(Auth);
    invoices = TestBed.inject(Invoices);
    auth.logout();
  });

  afterEach(() => {
    auth.logout();
    sessionStorage.clear();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StudentFees);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show student invoice totals', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    expect(component.totalAmount()).toBe(91800);
    expect(component.paidAmount()).toBe(45000);
    expect(component.unpaidAmount()).toBe(46800);
  });

  it('should only show the logged-in student invoices', () => {
    auth.register(
      'New Student',
      'new.student@example.com',
      'Student123!'
    );

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    expect(component.studentInvoices().length).toBe(0);
    expect(component.totalAmount()).toBe(0);
  });

  it('should allow accounting to mark an invoice as paid', () => {
    auth.login('accounting@demo.test', 'Accounting123!');

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    component.markAsPaid('INV002');

    expect(
      invoices.invoices().find(item => item.id === 'INV002')?.status
    ).toBe('paid');
  });

  it('should prevent students from marking invoices as paid', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    component.markAsPaid('INV002');

    expect(
      invoices.invoices().find(item => item.id === 'INV002')?.status
    ).toBe('unpaid');
  });

  it('should filter invoices by status', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    component.statusFilter.set('paid');

    expect(component.filteredInvoices().length).toBe(1);
    expect(
      component.filteredInvoices().every(item => item.status === 'paid')
    ).toBeTrue();
  });

  it('should search invoices by description', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(StudentFees);
    const component = fixture.componentInstance;

    component.searchQuery.set('winter');

    expect(component.filteredInvoices().length).toBe(1);
    expect(component.filteredInvoices()[0].id).toBe('INV002');
  });
  
it('should allow accounting to create a new invoice', () => {
  auth.login('accounting@demo.test', 'Accounting123!');

  const fixture = TestBed.createComponent(StudentFees);
  const component = fixture.componentInstance;

  component.invoiceForm.patchValue({
    studentId: 'STU001',
    type: 'tuition',
    description: 'Library Fees',
    amount: 1500,
    dueDate: '2026-12-20',
  });

  component.addInvoice();

  expect(invoices.getStudentInvoices('STU001').length).toBe(4);
  expect(component.successMessage()).toContain('created successfully');
});

it('should prevent students from creating invoices', () => {
  auth.login('student@demo.test', 'Student123!');

  const fixture = TestBed.createComponent(StudentFees);
  const component = fixture.componentInstance;

  component.invoiceForm.patchValue({
    studentId: 'STU001',
    type: 'tuition',
    description: 'Library Fees',
    amount: 1500,
    dueDate: '2026-12-20',
  });

  component.addInvoice();

  expect(invoices.invoices().length).toBe(3);
  expect(component.invoiceError()).toContain('not authorized');
});

it('should reject invalid invoice form values', () => {
  auth.login('accounting@demo.test', 'Accounting123!');

  const fixture = TestBed.createComponent(StudentFees);
  const component = fixture.componentInstance;

  component.invoiceForm.patchValue({
    studentId: 'STU001',
    type: 'tuition',
    description: 'Library Fees',
    amount: -100,
    dueDate: '',
  });

  component.addInvoice();

  expect(component.invoiceForm.invalid).toBeTrue();
  expect(invoices.invoices().length).toBe(3);
});

});
