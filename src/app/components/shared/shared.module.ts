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
import { BoardCardComponent } from './board-card/board-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
    PasswordInputComponent,
    BoardCardComponent,
  ],
  exports: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
    PasswordInputComponent,
    BoardCardComponent
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
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    RouterModule,
    MatRippleModule
  ]
})
export class SharedModule { }
