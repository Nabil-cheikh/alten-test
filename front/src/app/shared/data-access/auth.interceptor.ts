import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  const token = authService.token();

  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        messageService.add({
          severity: 'warn',
          summary: 'Session expirée',
          detail: 'Veuillez vous reconnecter.',
          life: 5000
        });
        router.navigate(['/home']);
      } else if (error.status === 403) {
        messageService.add({
          severity: 'error',
          summary: 'Accès refusé',
          detail: 'Vous devez être connecté pour effectuer cette action.',
          life: 5000
        });
      }
      return throwError(() => error);
    })
  );
};
