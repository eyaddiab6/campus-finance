import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  MealPlan,
  MealSubscription,
  User,
} from '../../core/models/campus.models';
import { MealPlanService } from '../../core/services/meal-plan.service';
import { MockData } from '../../core/services/mock-data';

@Component({
  selector: 'app-meal-plans',
  imports: [CommonModule],
  templateUrl: './meal-plans.html',
  styleUrl: './meal-plans.scss',
})
export class MealPlans {
  private readonly demoStudentId = 'STU001';

  readonly currentUser: User | undefined;
  readonly plans: MealPlan[];

  currentSubscription: MealSubscription | undefined;
  subscriptionHistory: MealSubscription[] = [];
  message = '';
  error = '';

  constructor(
    private readonly mealPlanService: MealPlanService,
    mockData: MockData,
  ) {
    this.currentUser = mockData.users.find(
      user => user.id === this.demoStudentId,
    );
    this.plans = this.mealPlanService.getPlans();
    this.refreshSubscriptions();
  }

  get currentPlan(): MealPlan | undefined {
    return this.plans.find(
      plan => plan.id === this.currentSubscription?.mealPlanId,
    );
  }

  activate(plan: MealPlan): void {
    this.message = '';
    this.error = '';

    if (!this.currentUser) {
      this.error = 'The demo student account could not be found.';
      return;
    }

    const result = this.mealPlanService.activatePlan(
      this.currentUser,
      plan.id,
    );

    if ('message' in result) {
      this.error = result.message;
      return;
    }

    this.message = `${plan.name} activated successfully.`;
    this.refreshSubscriptions();
  }

  getPlanName(mealPlanId: string): string {
    return (
      this.plans.find(plan => plan.id === mealPlanId)?.name ??
      'Unknown meal plan'
    );
  }

  private refreshSubscriptions(): void {
    if (!this.currentUser) {
      return;
    }

    this.currentSubscription =
      this.mealPlanService.getCurrentSubscription(this.currentUser.id);
    this.subscriptionHistory =
      this.mealPlanService.getSubscriptionHistory(this.currentUser.id);
  }
}