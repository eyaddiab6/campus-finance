
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CafeteriaOrders } from './cafeteria-orders';

describe('CafeteriaOrders', () => {
  let component: CafeteriaOrders;
  let fixture: ComponentFixture<CafeteriaOrders>;

  beforeEach(async () => {
    localStorage.removeItem('campus-finance-cafeteria-orders');

    await TestBed.configureTestingModule({
      imports: [CafeteriaOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(CafeteriaOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    localStorage.removeItem('campus-finance-cafeteria-orders');
  });

  it('should create the Cafeteria Orders component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the initial sample orders', () => {
    expect(component.orders.length).toBe(4);
  });

  it('should calculate the total number of orders', () => {
    expect(component.totalOrders).toBe(4);
  });

  it('should count pending orders correctly', () => {
    expect(component.pendingOrders).toBe(1);
  });

  it('should count active orders correctly', () => {
    expect(component.activeOrders).toBe(1);
  });

  it('should calculate completed revenue correctly', () => {
    expect(component.completedRevenue).toBe(40);
  });

  it('should filter orders by status', () => {
    component.selectedStatus = 'pending';

    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].status).toBe('pending');
  });

  it('should search orders by student name', () => {
    component.searchText = 'Ahmed';

    expect(component.filteredOrders.length).toBe(2);
  });

  it('should search orders by order ID', () => {
    component.searchText = 'ORD-002';

    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].id).toBe('ORD-002');
  });

  it('should return the correct next status', () => {
    expect(component.getNextStatus('pending')).toBe('preparing');
    expect(component.getNextStatus('preparing')).toBe('ready');
    expect(component.getNextStatus('ready')).toBe('completed');
    expect(component.getNextStatus('completed')).toBeNull();
    expect(component.getNextStatus('cancelled')).toBeNull();
  });

  it('should update an order from pending to preparing', () => {
    const order = component.orders[0];

    component.updateStatus(order, 'preparing');

    expect(order.status).toBe('preparing');
    expect(component.message).toBe(
      `Order ${order.id} updated to preparing.`
    );
  });

  it('should not update a completed order', () => {
    const order = component.orders.find(
      item => item.status === 'completed'
    )!;

    component.updateStatus(order, 'preparing');

    expect(order.status).toBe('completed');
  });

  it('should cancel a pending order', () => {
    const order = component.orders[0];

    component.cancelOrder(order);

    expect(order.status).toBe('cancelled');
    expect(component.message).toBe(
      `Order ${order.id} cancelled successfully.`
    );
  });

  it('should not cancel a completed order', () => {
    const order = component.orders.find(
      item => item.status === 'completed'
    )!;

    component.cancelOrder(order);

    expect(order.status).toBe('completed');
  });

  it('should save updated orders in localStorage', () => {
    const order = component.orders[0];

    component.updateStatus(order, 'preparing');

    const savedOrders = JSON.parse(
      localStorage.getItem('campus-finance-cafeteria-orders')!
    );

    expect(savedOrders[0].status).toBe('preparing');
  });
});
