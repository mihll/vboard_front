import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconSnackbarComponent } from './icon-snackbar/icon-snackbar.component';
import { MatIconModule } from '@angular/material/icon';
import { SimpleInfoDialogComponent } from './simple-info-dialog/simple-info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PasswordInputComponent } from './password-input/password-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
    PasswordInputComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
    PasswordInputComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPasswordStrengthModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
