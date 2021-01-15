import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAuth } from '../../models/user/userAuth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userAuthSubject: BehaviorSubject<UserAuth>;
  public userAuthObservable: Observable<UserAuth>;
  private refreshTokenTimeout;

  constructor(
    private http: HttpClient
  ) {
    this.userAuthSubject = new BehaviorSubject<UserAuth>(null);
    this.userAuthObservable = this.userAuthSubject.asObservable();
  }

  public get userValue(): UserAuth {
    return this.userAuthSubject.value;
  }

  login(email: string, password: string): Observable<UserAuth> {
    return this.http.post<any>(`${environment.apiUrl}/login`, {email, password}, {withCredentials: true})
      .pipe(map(user => {
        this.userAuthSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  logout(): void {
    this.http.post<any>(`${environment.apiUrl}/user/logout`, {}, {withCredentials: true}).subscribe();
    this.stopRefreshTokenTimer();
    this.userAuthSubject.next(null);
  }

  refreshToken(): Observable<UserAuth> {
    return this.http.post<any>(`${environment.apiUrl}/refresh`, {}, {withCredentials: true})
      .pipe(map(user => {
        this.userAuthSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
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
