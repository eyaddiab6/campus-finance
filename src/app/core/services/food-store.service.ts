import { Injectable, inject } from '@angular/core';
import { Auth } from './auth';
import {
  FoodItem,
  FoodOrder,
  OrderItem,
  User,
} from '../models/campus.models';
import { MockData } from './mock-data';
import { WalletService } from './wallet.service';

export interface CartLine {
  foodItem: FoodItem;
  quantity: number;
}

export type CheckoutResult =
  | { success: true; order: FoodOrder }
  | { success: false; message: string };

@Injectable({
  providedIn: 'root',
})
export class FoodStoreService {
  private readonly auth = inject(Auth);
  private readonly cart = new Map<string, number>();
  private cartOwnerId: string | null = null;

  private ensureCartOwner(): void {
    const currentId = this.auth.currentUser()?.id ?? null;
    if (this.cartOwnerId !== currentId) {
      this.cart.clear();
      this.cartOwnerId = currentId;
    }
  }
  private readonly orders: FoodOrder[] = [];
  private nextOrderId = 1;
  private checkoutInProgress = false;

  constructor(
    private readonly mockData: MockData,
    private readonly walletService: WalletService,
  ) {}

  getCatalog(): FoodItem[] {
    return [...this.mockData.foodItems];
  }

  getCart(): CartLine[] {
    this.ensureCartOwner();
    return [...this.cart.entries()]
      .map(([foodItemId, quantity]) => {
        const foodItem = this.mockData.foodItems.find(
          item => item.id === foodItemId,
        );

        return foodItem ? { foodItem, quantity } : undefined;
      })
      .filter((line): line is CartLine => line !== undefined);
  }

  getCartTotal(): number {
    return this.getCart().reduce(
      (total, line) => total + line.foodItem.price * line.quantity,
      0,
    );
  }

  addToCart(foodItemId: string, quantity = 1): boolean {
    this.ensureCartOwner();
    const foodItem = this.mockData.foodItems.find(
      item => item.id === foodItemId,
    );

    if (
      !foodItem ||
      !foodItem.available ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return false;
    }

    this.cart.set(foodItemId, (this.cart.get(foodItemId) ?? 0) + quantity);
    return true;
  }

  setQuantity(foodItemId: string, quantity: number): boolean {
    this.ensureCartOwner();
    if (!this.cart.has(foodItemId) || !Number.isInteger(quantity) || quantity < 1) {
      return false;
    }

    const foodItem = this.mockData.foodItems.find(
      item => item.id === foodItemId,
    );

    if (!foodItem?.available) {
      return false;
    }

    this.cart.set(foodItemId, quantity);
    return true;
  }

  removeFromCart(foodItemId: string): void {
    this.ensureCartOwner();
    this.cart.delete(foodItemId);
  }

  clearCart(): void {
    this.ensureCartOwner();
    this.cart.clear();
  }

  getOrders(studentId: string): FoodOrder[] {
    return this.orders
      .filter(order => order.studentId === studentId)
      .map(order => ({ ...order, items: order.items.map(item => ({ ...item })) }));
  }

  checkout(user: User): CheckoutResult {
    if (this.checkoutInProgress) {
      return { success: false, message: 'Checkout is already in progress.' };
    }

    this.checkoutInProgress = true;

    try {
      if (user.role !== 'student') {
        return {
          success: false,
          message: 'Only students can place cafeteria orders.',
        };
      }

      const lines = this.getCart();

      if (lines.length === 0) {
        return { success: false, message: 'Your cart is empty.' };
      }

      const orderItems: OrderItem[] = [];

      for (const line of lines) {
        const currentItem = this.mockData.foodItems.find(
          item => item.id === line.foodItem.id,
        );

        if (
          !currentItem ||
          !currentItem.available ||
          !Number.isInteger(line.quantity) ||
          line.quantity < 1 ||
          !Number.isFinite(currentItem.price) ||
          currentItem.price <= 0
        ) {
          return {
            success: false,
            message: `${line.foodItem.name} is unavailable or has invalid details.`,
          };
        }

        orderItems.push({
          foodItemId: currentItem.id,
          quantity: line.quantity,
          unitPrice: currentItem.price,
        });
      }

      const totalAmount = orderItems.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      );

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        return { success: false, message: 'The cart total is invalid.' };
      }

      if (!this.walletService.getWallet(user.id)) {
        return {
          success: false,
          message: 'A wallet could not be found for this student.',
        };
      }

      if (this.walletService.getWallet(user.id)!.balance < totalAmount) {
        return {
          success: false,
          message: 'Your wallet balance is too low for this order.',
        };
      }

      const orderId = `ORDER${String(this.nextOrderId++).padStart(4, '0')}`;
      const debited = this.walletService.debit(
        user.id,
        totalAmount,
        `Cafeteria order ${orderId}`,
      );

      if (!debited) {
        return {
          success: false,
          message: 'Payment could not be completed. Please try again.',
        };
      }

      const order: FoodOrder = {
        id: orderId,
        studentId: user.id,
        items: orderItems,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      this.orders.push(order);
      this.clearCart();

      return { success: true, order };
    } finally {
      this.checkoutInProgress = false;
    }
  }
}