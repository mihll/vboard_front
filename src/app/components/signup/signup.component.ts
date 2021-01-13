import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { checkPasswordsMismatch } from '../change-password/change-password.component';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterContentChecked {
  signupForm: FormGroup;
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

  get f(): { [p: string]: AbstractControl } { return this.signupForm.controls; }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.resetPassword(this.f.email.value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.dialogService.openInfoDialog('Reset hasła',
            'Na podany adres e-mail została wysłana wiadomość z łączem do zmiany hasła.', true);
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd');
          this.loading = false;
        }
      });

  }
}
