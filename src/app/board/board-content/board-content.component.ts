import { Component, OnInit } from '@angular/core';
import { MyBoard } from '../models/board/board';
import { Sort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { BoardService } from '../services/board-service/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { EmitterService } from '../../shared/emitter-service/emitter.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { BoardPost } from '../../post/models/post';

@Component({
  selector: 'app-board-content',
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit {
  currentBoard: MyBoard;
  allBoardPosts: BoardPost[] = [];
  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;
  boardLoading = true;
  postsLoading = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private boardService: BoardService,
    private authenticationService: AuthenticationService,
    private emitterService: EmitterService,
    private clipboard: Clipboard
  ) {
    this.emitterService.shouldReloadCurrentBoardEmitter.subscribe(() => {
      this.loadBoardInfo(this.route.snapshot.params.id);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.loadBoardInfo(routeParams.id);
      this.loadAllBoardPosts(routeParams.id);
    });
  }

  reloadData(): void {
    this.loadBoardInfo(this.currentBoard.boardId);
    this.loadAllBoardPosts(this.currentBoard.boardId);
  }

  loadBoardInfo(id: string): void {
    this.boardLoading = true;
    this.boardService.getBoardOfId(id).subscribe({
      next: response => {
        this.currentBoard = response;
        this.boardLoading = false;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych tablicy'));
        }
      }
    });
  }

  loadAllBoardPosts(id: string): void {
    this.postsLoading = true;
    this.boardService.getAllBoardPosts(id).subscribe({
      next: response => {
        this.allBoardPosts = response;
        this.postsLoading = false;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards'])
            .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.router.navigate(['/myBoards'])
            .then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania ogłoszeń!'));
        }
      }
    });
  }

  menuSortPosts(sortOption: Sort): void {
    this.sortState = sortOption;
    this.sortPosts();
  }

  sortPosts(): void {
    switch (this.sortState.active) {
      case 'postDate': {
        this.sortBadge = 'font_download';
        break;
      }
      case 'lastActivity': {
        this.sortBadge = 'date_range';
        break;
      }
      default: {
        this.sortBadge = null;
      }
    }
  }

  customSortCompare(o1: Sort, o2: Sort): boolean {
    return o1.active === o2.active && o1.direction === o2.direction;
  }

  openBoardInfo(): void {
    this.dialogService.openBoardInfoDialog(this.currentBoard);
  }

  openBoardMembers(): void {
    this.dialogService.openBoardMembersDialog(this.currentBoard);
  }

  openBoardJoinRequests(): void {
    this.dialogService.openBoardJoinRequestsDialog(this.currentBoard).afterClosed()
        .subscribe( didMakeChanges => {
          if (didMakeChanges) {
            this.reloadData();
            this.authenticationService.refreshToken().subscribe();
          }
    });
  }

  shareBoard(): void {
    if (navigator.share) {
      navigator.share({
        text: `Dołącz do tablicy ogłoszeń "${this.currentBoard.boardName}" w serwisie VBoard!`,
        url: `localhost:4200/joinBoard/${this.currentBoard.boardId}`
      });
    } else {
      this.clipboard.copy(`Dołącz do tablicy ogłoszeń "${this.currentBoard.boardName}" w serwisie VBoard!
localhost:4200/joinBoard/${this.currentBoard.boardId}`);
      this.snackbarService.openSuccessSnackbar('Skopiowano link do schowka!');
    }
  }

  leaveBoard(): void {
    this.dialogService.openYesNoDialog('Czy na pewno opuścić tę tablicę?', 'Po opuszczeniu tablicy nie będziesz mógł już przeglądać jej zawartości, ani publikować nowych ogłoszeń. <br>' +
      'Żadne twoje ogłoszenia oraz twoje interakcje (komentarze, polubienia, głosy w ankietach itd.) <b>NIE</b> zostaną usunięte po opuszczeniu tablicy. <br><br>' +
      'Jeżeli chcesz usunąć swoją aktywność, skontatkuj się za administratorem tablicy.')
      .beforeClosed().subscribe(result => {
      if (result) {
        this.boardLoading = true;

        this.boardService.leaveBoard(this.currentBoard.boardId, this.authenticationService.userValue.userId)
          .subscribe({
            next: () => {
              this.authenticationService.refreshToken().subscribe();
              this.router.navigate(['/myBoards']).then(() => this.snackbarService.openSuccessSnackbar('Opuściłeś tablicę!'));
            },
            error: err => {
              this.boardLoading = false;
              if (err.error.status === 'FORBIDDEN') {
                this.dialogService.openInfoDialog('Nie możesz opuścić tablicy!', 'Nie możesz opuścić tej tablicy, ponieważ jesteś jej jedynym administratorem.', false);
              } else {
                this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas opuszczania tablicy!');
              }
            }
          });
      }
    });
  }

}
