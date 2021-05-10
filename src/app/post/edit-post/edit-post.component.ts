import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardPost, PostUpdateRequest } from '../models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { PostService } from '../services/post-service/post.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  currentPost: BoardPost;
  editPostForm: FormGroup;
  editPostRequest: PostUpdateRequest;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private postService: PostService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.loadPostInfo(routeParams.postId);
    });

    this.editPostForm = this.formBuilder.group({
      postText: ['', Validators.required],
    });
  }

  loadPostInfo(postId: string): void {
    this.postService.getPostOfId(postId).subscribe({
      next: response => {
        if (response.userId !== this.authenticationService.userValue.userId) {
          this.router.navigate([`/board/${this.route.snapshot.params.boardId}`]).then(() => this.snackbarService.openErrorSnackbar('Nie jesteś autorem tego ogłoszenia!'));
        }
        this.initializeModel(response);
        this.loading = false;
      },
      error: () => {
        this.router.navigate([`/board/${this.route.snapshot.params.boardId}`]).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych ogłoszenia!'));
      }
    });
  }

  initializeModel(receivedBoardPostData: BoardPost): void {
    this.currentPost = receivedBoardPostData;
    this.editPostForm = this.formBuilder.group({
      postText: [this.currentPost.postText, Validators.required],
    });
  }

  goBackToBoard(): void {
    this.router.navigate([`/board/${this.route.snapshot.params.boardId}`]);
  }

  get f(): { [p: string]: AbstractControl } {
    return this.editPostForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.editPostForm.invalid) {
      return;
    }

    this.loading = true;

    this.editPostRequest = {
      postText: this.f.postText.value,
    };

    this.postService.editPost(this.currentPost.postId, this.editPostRequest)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([`/board/${this.route.snapshot.params.boardId}`]).then(() => this.snackbarService.openSuccessSnackbar('Pomyślnie edytowano ogłoszenie'));
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas edytowania ogłoszenia!');
          this.loading = false;
        }
      });
  }

}
