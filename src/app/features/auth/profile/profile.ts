import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { SignupProfileService } from '../../../core/services/signup-profile.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  readonly auth = inject(Auth);
  readonly signupProfile = inject(SignupProfileService);
  private readonly router = inject(Router);

  logout(): void {
    this.signupProfile.clearPrivateSession();
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
