import { Injectable, signal } from '@angular/core';
import { User } from '../models/campus.models';

export interface LoginResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly sessionKey = 'campus-finance-demo-user';

  // Demo credentials only — never use real passwords.
  private readonly demoAccounts = [
    { email: 'student@demo.test', password: 'Student123!', role: 'student' },
    { email: 'accounting@demo.test', password: 'Accounting123!', role: 'accounting' },
    { email: 'admin@demo.test', password: 'Admin123!', role: 'admin' },
    { email: 'staff@demo.test', password: 'Staff123!', role: 'cafeteria-staff' },
  ] as const;

  readonly currentUser = signal<User | null>(null);

  constructor() {
    this.restoreSession();
  }

  login(email: string, password: string): LoginResult {
    const account = this.demoAccounts.find(
      item =>
        item.email === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!account) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const user: User = {
      id: account.role === 'student' ? 'STU001' : account.role.toUpperCase(),
      fullName: account.role === 'student' ? 'Demo Student' : 'Demo User',
      email: account.email,
      role: account.role,
    };

    this.currentUser.set(user);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(user));

    return {
      success: true,
      message: 'Login successful',
    };
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem(this.sessionKey);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }

  private restoreSession(): void {
    try {
      const saved = sessionStorage.getItem(this.sessionKey);
      if (!saved) return;

      const user = JSON.parse(saved) as User;

      // Validate against known demo accounts.
      const account = this.demoAccounts.find(
        item => item.email === user.email && item.role === user.role
      );

      if (account) {
        this.currentUser.set({
          id: user.id,
          fullName: user.fullName,
          email: account.email,
          role: account.role,
        });
      } else {
        sessionStorage.removeItem(this.sessionKey);
      }
    } catch {
      sessionStorage.removeItem(this.sessionKey);
    }
  }
}