import { Component, OnInit } from '@angular/core';
import { BoardPost } from '../models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { PostService } from '../services/post-service/post.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { MyBoard } from '../../board/models/board/board';
import { BoardService } from '../../board/services/board-service/board.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  currentPost: BoardPost;
  currentBoard: MyBoard;
  currentUserId = '';

  postLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private postService: PostService,
    private boardService: BoardService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
     this.currentUserId = this.authenticationService.userValue.userId;
     this.loadBoardInfo();
     this.loadPost();
  }

  loadBoardInfo(): void {
    this.postLoading = true;
    this.boardService.getBoardOfId(this.route.snapshot.params.boardId).subscribe({
      next: response => {
        this.currentBoard = response;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych tablicy'));
        }
      }
    });
  }

  loadPost(): void {
    this.postService.getPostOfId(this.route.snapshot.params.postId).subscribe({
      next: response => {
        this.currentPost = response;
        this.postLoading = false;
      },
      error: err => {
        if (err.error?.status === 'FORBIDDEN') {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
        } else {
          this.router.navigate(['/myBoards']).then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania danych ogłoszenia'));
        }
      }
    });
  }

  pinPost(): void {
    this.postLoading = true;

    this.postService.pinPost(this.currentPost.postId)
      .subscribe({
        next: () => {
          this.currentPost.isPinned = true;
          this.snackbarService.openSuccessSnackbar('Pomyślnie przypięto ogłoszenie');
          this.postLoading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas przypinania ogłoszenia!');
          this.postLoading = false;
        }
      });
  }

  unpinPost(): void {
    this.postLoading = true;

    this.postService.unpinPost(this.currentPost.postId)
      .subscribe({
        next: () => {
          this.currentPost.isPinned = false;
          this.snackbarService.openSuccessSnackbar('Pomyślnie odpięto ogłoszenie');
          this.postLoading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas odpinania ogłoszenia!');
          this.postLoading = false;
        }
      });
  }

  likePost(): void {
    this.currentPost.isDoingLike = true;

    this.postService.likePost(this.currentPost.postId)
      .subscribe({
        next: response => {
          this.currentPost.postLikesCount = response.postLikesCount;
          this.currentPost.isLiked = true;
          this.currentPost.isDoingLike = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd przesyłania polubienia!');
        }
      });
  }

  unlikePost(): void {
    this.currentPost.isDoingLike = true;

    this.postService.unlikePost(this.currentPost.postId)
      .subscribe({
        next: response => {
          this.currentPost.postLikesCount = response.postLikesCount;
          this.currentPost.isLiked = false;
          this.currentPost.isDoingLike = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd przesyłania polubienia!');
        }
      });
  }

  getCurrentUserId(): string {
    return this.authenticationService.userValue.userId;
  }
}
