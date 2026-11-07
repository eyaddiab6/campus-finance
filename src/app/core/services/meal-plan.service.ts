import { Injectable } from '@angular/core';
import {
  MealPlan,
  MealSubscription,
  User,
} from '../models/campus.models';
import { MockData } from './mock-data';

export type MealPlanResult =
  | { success: true; subscription: MealSubscription }
  | { success: false; message: string };

@Injectable({
  providedIn: 'root',
})
export class MealPlanService {
  private readonly subscriptions: MealSubscription[] = [];
  private nextSubscriptionId = 1;

  constructor(private readonly mockData: MockData) {}

  getPlans(): MealPlan[] {
    return [...this.mockData.mealPlans];
  }

  getCurrentSubscription(studentId: string): MealSubscription | undefined {
    const today = new Date().toISOString().slice(0, 10);

    return this.subscriptions.find(
      subscription =>
        subscription.studentId === studentId &&
        subscription.startDate <= today &&
        subscription.endDate >= today,
    );
  }

  getSubscriptionHistory(studentId: string): MealSubscription[] {
    return this.subscriptions
      .filter(subscription => subscription.studentId === studentId)
      .map(subscription => ({ ...subscription }));
  }

  activatePlan(user: User, mealPlanId: string): MealPlanResult {
    if (user.role !== 'student') {
      return {
        success: false,
        message: 'Only students can activate a meal plan.',
      };
    }

    if (this.getCurrentSubscription(user.id)) {
      return {
        success: false,
        message: 'You already have an active meal plan.',
      };
    }

    const plan = this.mockData.mealPlans.find(item => item.id === mealPlanId);

    if (!plan) {
      return { success: false, message: 'That meal plan could not be found.' };
    }

    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    const subscriptionId = `SUB${String(this.nextSubscriptionId++).padStart(4, '0')}`;

    const subscription: MealSubscription = {
      id: subscriptionId,
      studentId: user.id,
      mealPlanId: plan.id,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      // Invoice integration is pending; this demo activation creates no invoice.
      invoiceId: '',
    };

    this.subscriptions.push(subscription);

    return { success: true, subscription };
  }
}