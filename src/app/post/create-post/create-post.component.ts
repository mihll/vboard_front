import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { PostCreateRequest } from '../models/post';
import { PostService } from '../services/post-service/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  createPostForm: FormGroup;
  createPostRequest: PostCreateRequest;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.createPostForm = this.formBuilder.group({
      postText: ['', Validators.required],
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.createPostForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.createPostForm.invalid) {
      return;
    }

    this.loading = true;

    this.createPostRequest = {
      boardId: this.route.snapshot.params.boardId,
      postText: this.f.postText.value,
    };

    this.postService.createPost(this.createPostRequest)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([`/board/${this.route.snapshot.params.boardId}`]).then(() => this.snackbarService.openSuccessSnackbar('Pomyślnie dodano ogłoszenie'));
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas dodawania ogłoszenia!');
          this.loading = false;
        }
      });
  }

}
