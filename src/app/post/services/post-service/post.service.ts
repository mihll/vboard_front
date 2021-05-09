import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostCreateRequest, PostCreateResponse } from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly apiURL = `${environment.apiUrl}/post`;

  constructor(private http: HttpClient) { }

  createPost(postCreateRequest: PostCreateRequest): Observable<PostCreateResponse> {
    return this.http.post<any>(`${this.apiURL}/create`, postCreateRequest);
  }
}