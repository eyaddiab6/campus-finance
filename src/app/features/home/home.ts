import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import type { UserRole } from '../../core/models/campus.models';

interface DashboardLink {
  label: string;
  description: string;
  url: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly links: DashboardLink[] = [
    { label: 'Student Fees', description: 'Tuition invoices and payment records', url: '/student-fees', roles: ['student', 'accounting', 'admin'] },
    { label: 'Digital Wallet', description: 'Balance and spending', url: '/wallet', roles: ['student'] },
    { label: 'Food Ordering', description: 'Browse the campus food menu', url: '/food-ordering', roles: ['student'] },
    { label: 'Meal Plans', description: 'Cafeteria subscriptions', url: '/meal-plans', roles: ['student'] },
    { label: 'Payroll', description: 'Manage employee salary records', url: '/payroll', roles: ['admin', 'accounting'] },
    { label: 'Department Budget', description: 'Review income and expenditure', url: '/department-budget', roles: ['admin', 'accounting'] },
    { label: 'Cafeteria Orders', description: 'Track cafeteria order fulfilment', url: '/cafeteria-orders', roles: ['admin', 'cafeteria-staff'] },
  ];

  readonly availableLinks = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role ? this.links.filter(link => link.roles.includes(role)) : [];
  });

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
