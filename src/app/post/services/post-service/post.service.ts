import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardPost, PostCreateRequest, PostCreateResponse, PostLikeResponse, PostUpdateRequest } from '../../models/post';
import { map } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { CommentPostRequest, PostComment } from '../../models/postComment';

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

  getAllBoardPosts(boardId: string, page: number, sort: Sort): Observable<BoardPost[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('sortBy', sort.active)
      .set('direction', sort.direction);
    return this.http.get<any>(`${this.apiURL}/board/${boardId}/all`, {params})
      .pipe(map(response => response.posts));
  }

  searchBoardPosts(boardId: string, page: number, sort: Sort, searchText: string): Observable<BoardPost[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('sortBy', sort.active)
      .set('direction', sort.direction)
      .set('searchText', searchText);
    return this.http.get<any>(`${this.apiURL}/board/${boardId}/search`, {params})
      .pipe(map(response => response.posts));
  }

  getPinnedBoardPosts(boardId: string): Observable<BoardPost[]> {
    return this.http.get<any>(`${this.apiURL}/board/${boardId}/pinned`)
      .pipe(map(response => response.posts));
  }

  editPost(postId: string, editPostRequest: PostUpdateRequest): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${postId}`, editPostRequest);
  }

  pinPost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${postId}/pin`, null);
  }

  unpinPost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${postId}/unpin`, null);
  }

  likePost(postId: string): Observable<PostLikeResponse> {
    return this.http.post<any>(`${this.apiURL}/${postId}/like`, null);
  }

  unlikePost(postId: string): Observable<PostLikeResponse> {
    return this.http.post<any>(`${this.apiURL}/${postId}/unlike`, null);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${postId}`);
  }

  getPostComments(postId: string, page: number): Observable<PostComment[]> {
    const params = new HttpParams()
      .set('page', String(page));
    return this.http.get<any>(`${this.apiURL}/${postId}/comments`, {params})
      .pipe(map(response => response.comments));
  }

  commentPost(postId: string, commentPostRequest: CommentPostRequest): Observable<PostComment[]> {
    return this.http.post<any>(`${this.apiURL}/${postId}/comment`, commentPostRequest)
      .pipe(map(response => response.comments));
  }

  deleteComment(postId: string, commentId: string): Observable<PostComment[]> {
    return this.http.post<any>(`${this.apiURL}/${postId}/comment/${commentId}/delete`, null)
      .pipe(map(response => response.comments));
  }
}
