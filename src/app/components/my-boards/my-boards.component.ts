import {Component, OnInit} from '@angular/core';
import { Board } from '../../models/board/board';
import { BoardService } from '../../services/board/board.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  columns: number;
  joinedBoards: Board[];

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

}
