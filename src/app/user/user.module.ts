import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { PersonUserDataInputComponent } from './user-settings/person-user-data-input/person-user-data-input.component';
import { InstitutionUserDataInputComponent } from './user-settings/institution-user-data-input/institution-user-data-input.component';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ConfirmSignupComponent,
    ResetPasswordComponent,
    SignupComponent,
    UserSettingsComponent,
    PersonUserDataInputComponent,
    InstitutionUserDataInputComponent,
  ],
  exports: [
    ChangePasswordComponent,
    ConfirmSignupComponent,
    ResetPasswordComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
