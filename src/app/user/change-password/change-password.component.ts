import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { UserService } from '../services/user-service/user.service';
import { checkPasswordsMismatch } from '../../shared/password-input/password-input.component';
import { PasswordChangeRequest } from '../models/password/passwordChangeRequest';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  passwordChangeRequest: PasswordChangeRequest;
  token: string;
  loading = false;
  noSpacesPattern = new RegExp('^\\S+$');

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
    // redirects if token is missing from url or user is logged in
    if (!this.route.snapshot.queryParams.token) {
      this.router.navigate(['/']);
    }

    if (this.authenticationService.userValue) {
      this.router.navigate(['/']).then(() => this.snackbarService.openErrorSnackbar('Jesteś już zalogowany!'));
    }
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/\d/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(this.noSpacesPattern)
      ])],
      repeatPassword: ['', Validators.required]
    }, {validators: checkPasswordsMismatch});

    this.token = this.route.snapshot.queryParams.token;
  }

  get f(): { [p: string]: AbstractControl } { return this.changePasswordForm.controls; }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;

    this.passwordChangeRequest = {
      token: this.token,
      newPassword: this.f.password.value
    };

    this.userService.changePassword(this.passwordChangeRequest)
      .subscribe({
        next: () => {
          this.dialogService.openInfoDialog('Hasło zostało zmienione',
            'Twoje hasło zostało zmienione pomyślnie. Możesz się teraz zalogować za jego pomocą.',
            true , '/login');
        },
        error: err => {
          switch (err.error.errors.message) {
            case 'token.not.found':
              this.dialogService.openInfoDialog('Wystąpił błąd podczas zmiany hasła',
                'Ten link do zmiany hasła nie jest już aktywny. <br>' +
                'Aby zresetować hasło, wejdź na stronę logowania, a następnie wybierz opcję resetu hasła.',
                true , '/');
              break;
            default:
              this.dialogService.openInfoDialog('Wystąpił błąd podczas zmiany hasła',
                '',
                true , '/');
              break;
          }
        }
      });

  }
}
