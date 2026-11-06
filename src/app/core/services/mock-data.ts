import { Injectable } from '@angular/core';
import {
  User,
  FoodItem,
  MealPlan,
  Employee,
  Wallet,
} from '../models/campus.models';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  readonly users: User[] = [
    {
      id: 'STU001',
      fullName: 'Ahmed Mohamed',
      email: 'ahmed@student.giu.edu.eg',
      role: 'student',
    },
    {
      id: 'ACC001',
      fullName: 'Sara Ali',
      email: 'sara@giu.edu.eg',
      role: 'accounting',
    },
    {
      id: 'ADM001',
      fullName: 'Omar Hassan',
      email: 'omar@giu.edu.eg',
      role: 'admin',
    },
    {
      id: 'STAFF001',
      fullName: 'Mona Adel',
      email: 'mona@giu.edu.eg',
      role: 'cafeteria-staff',
    },
  ];

  readonly foodItems: FoodItem[] = [
    {
      id: 'FOOD001',
      name: 'Chicken Sandwich',
      category: 'Sandwiches',
      price: 85,
      available: true,
    },
    {
      id: 'FOOD002',
      name: 'Beef Burger',
      category: 'Burgers',
      price: 120,
      available: true,
    },
    {
      id: 'FOOD003',
      name: 'Orange Juice',
      category: 'Drinks',
      price: 40,
      available: true,
    },
  ];

  readonly mealPlans: MealPlan[] = [
    {
      id: 'PLAN001',
      name: 'Weekly Plan',
      price: 500,
      durationDays: 7,
      mealsIncluded: 5,
    },
    {
      id: 'PLAN002',
      name: 'Monthly Plan',
      price: 1800,
      durationDays: 30,
      mealsIncluded: 20,
    },
  ];

  readonly wallets: Wallet[] = [
    {
      id: 'WALLET001',
      studentId: 'STU001',
      balance: 750,
    },
  ];

  readonly employees: Employee[] = [
    {
      id: 'EMP001',
      fullName: 'Mohamed Ahmed',
      baseSalary: 6000,
    },
    {
      id: 'EMP002',
      fullName: 'Hassan Ali',
      baseSalary: 5500,
    },
  ];
}