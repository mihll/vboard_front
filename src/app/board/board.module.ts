import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCardComponent } from './board-card/board-card.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { CreateSearchBoardCardComponent } from './create-search-board-card/create-search-board-card.component';
import { MyBoardsComponent } from './my-boards/my-boards.component';
import { SearchBoardDialogComponent } from './dialogs/search-board-dialog/search-board-dialog.component';
import { ChangeBoardOrderDialogComponent } from './dialogs/change-board-order-dialog/change-board-order-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BoardContentComponent } from './board-content/board-content.component';
import { RequestedBoardCardComponent } from './requested-board-card/requested-board-card.component';

@NgModule({
  declarations: [
    BoardCardComponent,
    CreateBoardComponent,
    CreateSearchBoardCardComponent,
    MyBoardsComponent,
    SearchBoardDialogComponent,
    ChangeBoardOrderDialogComponent,
    BoardContentComponent,
    RequestedBoardCardComponent,
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
        DragDropModule,
        MatTooltipModule
    ]
})
export class BoardModule { }
