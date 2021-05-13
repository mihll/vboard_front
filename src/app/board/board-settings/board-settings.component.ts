import { Component, OnInit } from '@angular/core';
import { BoardSettingsData, BoardUpdateRequest, MyBoard } from '../models/board/board';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { BoardService } from '../services/board-service/board.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.component.html',
  styleUrls: ['./board-settings.component.scss']
})
export class BoardSettingsComponent implements OnInit {
  currentBoard: BoardSettingsData;
  loading = true;

  boardDataForm: FormGroup;
  updateBoardDataRequest: BoardUpdateRequest;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private boardService: BoardService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.loadBoardInfo(routeParams.boardId);
    });
  }

  loadBoardInfo(boardId: string): void {
    this.boardService.getBoardOfId(boardId).subscribe({
      next: response => {
        this.initializeModel(response);
        this.loading = false;
      },
      error: err => {
        if (err.error.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Nie jesteś administratorem tej tablicy!'));
        } else {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych tablicy'));
        }
      }
    });
  }

  initializeModel(receivedBoardData: MyBoard): void {
    this.currentBoard = receivedBoardData;
    this.boardDataForm = this.formBuilder.group({
      boardName: [this.currentBoard.boardName, Validators.required],
      description: [this.currentBoard.description],
      isPrivate: [this.currentBoard.isPrivate, Validators.required],
      acceptAll: [this.currentBoard.acceptAll, Validators.required],
      addressCity: [this.currentBoard.addressCity],
      addressPostCode: [this.currentBoard.addressPostCode, Validators.pattern('[0-9]{2}-[0-9]{3}')],
      addressStreet: [this.currentBoard.addressStreet]
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.boardDataForm.controls;
  }

  updateBoardData(): void {
    if (this.boardDataForm.invalid) {
      return;
    }

    this.loading = true;

    this.updateBoardDataRequest = {
      boardName: this.f.boardName.value,
      description: this.f.description.value,
      isPrivate: this.f.isPrivate.value,
      acceptAll: this.f.acceptAll.value,
      addressCity: this.f.addressCity.value,
      addressPostCode: this.f.addressPostCode.value,
      addressStreet: this.f.addressStreet.value
    };

    // check if user changed board privacy
    if (this.currentBoard.isPrivate !== this.f.isPrivate.value) {
      let warnText: string;
      if (this.f.isPrivate.value) {
        warnText = 'Po zmianie na tablicę prywatną, użytkownicy nie będą mogli już wyszukiwać twojej tablicy.';
      } else {
        warnText = 'Po zmianie na tablicę publiczną, wszyscy użytkownicy będą mogli wyszukiwać twoją tablicę.';
      }

      this.dialogService.openYesNoDialog('Czy na pewno chcesz zmienić typ tablicy?', warnText)
        .beforeClosed().subscribe(result => {
        if (result) {
          this.sendUpdateRequest();
        } else {
          this.loading = false;
        }
      });
    } else {
      this.sendUpdateRequest();
    }
  }

  sendUpdateRequest(): void {
    this.boardService.updateBoard(this.currentBoard.boardId, this.updateBoardDataRequest)
      .subscribe({
        next: response => {
          this.initializeModel(response);
          this.snackbarService.openSuccessSnackbar('Pomyślnie zmieniono dane tablicy');
          this.authenticationService.refreshToken().subscribe();
          this.loading = false;
        },
        error: err => {
          if (err.error.status === 'DUPLICATE_ENTITY') {
            this.snackbarService.openErrorSnackbar('Inna tablica o podanej nazwie już istnieje');
            this.f.boardName.setErrors({ boardNameAlreadyUsed: true });
          } else {
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany danych tablicy');
          }
          this.loading = false;
        }
      });
  }

  deleteBoard(): void {
    this.dialogService.openYesNoDialog('Czy na pewno usunąć tablicę?', 'Cała zawartość tablicy <b>ZOSTANIE</b> usunięta (wszystkie ogłoszenia, komentarze, polubienia itd.) <br>' +
      'Sprawdź czy na tablicy nie pozostały istotne informacje, przed jej usnięciem.<br>' +
      'Ta operacja jest <b>NIEODWRACALNA</b>.')
      .beforeClosed().subscribe(result => {
        if (result) {
          this.boardService.deleteBoard(this.currentBoard.boardId)
            .subscribe({
              next: () => {
                this.router.navigate(['/myBoards']).then(() => this.snackbarService.openSuccessSnackbar('Pomyślnie usunięto tablicę'));
              },
              error: () => {
                this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas usuwania tablicy!');
                this.loading = false;
              }
            });
        }
    });
  }
}
