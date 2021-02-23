import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user-service/user.service';
import {PersonUser} from '../models/user/personUser';
import {InstitutionUser} from '../models/user/institutionUser';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  currentPersonUser: PersonUser;
  currentInstitutionUser: InstitutionUser;

  personUserDataForm: FormGroup;
  personUserDataUpdateRequest;

  institutionUserDataForm: FormGroup;
  institutionUserDataUpdateRequest;

  loading = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: response => {
        if ((response as PersonUser).firstName){
          this.currentPersonUser = response as PersonUser;
          this.personUserDataForm = this.formBuilder.group({
            firstName: [this.currentPersonUser.firstName, Validators.required],
            lastName: [this.currentPersonUser.lastName, Validators.required],
            birthDate: [this.currentPersonUser.birthDate],
          });
        } else if ((response as InstitutionUser).institutionName) {
          this.currentInstitutionUser = response as InstitutionUser;
          this.institutionUserDataForm = this.formBuilder.group({
            institutionName: [this.currentInstitutionUser.institutionName, Validators.required],
            addressCity: [this.currentInstitutionUser.addressCity],
            addressStreet: [this.currentInstitutionUser.addressStreet],
            addressPostCode: [this.currentInstitutionUser.addressPostCode]
          });
        }
        this.loading = false;
      }
    });
  }

  get personF(): { [p: string]: AbstractControl } {
    return this.personUserDataForm.controls;
  }

  updatePeronUserData(): void {
    if (this.personUserDataForm.invalid) {
      return;
    }

    this.loading = true;
  }

}
