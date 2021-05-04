import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  BoardCreateRequest,
  BoardCreateResponse,
  BoardPublicInfo,
  BoardLink,
  BoardUpdateRequest,
  MyBoard,
  RequestedBoardInfo
} from '../../models/board/board';
import { map } from 'rxjs/operators';
import { BoardMemberInfo } from '../../models/board/boardMember';
import { BoardJoinRequest } from '../../models/board/boardJoinRequest';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private readonly apiURL = `${environment.apiUrl}/board`;

  constructor(private http: HttpClient) { }

  getBoardOfId(boardId: string): Observable<MyBoard> {
    return this.http.get<any>(`${this.apiURL}/${boardId}`);
  }

  getBoardPublicInfo(boardId: string): Observable<BoardPublicInfo> {
    return this.http.get<any>(`${this.apiURL}/${boardId}/publicInfo`);
  }

  getBoardMembersInfo(boardId: string): Observable<BoardMemberInfo[]> {
    return this.http.get<any>(`${this.apiURL}/${boardId}/members`)
      .pipe(map(response => response.members));
  }

  getBoardJoinRequests(boardId: string): Observable<BoardJoinRequest[]> {
    return this.http.get<any>(`${this.apiURL}/${boardId}/joinRequests`)
      .pipe(map(response => response.joinRequests));
  }

  acceptJoinRequest(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/joinRequest/accept`, null, {params});
  }

  denyJoinRequest(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/joinRequest/deny`, null, {params});
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

  findBoardsByName(boardNameToFind: string): Observable<BoardPublicInfo[]> {
    const params = new HttpParams()
      .set('name', boardNameToFind);
    return this.http.get<any>(`${this.apiURL}/findByName`, {params})
      .pipe(map(response => response.boards));
  }

  createBoard(boardCreateRequest: BoardCreateRequest): Observable<BoardCreateResponse> {
    return this.http.post<any>(`${this.apiURL}/create`, boardCreateRequest);
  }

  updateBoard(boardId: string, boardUpdateRequest: BoardUpdateRequest): Observable<MyBoard> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/update`, boardUpdateRequest);
  }

  joinBoard(boardId: string): Observable<BoardPublicInfo> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/join`, null);
  }

  revertBoardJoin(boardId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/revertJoin`, null);
  }

  grantBoardAdmin(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/grantAdmin`, null, {params});
  }

  revokeBoardAdmin(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/revokeAdmin`, null, {params});
  }

  leaveBoard(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/leave`, null, {params});
  }

  restoreBoardMember(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.post<any>(`${this.apiURL}/${boardId}/restoreMember`, null, {params});
  }

  changeBoardOrder(boardIds: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/changeOrder`, {boardIds});
  }
}
