
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FoodOrder,
  FoodItem,
  OrderStatus
} from '../../core/models/campus.models';
import { MockData } from '../../core/services/mock-data';

interface ManagedOrder extends FoodOrder {
  studentName: string;
}

@Component({
  selector: 'app-cafeteria-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './cafeteria-orders.html',
  styleUrl: './cafeteria-orders.scss'
})
export class CafeteriaOrders {
  orders: ManagedOrder[] = [];
  foodItems: FoodItem[] = [];

  searchText = '';
  selectedStatus = 'all';
  message = '';

  private readonly storageKey = 'campus-finance-cafeteria-orders';

  readonly statuses: OrderStatus[] = [
    'pending',
    'preparing',
    'ready',
    'completed',
    'cancelled'
  ];

  constructor(private mockData: MockData) {
    this.foodItems = [...this.mockData.foodItems];
    this.loadOrders();
  }

  private loadOrders(): void {
    const savedOrders = localStorage.getItem(this.storageKey);

    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      return;
    }

    this.orders = [
      {
        id: 'ORD-001',
        studentId: 'STU001',
        studentName: 'Ahmed Mohamed',
        items: [
          { foodItemId: 'FOOD001', quantity: 2, unitPrice: 85 }
        ],
        totalAmount: 170,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'ORD-002',
        studentId: 'STU002',
        studentName: 'Sara Hassan',
        items: [
          { foodItemId: 'FOOD002', quantity: 1, unitPrice: 120 },
          { foodItemId: 'FOOD003', quantity: 2, unitPrice: 40 }
        ],
        totalAmount: 200,
        status: 'preparing',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'ORD-003',
        studentId: 'STU003',
        studentName: 'Omar Ali',
        items: [
          { foodItemId: 'FOOD003', quantity: 1, unitPrice: 40 }
        ],
        totalAmount: 40,
        status: 'completed',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'ORD-004',
        studentId: 'STU001',
        studentName: 'Ahmed Mohamed',
        items: [
          { foodItemId: 'FOOD002', quantity: 1, unitPrice: 120 }
        ],
        totalAmount: 120,
        status: 'cancelled',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    this.saveOrders();
  }

  get filteredOrders(): ManagedOrder[] {
    const search = this.searchText.toLowerCase().trim();

    return this.orders.filter(order => {
      const matchesStatus =
        this.selectedStatus === 'all' ||
        order.status === this.selectedStatus;

      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.studentId.toLowerCase().includes(search) ||
        order.studentName.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter(
      order => order.status === 'pending'
    ).length;
  }

  get activeOrders(): number {
    return this.orders.filter(
      order =>
        order.status === 'preparing' ||
        order.status === 'ready'
    ).length;
  }

  get completedRevenue(): number {
    return this.orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getFoodName(foodItemId: string): string {
    return this.foodItems.find(item => item.id === foodItemId)?.name
      ?? foodItemId;
  }

  getOrderItems(order: ManagedOrder): string {
    return order.items.map(item =>
      `${this.getFoodName(item.foodItemId)} × ${item.quantity}`
    ).join(', ');
  }

  updateStatus(order: ManagedOrder, status: OrderStatus): void {
    if (order.status === 'completed' || order.status === 'cancelled') {
      return;
    }

    if (
      status === 'pending' ||
      (order.status === 'ready' && status === 'preparing')
    ) {
      return;
    }

    order.status = status;
    this.saveOrders();

    this.message = `Order ${order.id} updated to ${status}.`;
  }

  cancelOrder(order: ManagedOrder): void {
    if (
      order.status === 'completed' ||
      order.status === 'cancelled'
    ) {
      return;
    }

    order.status = 'cancelled';
    this.saveOrders();

    this.message = `Order ${order.id} cancelled successfully.`;
  }

  getNextStatus(status: OrderStatus): OrderStatus | null {
    const nextStatuses: Record<string, OrderStatus | null> = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
      cancelled: null
    };

    return nextStatuses[status];
  }

  private saveOrders(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.orders)
    );
  }
}
