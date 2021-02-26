import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { UserService } from '../services/user-service/user.service';
import { PersonUserSignupRequest } from '../models/user/personUser';
import { InstitutionUserSignupRequest } from '../models/user/institutionUser';
import { Observable } from 'rxjs';
import { checkPasswordsMismatch } from '../../shared/password-input/password-input.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterContentChecked {
  signupForm: FormGroup;
  userSignupRequest: PersonUserSignupRequest | InstitutionUserSignupRequest;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {
    // redirects to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      type: ['person', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      institutionName: [''],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        Validators.pattern(/\d/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern('^\\S+$')
      ])],
      repeatPassword: ['', Validators.required]
    }, {validators: [checkPasswordsMismatch]});

    this.signupForm.get('type').valueChanges.subscribe(value => {
      if (value === 'person') {
        this.signupForm.get('firstName').setValidators(Validators.required);
        this.signupForm.get('lastName').setValidators(Validators.required);
        this.signupForm.get('institutionName').clearValidators();
        this.signupForm.get('firstName').updateValueAndValidity();
        this.signupForm.get('lastName').updateValueAndValidity();
        this.signupForm.get('institutionName').updateValueAndValidity();
      }
      if (value === 'institution') {
        this.signupForm.get('firstName').clearValidators();
        this.signupForm.get('lastName').clearValidators();
        this.signupForm.get('institutionName').setValidators(Validators.required);
        this.signupForm.get('firstName').updateValueAndValidity();
        this.signupForm.get('lastName').updateValueAndValidity();
        this.signupForm.get('institutionName').updateValueAndValidity();
      }
    });
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.signupUser()
        .subscribe({
          next: () => {
            this.loading = false;
            this.dialogService.openInfoDialog('Rejestracja zakończona pomyślnie',
              'Na podany adres e-mail została wysłana wiadomość z łączem do potwierdzenia założonego konta.<br>Jeżeli nie potwierdzisz konta w ciągu 24 godzin, zostanie ono usunięte.', true);
          },
          error: err => {
            if (err.error.status === 'DUPLICATE_ENTITY') {
              this.snackbarService.openErrorSnackbar('Istnieje już konto o podanym adresie e-mail');
              this.f.email.setErrors({ emailAlreadyUsed: true });
            } else {
              this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas rejestracji');
            }
            this.loading = false;
          }
        });
  }

  signupUser(): Observable<any> {
    if (this.f.type.value === 'person') {
      this.userSignupRequest = {
        email: this.f.email.value,
        password: this.f.password.value,
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        userType: this.f.type.value
      };
    }

    if (this.f.type.value === 'institution') {
      this.userSignupRequest = {
        email: this.f.email.value,
        password: this.f.password.value,
        institutionName: this.f.institutionName.value,
        userType: this.f.type.value
      };
    }

    return this.userService.signupUser(this.userSignupRequest);
  }
}
