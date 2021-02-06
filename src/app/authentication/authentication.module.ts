import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { LoginComponent } from './login/login.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ConfirmSignupComponent,
    LoginComponent,
    PasswordInputComponent,
    ResetPasswordComponent,
    SignupComponent,
  ],
  exports: [
    ChangePasswordComponent,
    ConfirmSignupComponent,
    LoginComponent,
    ResetPasswordComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    MatPasswordStrengthModule,
  ]
})
export class AuthenticationModule { }
