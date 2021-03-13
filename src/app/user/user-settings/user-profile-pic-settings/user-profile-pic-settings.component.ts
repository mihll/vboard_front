import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user/user';
import { UserService } from '../../services/user-service/user.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SnackbarService } from '../../../shared/snackbar/snackbar-service/snackbar.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AuthenticationService } from '../../../authentication/services/authentication-service/authentication.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-profile-pic-settings',
  templateUrl: './user-profile-pic-settings.component.html',
  styleUrls: ['./user-profile-pic-settings.component.scss']
})
export class UserProfilePicSettingsComponent implements OnInit {
  currentUser: User;
  profilePicLoading = true;
  shownProfilePicUrl: string;

  uploadingProfilePic = false;
  uploadProgress = 0;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  shouldDeleteCurrentProfilePic = false;

  formData: FormData;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.initializeUser();
  }

  initializeUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: response => {
        this.currentUser = response;
        this.shownProfilePicUrl = this.currentUser.profilePicUrl;
        this.profilePicLoading = false;
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.shouldDeleteCurrentProfilePic = false;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  loadImageFailed(): void {
    this.snackbarService.openErrorSnackbar('Wybrałeś zły typ pliku (dozwolone są tylko pliki PNG, GIF oraz JPEG)');
  }

  deleteCurrentProfilePicClicked(): void {
    this.shouldDeleteCurrentProfilePic = true;

    const lastSlashPosition = this.currentUser.profilePicUrl.lastIndexOf('/');
    const profilePicsUrl = this.currentUser.profilePicUrl.substring(0, lastSlashPosition);

    this.profilePicLoading = true;
    if (this.currentUser.userType === 'person') {
      this.shownProfilePicUrl = profilePicsUrl.concat('/defaultPersonProfilePic.jpg');
    } else if (this.currentUser.userType === 'institution') {
      this.shownProfilePicUrl = profilePicsUrl.concat('/defaultInstitutionProfilePic.jpg');
    }

    this.resetCropper();
  }

  onSubmit(): void {
    this.formData = new FormData();

    if (!this.shouldDeleteCurrentProfilePic) {
      const imageFile = this.base64ToFile(this.croppedImage, 'profilePic.jpg');
      this.formData.append('profilePic', imageFile);
    }

    this.uploadingProfilePic = true;

    this.userService.changeProfilePic(this.formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((_: HttpErrorResponse) => {
        this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas zmiany zdjęcia profilowego');
        this.uploadingProfilePic = false;
        return of(`upload failed.`);
      })).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.shouldDeleteCurrentProfilePic = false;
        this.resetCropper();
        this.authenticationService.refreshToken().subscribe();
        this.initializeUser();
        this.profilePicLoading = true;
        this.snackbarService.openSuccessSnackbar('Pomyślnie zmieniono zdjęcie profilowe');
        this.uploadingProfilePic = false;
      }
    });
  }

  resetCropper(): void {
    this.imageChangedEvent = null;
    this.croppedImage = '';
  }

  base64ToFile(data, filename): File {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
