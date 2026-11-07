
import { TestBed } from '@angular/core/testing';
import { Invoices } from './invoices';

describe('Invoices Service', () => {
  let service: Invoices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invoices);
  });

  it('should load student invoices', () => {
    const invoices = service.getStudentInvoices('STU001');

    expect(invoices.length).toBe(3);
    expect(invoices.every(item => item.studentId === 'STU001'))
      .toBeTrue();
  });

  it('should calculate total, paid and unpaid amounts', () => {
    expect(service.getTotalAmount('STU001')).toBe(91800);
    expect(service.getPaidAmount('STU001')).toBe(45000);
    expect(service.getUnpaidAmount('STU001')).toBe(46800);
  });

  it('should mark an unpaid invoice as paid', () => {
    const result = service.markAsPaid('INV002');

    expect(result).toBeTrue();
    expect(service.getPaidAmount('STU001')).toBe(90000);
    expect(service.getUnpaidAmount('STU001')).toBe(1800);
  });

  it('should create a new unpaid invoice', () => {
    const invoice = service.addInvoice(
      'STU001',
      'tuition',
      'Library Fees',
      1500,
      '2026-12-20'
    );

    expect(invoice).not.toBeNull();
    expect(invoice?.status).toBe('unpaid');
    expect(service.getStudentInvoices('STU001').length).toBe(4);
  });

  it('should reject invalid invoice amounts', () => {
    const invoice = service.addInvoice(
      'STU001',
      'tuition',
      'Invalid Invoice',
      -500,
      '2026-12-20'
    );

    expect(invoice).toBeNull();
    expect(service.invoices().length).toBe(3);
  });

  it('should not modify nonexistent invoices', () => {
    expect(service.markAsPaid('UNKNOWN')).toBeFalse();
  });
});
