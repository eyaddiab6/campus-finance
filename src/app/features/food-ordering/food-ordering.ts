import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { FoodItem, User } from '../../core/models/campus.models';
import {
  CartLine,
  FoodStoreService,
} from '../../core/services/food-store.service';

@Component({
  selector: 'app-food-ordering',
  imports: [CommonModule],
  templateUrl: './food-ordering.html',
  styleUrl: './food-ordering.scss',
})
export class FoodOrdering {
  private readonly auth = inject(Auth);

  readonly catalog: FoodItem[];
  get currentUser(): User | undefined {
    const user = this.auth.currentUser();
    return user?.role === 'student' ? user : undefined;
  }

  searchTerm = '';
  selectedCategory = 'All';
  cart: CartLine[] = [];
  cartTotal = 0;
  message = '';
  error = '';

  constructor(private readonly foodStore: FoodStoreService) {
    this.catalog = this.foodStore.getCatalog();
    this.refreshCart();
  }

  get categories(): string[] {
    return ['All', ...new Set(this.catalog.map(item => item.category))];
  }

  get filteredItems(): FoodItem[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    return this.catalog.filter(item => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        item.category === this.selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }

  setSearch(value: string): void {
    this.searchTerm = value;
  }

  setCategory(value: string): void {
    this.selectedCategory = value;
  }

  addItem(item: FoodItem): void {
    this.message = '';
    this.error = '';

    if (!this.foodStore.addToCart(item.id)) {
      this.error = `${item.name} is currently unavailable.`;
      return;
    }

    this.refreshCart();
  }

  changeQuantity(foodItemId: string, quantity: number): void {
    this.message = '';
    this.error = '';

    if (!this.foodStore.setQuantity(foodItemId, quantity)) {
      this.error = 'The quantity could not be updated.';
      this.refreshCart();
      return;
    }

    this.refreshCart();
  }

  removeItem(foodItemId: string): void {
    this.foodStore.removeFromCart(foodItemId);
    this.refreshCart();
  }

  checkout(): void {
    this.message = '';
    this.error = '';

    if (!this.currentUser) {
      this.error = 'The demo student account could not be found.';
      return;
    }

    const result = this.foodStore.checkout(this.currentUser);

    if (result.success === false) {
      this.error = result.message;
      return;
    }

    this.message = `Order ${result.order.id} placed successfully.`;
    this.refreshCart();
  }

  private refreshCart(): void {
    this.cart = this.foodStore.getCart();
    this.cartTotal = this.foodStore.getCartTotal();
  }
}