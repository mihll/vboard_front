import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { BoardService } from '../services/board-service/board.service';
import { MyBoard, RequestedBoardInfo } from '../models/board/board';
import { Sort } from '@angular/material/sort';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { EmitterService } from '../../shared/emitter-service/emitter.service';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  joinedBoards: MyBoard[] = [];
  requestedBoards: RequestedBoardInfo[] = [];
  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;
  loadingMyBoards = true;
  loadingRequestedBoards = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private emitterService: EmitterService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private boardService: BoardService
  ) {
    this.emitterService.shouldReloadMyBoardsEmitter.subscribe(() => {
      this.loadMyBoards();
      this.loadRequestedBoards();
    });
  }

  ngOnInit(): void {
    this.loadMyBoards();
    this.loadRequestedBoards();
  }

  loadMyBoards(): void {
    this.loadingMyBoards = true;
    this.boardService.getMyBoards().subscribe(response => {
      this.joinedBoards = response;
      this.sortState = {active: '', direction: ''};
      this.sortByOrderIndex();
      this.loadingMyBoards = false;
    });
  }

  loadRequestedBoards(): void {
    this.loadingRequestedBoards = true;
    this.boardService.getRequestedBoards().subscribe(response => {
      this.requestedBoards = response;
      this.loadingRequestedBoards = false;
    });
  }

  reloadClicked(): void {
    this.loadMyBoards();
    this.loadRequestedBoards();
  }

  openReorder(): void {
    this.dialogService.openBoardOrderChangeDialog(this.joinedBoards).beforeClosed()
      .subscribe(() => {
        this.loadMyBoards();
      });
  }

  openSearchDialog(): void {
    this.dialogService.openBoardSearchDialog().beforeClosed()
      .subscribe(() => {
        this.loadMyBoards();
        this.loadRequestedBoards();
      });
  }

  menuSortBoards(sortOption: Sort): void {
    this.sortState = sortOption;
    this.sortBoards();
  }

  sortBoards(): void {
    switch (this.sortState.active) {
      case 'boardName': {
        this.sortBadge = 'font_download';
        this.sortByName();
        break;
      }
      case 'joinDate': {
        this.sortBadge = 'date_range';
        this.sortByJoinDate();
        break;
      }
      default: {
        this.sortBadge = null;
        this.sortByOrderIndex();
      }
    }
  }

  sortByOrderIndex(): void {
    this.joinedBoards.sort((a, b) => {
      return a.orderIndex - b.orderIndex;
    });
  }

  sortByName(): void {
    if (this.sortState.direction === 'asc') {
      this.joinedBoards.sort((a, b) => {
        return a.boardName.localeCompare(b.boardName);
      });
    } else if (this.sortState.direction  === 'desc') {
      this.joinedBoards.sort((a, b) => {
        return b.boardName.localeCompare(a.boardName);
      });
    }
  }

  sortByJoinDate(): void {
    if (this.sortState.direction === 'asc') {
      this.joinedBoards.sort((a, b) => {
        return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      });
    } else if (this.sortState.direction  === 'desc') {
      this.joinedBoards.sort((a, b) => {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      });
    }
  }

  customSortCompare(o1: Sort, o2: Sort): boolean {
    return o1.active === o2.active && o1.direction === o2.direction;
  }

  revertJoin(board: RequestedBoardInfo): void {
    this.dialogService.openYesNoDialog('Czy na pewno chcesz anulować prośbę o dołączenie?', '')
      .beforeClosed().subscribe(result => {
        if (result) {
          board.isReverting = true;
          this.boardService.revertBoardJoin(board.boardId).subscribe({
            next: () => {
              this.loadRequestedBoards();
              this.snackbarService.openSuccessSnackbar('Anulowano prośbę o dołączenie');
            },
            error: () => {
              this.loadRequestedBoards();
              this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas anulowania prośby o dołączenie');
            }
          });
        }
    });
  }

}
