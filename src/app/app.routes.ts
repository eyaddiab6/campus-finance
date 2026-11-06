import { Routes } from '@angular/router';

export const routes: Routes = [
  // Shared / Eyad
  {
    path: '',
    title: 'Campus Finance | Home',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'signup',
    title: 'Signup',
    loadComponent: () =>
      import('./features/auth/signup/signup').then(m => m.Signup),
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('./features/auth/profile/profile').then(m => m.Profile),
  },
  {
    path: 'student-fees',
    title: 'Student Fees',
    loadComponent: () =>
      import('./features/student-fees/student-fees')
        .then(m => m.StudentFees),
  },

  // Yassin
  {
    path: 'wallet',
    title: 'Digital Wallet',
    loadComponent: () =>
      import('./features/wallet/wallet').then(m => m.Wallet),
  },
  {
    path: 'food-ordering',
    title: 'Food Ordering',
    loadComponent: () =>
      import('./features/food-ordering/food-ordering')
        .then(m => m.FoodOrdering),
  },
  {
    path: 'meal-plans',
    title: 'Meal Plans',
    loadComponent: () =>
      import('./features/meal-plans/meal-plans')
        .then(m => m.MealPlans),
  },

  // Ali
  {
    path: 'payroll',
    title: 'Staff Payroll',
    loadComponent: () =>
      import('./features/payroll/payroll').then(m => m.Payroll),
  },
  {
    path: 'department-budget',
    title: 'Department Budget',
    loadComponent: () =>
      import('./features/department-budget/department-budget')
        .then(m => m.DepartmentBudget),
  },
  {
    path: 'cafeteria-orders',
    title: 'Cafeteria Orders',
    loadComponent: () =>
      import('./features/cafeteria-orders/cafeteria-orders')
        .then(m => m.CafeteriaOrders),
  },
  {
    path: '**',
    redirectTo: '',
  },
];