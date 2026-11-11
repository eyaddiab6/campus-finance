import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Profile } from './profile';
import { Auth } from '../../../core/services/auth';

describe('Profile', () => {
  let auth: Auth;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  afterEach(() => sessionStorage.clear());

  it('should create', () => {
    const fixture = TestBed.createComponent(Profile);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the logged-in student name', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Demo Student');
  });

  it('should show login link when logged out', () => {
    const fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Not Logged In');
  });

  it('should log out and navigate to login', () => {
    auth.login('student@demo.test', 'Student123!');

    const fixture = TestBed.createComponent(Profile);

    spyOn(router, 'navigateByUrl')
      .and.returnValue(Promise.resolve(true));

    fixture.componentInstance.logout();

    expect(auth.isLoggedIn()).toBeFalse();
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/login');
  });
});