import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { SnackbarService } from './shared/snackbar/snackbar-service/snackbar.service';
import { DialogService } from './shared/dialog/dialog-service/dialog.service';
import { AuthenticationService } from './authentication/services/authentication-service/authentication.service';
import { UserAuth } from './authentication/models/userAuth';
import { EmitterService } from './shared/emitter-service/emitter.service';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as polishStrings } from 'ngx-timeago/language-strings/pl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userAuth: UserAuth;
  profilePictureLoading = true;
  @ViewChild('drawer', {static: false}) drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  tabletWidthBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 800px)')
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private intl: TimeagoIntl,
              private emitterService: EmitterService,
              private snackbarService: SnackbarService,
              private dialogService: DialogService,
              private authenticationService: AuthenticationService) {
    intl.strings = polishStrings;
    intl.changes.next();
    this.authenticationService.userAuthObservable.subscribe(x => this.userAuth = x);
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']).then(() => this.snackbarService.openSuccessSnackbar('Zostałeś wylogowany'));
  }

  openSearch(): void {
    this.dialogService.openBoardSearchDialog().beforeClosed()
      .subscribe(() => {
        this.emitterService.emitReloadMyBoardsEvent();
      });
  }

  closeSidenav(): void {
    this.isHandset$.subscribe(isVisible => {
      if (isVisible) {
        this.drawer.close();
      }
    }).unsubscribe();
  }
}
