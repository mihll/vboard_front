import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.authenticationService.userValue;
    if (user) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with return url
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url }}).then(() => this.snackbarService.openErrorSnackbar('Musisz się zalogować, aby mieć dostęp do tej strony!'));
      return false;
    }
  }
}
