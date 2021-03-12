import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user/user';
import {UserService} from '../../services/user-service/user.service';

@Component({
  selector: 'app-user-profile-pic-settings',
  templateUrl: './user-profile-pic-settings.component.html',
  styleUrls: ['./user-profile-pic-settings.component.scss']
})
export class UserProfilePicSettingsComponent implements OnInit {
  currentUser: User;
  profilePictureLoading = false;
  loading = true;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: response => {
        this.currentUser = response;
        this.loading = false;
      }
    });
  }
}
