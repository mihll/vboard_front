import { Component, OnInit } from '@angular/core';
import { Board } from '../../models/board/board';
import { BoardService } from '../../services/board/board.service';

@Component({
  selector: 'app-my-boards',
  templateUrl: './my-boards.component.html',
  styleUrls: ['./my-boards.component.scss']
})
export class MyBoardsComponent implements OnInit {
  columns: number;
  joinedBoards: Board[];

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.columns = window.innerWidth / 400;
    this.boardService.getMyBoards().subscribe(response => {
      this.joinedBoards = response;
      console.log(this.joinedBoards);
    });
  }

  onResize(event): void {
    this.columns = event.target.innerWidth / 400;
  }

}
