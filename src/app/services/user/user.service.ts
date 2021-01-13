import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/resetPassword`, {email}, {withCredentials: true});
  }

  changePassword(password: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.post<any>(`${environment.apiUrl}/user/changePassword`, {password}, {params, withCredentials: true});
  }
}
