import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user/user';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private refreshTokenTimeout;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/login`, {email, password}, {withCredentials: true})
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  logout(): void {
    this.http.post<any>(`${environment.apiUrl}/user/logout`, {}, {withCredentials: true}).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/refresh`, {}, {withCredentials: true})
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/resetPassword`, {email}, {withCredentials: true});
  }

  changePassword(password: string, token: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token);
    return this.http.post<any>(`${environment.apiUrl}/user/changePassword`, {password}, {params, withCredentials: true});
  }

  // helper methods

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.accessToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => {
      if (!environment.production){
        console.log('User access token refreshed!');
      }
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
