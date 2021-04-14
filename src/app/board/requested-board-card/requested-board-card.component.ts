import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RequestedBoardInfo} from '../models/board/board';

@Component({
  selector: 'app-requested-board-card',
  templateUrl: './requested-board-card.component.html',
  styleUrls: ['./requested-board-card.component.scss']
})
export class RequestedBoardCardComponent implements OnInit {
  isHovered = false;

  @Input() board: RequestedBoardInfo;
  @Output() revertJoinEvent = new EventEmitter<RequestedBoardInfo>();

  constructor() { }

  ngOnInit(): void {
  }

  revertJoin(): void {
    this.revertJoinEvent.emit(this.board);
  }

}
