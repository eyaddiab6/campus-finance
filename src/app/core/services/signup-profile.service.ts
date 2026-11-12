import { Injectable, inject } from '@angular/core';
import { Auth } from './auth';

/** Additional data for the short-lived student sign-up demo. */
export interface DemoSignupProfile {
  userId: string;
  username: string;
  pictureDataUrl: string;
  cardLast4: string;
  foodPreference: string;
}

@Injectable({ providedIn: 'root' })
export class SignupProfileService {
  private readonly auth = inject(Auth);
  private readonly sessionKey = 'campus-finance-signup-profile';
  private readonly cookieName = 'campus_finance_food_preference';
  private readonly allowedPreferences = ['regular', 'vegetarian', 'high-protein'];

  /** Persist only harmless mock metadata in this tab's session storage. */
  save(input: Omit<DemoSignupProfile, 'userId'>): boolean {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'student') return false;
    if (!/^[A-Za-z0-9_]{3,20}$/.test(input.username)) return false;
    if (input.cardLast4 && !/^\d{4}$/.test(input.cardLast4)) return false;
    if (!this.allowedPreferences.includes(input.foodPreference)) return false;
    if (input.pictureDataUrl && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(input.pictureDataUrl)) {
      return false;
    }
    const profile: DemoSignupProfile = { ...input, userId: user.id };
    try {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(profile));
      this.setFoodPreference(input.foodPreference);
      return true;
    } catch {
      return false;
    }
  }

  getProfile(): DemoSignupProfile | null {
    const user = this.auth.currentUser();
    if (!user || user.role !== 'student') return null;
    try {
      const stored = sessionStorage.getItem(this.sessionKey);
      if (!stored) return null;
      const data: unknown = JSON.parse(stored);
      if (!data || typeof data !== 'object' || !('userId' in data) || data.userId !== user.id ||
          !('username' in data) || typeof data.username !== 'string' ||
          !('pictureDataUrl' in data) || typeof data.pictureDataUrl !== 'string' ||
          !('cardLast4' in data) || typeof data.cardLast4 !== 'string' ||
          !('foodPreference' in data) || typeof data.foodPreference !== 'string') return null;
      const profile = data as DemoSignupProfile;
      const preference = this.getFoodPreference();
      return {
        ...profile,
        foodPreference: preference && this.allowedPreferences.includes(preference)
          ? preference : profile.foodPreference,
      };
    } catch {
      return null;
    }
  }

  /** Non-sensitive browser cookie; NEVER use cookies here for credentials/card data. */
  setFoodPreference(preference: string): void {
    if (!this.allowedPreferences.includes(preference)) return;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${this.cookieName}=${encodeURIComponent(preference)}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
  }

  getFoodPreference(): string | null {
    const item = document.cookie.split('; ').find(part => part.startsWith(`${this.cookieName}=`));
    if (!item) return null;
    try { return decodeURIComponent(item.slice(this.cookieName.length + 1)); }
    catch { return null; }
  }

  clearPrivateSession(): void {
    sessionStorage.removeItem(this.sessionKey);
    // Preference cookie deliberately remains to remember a non-sensitive choice.
  }
}
