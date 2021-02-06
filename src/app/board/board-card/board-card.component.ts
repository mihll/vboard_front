import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/board/board';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit {
  isHovered = false;

  @Input() board: Board;

  constructor() { }

  ngOnInit(): void {
  }

}
