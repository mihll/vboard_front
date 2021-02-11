import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardComponent } from './board-card/board-card.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { CreateSearchBoardCardComponent } from './create-search-board-card/create-search-board-card.component';
import { MyBoardsComponent } from './my-boards/my-boards.component';
import { SearchBoardDialogComponent } from './search-board-dialog/search-board-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    BoardCardComponent,
    CreateBoardComponent,
    CreateSearchBoardCardComponent,
    MyBoardsComponent,
    SearchBoardDialogComponent,
  ],
  exports: [
    CreateBoardComponent,
    MyBoardsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
  ]
})
export class BoardModule { }
