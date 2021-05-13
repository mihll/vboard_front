import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../shared/dialog/dialog-service/dialog.service';
import { UserService } from '../../services/user-service/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../../authentication/services/authentication-service/authentication.service';

@Component({
  selector: 'app-user-manage-settings',
  templateUrl: './user-manage-settings.component.html',
  styleUrls: ['./user-manage-settings.component.scss']
})
export class UserManageSettingsComponent implements OnInit {
  loading = false;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  deleteAccount(): void {
    this.dialogService.openYesNoDialog('Czy na pewno chcesz usunąć konto?', 'Cała twoja aktywność <b>ZOSTANIE</b> bezpowrotnie usunięta (wszystkie twoje ogłoszenia, komentarze, polubienia itd.) <br>' +
      'Sprawdź czy na twoich tablicach nie pozostały zamieszczone przez ciebie istotne informacje.<br>' +
      'Aby móc usunąc konto, nie możesz być aktywnym administratorem żadnej z tablic.<br>' +
      'Ta operacja jest <b>NIEODWRACALNA</b>.')
      .beforeClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.userService.deleteUserAccount()
          .subscribe({
            next: () => {
              this.authenticationService.logout();
              this.router.navigate(['/landingPage']).then(() => this.snackbarService.openSuccessSnackbar('Pomyślnie usunięto konto użytkownika'));
            },
            error: err => {
              if (err.error.status === 'FAILED') {
                this.dialogService.openInfoDialog('Nie możesz usunąć konta', 'Nie możesz usunąć swojego konta, ponieważ jesteś administratorem jednej z twoich tablic.', false);
              } else {
                this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas usuwania konta!');
              }
              this.loading = false;
            }
          });
      } else {

      }
    });
  }

}
