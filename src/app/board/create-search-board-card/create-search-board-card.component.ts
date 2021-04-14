import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-search-board-card',
  templateUrl: './create-search-board-card.component.html',
  styleUrls: ['./create-search-board-card.component.scss']
})
export class CreateSearchBoardCardComponent implements OnInit {
  isHovered = false;
  isUpHovered = false;
  isDownHovered = false;

  @Output() openSearchDialogEvent = new EventEmitter();

  ngOnInit(): void {
  }

  openSearch(): void {
    this.openSearchDialogEvent.emit();
  }
}
