import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardService } from '../services/board-service/board.service';
import { MyBoard } from '../models/board/board';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  columns: number;
  joinedBoards: MyBoard[];
  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private matIconRegistry: MatIconRegistry,
    private boardService: BoardService,
    private domSanitizer: DomSanitizer
  ) {
    matIconRegistry.addSvgIcon(
      'sort_by_zeta',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/sort_by_zeta.svg')
    );
  }

  ngOnInit(): void {
    this.columns = window.innerWidth / 400;
    this.boardService.getMyBoards().subscribe(response => {
      this.joinedBoards = response;
    });
  }

  onResize(event): void {
    this.columns = event.target.innerWidth / 400;
  }

  menuSortBoards(sortOption: Sort): void {
    this.sortState = sortOption;
    this.sortBoards();
  }

  sortBoards(): void {
    switch (this.sortState.active) {
      case 'boardName': {
        this.sortByName();
        break;
      }
      case 'joinDate': {
        this.sortByJoinDate();
        break;
      }
      default: {
        // TODO: Save indexes on back-end and pass it in response
        this.sortBadge = null;
        this.boardService.getMyBoards().subscribe(response => {
          this.joinedBoards = response;
        });
      }
    }
  }

  sortByName(): void {
    this.sortBadge = 'font_download';
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
    this.sortBadge = 'date_range';
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

}
