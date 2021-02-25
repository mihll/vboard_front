import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {User} from '../../models/user/user';

@Component({
  selector: 'app-institution-user-data-input',
  templateUrl: './institution-user-data-input.component.html',
  styleUrls: ['./institution-user-data-input.component.scss']
})
export class InstitutionUserDataInputComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() currentUser: User;

  constructor() { }

  ngOnInit(): void {
  }

}
