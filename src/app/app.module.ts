import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { appInitializer } from './helpers/app.initializer';
import { JwtInterceptor } from './helpers/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './helpers/interceptors/error.interceptor';

import { LandingPageComponent } from './landing-page/landing-page.component';

import { SnackbarService } from './shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from './authentication/services/authentication-service/authentication.service';

import { AuthenticationModule } from './authentication/authentication.module';
import { BoardModule } from './board/board.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    AuthenticationModule,
    BoardModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [
    SnackbarService,
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService]},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
