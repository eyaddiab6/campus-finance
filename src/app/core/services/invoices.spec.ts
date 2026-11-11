import { TestBed } from '@angular/core/testing';
import { Invoices } from './invoices';

describe('Invoices Service', () => {
  let service: Invoices;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invoices);
  });

  it('should load only student invoices', () => {
    const items = service.getStudentInvoices('STU001');
    expect(items.length).toBe(3);
    expect(items.every(i => i.studentId === 'STU001')).toBeTrue();
    expect(service.getStudentInvoices('STU-NEW')).toEqual([]);
  });

  it('should calculate total, paid and unpaid amounts', () => {
    expect(service.getTotalAmount('STU001')).toBe(91800);
    expect(service.getPaidAmount('STU001')).toBe(45000);
    expect(service.getUnpaidAmount('STU001')).toBe(46800);
  });

  it('should mark an unpaid invoice paid and create a payment record', () => {
    expect(service.markAsPaid('INV002', 'ACC001')).toBeTrue();
    expect(service.getPaidAmount('STU001')).toBe(90000);
    expect(service.getUnpaidAmount('STU001')).toBe(1800);
    const record = service.payments().find(p => p.invoiceId === 'INV002');
    expect(record?.recordedBy).toBe('ACC001');
    expect(record?.amount).toBe(45000);
    expect(record?.studentId).toBe('STU001');
  });

  it('should not double-record payments', () => {
    expect(service.markAsPaid('INV002')).toBeTrue();
    const count = service.payments().length;
    expect(service.markAsPaid('INV002')).toBeFalse();
    expect(service.payments().length).toBe(count);
  });

  it('should reject nonexistent and already-paid invoices', () => {
    expect(service.markAsPaid('UNKNOWN')).toBeFalse();
    expect(service.markAsPaid('INV001')).toBeFalse();
    expect(service.payments().length).toBe(1);
  });

  it('should retain a matching seeded payment for the paid fixture', () => {
    const history = service.getStudentPayments('STU001');
    expect(history.length).toBe(1);
    expect(history[0].invoiceId).toBe('INV001');
    expect(service.getStudentPayments('STU-NEW')).toEqual([]);
  });

  it('should create a new unpaid invoice without creating payment history', () => {
    const invoice = service.addInvoice('STU001', 'tuition', 'Library Fees', 1500, '2026-12-20');
    expect(invoice?.status).toBe('unpaid');
    expect(service.getStudentInvoices('STU001').length).toBe(4);
    expect(service.payments().length).toBe(1);
  });

  it('should reject non-finite or negative invoice amounts', () => {
    expect(service.addInvoice('STU001', 'tuition', 'Invalid', -500, '2026-12-20')).toBeNull();
    expect(service.addInvoice('STU001', 'tuition', 'Invalid', Infinity, '2026-12-20')).toBeNull();
    expect(service.invoices().length).toBe(3);
  });

  it('should reject impossible dates rather than auto-normalizing them', () => {
    expect(service.addInvoice('STU001', 'tuition', 'Invalid date', 100, '2026-02-30')).toBeNull();
    expect(service.addInvoice('STU001', 'tuition', 'Valid leap date', 100, '2028-02-29')).not.toBeNull();
  });
});
