import { Component, OnInit } from '@angular/core';
import { MyBoard } from '../../board/models/board/board';
import { BoardPost } from '../models/post';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { EmitterService } from '../../shared/emitter-service/emitter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { BoardService } from '../../board/services/board-service/board.service';
import { PostService } from '../services/post-service/post.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';

@Component({
  selector: 'app-search-posts',
  templateUrl: './search-posts.component.html',
  styleUrls: ['./search-posts.component.scss']
})
export class SearchPostsComponent implements OnInit {
  currentBoard: MyBoard;

  foundBoardPosts: BoardPost[] = [];
  currentSearchRequestPage = 0;

  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;

  boardLoading = true;
  searchPostsLoading = false;
  isSearchPerformed = false;

  nextPageLoading = false;
  isLastPageLoaded = false;

  currentSearchText = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private snackbarService: SnackbarService,
    private boardService: BoardService,
    private postService: PostService,
    private authenticationService: AuthenticationService,
    private emitterService: EmitterService,
  ) {
    this.emitterService.searchPostsEmitter.subscribe( searchText => {
      this.currentSearchText = searchText;
      this.searchBoardPosts();
    });
  }

  ngOnInit(): void {
    this.loadBoardInfo(this.route.snapshot.params.boardId);
  }

  loadBoardInfo(boardId: string): void {
    this.boardLoading = true;
    this.boardService.getBoardOfId(boardId).subscribe({
      next: response => {
        this.currentBoard = response;
        this.boardLoading = false;
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

  searchBoardPosts(): void {
    if (this.currentSearchText === '') {
      return;
    }
    this.currentSearchRequestPage = 0;
    this.searchPostsLoading = true;
    this.isLastPageLoaded = false;
    this.postService.searchBoardPosts(this.currentBoard.boardId, this.currentSearchRequestPage, this.sortState, this.currentSearchText)
      .subscribe({
        next: response => {
          this.isSearchPerformed = true;
          if (response.length < 10) {
            this.isLastPageLoaded = true;
          }
          this.foundBoardPosts = response;
          this.searchPostsLoading = false;
        },
        error: err => {
          if (err.error?.status === 'FORBIDDEN') {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
          } else {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania ogłoszeń!'));
          }
        }
      });
  }

  loadNextPage(): void {
    this.currentSearchRequestPage = Math.floor(this.foundBoardPosts.length / 10);
    this.nextPageLoading = true;
    this.postService.searchBoardPosts(this.currentBoard.boardId, this.currentSearchRequestPage, this.sortState, this.currentSearchText)
      .subscribe({
        next: response => {
          if (response.length < 10) {
            this.isLastPageLoaded = true;
          }
          this.foundBoardPosts = this.foundBoardPosts.concat(response);
          this.nextPageLoading = false;
        },
        error: err => {
          if (err.error?.status === 'FORBIDDEN') {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Nie należysz do tej tablicy!'));
          } else {
            this.router.navigate(['/myBoards'])
              .then(() => this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas pobierania ogłoszeń!'));
          }
        }
      });
  }

  menuSortPosts(sortOption: Sort): void {
    this.sortState = sortOption;
    this.sortPosts();
  }

  sortPosts(): void {
    this.currentSearchRequestPage = 0;
    switch (this.sortState.active) {
      case 'postDate': {
        this.sortBadge = 'date_range';
        this.searchBoardPosts();
        break;
      }
      case 'lastActivity': {
        this.sortBadge = 'access_time';
        this.searchBoardPosts();
        break;
      }
      default: {
        this.sortBadge = null;
        this.searchBoardPosts();
      }
    }
  }

  customSortCompare(o1: Sort, o2: Sort): boolean {
    return o1.active === o2.active && o1.direction === o2.direction;
  }

  pinPost(postToPin: BoardPost): void {
    this.postService.pinPost(postToPin.postId)
      .subscribe({
        next: () => {
          postToPin.isPinned = true;
          this.updateAllPosts(postToPin);
          this.snackbarService.openSuccessSnackbar('Pomyślnie przypięto ogłoszenie');
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas przypinania ogłoszenia!');
        }
      });
  }

  unpinPost(postToUnpin: BoardPost): void {
    this.postService.unpinPost(postToUnpin.postId)
      .subscribe({
        next: () => {
          postToUnpin.isPinned = false;
          this.updateAllPosts(postToUnpin);
          this.snackbarService.openSuccessSnackbar('Pomyślnie odpięto ogłoszenie');
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas odpinania ogłoszenia!');
        }
      });
  }

  likePost(postToLike: BoardPost): void {
    postToLike.isDoingLike = true;

    this.postService.likePost(postToLike.postId)
      .subscribe({
        next: response => {
          postToLike.postLikesCount = response.postLikesCount;
          postToLike.isLiked = true;
          this.updateAllPosts(postToLike);
          postToLike.isDoingLike = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd przesyłania polubienia!');
        }
      });
  }

  unlikePost(postToUnlike: BoardPost): void {
    postToUnlike.isDoingLike = true;

    this.postService.unlikePost(postToUnlike.postId)
      .subscribe({
        next: response => {
          postToUnlike.postLikesCount = response.postLikesCount;
          postToUnlike.isLiked = false;
          this.updateAllPosts(postToUnlike);
          postToUnlike.isDoingLike = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd przesyłania polubienia!');
        }
      });
  }

  getCurrentUserId(): string {
    return this.authenticationService.userValue.userId;
  }

  updateAllPosts(updatedPost: BoardPost): void {
    for (const post of this.foundBoardPosts) {
      if (post.postId === updatedPost.postId) {
        post.postLikesCount = updatedPost.postLikesCount;
        post.isLiked = updatedPost.isLiked;
        post.isPinned = updatedPost.isPinned;
      }
    }
  }

}
