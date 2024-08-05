import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const withSessionGuard: CanActivateFn = (route, state) => {
  const hasSession = !!sessionStorage.getItem('session');
  if (!hasSession) {
    const router = inject(Router);
    alert('User is not authenticated');
    router.navigateByUrl('/login');
  }
  return true;
};

export const withSessionChildGuard:  CanActivateChildFn = (childRoute, state) => {
  const hasSession = !!sessionStorage.getItem('session');
  if (!hasSession) {
    const router = inject(Router);
    alert('User is not authenticated');
    router.navigateByUrl('/login');
  }
  return true;
}