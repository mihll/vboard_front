import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PersonUserSignupRequest, PersonUserUpdateRequest } from '../../models/user/personUser';
import { InstitutionUserSignupRequest, InstitutionUserUpdateRequest } from '../../models/user/institutionUser';
import { User } from '../../models/user/user';
import { PasswordChangeRequest } from '../../models/password/passwordChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiURL = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient
  ) { }

  getCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.apiURL}/me`);
  }

  updateUser(userUpdateRequest: PersonUserUpdateRequest | InstitutionUserUpdateRequest): Observable<User> {
    return this.http.put<any>(`${this.apiURL}/me`, userUpdateRequest);
  }

  deleteUserAccount(): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/me`);
  }

  changeProfilePic(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/changeProfilePic`, formData,  {
      reportProgress: true,
      observe: 'events'
    });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/resetPassword`, {email});
  }

  changePassword(passwordChangeRequest: PasswordChangeRequest): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/changePassword`, passwordChangeRequest);
  }

  signupUser(userSignupRequest: PersonUserSignupRequest | InstitutionUserSignupRequest): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/signup`, userSignupRequest);
  }

  confirmSignup(token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.get<any>(`${this.apiURL}/signup/confirm`, {params});
  }
}
