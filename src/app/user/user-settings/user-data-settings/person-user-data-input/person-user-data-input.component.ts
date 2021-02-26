import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '../../../models/user/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person-user-data-input',
  templateUrl: './person-user-data-input.component.html',
  styleUrls: ['./person-user-data-input.component.scss']
})
export class PersonUserDataInputComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() currentUser: User;
  @Input() isHandset$: Observable<boolean>;

  constructor() { }

  ngOnInit(): void {
  }

}
