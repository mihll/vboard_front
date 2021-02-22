import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../../authentication/services/authentication-service/authentication.service';
import { UserAuth } from '../../../authentication/models/userAuth';
import { BoardService } from '../../services/board-service/board.service';
import { BoardInfo } from '../../models/board/board';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-search-board-dialog',
  templateUrl: './search-board-dialog.component.html',
  styleUrls: ['./search-board-dialog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class SearchBoardDialogComponent implements OnInit {
  searchForm: FormGroup;
  userData: UserAuth;
  loading = false;

  foundBoards: BoardInfo[];
  dataSource: MatTableDataSource<BoardInfo> = new MatTableDataSource<BoardInfo>();
  displayedColumns: string[] = ['boardName', 'expandIcon', 'creationDate', 'addressCity', 'addressPostCode', 'addressStreet', 'join'];

  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }
  sortState: Sort = {active: '', direction: ''};
  isSortSelectShown = false;

  expandedElement: BoardInfo | null = null;
  detailsArraySubject: BehaviorSubject<BoardDetails[]> = new BehaviorSubject<BoardDetails[]>([]);
  detailsDataSource: MatTableDataSource<BoardDetails> = new MatTableDataSource<BoardDetails>();

  // BREAKPOINTS
  allVisibleBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 1101px)')
    .pipe(
      map(result => result.matches)
    );

  addressStreetBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 951px) and (max-width: 1100px)'])
    .pipe(
      map(result => result.matches)
    );

  addressPostCodeBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 831px) and (max-width: 950px)'])
    .pipe(
      map(result => result.matches)
    );

  addressCityBreakpoint$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 641px) and (max-width: 830px)'])
    .pipe(
      map(result => result.matches)
    );

  creationDateBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 501px) and (max-width: 640px)')
    .pipe(
      map(result => result.matches)
    );

  joinBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 500px)')
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private boardService: BoardService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      boardName: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.userData = this.authenticationService.userValue;

    // BREAKPOINTS
    this.allVisibleBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'creationDate', 'addressCity', 'addressPostCode', 'addressStreet', 'join'];
        this.detailsArraySubject.next([new BoardDetails('Opis', '')]);
      }
    });
    this.addressStreetBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'creationDate', 'addressCity', 'addressPostCode', 'join'];
        this.detailsArraySubject.next([new BoardDetails('Opis', ''),
          new BoardDetails('Ulica', '')]);
      }
    });
    this.addressPostCodeBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'creationDate', 'addressCity', 'join'];
        this.detailsArraySubject.next([new BoardDetails('Opis', ''),
          new BoardDetails('Ulica', ''),
          new BoardDetails('Kod pocztowy', '')]);
      }
    });
    this.addressCityBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'creationDate', 'join'];
        this.detailsArraySubject.next([new BoardDetails('Opis', ''),
          new BoardDetails('Ulica', ''),
          new BoardDetails('Kod pocztowy', ''),
          new BoardDetails('Miasto', '')]);
      }
    });
    this.creationDateBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'join'];
        this.detailsArraySubject.next([new BoardDetails('Opis', ''),
          new BoardDetails('Ulica', ''),
          new BoardDetails('Kod pocztowy', ''),
          new BoardDetails('Miasto', ''),
          new BoardDetails('Data utworzenia', '')]);
      }
    });
    this.joinBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon'];
        this.detailsArraySubject.next([new BoardDetails('Opis', ''),
          new BoardDetails('Ulica', ''),
          new BoardDetails('Kod pocztowy', ''),
          new BoardDetails('Miasto', ''),
          new BoardDetails('Data utworzenia', '')]);
      }
    });
  }

  isBoardJoined(board: BoardInfo): boolean {
    return this.userData.boardLinks.some(boardLink => boardLink.boardId === board.boardId);
  }

  isFoundBoards(): boolean {
    return this.foundBoards ? this.foundBoards.length !== 0 : false;
  }

  get f(): { [p: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  onSearch(): void {
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      return;
    }

    this.loading = true;

    this.boardService.findBoardsByName(this.f.boardName.value)
      .subscribe({
        next: response => {
          this.foundBoards = response;
          this.dataSource.data = this.foundBoards;
          this.dataSource.sort = this.sort;
          this.sortState = {active: '', direction: ''};
          this.loading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas wyszukiwania!');
          this.loading = false;
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

  expandRow(element: BoardInfo): void {
    this.detailsArraySubject.subscribe(detailsArray => {
      this.detailsDataSource.data = detailsArray.map(((value) => {
        switch (value.detailName){
          case 'Opis':
            value.detailData = element.description;
            return value;
          case 'Ulica':
            value.detailData = element.addressStreet;
            return value;
          case 'Kod pocztowy':
            value.detailData = element.addressPostCode;
            return value;
          case 'Miasto':
            value.detailData = element.addressCity;
            return value;
          case 'Data utworzenia':
            value.detailData = formatDate(element.creationDate, 'dd-MM-yyyy', 'en');
            return value;
        }
        return value;
      }));
    });
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}

export class BoardDetails {
  constructor(detailName: string, detailData: string) {
    this.detailName = detailName;
    this.detailData = detailData;
  }
  detailName: string;
  detailData: string;
}
