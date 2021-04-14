import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SimpleInfoDialogComponent } from '../simple-info-dialog/simple-info-dialog.component';
import { SearchBoardDialogComponent } from '../../../board/dialogs/search-board-dialog/search-board-dialog.component';
import { ChangeBoardOrderDialogComponent } from '../../../board/dialogs/change-board-order-dialog/change-board-order-dialog.component';
import { MyBoard } from '../../../board/models/board/board';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private router: Router,
    private matDialog: MatDialog
  ) { }

  openInfoDialog(dialogTitle: string, dialogDescription: string, shouldRedirectAfterClose: boolean, pathAfterClose?: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;

    dialogConfig.data = {
      title: dialogTitle,
      description: dialogDescription,
      redirectAfterClose: shouldRedirectAfterClose
    };

    const dialogRef = this.matDialog.open(SimpleInfoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(shouldRedirect => {
      if (shouldRedirect === true) {
        this.router.navigate([pathAfterClose ? pathAfterClose : '/']);
      }
    });
  }

  openYesNoDialog(dialogTitle: string, dialogDescription: string): MatDialogRef<unknown, any> {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;

    dialogConfig.data = {
      title: dialogTitle,
      description: dialogDescription,
    };

    return this.matDialog.open(YesNoDialogComponent, dialogConfig);
  }

  openBoardSearchDialog(): MatDialogRef<unknown, any> {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.maxWidth = '90%';
    dialogConfig.width = '90%';

    return this.matDialog.open(SearchBoardDialogComponent, dialogConfig);
  }

  openBoardOrderChangeDialog(joinedBoards: MyBoard[]): MatDialogRef<unknown, any> {
    const dialogConfig = new MatDialogConfig();

    const clonedJoinedBoards: MyBoard[] = [];
    joinedBoards.forEach(val => clonedJoinedBoards.push(Object.assign({}, val)));
    dialogConfig.data = clonedJoinedBoards;

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    return this.matDialog.open(ChangeBoardOrderDialogComponent, dialogConfig);
  }
}
