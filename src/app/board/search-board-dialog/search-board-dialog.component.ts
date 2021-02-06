import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { BoardService } from '../services/board-service/board.service';
import { FindBoardsByNameRequest } from '../models/board/board';

@Component({
  selector: 'app-search-board-dialog',
  templateUrl: './search-board-dialog.component.html',
  styleUrls: ['./search-board-dialog.component.scss']
})
export class SearchBoardDialogComponent implements OnInit {
  searchForm: FormGroup;
  findBoardsByNameRequest: FindBoardsByNameRequest;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      boardName: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      return;
    }

    this.loading = true;
    this.findBoardsByNameRequest = {
      boardName: this.f.boardName.value
    };
  }
}
