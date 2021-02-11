import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Board, BoardCreateRequest, BoardCreateResponse, BoardLink } from '../../models/board/board';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly apiURL = `${environment.apiUrl}/board`;

  constructor(private http: HttpClient) { }

  getMyBoards(): Observable<Board[]> {
    return this.http.get<any>(`${this.apiURL}/my`)
      .pipe(map(response => response.boards));
  }

  getBoardLinks(): Observable<BoardLink[]> {
    return this.http.get<any>(`${this.apiURL}/my/links`)
      .pipe(map(response => response.boardLinks));
  }

  findBoardsByName(boardNameToFind: string): Observable<Board[]> {
    const params = new HttpParams()
      .set('name', boardNameToFind);
    return this.http.get<any>(`${this.apiURL}/findByName`, {params})
      .pipe(map(response => response.boards));
  }

  createBoard(boardCreateRequest: BoardCreateRequest): Observable<BoardCreateResponse> {
    return this.http.post<any>(`${this.apiURL}/create`, boardCreateRequest);
  }
}
