import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { BoardService } from '../services/board-service/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardPublicInfo } from '../models/board/board';

@Component({
  selector: 'app-join-board',
  templateUrl: './join-board.component.html',
  styleUrls: ['./join-board.component.scss']
})
export class JoinBoardComponent implements OnInit {
  boardToJoin: BoardPublicInfo;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private boardService: BoardService,
  ) { }

  ngOnInit(): void {
    this.boardService.getBoardPublicInfo(this.route.snapshot.params.boardId).subscribe({
      next: boardInfoResponse => {
        this.boardToJoin = boardInfoResponse;
        this.loading = false;
        this.dialogService.openYesNoDialog(`Czy na pewno chcesz dołączyć do tablicy "${this.boardToJoin.boardName}"?`, null)
          .beforeClosed().subscribe(result => {
          if (result) {
            this.loading = true;

            this.boardService.joinBoard(this.boardToJoin.boardId)
              .subscribe({
                next: boardJoinResponse => {
                  if (boardJoinResponse.isRequested) {
                    this.router.navigate(['/myBoards']).then(() => this.snackbarService.openSuccessSnackbar('Pomyślnie przesłano prośbę o dołączenie'));
                  } else if (boardJoinResponse.isJoined) {
                    this.router.navigate(['/myBoards']).then(() => this.snackbarService.openSuccessSnackbar('Dołączono do tablicy'));
                  }
                },
                error: err => {
                  if (err.error.status === 'INVALID') {
                    this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Już należysz do tej tablicy!'));
                  } else if (err.error.status === 'DUPLICATE_ENTITY') {
                    this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Już przesłałeś prośbę o dołączenie do tej tablicy!'));
                  } else {
                    this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas wysłania prośby o dołączenie!'));
                  }
                }
              });
          } else {
            this.router.navigate(['/myBoards']);
          }
        });
      },
      error: () => {
        this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd!'));
      }
    });
  }

}
