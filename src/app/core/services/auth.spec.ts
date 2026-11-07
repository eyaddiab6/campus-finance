import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';

describe('Auth Service', () => {
  let service: Auth;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should reject incorrect credentials', () => {
    const result = service.login('wrong@test.com', 'wrong');

    expect(result.success).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should log in a student with valid demo credentials', () => {
    const result = service.login(
      'student@demo.test',
      'Student123!'
    );

    expect(result.success).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.hasRole('student')).toBeTrue();
  });

  it('should log out the current user', () => {
    service.login('student@demo.test', 'Student123!');
    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(sessionStorage.getItem('campus-finance-demo-user'))
      .toBeNull();
  });

  it('should reject invalid stored sessions', () => {
    service.logout();

    sessionStorage.setItem(
      'campus-finance-demo-user',
      JSON.stringify({
        id: 'FAKE',
        fullName: 'Fake User',
        email: 'fake@demo.test',
        role: 'admin',
      })
    );

    const restoredService = new Auth();

    expect(restoredService.isLoggedIn()).toBeFalse();
  });
  it('should register a new student', () => {
  const result = service.register(
    'Ahmed Mohamed',
    'newstudent@example.com',
    'Student123!'
  );

  expect(result.success).toBeTrue();
  expect(service.isLoggedIn()).toBeTrue();
  expect(service.currentUser()?.fullName)
    .toBe('Ahmed Mohamed');
  expect(service.hasRole('student')).toBeTrue();
});

it('should reject an existing demo email', () => {
  const result = service.register(
    'Ahmed Mohamed',
    'student@demo.test',
    'Student123!'
  );

  expect(result.success).toBeFalse();
  expect(service.isLoggedIn()).toBeFalse();
});

it('should reject short passwords', () => {
  const result = service.register(
    'Ahmed Mohamed',
    'newstudent@example.com',
    '123'
  );

  expect(result.success).toBeFalse();
});

it('should not store the registration password', () => {
  service.register(
    'Ahmed Mohamed',
    'newstudent@example.com',
    'Student123!'
  );

  const saved = sessionStorage.getItem(
    'campus-finance-demo-user'
  );

  expect(saved).not.toContain('Student123!');
});
it('should restore a registered student after refresh', () => {
  const auth = new Auth();

  const result = auth.register(
    'Ahmed Mohamed',
    'ahmed.refresh@example.com',
    'Student123!'
  );

  expect(result.success).toBeTrue();

  // Simulate a new Auth instance after page refresh.
  const restoredAuth = new Auth();

  expect(restoredAuth.isLoggedIn()).toBeTrue();
  expect(restoredAuth.currentUser()?.fullName)
    .toBe('Ahmed Mohamed');
  expect(restoredAuth.currentUser()?.role)
    .toBe('student');

  restoredAuth.logout();
});

it('should clear registered student session on logout', () => {
  const auth = new Auth();

  auth.register(
    'Ahmed Mohamed',
    'ahmed.logout@example.com',
    'Student123!'
  );

  auth.logout();

  expect(auth.isLoggedIn()).toBeFalse();

  expect(
    sessionStorage.getItem('campus-finance-demo-user')
  ).toBeNull();

  expect(
    sessionStorage.getItem('campus-finance-demo-registration')
  ).toBeNull();
});

it('should reject a tampered registered student role', () => {
  const auth = new Auth();

  auth.register(
    'Ahmed Mohamed',
    'ahmed.test@example.com',
    'Student123!'
  );

  const sessionKey = 'campus-finance-demo-user';

  const saved = JSON.parse(
    sessionStorage.getItem(sessionKey)!
  );

  saved.role = 'admin';

  sessionStorage.setItem(
    sessionKey,
    JSON.stringify(saved)
  );

  const restoredAuth = new Auth();

  expect(restoredAuth.isLoggedIn()).toBeFalse();
  expect(sessionStorage.getItem(sessionKey)).toBeNull();
});
});