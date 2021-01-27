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

  private readonly apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient
  ) { }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resetPassword`, {email});
  }

  changePassword(password: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.post<any>(`${this.apiUrl}/changePassword`, {password}, {params});
  }

  signupPersonUser(personUserSignupRequest: PersonUserSignupRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup/person`, personUserSignupRequest);
  }

  signupInstitutionUser(institutionUserSignupRequest: InstitutionUserSignupRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup/institution`, institutionUserSignupRequest);
  }

  confirmSignup(token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.get<any>(`${this.apiUrl}/signup/confirm`, {params});
  }
}
