import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BoardCreateRequest, BoardCreateResponse, BoardInfo, BoardLink, MyBoard, RequestedBoardInfo } from '../../models/board/board';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly apiURL = `${environment.apiUrl}/board`;

  constructor(private http: HttpClient) { }

  getBoardOfId(boardId: string): Observable<MyBoard> {
    return this.http.get<any>(`${this.apiURL}/${boardId}`);
  }

  getMyBoards(): Observable<MyBoard[]> {
    return this.http.get<any>(`${this.apiURL}/my`)
      .pipe(map(response => response.boards));
  }

  getRequestedBoards(): Observable<RequestedBoardInfo[]> {
    return this.http.get<any>(`${this.apiURL}/my/requested/`)
      .pipe(map(response => response.requestedBoards));
  }

  getBoardLinks(): Observable<BoardLink[]> {
    return this.http.get<any>(`${this.apiURL}/my/links`)
      .pipe(map(response => response.boardLinks));
  }

  findBoardsByName(boardNameToFind: string): Observable<BoardInfo[]> {
    const params = new HttpParams()
      .set('name', boardNameToFind);
    return this.http.get<any>(`${this.apiURL}/findByName`, {params})
      .pipe(map(response => response.boards));
  }

  createBoard(boardCreateRequest: BoardCreateRequest): Observable<BoardCreateResponse> {
    return this.http.post<any>(`${this.apiURL}/create`, boardCreateRequest);
  }

  joinBoard(boardId: string): Observable<BoardInfo> {
    return this.http.post<any>(`${this.apiURL}/join/${boardId}`, null);
  }

  revertBoardJoin(boardId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/revertJoin/${boardId}`, null);
  }

  changeBoardOrder(boardIds: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/changeOrder`, {boardIds});
  }
}
