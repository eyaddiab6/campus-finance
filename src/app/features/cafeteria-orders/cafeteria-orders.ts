import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodItem, FoodOrder, OrderStatus } from '../../core/models/campus.models';
import { MockData } from '../../core/services/mock-data';
import { FoodStoreService } from '../../core/services/food-store.service';

interface ManagedOrder extends FoodOrder {
  studentName: string;
}

@Component({
  selector: 'app-cafeteria-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './cafeteria-orders.html',
  styleUrl: './cafeteria-orders.scss',
})
export class CafeteriaOrders {
  readonly foodItems: FoodItem[];
  searchText = '';
  selectedStatus = 'all';
  message = '';

  readonly statuses: OrderStatus[] = [
    'pending', 'preparing', 'ready', 'completed', 'cancelled',
  ];

  constructor(
    private readonly mockData: MockData,
    private readonly foodStore: FoodStoreService,
  ) {
    this.foodItems = this.foodStore.getCatalog();
  }

  // Re-read shared service on change detection; checkout and staff use ONE ledger.
  get orders(): ManagedOrder[] {
    return this.foodStore.getAllOrders().map(order => ({
      ...order,
      studentName: this.mockData.users.find(user => user.id === order.studentId)?.fullName
        ?? order.studentId,
    }));
  }

  get filteredOrders(): ManagedOrder[] {
    const search = this.searchText.trim().toLowerCase();
    return this.orders.filter(order =>
      (this.selectedStatus === 'all' || order.status === this.selectedStatus) &&
      (!search || order.id.toLowerCase().includes(search) ||
        order.studentId.toLowerCase().includes(search) ||
        order.studentName.toLowerCase().includes(search)),
    );
  }

  get totalOrders(): number { return this.orders.length; }
  get pendingOrders(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }
  get activeOrders(): number {
    return this.orders.filter(order => order.status === 'preparing' || order.status === 'ready').length;
  }
  get completedRevenue(): number {
    return this.orders.filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getFoodName(foodItemId: string): string {
    return this.foodItems.find(item => item.id === foodItemId)?.name ?? foodItemId;
  }

  getOrderItems(order: ManagedOrder): string {
    return order.items.map(item => `${this.getFoodName(item.foodItemId)} × ${item.quantity}`).join(', ');
  }

  updateStatus(order: ManagedOrder, status: OrderStatus): void {
    const updated = this.foodStore.updateOrderStatus(order.id, status);
    this.message = updated
      ? `Order ${order.id} updated to ${status}.`
      : `Cannot change order ${order.id} from ${order.status} to ${status}.`;
  }

  cancelOrder(order: ManagedOrder): void {
    const cancelled = this.foodStore.updateOrderStatus(order.id, 'cancelled');
    this.message = cancelled
      ? `Order ${order.id} cancelled successfully.`
      : `Order ${order.id} cannot be cancelled.`;
  }

  getNextStatus(status: OrderStatus): OrderStatus | null {
    const transitions: Record<OrderStatus, OrderStatus | null> = {
      pending: 'preparing', preparing: 'ready', ready: 'completed',
      completed: null, cancelled: null,
    };
    return transitions[status];
  }
}
