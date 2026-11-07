import { TestBed } from '@angular/core/testing';
import { MockData } from './mock-data';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WalletService, MockData],
    });

    service = TestBed.inject(WalletService);
  });

  it('returns the student wallet and its starting balance', () => {
    expect(service.getWallet('STU001')?.balance).toBe(750);
    expect(service.getWallet('UNKNOWN')).toBeUndefined();
  });

  it('rejects invalid top-ups without changing the balance', () => {
    expect(service.topUp('STU001', 0)).toBeFalse();
    expect(service.topUp('STU001', -10)).toBeFalse();
    expect(service.topUp('STU001', Number.NaN)).toBeFalse();
    expect(service.getWallet('STU001')?.balance).toBe(750);
  });

  it('adds a valid top-up to the balance and transaction history', () => {
    expect(service.topUp('STU001', 200)).toBeTrue();

    expect(service.getWallet('STU001')?.balance).toBe(950);
    expect(service.getTransactions('STU001')).toContain(
      jasmine.objectContaining({
        walletId: 'WALLET001',
        type: 'top-up',
        amount: 200,
      }),
    );
    expect(service.getTotals('STU001').received).toBe(200);
  });

  it('debits a valid purchase and records it', () => {
    expect(service.debit('STU001', 100, 'Lunch')).toBeTrue();

    expect(service.getWallet('STU001')?.balance).toBe(650);
    expect(service.getTransactions('STU001')).toContain(
      jasmine.objectContaining({
        type: 'purchase',
        amount: 100,
        description: 'Lunch',
      }),
    );
    expect(service.getTotals('STU001').spent).toBe(100);
  });

  it('rejects invalid or unaffordable debits without changing the balance', () => {
    expect(service.debit('STU001', 0, 'Invalid')).toBeFalse();
    expect(service.debit('STU001', 751, 'Too expensive')).toBeFalse();

    expect(service.getWallet('STU001')?.balance).toBe(750);
    expect(service.getTransactions('STU001')).toHaveSize(0);
  });

  it('keeps each student transaction history isolated', () => {
    service.topUp('STU001', 50);

    expect(service.getTransactions('UNKNOWN')).toEqual([]);
    expect(service.getTotals('UNKNOWN')).toEqual({ spent: 0, received: 0 });
  });
});