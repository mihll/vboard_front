import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailData } from '../../../shared/details-table/DetailData';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyBoard } from '../../models/board/board';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SnackbarService } from '../../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../../authentication/services/authentication-service/authentication.service';
import { BoardService } from '../../services/board-service/board.service';
import { BoardJoinRequest } from '../../models/board/boardJoinRequest';
import { formatDate } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-board-join-requests-dialog',
  templateUrl: './board-join-requests-dialog.component.html',
  styleUrls: ['./board-join-requests-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class BoardJoinRequestsDialogComponent implements OnInit {
  loading = true;
  didMakeChanges = false;

  joinRequests: BoardJoinRequest[];
  dataSource: MatTableDataSource<BoardJoinRequest> = new MatTableDataSource<BoardJoinRequest>();
  displayedColumns: string[] = ['name', 'expandIcon', 'requestDate', 'actions'];

  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }
  sortState: Sort = {active: '', direction: ''};

  expandedElement: BoardJoinRequest | null = null;
  detailsArraySubject: BehaviorSubject<DetailData[]> = new BehaviorSubject<DetailData[]>([]);
  detailsDataSource: MatTableDataSource<DetailData> = new MatTableDataSource<DetailData>();

  // BREAKPOINTS
  allVisibleBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 721px)')
    .pipe(
      map(result => result.matches)
    );

  requestDateBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 571px) and (max-width: 720px)'])
    .pipe(
      map(result => result.matches)
    );

  actionsBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 570px)'])
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private dialogRef: MatDialogRef<BoardJoinRequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentBoard: MyBoard,
    private breakpointObserver: BreakpointObserver,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private boardService: BoardService
  ) {
    dialogRef.beforeClosed().subscribe(() => dialogRef.close(this.didMakeChanges));
  }

  ngOnInit(): void {
    this.loadData();

    // BREAKPOINTS
    this.allVisibleBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'requestDate', 'actions'];
        this.joinRequests?.forEach(member => member.profilePictureLoading = true);
        this.detailsArraySubject.next([]);
        this.expandedElement = null;
      }
    });

    this.requestDateBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon', 'actions'];
        this.joinRequests?.forEach(member => member.profilePictureLoading = true);
        this.detailsArraySubject.next([
          new DetailData('Data prośby', ''),
        ]);
      }
    });

    this.actionsBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon'];
        this.joinRequests?.forEach(member => member.profilePictureLoading = true);
        this.detailsArraySubject.next([
          new DetailData('Data prośby', ''),
        ]);
      }
    });
  }

  loadData(): void {
    this.loading = true;

    this.boardService.getBoardJoinRequests(this.currentBoard.boardId)
      .subscribe({
        next: response => {
          this.joinRequests = response;
          this.dataSource.data = this.joinRequests;
          this.dataSource.sort = this.sort;
          this.sortState = {active: '', direction: ''};
          this.loading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych próśb o dołączenie!');
          this.dialogRef.close();
        }
      });
  }

  changeSortedColumn(): void {
    this.sort.active = this.sortState.active;
    this.sort.direction = this.sortState.direction;
    this.sort.sortChange.emit(this.sortState);
  }

  customSortCompare(o1: Sort, o2: Sort): boolean {
    if (o1.active === '' && o2.direction === '') { return true; }
    return o1.active === o2.active && o1.direction === o2.direction;
  }

  expandRow(element: BoardJoinRequest): void {
    this.detailsArraySubject.subscribe(detailsArray => {
      this.detailsDataSource.data = detailsArray.map(((value) => {
        switch (value.detailName){
          case 'Data prośby':
            value.detailData = formatDate(element.requestDate, 'mediumDate', 'pl');
            return value;
        }
        return value;
      }));
    });
    if (this.detailsArraySubject.getValue().length !== 0) {
      this.expandedElement = this.expandedElement === element ? null : element;
    }
  }

  acceptRequest(joinRequest: BoardJoinRequest): void {
    this.didMakeChanges = true;
    joinRequest.isDoingAction = true;

    this.boardService.acceptJoinRequest(this.currentBoard.boardId, joinRequest.userId)
      .subscribe({
        next: () => {
          this.removeRequestFromList(joinRequest);
          this.snackbarService.openSuccessSnackbar('Pomyślnie dodano użytkownika do tablicy');
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas akceptowania prośby!');
        }
      });
  }

  denyRequest(joinRequest: BoardJoinRequest): void {
    this.didMakeChanges = true;
    joinRequest.isDoingAction = true;

    this.boardService.denyJoinRequest(this.currentBoard.boardId, joinRequest.userId)
      .subscribe({
        next: () => {
          this.removeRequestFromList(joinRequest);
          this.snackbarService.openSuccessSnackbar('Pomyślnie odrzucono prośbę o dołączenie');
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas odrzucania prośby!');
        }
      });
  }

  removeRequestFromList(joinRequestToRemove: BoardJoinRequest): void {
    const index = this.dataSource.data.indexOf(joinRequestToRemove);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.dataSource.sort = this.sort;
  }
}
