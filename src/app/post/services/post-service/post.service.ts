import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardPost, PostCreateRequest, PostCreateResponse, PostUpdateRequest } from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly apiURL = `${environment.apiUrl}/post`;

  constructor(private http: HttpClient) { }

  createPost(postCreateRequest: PostCreateRequest): Observable<PostCreateResponse> {
    return this.http.post<any>(`${this.apiURL}/create`, postCreateRequest);
  }

  getPostOfId(postId: string): Observable<BoardPost> {
    return this.http.get<any>(`${this.apiURL}/${postId}`);
  }

  editPost(postId: string, editPostRequest: PostUpdateRequest): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${postId}`, editPostRequest);
  }

  pinPost(postId: string): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${postId}/pin`, null);
  }

  unpinPost(postId: string): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${postId}/unpin`, null);
  }
}
