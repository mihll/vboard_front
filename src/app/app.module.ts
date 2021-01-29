import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RoutingModule } from './routing/routing.module';
import { MyBoardsComponent } from './components/my-boards/my-boards.component';
import { LoginComponent } from './components/login/login.component';
import { TestformComponent } from './testform/testform.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './components/shared/shared.module';
import { appInitializer } from './helpers/app.initializer';
import { AuthenticationService } from './services/authentication/authentication.service';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SnackbarService } from './services/snackbar/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CreateBoardComponent } from './components/create-board/create-board.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@NgModule({
  declarations: [
    AppComponent,
    MyBoardsComponent,
    LoginComponent,
    TestformComponent,
    LandingPageComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    SignupComponent,
    ConfirmSignupComponent,
    CreateBoardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RoutingModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatSnackBarModule,
    MatPasswordStrengthModule,
    MatMenuModule,
    MatGridListModule,
    MatRippleModule,
    FlexLayoutModule,
    NgxTrimDirectiveModule
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
