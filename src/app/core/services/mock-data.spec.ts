import { TestBed } from '@angular/core/testing';
import { MockData } from './mock-data';

describe('MockData', () => {
  let service: MockData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain the required user roles', () => {
    const roles = service.users.map(user => user.role);

    expect(roles).toContain('student');
    expect(roles).toContain('accounting');
    expect(roles).toContain('admin');
    expect(roles).toContain('cafeteria-staff');
  });

  it('should provide food items', () => {
    expect(service.foodItems.length).toBeGreaterThan(0);
  });

  it('should provide valid wallet balances', () => {
    expect(
      service.wallets.every(wallet => wallet.balance >= 0)
    ).toBeTrue();
  });

  it('should provide meal plans', () => {
    expect(service.mealPlans.length).toBeGreaterThan(0);
  });
});