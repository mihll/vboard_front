import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SimpleInfoDialogComponent } from '../simple-info-dialog/simple-info-dialog.component';
import { SearchBoardDialogComponent } from '../../../board/search-board-dialog/search-board-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private router: Router,
    private matDialog: MatDialog
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

  openBoardSearchDialog(): MatDialogRef<unknown, any> {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.maxWidth = '90%';
    dialogConfig.width = '90%';

    return this.matDialog.open(SearchBoardDialogComponent, dialogConfig);
  }
}
