import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyBoard } from '../../models/board/board';
import { DetailData } from '../../../shared/details-table/DetailData';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-board-info-dialog',
  templateUrl: './board-info-dialog.component.html',
  styleUrls: ['./board-info-dialog.component.scss']
})
export class BoardInfoDialogComponent implements OnInit {
  detailsArray: DetailData[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public board: MyBoard,
  ) { }

  ngOnInit(): void {
    this.detailsArray = [
      new DetailData('Nazwa', this.board.boardName),
      new DetailData('Opis', this.board.description),
      new DetailData('Ulica', this.board.addressStreet),
      new DetailData('Kod pocztowy', this.board.addressPostCode),
      new DetailData('Miasto', this.board.addressCity),
      new DetailData('Data utworzenia', formatDate(this.board.createdDate, 'mediumDate', 'pl')),
      new DetailData('Typ tablicy', this.board.isPrivate ? 'Prywatna' : 'Publiczna'),
      new DetailData('Liczba członków', String(this.board.boardMembers)),
      new DetailData('Liczba ogłoszeń', String(this.board.boardPostsCount))
    ];
  }

}
