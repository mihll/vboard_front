import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardPublicInfo } from '../../models/board/board';

@Injectable({
  providedIn: 'root'
})
export class BoardMemberService {

  private readonly apiURL = `${environment.apiUrl}/boardMember`;

  constructor(private http: HttpClient) { }

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

  // join board
  joinBoard(boardId: string): Observable<BoardPublicInfo> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/join`, null);
  }

  revertBoardJoin(boardId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${boardId}/revertJoin`, null);
  }

  // boardMember leave/delete/restore
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

  deleteBoardMember(boardId: string, userId: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.delete<any>(`${this.apiURL}/${boardId}/deleteMember`, {params});
  }

  // manage board admins
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
}
