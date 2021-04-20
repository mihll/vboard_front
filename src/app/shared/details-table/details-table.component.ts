import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetailData } from './DetailData';

@Component({
  selector: 'app-details-table',
  templateUrl: './details-table.component.html',
  styleUrls: ['./details-table.component.scss']
})
export class DetailsTableComponent implements OnInit {
  detailsDataSource: MatTableDataSource<DetailData> = new MatTableDataSource<DetailData>();

  @Input() detailsArray: DetailData[] = [];

  constructor() { }

  ngOnInit(): void {
    this.detailsDataSource.data = this.detailsArray;
  }
}
