import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordChangeRequest} from '../../models/password/passwordChangeRequest';
import {UserService} from '../../services/user-service/user.service';
import {SnackbarService} from '../../../shared/snackbar/snackbar-service/snackbar.service';
import {checkPasswordsMismatch} from '../../../shared/password-input/password-input.component';
import {MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-user-password-settings',
  templateUrl: './user-password-settings.component.html',
  styleUrls: ['./user-password-settings.component.scss']
})
export class UserPasswordSettingsComponent implements OnInit {
  @ViewChild(MatExpansionPanel) panel: MatExpansionPanel;
  userPasswordForm: FormGroup;
  passwordChangeRequest: PasswordChangeRequest;
  noSpacesPattern = new RegExp('^\\S+$');
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userPasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
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
  }

  get f(): { [p: string]: AbstractControl } { return this.userPasswordForm.controls; }

  updateUserPassword(): void {
    // stop here if form is invalid
    if (this.userPasswordForm.invalid) {
      return;
    }

    this.passwordChangeRequest = {
      currentPassword: this.f.currentPassword.value,
      newPassword: this.f.password.value
    };

    this.userService.changePassword(this.passwordChangeRequest)
      .subscribe({
        next: () => {
          this.userPasswordForm.reset();
          this.snackbarService.openSuccessSnackbar('Pomyślnie zmieniono hasło');
          this.loading = false;
          this.panel.close();
        },
        error: err => {
          switch (err.error.errors.message) {
            case 'current_password.invalid':
              this.snackbarService.openErrorSnackbar('Podałeś nieprawidłowe aktualne hasło');
              this.f.currentPassword.setErrors({ wrongCurrentPassword: true });
              break;
            default:
              this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany hasła');
              break;
          }
          this.loading = false;
        }
      });

  }
}
