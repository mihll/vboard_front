import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconSnackbarComponent } from './icon-snackbar/icon-snackbar.component';
import { MatIconModule } from '@angular/material/icon';
import { SimpleInfoDialogComponent } from './simple-info-dialog/simple-info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class SharedModule { }
