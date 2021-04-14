import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/myBoards';
  }

  // convince getter for easy access to form fields
  get f(): { [p: string]: AbstractControl } { return this.loginForm.controls; }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]).then(() => this.snackbarService.openSuccessSnackbar('Zalogowano pomyślnie'));
        },
        error: err => {
          this.loginForm.reset();
          switch (err.error.message) {
            case 'Bad credentials':
              this.snackbarService.openErrorSnackbar('Nieprawidłowy adres e-mail lub hasło');
              break;
            case 'User is not verified':
              this.snackbarService.openErrorSnackbar('Użytkownik nie zweryfikował swojego adresu e-mail');
              break;
            case 'User is blocked':
              this.snackbarService.openErrorSnackbar('Użytkownik jest zablokowany');
              break;
            default:
              this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas logowania');
              break;
          }
          this.loading = false;
        }
      });
  }
}
