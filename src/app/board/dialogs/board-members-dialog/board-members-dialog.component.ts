import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserAuth } from '../../../authentication/models/userAuth';
import { MyBoard } from '../../models/board/board';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailData } from '../../../shared/details-table/DetailData';
import { BoardMemberInfo } from '../../models/board/boardMember';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SnackbarService } from '../../../shared/snackbar/snackbar-service/snackbar.service';
import { DialogService } from '../../../shared/dialog/dialog-service/dialog.service';
import { AuthenticationService } from '../../../authentication/services/authentication-service/authentication.service';
import { BoardService } from '../../services/board-service/board.service';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-board-members-dialog',
  templateUrl: './board-members-dialog.component.html',
  styleUrls: ['./board-members-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class BoardMembersDialogComponent implements OnInit {
  userData: UserAuth;
  loading = false;

  boardMembers: BoardMemberInfo[];
  dataSource: MatTableDataSource<BoardMemberInfo> = new MatTableDataSource<BoardMemberInfo>();
  displayedColumns: string[] = ['name', 'expandIcon', 'joinDate', 'postsNumber' , 'didLeft', 'isAdmin', 'action'];

  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }
  sortState: Sort = {active: '', direction: ''};
  isSortSelectShown = false;

  expandedElement: BoardMemberInfo | null = null;
  detailsArraySubject: BehaviorSubject<DetailData[]> = new BehaviorSubject<DetailData[]>([]);
  detailsDataSource: MatTableDataSource<DetailData> = new MatTableDataSource<DetailData>();

  // BREAKPOINTS
  allVisibleBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 931px)')
    .pipe(
      map(result => result.matches)
    );

  postsNumberBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 831px) and (max-width: 930px)'])
    .pipe(
      map(result => result.matches)
    );

  joinDateBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 671px) and (max-width: 830px)'])
    .pipe(
      map(result => result.matches)
    );

  didLeftBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 501px) and (max-width: 670px)'])
    .pipe(
      map(result => result.matches)
    );

  isAdminBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 500px)')
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private dialogRef: MatDialogRef<BoardMembersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentBoard: MyBoard,
    private breakpointObserver: BreakpointObserver,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private boardService: BoardService,
  ) { }

  ngOnInit(): void {
    this.userData = this.authenticationService.userValue;

    this.loading = true;

    this.boardService.getBoardMembersInfo(this.currentBoard.boardId)
      .subscribe({
        next: response => {
          this.boardMembers = response;
          this.dataSource.data = this.boardMembers;
          this.dataSource.sort = this.sort;
          this.sortState = {active: '', direction: ''};
          this.loading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych członków tablicy!');
          this.dialogRef.close();
        }
      });

    // BREAKPOINTS
    this.allVisibleBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'joinDate', 'postsNumber' , 'didLeft', 'isAdmin'];
        if (this.currentBoard.isAdmin) {
          this.displayedColumns.push('action');
        }
        this.detailsArraySubject.next([]);
        this.expandedElement = null;
      }
    });
    this.postsNumberBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon', 'joinDate' , 'didLeft', 'isAdmin'];
        if (this.currentBoard.isAdmin) {
          this.displayedColumns.push('action');
        }
        this.detailsArraySubject.next([
          new DetailData('Liczba postów', ''),
        ]);
      }
    });
    this.joinDateBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon' , 'didLeft', 'isAdmin'];
        if (this.currentBoard.isAdmin) {
          this.displayedColumns.push('action');
        }
        this.detailsArraySubject.next([
          new DetailData('Liczba postów', ''),
          new DetailData('Data dołączenia', ''),
        ]);
      }
    });
    this.didLeftBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon', 'isAdmin'];
        if (this.currentBoard.isAdmin) {
          this.displayedColumns.push('action');
        }
        this.detailsArraySubject.next([
          new DetailData('Liczba postów', ''),
          new DetailData('Data dołączenia', ''),
          new DetailData('Opuścił tablicę', ''),
        ]);
      }
    });
    this.isAdminBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['name', 'expandIcon'];
        if (this.currentBoard.isAdmin) {
          this.displayedColumns.push('action');
        }
        this.detailsArraySubject.next([
          new DetailData('Liczba postów', ''),
          new DetailData('Data dołączenia', ''),
          new DetailData('Opuścił tablicę', ''),
          new DetailData('Administrator tablicy', ''),
        ]);
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

  expandRow(element: BoardMemberInfo): void {
    this.detailsArraySubject.subscribe(detailsArray => {
      this.detailsDataSource.data = detailsArray.map(((value) => {
        switch (value.detailName){
          case 'Liczba postów':
            value.detailData = element.postsNumber.toString();
            return value;
          case 'Data dołączenia':
            value.detailData = formatDate(element.joinDate, 'mediumDate', 'pl');
            return value;
          case 'Opuścił tablicę':
            value.detailData = element.didLeft ? 'Tak' : 'Nie' ;
            return value;
          case 'Administrator tablicy':
            value.detailData = element.isAdmin ? 'Tak' : 'Nie' ;
            return value;
        }
        return value;
      }));
    });
    if (this.detailsArraySubject.getValue().length !== 0) {
      this.expandedElement = this.expandedElement === element ? null : element;
    }
  }

}
