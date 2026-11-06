import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Campus Finance | Home',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'student-fees',
    title: 'Student Fees',
    loadComponent: () =>
      import('./features/student-fees/student-fees')
        .then(m => m.StudentFees),
  },
  {
    path: 'wallet',
    title: 'Digital Wallet',
    loadComponent: () =>
      import('./features/wallet/wallet').then(m => m.Wallet),
  },
  {
    path: 'department-budget',
    title: 'Department Budget',
    loadComponent: () =>
      import('./features/department-budget/department-budget')
        .then(m => m.DepartmentBudget),
  },
  {
    path: '**',
    redirectTo: '',
  },
];