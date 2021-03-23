import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import 'hammerjs';

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
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';

import { MatNativeDateModule} from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl);

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
        UserModule,
        BoardModule,
        SharedModule,
        MaterialModule,
        MatNativeDateModule,
    ],
    providers: [
        SnackbarService,
        {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService]},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: LOCALE_ID, useValue: 'pl-PL'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
