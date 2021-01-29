import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private snackBarService: SnackbarService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if ([0, 401, 403].includes(err.status) && this.authenticationService.userValue) {
        // auto logout if 401 or 403 response returned from api
        this.authenticationService.logout();
        this.router.navigate(['/']).then(() => this.snackBarService.openErrorSnackbar('Zostałeś wylogowany!'));
      }

      if ([401].includes(err.status) && request.url.startsWith(environment.apiUrl.concat('/refresh'))) {
        console.warn('User has not previously been logged in.');
      } else {
        console.error(err);
      }
      return throwError(err);
    }));
  }
}
