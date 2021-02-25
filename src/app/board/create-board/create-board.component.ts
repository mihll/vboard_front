import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { BoardService } from '../services/board-service/board.service';
import { BoardCreateRequest } from '../models/board/board';

@Component({
  selector: 'app-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  createBoardForm: FormGroup;
  createBoardRequest: BoardCreateRequest;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private boardService: BoardService
  ) {
  }

  ngOnInit(): void {
    this.createBoardForm = this.formBuilder.group({
      isPrivate: [true, Validators.required],
      boardName: ['', Validators.required],
      description: [null],
      addressCity: [null],
      addressPostCode: [null, Validators.pattern('[0-9]{2}-[0-9]{3}')],
      addressStreet: [null]
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.createBoardForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.createBoardForm.invalid) {
      return;
    }

    this.loading = true;
    this.createBoardRequest = {
      isPrivate: this.f.isPrivate.value,
      boardName: this.f.boardName.value,
      description: this.f.description.value,
      addressCity: this.f.addressCity.value,
      addressPostCode: this.f.addressPostCode.value,
      addressStreet: this.f.addressStreet.value
    };
    this.boardService.createBoard(this.createBoardRequest)
      .subscribe({
        next: response => {
          this.loading = false;
          this.authenticationService.refreshToken().subscribe();
          this.dialogService.openInfoDialog('Pomyślnie utworzono nową tablicę',
            'Twoja tablica została pomyślnie utworzona.<br>Zostaniesz na nią teraz przekierowany.', true, `/board/${response.boardId}`);
        },
        error: err => {
          if (err.error.status === 'DUPLICATE_ENTITY') {
            this.snackbarService.openErrorSnackbar('Tablica o podanej nazwie już istnieje');
            this.f.boardName.setErrors({ boardNameAlreadyUsed: true });
          } else {
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas tworzenia tablicy');
          }
          this.loading = false;
        }
      });
  }

}
