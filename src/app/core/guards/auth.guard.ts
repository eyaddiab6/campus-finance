import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';
import type { UserRole } from '../models/campus.models';

// Allow only authenticated users.
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

// Allow only users with an authorized role.
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as UserRole[] | undefined;
  const user = auth.currentUser();

  if (user && allowedRoles?.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/profile']);
};