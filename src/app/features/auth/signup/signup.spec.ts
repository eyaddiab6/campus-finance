import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Signup } from './signup';
import { Auth } from '../../../core/services/auth';
import { SignupProfileService } from '../../../core/services/signup-profile.service';

describe('Signup - Milestone 1', () => {
  let auth: Auth;
  let router: Router;
  let profile: SignupProfileService;
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Signup], providers: [provideRouter([])],
    }).compileComponents();
    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
    profile = TestBed.inject(SignupProfileService);
  });
  afterEach(() => sessionStorage.clear());

  it('creates', () => {
    const fixture = TestBed.createComponent(Signup);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('rejects an empty registration', () => {
    const fixture = TestBed.createComponent(Signup);
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.signupForm.invalid).toBeTrue();
    expect(auth.isLoggedIn()).toBeFalse();
  });

  it('requires a valid username', () => {
    const fixture = TestBed.createComponent(Signup);
    fixture.componentInstance.signupForm.controls.username.setValue('bad name');
    expect(fixture.componentInstance.signupForm.controls.username.invalid).toBeTrue();
    fixture.componentInstance.signupForm.controls.username.setValue('student_01');
    expect(fixture.componentInstance.signupForm.controls.username.valid).toBeTrue();
  });

  it('rejects mismatching passwords', () => {
    const fixture = TestBed.createComponent(Signup);
    fixture.componentInstance.signupForm.patchValue({
      username: 'student_01', fullName: 'Test Student', email: 'test@example.com',
      password: 'Password123!', confirmPassword: 'Different123!',
    });
    expect(fixture.componentInstance.signupForm.hasError('passwordMismatch')).toBeTrue();
  });

  it('rejects invalid demo card last-four data', () => {
    const fixture = TestBed.createComponent(Signup);
    fixture.componentInstance.signupForm.controls.cardLast4.setValue('12345');
    expect(fixture.componentInstance.signupForm.controls.cardLast4.invalid).toBeTrue();
    fixture.componentInstance.signupForm.controls.cardLast4.setValue('1234');
    expect(fixture.componentInstance.signupForm.controls.cardLast4.valid).toBeTrue();
  });

  it('registers a student and displays session metadata', () => {
    const fixture = TestBed.createComponent(Signup);
    const component = fixture.componentInstance;
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    component.signupForm.patchValue({
      username: 'student_01', fullName: 'Test Student', email: 'test@example.com',
      password: 'Password123!', confirmPassword: 'Password123!',
      cardLast4: '1234', preferences: 'vegetarian',
    });
    component.onSubmit();
    expect(auth.isLoggedIn()).toBeTrue();
    expect(auth.currentUser()?.fullName).toBe('Test Student');
    expect(profile.getProfile()?.username).toBe('student_01');
    expect(profile.getProfile()?.cardLast4).toBe('1234');
    expect(profile.getFoodPreference()).toBe('vegetarian');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
  });
});
