import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    // redirects to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  // convince getter for easy access to form fields
  get f(): { [p: string]: AbstractControl } { return this.resetPasswordForm.controls; }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
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
