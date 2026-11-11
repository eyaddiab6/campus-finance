
import { Injectable, signal } from '@angular/core';
import type { User } from '../models/campus.models';

export interface LoginResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly sessionKey = 'campus-finance-demo-user';
  private readonly registrationKey = 'campus-finance-demo-registration';

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
      (item) =>
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

    // Remove any previous temporary registration.
    sessionStorage.removeItem(this.registrationKey);

    return {
      success: true,
      message: 'Login successful',
    };
  }

  register(
    fullName: string,
    email: string,
    password: string
  ): LoginResult {
    const name = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (name.length < 3) {
      return {
        success: false,
        message: 'Full name must contain at least 3 characters',
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must contain at least 8 characters',
      };
    }

    const exists = this.demoAccounts.some(
      (account) => account.email === normalizedEmail
    );

    if (exists) {
      return {
        success: false,
        message: 'This email is already registered',
      };
    }

    const user: User = {
      id: 'STU-' + crypto.randomUUID(),
      fullName: name,
      email: normalizedEmail,
      role: 'student',
    };

    // Frontend demo only. Never persist the password.
    this.currentUser.set(user);

    sessionStorage.setItem(
      this.sessionKey,
      JSON.stringify(user)
    );

    sessionStorage.setItem(
      this.registrationKey,
      JSON.stringify({
        id: user.id,
        email: user.email,
      })
    );

    return {
      success: true,
      message: 'Account created successfully',
    };
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.registrationKey);
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

      if (!saved) {
        sessionStorage.removeItem(this.registrationKey);
        return;
      }

      const user: unknown = JSON.parse(saved);

      if (
        !user ||
        typeof user !== 'object' ||
        !('id' in user) ||
        !('fullName' in user) ||
        !('email' in user) ||
        !('role' in user) ||
        typeof user.id !== 'string' ||
        typeof user.fullName !== 'string' ||
        typeof user.email !== 'string' ||
        typeof user.role !== 'string'
      ) {
        throw new Error('Invalid session');
      }

      // Restore an existing demo account.
      const account = this.demoAccounts.find(
        (item) =>
          item.email === user.email &&
          item.role === user.role
      );

      if (account) {
        this.currentUser.set({
          id: user.id,
          fullName: user.fullName,
          email: account.email,
          role: account.role,
        });

        sessionStorage.removeItem(this.registrationKey);
        return;
      }

      // Restore a temporarily registered student.
      const savedRegistration = sessionStorage.getItem(
        this.registrationKey
      );

      if (!savedRegistration) {
        throw new Error('Registration not found');
      }

      const registration: unknown = JSON.parse(savedRegistration);

      if (
        !registration ||
        typeof registration !== 'object' ||
        !('id' in registration) ||
        !('email' in registration) ||
        registration.id !== user.id ||
        registration.email !== user.email ||
        user.role !== 'student' ||
        !user.id.startsWith('STU-') ||
        user.fullName.trim().length < 3 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
      ) {
        throw new Error('Invalid registered student session');
      }

      this.currentUser.set({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: 'student',
      });
    } catch {
      this.currentUser.set(null);
      sessionStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.registrationKey);
    }
  }
}
