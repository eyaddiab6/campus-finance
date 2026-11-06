import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Signup } from './signup';
import { Auth } from '../../../core/services/auth';

describe('Signup', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Signup);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should reject empty registration', () => {
    const fixture = TestBed.createComponent(Signup);
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.signupForm.invalid).toBeTrue();
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('should reject mismatching passwords', () => {
    const fixture = TestBed.createComponent(Signup);
    const component = fixture.componentInstance;

    component.signupForm.patchValue({
      fullName: 'Test Student',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Different123!'
    });

    expect(component.signupForm.hasError('passwordMismatch')).toBeTrue();
  });

  it('should successfully register a student', () => {
    const fixture = TestBed.createComponent(Signup);
    const component = fixture.componentInstance;

    spyOn(router, 'navigateByUrl')
      .and.returnValue(Promise.resolve(true));

    component.signupForm.patchValue({
      fullName: 'Test Student',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    component.onSubmit();

    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.currentUser()?.fullName).toBe('Test Student');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
  });
});