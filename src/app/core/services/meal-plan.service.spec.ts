import { TestBed } from '@angular/core/testing';
import { MockData } from './mock-data';
import { MealPlanService } from './meal-plan.service';
import { Invoices } from './invoices';

describe('MealPlanService', () => {
  let service: MealPlanService;
  let mockData: MockData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealPlanService, MockData, Invoices],
    });

    service = TestBed.inject(MealPlanService);
    mockData = TestBed.inject(MockData);
  });

  it('provides the available meal plans', () => {
    expect(service.getPlans().length).toBe(2);
    expect(service.getPlans()[0].name).toBe('Weekly Plan');
  });

  it('activates a plan for a student and records its subscription', () => {
    const student = mockData.users.find(user => user.id === 'STU001')!;
    const result = service.activatePlan(student, 'PLAN001');

    expect(result.success).toBeTrue();
    expect(service.getCurrentSubscription('STU001')).toBeDefined();
    expect(service.getSubscriptionHistory('STU001').length).toBe(1);
  });

  it('prevents a student from activating another plan while one is active', () => {
    const student = mockData.users.find(user => user.id === 'STU001')!;

    service.activatePlan(student, 'PLAN001');
    const result = service.activatePlan(student, 'PLAN002');

    expect(result.success).toBeFalse();
    expect(service.getSubscriptionHistory('STU001').length).toBe(1);
  });

  it('rejects activation for a non-student account', () => {
    const staffUser = mockData.users.find(user => user.id === 'ACC001')!;

    const result = service.activatePlan(staffUser, 'PLAN001');

    expect(result.success).toBeFalse();
    expect(service.getSubscriptionHistory('ACC001')).toEqual([]);
  });

  it('rejects an unknown plan', () => {
    const student = mockData.users.find(user => user.id === 'STU001')!;

    const result = service.activatePlan(student, 'UNKNOWN');

    expect(result.success).toBeFalse();
    expect(service.getSubscriptionHistory('STU001')).toEqual([]);
  });

  it('keeps subscription history isolated by student', () => {
    const student = mockData.users.find(user => user.id === 'STU001')!;
    service.activatePlan(student, 'PLAN001');

    expect(service.getSubscriptionHistory('ACC001')).toEqual([]);
    expect(service.getCurrentSubscription('ACC001')).toBeUndefined();
  });

  it('creates a matching invoice for an activated meal plan', () => {
    const student = mockData.users.find(user => user.id === 'STU001')!;
    const result = service.activatePlan(student, 'PLAN001');
    expect(result.success).toBeTrue();
    if (!result.success) return;
    const invoices = TestBed.inject(Invoices);
    const invoice = invoices.invoices().find(item => item.id === result.subscription.invoiceId);
    expect(invoice).toBeDefined();
    expect(invoice?.studentId).toBe('STU001');
    expect(invoice?.type).toBe('meal-plan');
    expect(invoice?.status).toBe('unpaid');
  });
});