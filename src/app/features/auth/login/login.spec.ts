import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { Auth } from '../../../core/services/auth';

describe('Login', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should reject an empty form', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.onSubmit();

    expect(component.loginForm.invalid).toBeTrue();
    expect(component.loginForm.controls.email.touched).toBeTrue();
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('should display an error for invalid credentials', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.loginForm.setValue({
      email: 'wrong@demo.test',
      password: 'Wrong123!',
    });

    component.onSubmit();

    expect(component.errorMessage())
      .toBe('Invalid email or password');
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('should log in with valid credentials', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    spyOn(router, 'navigateByUrl')
      .and.returnValue(Promise.resolve(true));

    component.loginForm.setValue({
      email: 'student@demo.test',
      password: 'Student123!',
    });

    component.onSubmit();

    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.hasRole('student')).toBeTrue();
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/profile');
  });
});