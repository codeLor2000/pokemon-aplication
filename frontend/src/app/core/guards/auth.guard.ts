import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Authentication guard to protect routes that require login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Redirect to login page with return URL
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
}; 