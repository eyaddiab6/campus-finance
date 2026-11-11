import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Home } from './home';
import { Auth } from '../../core/services/auth';

describe('Home', () => {
  let auth: Auth;
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Home], providers: [provideRouter([])],
    }).compileComponents();
    auth = TestBed.inject(Auth);
    auth.logout();
  });
  afterEach(() => { auth.logout(); sessionStorage.clear(); });

  it('should create and show guest links', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Campus Finance');
    expect(fixture.nativeElement.textContent).toContain('Student signup');
  });

  it('should only show student modules to students', () => {
    auth.login('student@demo.test', 'Student123!');
    const c = TestBed.createComponent(Home).componentInstance;
    expect(c.availableLinks().some(l => l.url === '/wallet')).toBeTrue();
    expect(c.availableLinks().some(l => l.url === '/payroll')).toBeFalse();
  });

  it('should only show finance modules to accounting staff', () => {
    auth.login('accounting@demo.test', 'Accounting123!');
    const c = TestBed.createComponent(Home).componentInstance;
    expect(c.availableLinks().some(l => l.url === '/student-fees')).toBeTrue();
    expect(c.availableLinks().some(l => l.url === '/wallet')).toBeFalse();
  });

  it('should show cafeteria orders to staff but not invoices', () => {
    auth.login('staff@demo.test', 'Staff123!');
    const c = TestBed.createComponent(Home).componentInstance;
    expect(c.availableLinks().map(l => l.url)).toEqual(['/cafeteria-orders']);
  });

  it('should clear user session on logout and navigate', () => {
    auth.login('student@demo.test', 'Student123!');
    const fixture = TestBed.createComponent(Home);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    fixture.componentInstance.logout();
    expect(auth.isLoggedIn()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
