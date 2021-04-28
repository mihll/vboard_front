import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BoardCreateRequest, BoardCreateResponse, BoardInfo, BoardLink, MyBoard, RequestedBoardInfo } from '../../models/board/board';
import { map } from 'rxjs/operators';
import { BoardMemberInfo } from '../../models/board/boardMember';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly apiURL = `${environment.apiUrl}/board`;

  constructor(private http: HttpClient) { }

  getBoardOfId(boardId: string): Observable<MyBoard> {
    return this.http.get<any>(`${this.apiURL}/${boardId}`);
  }

  getBoardMembersInfo(boardId: string): Observable<BoardMemberInfo[]> {
    return this.http.get<any>(`${this.apiURL}/${boardId}/members`)
      .pipe(map(response => response.members));
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
    return this.http.post<any>(`${this.apiURL}/${boardId}/join`, null);
  }

  revertBoardJoin(boardId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/revertJoin`, null);
  }

  leaveBoard(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/leave`, null, {params});
  }

  changeBoardOrder(boardIds: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/changeOrder`, {boardIds});
  }
}
