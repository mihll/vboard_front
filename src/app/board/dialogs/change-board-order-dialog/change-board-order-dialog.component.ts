import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MyBoard} from '../../models/board/board';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardService} from '../../services/board-service/board.service';
import {AuthenticationService} from '../../../authentication/services/authentication-service/authentication.service';
import {SnackbarService} from '../../../shared/snackbar/snackbar-service/snackbar.service';

@Component({
  selector: 'app-change-board-order-dialog',
  templateUrl: './change-board-order-dialog.component.html',
  styleUrls: ['./change-board-order-dialog.component.scss']
})
export class ChangeBoardOrderDialogComponent implements OnInit {

  isOrderChanged = false;
  loading = false;

  constructor(private dialogRef: MatDialogRef<ChangeBoardOrderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public joinedBoards: MyBoard[],
              private authenticationService: AuthenticationService,
              private snackbarService: SnackbarService,
              private boardService: BoardService) { }

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex !== event.currentIndex){
      this.isOrderChanged = true;
    }
    moveItemInArray(this.joinedBoards, event.previousIndex, event.currentIndex);
  }

  changeOrder(): void {
    this.loading = true;
    const boardIds: string[] = this.joinedBoards.map(o => o.boardId);
    this.boardService.changeBoardOrder(boardIds)
      .subscribe({
        next: () => {
          this.loading = false;
          this.snackbarService.openSuccessSnackbar('Pomyślnie zmieniono kolejność tablic');
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany kolejności');
          this.loading = false;
        }
      });
  }

}
