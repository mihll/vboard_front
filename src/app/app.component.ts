import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { UserAuth } from './models/user/userAuth';
import { AuthenticationService } from './services/authentication/authentication.service';
import {SnackbarService} from './services/snackbar/snackbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userAuth: UserAuth;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
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
}
