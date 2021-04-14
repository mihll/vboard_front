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

@Component({
  selector: 'app-board-content',
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit {
  currentBoard: MyBoard;
  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;
  loading = true;

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
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.boardService.getBoardOfId(routeParams.id).subscribe({
        next: response => {
          this.currentBoard = response;
          this.loading = false;
        },
        error: err => {
          if (err.error.status === 'FORBIDDEN') {
            this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
          } else {
            this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych tablicy'));
          }
        }
      });
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

}
