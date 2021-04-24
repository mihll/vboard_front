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
import { DialogService } from '../../../shared/dialog/dialog-service/dialog.service';
import { DetailData } from '../../../shared/details-table/DetailData';

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
  displayedColumns: string[] = ['boardName', 'expandIcon', 'createdDate', 'addressCity', 'addressPostCode', 'addressStreet', 'join'];

  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }
  sortState: Sort = {active: '', direction: ''};
  isSortSelectShown = false;

  expandedElement: BoardInfo | null = null;
  detailsArraySubject: BehaviorSubject<DetailData[]> = new BehaviorSubject<DetailData[]>([]);
  detailsDataSource: MatTableDataSource<DetailData> = new MatTableDataSource<DetailData>();

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

  createdDateBreakpoint$: Observable<boolean> = this.breakpointObserver.observe('(min-width: 501px) and (max-width: 640px)')
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
    private dialogService: DialogService,
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
        this.displayedColumns = ['boardName', 'expandIcon', 'createdDate', 'addressCity', 'addressPostCode', 'addressStreet', 'join'];
        this.detailsArraySubject.next([
          new DetailData('Opis', '')
        ]);
      }
    });
    this.addressStreetBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'createdDate', 'addressCity', 'addressPostCode', 'join'];
        this.detailsArraySubject.next([
          new DetailData('Opis', ''),
          new DetailData('Ulica', '')
        ]);
      }
    });
    this.addressPostCodeBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'createdDate', 'addressCity', 'join'];
        this.detailsArraySubject.next([
          new DetailData('Opis', ''),
          new DetailData('Ulica', ''),
          new DetailData('Kod pocztowy', '')
        ]);
      }
    });
    this.addressCityBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'createdDate', 'join'];
        this.detailsArraySubject.next([
          new DetailData('Opis', ''),
          new DetailData('Ulica', ''),
          new DetailData('Kod pocztowy', ''),
          new DetailData('Miasto', '')
        ]);
      }
    });
    this.createdDateBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon', 'join'];
        this.detailsArraySubject.next([
          new DetailData('Opis', ''),
          new DetailData('Ulica', ''),
          new DetailData('Kod pocztowy', ''),
          new DetailData('Miasto', ''),
          new DetailData('Data utworzenia', '')
        ]);
      }
    });
    this.joinBreakpoint$.subscribe(breakpoint => {
      if (breakpoint) {
        this.displayedColumns = ['boardName', 'expandIcon'];
        this.detailsArraySubject.next([
          new DetailData('Opis', ''),
          new DetailData('Ulica', ''),
          new DetailData('Kod pocztowy', ''),
          new DetailData('Miasto', ''),
          new DetailData('Data utworzenia', '')
        ]);
      }
    });
  }

  joinBoard(board: BoardInfo): void {
    this.dialogService.openYesNoDialog('Czy na pewno chcesz dołączyć do tej tablicy?', '')
      .beforeClosed().subscribe(result => {
      if (result) {
        board.isJoining = true;

        this.boardService.joinBoard(board.boardId)
          .subscribe({
            next: response => {
              board.isJoining = false;
              if (response.isRequested) {
                this.snackbarService.openSuccessSnackbar('Wysłano prośbę o dołączenie');
                board.isRequested = true;
              } else if (response.isJoined) {
                this.snackbarService.openSuccessSnackbar('Dołączono do tablicy');
                board.isJoined = true;
              }
            },
            error: () => {
              board.isJoining = false;
              this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas wysłania prośby o dołączenie!');
            }
          });
      }
    });
  }

  revertJoin(board: BoardInfo): void {
    this.dialogService.openYesNoDialog('Czy na pewno chcesz anulować prośbę o dołączenie?', '')
      .beforeClosed().subscribe(result => {
      if (result) {
        board.isReverting = true;
        this.boardService.revertBoardJoin(board.boardId).subscribe({
          next: () => {
            board.isRequested = false;
            board.isReverting = false;
            this.snackbarService.openSuccessSnackbar('Anulowano prośbę o dołączenie');
          },
          error: () => {
            board.isReverting = false;
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas anulowania prośby o dołączenie');
          }
        });
      }
    });
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
            value.detailData = formatDate(element.createdDate, 'mediumDate', 'pl');
            return value;
        }
        return value;
      }));
    });
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}
