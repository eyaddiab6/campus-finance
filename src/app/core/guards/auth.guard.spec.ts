import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { Auth } from '../services/auth';
import type { UserRole } from '../models/campus.models';
import { authGuard, roleGuard } from './auth.guard';

describe('Authentication and Role Guards', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    auth.logout();
  });

  afterEach(() => {
    auth.logout();
    sessionStorage.clear();
  });

  function checkAuth() {
    return TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    );
  }

  function checkRole(roles: UserRole[]) {
    const route = {
      data: { roles },
    } as unknown as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() =>
      roleGuard(route, {} as RouterStateSnapshot)
    );
  }

  function redirectUrl(result: unknown): string {
    return router.serializeUrl(result as UrlTree);
  }

  it('blocks guests from protected pages', () => {
    expect(redirectUrl(checkAuth())).toBe('/login');
  });

  it('allows logged-in users to access profile', () => {
    auth.login('student@demo.test', 'Student123!');

    expect(checkAuth()).toBeTrue();
  });

  it('blocks guests from role-protected pages', () => {
    expect(redirectUrl(checkRole(['admin']))).toBe('/login');
  });

  it('allows students to access their wallet', () => {
    auth.login('student@demo.test', 'Student123!');

    expect(checkRole(['student'])).toBeTrue();
  });

  it('blocks students from payroll', () => {
    auth.login('student@demo.test', 'Student123!');

    expect(redirectUrl(checkRole(['admin', 'accounting'])))
      .toBe('/profile');
  });

  it('allows accounting users to access student fees', () => {
    auth.login('accounting@demo.test', 'Accounting123!');

    expect(checkRole(['student', 'accounting', 'admin']))
      .toBeTrue();
  });

  it('blocks accounting users from student wallet', () => {
    auth.login('accounting@demo.test', 'Accounting123!');

    expect(redirectUrl(checkRole(['student'])))
      .toBe('/profile');
  });

  it('allows admins to access department budgets', () => {
    auth.login('admin@demo.test', 'Admin123!');

    expect(checkRole(['admin', 'accounting'])).toBeTrue();
  });

  it('allows cafeteria staff to access cafeteria orders', () => {
    auth.login('staff@demo.test', 'Staff123!');

    expect(checkRole(['cafeteria-staff', 'admin']))
      .toBeTrue();
  });

  it('blocks cafeteria staff from student fees', () => {
    auth.login('staff@demo.test', 'Staff123!');

    expect(redirectUrl(checkRole(['student', 'accounting', 'admin'])))
      .toBe('/profile');
  });

  it('blocks routes without an authorized role', () => {
    auth.login('admin@demo.test', 'Admin123!');

    expect(redirectUrl(checkRole([]))).toBe('/profile');
  });
});