import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonUserSignupRequest } from '../../models/user/personUser';
import { InstitutionUserSignupRequest } from '../../models/user/institutionUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/resetPassword`, {email});
  }

  changePassword(password: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.post<any>(`${environment.apiUrl}/user/changePassword`, {password}, {params});
  }

  signupPersonUser(personUserSignupRequest: PersonUserSignupRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/signup/person`, personUserSignupRequest);
  }

  signupInstitutionUser(institutionUserSignupRequest: InstitutionUserSignupRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/signup/institution`, institutionUserSignupRequest);
  }

  confirmSignup(token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.get<any>(`${environment.apiUrl}/user/signup/confirm`, {params});
  }
}
