import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { IconSnackbarComponent } from './snackbar/icon-snackbar/icon-snackbar.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { SimpleInfoDialogComponent } from './dialog/simple-info-dialog/simple-info-dialog.component';
import { MatBadgeIconDirective } from './directives/matBadgeIconDirective';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlexModule } from '@angular/flex-layout';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { SecurePipe } from '../helpers/pipes/secure.pipe';
import { YesNoDialogComponent } from './dialog/yes-no-dialog/yes-no-dialog.component';
import { TimeagoModule } from 'ngx-timeago';
import { SnackbarService } from './snackbar/snackbar-service/snackbar.service';
import { DialogService } from './dialog/dialog-service/dialog.service';
import { YES_NO_DIALOG_TOKEN } from '../injectionTokens';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    PasswordInputComponent,
    SimpleInfoDialogComponent,
    MatBadgeIconDirective,
    SecurePipe,
    YesNoDialogComponent,
  ],
  exports: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    PasswordInputComponent,
    SimpleInfoDialogComponent,
    MatBadgeIconDirective,
    RouterModule,
    NgxTrimDirectiveModule,
    FlexLayoutModule,
    FlexModule,
    SecurePipe,
    TimeagoModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxTrimDirectiveModule,
    MaterialModule,
    MatPasswordStrengthModule,
  ],
  providers: [
    SnackbarService,
    DialogService,
    {provide: YES_NO_DIALOG_TOKEN, useValue: YesNoDialogComponent}
  ]
})
export class SharedModule { }
