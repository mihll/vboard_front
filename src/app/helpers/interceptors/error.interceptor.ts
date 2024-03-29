import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private matDialog: MatDialog,
              private snackBarService: SnackbarService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if ([0, 401].includes(err.status) && this.authenticationService.userValue) {
        // auto logout if 401 or 403 response returned from api
        this.authenticationService.logout();
        this.matDialog.closeAll();
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
