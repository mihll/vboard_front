import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!route.queryParams.token) {
      this.router.navigate(['/']).then(() => this.snackbarService.openErrorSnackbar('Nieprawidłowy link!'));
      return false;
    }

    return true;
  }

}
