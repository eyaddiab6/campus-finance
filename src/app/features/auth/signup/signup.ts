import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { SignupProfileService } from '../../../core/services/signup-profile.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly signupProfile = inject(SignupProfileService);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly avatarPreview = signal('');

  readonly signupForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]{3,20}$/)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      // Only the final four digits of a *fake* card; never collect an actual card number/CVV.
      cardLast4: ['', [Validators.pattern(/^\d{4}$/)]],
      preferences: ['regular'],
    },
    { validators: passwordsMatch }
  );

  onPictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    this.errorMessage.set('');
    if (!file) { this.avatarPreview.set(''); return; }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 200_000) {
      input.value = '';
      this.avatarPreview.set('');
      this.errorMessage.set('Choose a PNG, JPEG, or WebP image under 200 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      if (typeof image === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(image)) {
        this.avatarPreview.set(image);
      } else {
        this.errorMessage.set('Unable to read the picture.');
      }
    };
    reader.onerror = () => this.errorMessage.set('Unable to read the picture.');
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    const { username, fullName, email, password, cardLast4, preferences } = this.signupForm.getRawValue();
    const result = this.auth.register(fullName, email, password);
    this.isSubmitting.set(false);
    if (!result.success) {
      this.errorMessage.set(result.message);
      return;
    }
    const saved = this.signupProfile.save({
      username, pictureDataUrl: this.avatarPreview(), cardLast4,
      foodPreference: preferences,
    });
    if (!saved) {
      this.auth.logout();
      this.errorMessage.set('Demo profile could not be saved. Check browser storage and try again.');
      return;
    }
    void this.router.navigateByUrl('/profile');
  }
}
