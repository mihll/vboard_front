import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';

@Component({
  selector: 'app-create-search-board-card',
  templateUrl: './create-search-board-card.component.html',
  styleUrls: ['./create-search-board-card.component.scss']
})
export class CreateSearchBoardCardComponent implements OnInit {
  isHovered = false;
  isUpHovered = false;
  isDownHovered = false;

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  openSearch(): void {
    this.dialogService.openBoardSearchDialog();
  }
}
