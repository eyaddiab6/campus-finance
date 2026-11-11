import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CafeteriaOrders } from './cafeteria-orders';
import { FoodStoreService } from '../../core/services/food-store.service';
import { MockData } from '../../core/services/mock-data';
import { WalletService } from '../../core/services/wallet.service';

// End-to-end service integration within one Angular testing injector.
describe('CafeteriaOrders shared order integration', () => {
  let component: CafeteriaOrders;
  let fixture: ComponentFixture<CafeteriaOrders>;
  let store: FoodStoreService;
  let mock: MockData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CafeteriaOrders],
      providers: [FoodStoreService, WalletService, MockData],
    }).compileComponents();
    store = TestBed.inject(FoodStoreService);
    mock = TestBed.inject(MockData);
    fixture = TestBed.createComponent(CafeteriaOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function placeOrder(): string {
    const student = mock.users.find(user => user.id === 'STU001')!;
    expect(store.addToCart('FOOD001')).toBeTrue();
    const checkout = store.checkout(student);
    expect(checkout.success).toBeTrue();
    if (!checkout.success) throw new Error('Expected successful checkout');
    return checkout.order.id;
  }

  it('creates the dashboard without separate seeded orders', () => {
    expect(component).toBeTruthy();
    expect(component.orders).toEqual([]);
    expect(component.totalOrders).toBe(0);
  });

  it('shows a student checkout immediately in the staff dashboard', () => {
    const orderId = placeOrder();
    expect(component.totalOrders).toBe(1);
    expect(component.pendingOrders).toBe(1);
    expect(component.orders[0].id).toBe(orderId);
    expect(component.orders[0].studentId).toBe('STU001');
    expect(component.getOrderItems(component.orders[0])).toContain('Chicken Sandwich');
  });

  it('advances a real checkout through preparing, ready and completed', () => {
    const orderId = placeOrder();
    component.updateStatus(component.orders[0], 'preparing');
    expect(store.getOrders('STU001')[0].status).toBe('preparing');
    expect(component.activeOrders).toBe(1);
    component.updateStatus(component.orders[0], 'ready');
    expect(store.getOrders('STU001')[0].status).toBe('ready');
    component.updateStatus(component.orders[0], 'completed');
    expect(store.getOrders('STU001')[0].status).toBe('completed');
    expect(component.completedRevenue).toBe(85);
    expect(component.orders[0].id).toBe(orderId);
  });

  it('does not permit skipping workflow steps', () => {
    placeOrder();
    component.updateStatus(component.orders[0], 'completed');
    expect(component.orders[0].status).toBe('pending');
    expect(component.message).toContain('Cannot change');
  });

  it('cancels an active order but not a completed order', () => {
    placeOrder();
    component.cancelOrder(component.orders[0]);
    expect(component.orders[0].status).toBe('cancelled');
    expect(component.getNextStatus('cancelled')).toBeNull();
    component.updateStatus(component.orders[0], 'preparing');
    expect(component.orders[0].status).toBe('cancelled');
  });

  it('filters checkout orders by status and student ID', () => {
    placeOrder();
    component.selectedStatus = 'pending';
    component.searchText = 'STU001';
    expect(component.filteredOrders).toHaveSize(1);
    component.searchText = 'another student';
    expect(component.filteredOrders).toEqual([]);
  });

  it('does not change wallet debit after staff status updates', () => {
    placeOrder();
    expect(mock.wallets[0].balance).toBe(665);
    component.updateStatus(component.orders[0], 'preparing');
    component.updateStatus(component.orders[0], 'ready');
    expect(mock.wallets[0].balance).toBe(665);
    expect(TestBed.inject(WalletService).getTransactions('STU001')).toHaveSize(1);
  });
});
