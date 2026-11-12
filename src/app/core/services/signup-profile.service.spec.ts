import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { SignupProfileService } from './signup-profile.service';

describe('SignupProfileService - browser storage', () => {
  let auth: Auth;
  let service: SignupProfileService;
  beforeEach(() => {
    sessionStorage.clear();
    document.cookie = 'campus_finance_food_preference=; Path=/; Max-Age=0; SameSite=Lax';
    TestBed.configureTestingModule({});
    auth = TestBed.inject(Auth);
    service = TestBed.inject(SignupProfileService);
  });
  afterEach(() => {
    sessionStorage.clear();
    document.cookie = 'campus_finance_food_preference=; Path=/; Max-Age=0; SameSite=Lax';
  });

  it('does not save a profile without a signed-in student', () => {
    expect(service.save({ username: 'testuser', pictureDataUrl: '', cardLast4: '', foodPreference: 'regular' })).toBeFalse();
  });

  it('stores display metadata in sessionStorage and preferences in cookies', () => {
    auth.register('Demo User', 'unique@demo.test', 'Password123!');
    expect(service.save({ username: 'demo_user', pictureDataUrl: '', cardLast4: '4321', foodPreference: 'high-protein' })).toBeTrue();
    expect(service.getProfile()?.username).toBe('demo_user');
    expect(service.getProfile()?.cardLast4).toBe('4321');
    expect(service.getFoodPreference()).toBe('high-protein');
    const stored = sessionStorage.getItem('campus-finance-signup-profile') ?? '';
    expect(stored).not.toContain('Password123!');
    expect(stored).not.toContain('4321123412341234');
  });

  it('prevents a different user from reading previous session profile', () => {
    auth.register('First User', 'first@demo.test', 'Password123!');
    service.save({ username: 'first_user', pictureDataUrl: '', cardLast4: '', foodPreference: 'regular' });
    auth.logout();
    auth.login('student@demo.test', 'Student123!');
    expect(service.getProfile()).toBeNull();
  });

  it('rejects invalid preferences and card data', () => {
    auth.register('Test User', 'third@demo.test', 'Password123!');
    expect(service.save({ username: 'test_user', pictureDataUrl: '', cardLast4: '1234567890123456', foodPreference: 'regular' })).toBeFalse();
    expect(service.save({ username: 'test_user', pictureDataUrl: '', cardLast4: '', foodPreference: 'secret' })).toBeFalse();
  });

  it('clears private session details but deliberately retains non-sensitive cookie', () => {
    auth.register('Demo User', 'fourth@demo.test', 'Password123!');
    service.save({ username: 'fourth', pictureDataUrl: '', cardLast4: '', foodPreference: 'vegetarian' });
    service.clearPrivateSession();
    expect(service.getProfile()).toBeNull();
    expect(service.getFoodPreference()).toBe('vegetarian');
  });
});
