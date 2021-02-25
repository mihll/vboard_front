import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user-service/user.service';
import { User } from '../models/user/user';
import { PersonUser, PersonUserUpdateRequest } from '../models/user/personUser';
import { InstitutionUser, InstitutionUserUpdateRequest } from '../models/user/institutionUser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  currentUser: PersonUser | InstitutionUser;
  userUpdateRequest: PersonUserUpdateRequest | InstitutionUserUpdateRequest;
  userDataForm: FormGroup;

  loading = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: response => {
        this.initializeModel(response);
        this.loading = false;
      }
    });
  }

  initializeModel(receivedUser: User): void {
    if (receivedUser.userType === 'person'){
      this.currentUser = receivedUser as PersonUser;
      this.userDataForm = this.formBuilder.group({
        firstName: [this.currentUser.firstName, Validators.required],
        lastName: [this.currentUser.lastName, Validators.required],
        birthDate: [this.currentUser.birthDate],
      });
    } else if (receivedUser.userType === 'institution') {
      this.currentUser = receivedUser as InstitutionUser;
      this.userDataForm = this.formBuilder.group({
        institutionName: [this.currentUser.institutionName, Validators.required],
        addressCity: [this.currentUser.addressCity],
        addressPostCode: [this.currentUser.addressPostCode, Validators.pattern('[0-9]{2}-[0-9]{3}')],
        addressStreet: [this.currentUser.addressStreet]
      });
    }
  }

  get f(): { [p: string]: AbstractControl } {
    return this.userDataForm.controls;
  }

  updateUserData(): void {
    if (this.userDataForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.currentUser.userType === 'person') {
      this.userUpdateRequest = {
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        birthDate: this.f.birthDate.value,
        userType: this.currentUser.userType
      };
    } else if (this.currentUser.userType === 'institution') {
      this.userUpdateRequest = {
        institutionName: this.f.institutionName.value,
        addressCity: this.f.addressCity.value,
        addressPostCode: this.f.addressPostCode.value,
        addressStreet: this.f.addressStreet.value,
        userType: this.currentUser.userType
      };
    } else {
      return;
    }

    this.userService.updateUser(this.userUpdateRequest)
      .subscribe({
        next: response => {
          this.authenticationService.refreshToken().subscribe();
          this.initializeModel(response);
          this.snackbarService.openSuccessSnackbar('Pomyślnie zmieniono dane użytkownika');
          this.loading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany danych użytkownika');
          this.loading = false;
        }
      });
  }

}
