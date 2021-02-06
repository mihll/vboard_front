import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { IconSnackbarComponent } from './snackbar/icon-snackbar/icon-snackbar.component';
import { SimpleInfoDialogComponent } from './dialog/simple-info-dialog/simple-info-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
  ],
  exports: [
    LoadingSpinnerComponent,
    IconSnackbarComponent,
    SimpleInfoDialogComponent,
    RouterModule,
    NgxTrimDirectiveModule,
    FlexLayoutModule,
    FlexModule,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxTrimDirectiveModule,
    MaterialModule,
  ]
})
export class SharedModule { }
