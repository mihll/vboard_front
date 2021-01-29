import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserAuth } from './models/user/userAuth';
import { AuthenticationService } from './services/authentication/authentication.service';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userAuth: UserAuth;
  @ViewChild('drawer', {static: false}) drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private snackbarService: SnackbarService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.userAuthObservable.subscribe(x => this.userAuth = x);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']).then(() => this.snackbarService.openSuccessSnackbar('Zostałeś wylogowany'));
  }

  closeSidenav(): void {
    this.isHandset$.subscribe(isVisible => {
      if (isVisible) {
        this.drawer.close();
      }
    }).unsubscribe();
  }
}
