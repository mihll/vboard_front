import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Board } from '../../models/board/board';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly apiURL = `${environment.apiUrl}/board`;

  constructor(private http: HttpClient) { }

  getMyBoards(): Observable<Board[]> {
    return this.http.get<any>(`${this.apiURL}/my`)
      .pipe(map(response => response.joinedBoards));
  }
}
