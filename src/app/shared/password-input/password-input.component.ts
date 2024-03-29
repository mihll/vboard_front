import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() passwordLabel: string;
  @Input() repeatPasswordLabel: string;
  errorMatcher = new CrossFieldErrorMatcher();
  noSpacesPattern = new RegExp('^\\S+$');
  hidePassword = true;
  hideRepeatPassword = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

export const checkPasswordsMismatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');
  return password && repeatPassword && password.value !== repeatPassword.value ? { passwordMismatch: true } : null;
};
