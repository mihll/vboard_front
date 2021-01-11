import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SimpleInfoDialogComponent } from '../../components/shared/simple-info-dialog/simple-info-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private matDialog: MatDialog,
    private router: Router
  ) { }

  openInfoDialog(dialogTitle: string, dialogDescription: string, shouldReloadAfterClose: boolean, pathAfterClose?: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;

    dialogConfig.data = {
      title: dialogTitle,
      description: dialogDescription,
      reloadAfterClose: shouldReloadAfterClose
    };

    const dialogRef = this.matDialog.open(SimpleInfoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(shouldReload => {
      if (shouldReload === true) {
        this.router.navigate([pathAfterClose ? pathAfterClose : '/']);
      }
    });
  }
}
