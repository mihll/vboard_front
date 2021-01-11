import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService
  ) {
    // redirects to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']).then(() => this.snackbarService.openSuccessSnackbar('Jesteś już zalogowany'));
    }
  }

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
    this.submitted = true;

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
          if ([401].includes(err.status)) {
            this.snackbarService.openErrorSnackbar('Nieprawidłowy adres e-mail lub hasło');
          } else {
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas logowania');
          }
          this.loading = false;
        }
      });

  }

}
