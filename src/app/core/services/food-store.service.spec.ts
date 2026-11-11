import { TestBed } from '@angular/core/testing';
import { MockData } from './mock-data';
import { FoodStoreService } from './food-store.service';
import { WalletService } from './wallet.service';
import { Auth } from './auth';

describe('FoodStoreService', () => {
  let service: FoodStoreService;
  let mockData: MockData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FoodStoreService, WalletService, MockData],
    });

    service = TestBed.inject(FoodStoreService);
    mockData = TestBed.inject(MockData);
  });

  it('provides the mock food catalog', () => {
    expect(service.getCatalog().length).toBe(3);
    expect(service.getCatalog()[0].name).toBe('Chicken Sandwich');
  });

  it('adds, updates, removes cart items, and calculates the total', () => {
    expect(service.addToCart('FOOD001')).toBeTrue();
    expect(service.addToCart('FOOD003', 2)).toBeTrue();
    expect(service.getCartTotal()).toBe(165);

    expect(service.setQuantity('FOOD001', 2)).toBeTrue();
    expect(service.getCartTotal()).toBe(250);

    service.removeFromCart('FOOD003');
    expect(service.getCart().length).toBe(1);
    expect(service.getCartTotal()).toBe(170);
  });

  it('rejects unknown, unavailable, and invalid cart additions', () => {
    expect(service.addToCart('UNKNOWN')).toBeFalse();
    expect(service.addToCart('FOOD001', 0)).toBeFalse();

    mockData.foodItems[0].available = false;
    expect(service.addToCart('FOOD001')).toBeFalse();
    expect(service.getCart()).toEqual([]);
  });

  it('completes checkout once, debits the wallet, records an order, and empties the cart', () => {
    service.addToCart('FOOD001');

    const student = mockData.users.find(user => user.id === 'STU001')!;
    const result = service.checkout(student);

    expect(result.success).toBeTrue();
    expect(service.getCart()).toEqual([]);
    expect(service.getOrders('STU001').length).toBe(1);
    expect(service.getOrders('STU001')[0].totalAmount).toBe(85);
    expect(mockData.wallets[0].balance).toBe(665);

    const transactions = TestBed.inject(WalletService).getTransactions('STU001');
    expect(transactions.length).toBe(1);
    expect(transactions[0].type).toBe('purchase');

    const secondAttempt = service.checkout(student);
    expect(secondAttempt.success).toBeFalse();
    expect(mockData.wallets[0].balance).toBe(665);
    expect(service.getOrders('STU001').length).toBe(1);
  });

  it('rejects checkout for a non-student account', () => {
    service.addToCart('FOOD001');
    const accountingUser = {
      ...mockData.users.find(user => user.id === 'STU001')!,
      role: 'accounting' as const,
    };

    const result = service.checkout(accountingUser);

    expect(result.success).toBeFalse();
    expect(mockData.wallets[0].balance).toBe(750);
    expect(service.getOrders('STU001')).toEqual([]);
  });

  it('rejects unavailable items at checkout without charging the wallet', () => {
    service.addToCart('FOOD001');
    mockData.foodItems[0].available = false;

    const student = mockData.users.find(user => user.id === 'STU001')!;
    const result = service.checkout(student);

    expect(result.success).toBeFalse();
    expect(mockData.wallets[0].balance).toBe(750);
    expect(service.getOrders('STU001')).toEqual([]);
  });

  it('rejects checkout when the wallet balance is insufficient', () => {
    service.addToCart('FOOD002');
    mockData.wallets[0].balance = 100;

    const student = mockData.users.find(user => user.id === 'STU001')!;
    const result = service.checkout(student);

    expect(result.success).toBeFalse();
    expect(mockData.wallets[0].balance).toBe(100);
    expect(service.getOrders('STU001')).toEqual([]);
  });

  it('returns orders only for the requested student', () => {
    service.addToCart('FOOD001');
    const student = mockData.users.find(user => user.id === 'STU001')!;
    service.checkout(student);

    expect(service.getOrders('UNKNOWN')).toEqual([]);
  });

  it("clears a previous account's cart when the user switches", () => {
    const auth = TestBed.inject(Auth);
    auth.login('student@demo.test', 'Student123!');
    expect(service.addToCart('FOOD001')).toBeTrue();
    expect(service.getCart()).toHaveSize(1);
    auth.logout();
    auth.register('Second Student', 'second.student@example.com', 'Password123!');
    expect(service.getCart()).toEqual([]);
    auth.logout();
  });
});