import { Component, Input, OnInit } from '@angular/core';
import { CommentPostRequest, PostComment } from '../models/postComment';
import { BoardPost } from '../models/post';
import { PostService } from '../services/post-service/post.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {
  postComments: PostComment[] = [];
  loadingComments = true;

  isLastPageLoaded = false;
  currentCommentsPage = 0;

  commentPostForm: FormGroup;
  commentPostRequest: CommentPostRequest;
  submittingComment = false;

  @Input() post: BoardPost;
  @Input() currentUserId: string;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private postService: PostService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadComments();
    this.commentPostForm = this.formBuilder.group({
      commentText: ['', Validators.required],
    });
  }

  loadComments(): void {
    this.currentCommentsPage = 0;
    this.loadingComments = true;
    this.postService.getPostComments(this.post.postId, this.currentCommentsPage).subscribe({
      next: response => {
        this.isLastPageLoaded = response.length < 5;
        this.postComments = response.reverse();
        this.loadingComments = false;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards'])
            .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania komentarzy!');
        }
      }
    });
  }

  loadNextPage(): void {
    this.currentCommentsPage = Math.floor(this.postComments.length / 5);
    this.loadingComments = true;
    this.postService.getPostComments(this.post.postId, this.currentCommentsPage).subscribe({
      next: response => {
        if (response.length < 5) {
          this.isLastPageLoaded = true;
        }
        this.postComments = response.reverse().concat(this.postComments);
        this.loadingComments = false;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards'])
            .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania komentarzy!');
        }
      }
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.commentPostForm.controls;
  }

  onCommentSubmit(formDirective: FormGroupDirective): void {
    if (this.commentPostForm.invalid) {
      return;
    }

    this.commentPostRequest = {
      commentText: this.f.commentText.value
    };

    this.submittingComment = true;
    this.postService.commentPost(this.post.postId, this.commentPostRequest)
      .subscribe({
        next: response => {
          formDirective.resetForm();
          this.commentPostForm.reset();
          this.isLastPageLoaded = response.length < 5;
          this.postComments = response.reverse();
          this.currentCommentsPage = 0;
          this.submittingComment = false;
        },
        error: err => {
          if (err.error?.status === 'FORBIDDEN') {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
          } else {
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas przesyłania komentarza!');
          }
        }
      });
  }

  deleteComment(commentToDelete: PostComment): void {
    commentToDelete.isDoingAction = true;

    this.postService.deleteComment(this.post.postId, commentToDelete.commentId)
      .subscribe({
        next: response => {
          this.isLastPageLoaded = response.length < 5;
          this.postComments = response.reverse();
          this.currentCommentsPage = 0;
          this.snackbarService.openSuccessSnackbar('Pomyślnie usunięto komentarz');
        },
        error: err => {
          if (err.error?.status === 'FORBIDDEN') {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
          } else {
            this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas usuwania komentarza!');
          }
        }
      });
  }

}
