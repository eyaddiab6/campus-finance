// Shared roles and user accounts
export type UserRole =
  | 'student'
  | 'accounting'
  | 'admin'
  | 'cafeteria-staff';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Student fees and invoices
export type InvoiceStatus = 'paid' | 'unpaid';
export type InvoiceType = 'tuition' | 'meal-plan';

export interface Invoice {
  id: string;
  studentId: string;
  type: InvoiceType;
  description: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

// Student digital wallet
export interface Wallet {
  id: string;
  studentId: string;
  balance: number;
}

export type TransactionType = 'top-up' | 'purchase';

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

// Cafeteria products and orders
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  available: boolean;
}

export interface OrderItem {
  foodItemId: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface FoodOrder {
  id: string;
  studentId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// Meal plan subscriptions
export interface MealPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  mealsIncluded: number;
}

export interface MealSubscription {
  id: string;
  studentId: string;
  mealPlanId: string;
  startDate: string;
  endDate: string;
  invoiceId: string;
}

// Cafeteria employees and payroll
export interface Employee {
  id: string;
  fullName: string;
  baseSalary: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  shiftAllowance: number;
  deductions: number;
  netSalary: number;
}

// Department financial records
export type FinancialRecordType = 'income' | 'expense';

export interface FinancialRecord {
  id: string;
  type: FinancialRecordType;
  category: string;
  amount: number;
  date: string;
  description: string;
}