import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.parseUrl('/login');
  }

  return true;
};
