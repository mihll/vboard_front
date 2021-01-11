import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective, NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  token: string;
  loading = false;
  submitted = false;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService
  ) {
    // redirects if token is missing from url
    if (!this.route.snapshot.queryParams.token) {
      this.router.navigate(['/']);
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
        Validators.pattern(/[a-z]/)])],
      repeatPassword: ['', Validators.required]
    }, {validators: checkPasswordsMismatch});

    this.token = this.route.snapshot.queryParams.token;
  }

  get f(): { [p: string]: AbstractControl } { return this.changePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.changePassword(this.f.password.value, this.token)
      .subscribe({
        next: () => {
          this.dialogService.openInfoDialog('Hasło zostało zmienione',
            'Twoje hasło zostało zmienione pomyślnie. Możesz się teraz zalogować za jego pomocą.',
            true , '/login');
        },
        error: error => {
          console.log(error);
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany hasła');
          this.loading = false;
        }
      });

  }
}

export const checkPasswordsMismatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');
  return password && repeatPassword && password.value !== repeatPassword.value ? { passwordMismatch: true } : null;
};

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}
