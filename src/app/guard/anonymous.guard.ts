import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const anonymousGuard: CanActivateFn = (route, state) => {
  const noSession = !sessionStorage.getItem('session');
  if (!noSession) {
    const router = inject(Router);
    console.log('User has session');
    router.navigateByUrl('/');
  }
  return noSession;
};
