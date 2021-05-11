import { Component, OnInit } from '@angular/core';
import { MyBoard } from '../models/board/board';
import { Sort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DialogService } from '../../shared/dialog/dialog-service/dialog.service';
import { BoardService } from '../services/board-service/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackbarService } from '../../shared/snackbar/snackbar-service/snackbar.service';
import { AuthenticationService } from '../../authentication/services/authentication-service/authentication.service';
import { EmitterService } from '../../shared/emitter-service/emitter.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { BoardPost } from '../../post/models/post';
import { PostService } from '../../post/services/post-service/post.service';

@Component({
  selector: 'app-board-content',
  templateUrl: './board-content.component.html',
  styleUrls: ['./board-content.component.scss']
})
export class BoardContentComponent implements OnInit {
  currentBoard: MyBoard;
  allBoardPosts: BoardPost[] = [];
  currentBoardRequestPage = 0;
  pinnedBoardPosts: BoardPost[] = [];
  sortState: Sort = {active: '', direction: ''};
  sortBadge: string;
  boardLoading = true;

  pinnedPostsLoading = true;
  allPostsLoading = true;
  nextPageLoading = false;
  isLastPageLoaded = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private boardService: BoardService,
    private postService: PostService,
    private authenticationService: AuthenticationService,
    private emitterService: EmitterService,
    private clipboard: Clipboard
  ) {
    this.emitterService.shouldReloadCurrentBoardEmitter.subscribe(() => {
      this.loadBoardInfo(this.route.snapshot.params.boardId);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.loadBoardInfo(routeParams.boardId);
      this.loadPinnedBoardPosts(routeParams.boardId);
      this.loadAllBoardPosts(routeParams.boardId);
    });
  }

  reloadData(): void {
    this.sortState = {active: '', direction: ''};
    this.loadBoardInfo(this.currentBoard.boardId);
    this.loadPinnedBoardPosts(this.currentBoard.boardId);
    this.loadAllBoardPosts(this.currentBoard.boardId);
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

  loadPinnedBoardPosts(boardId: string): void {
    this.pinnedPostsLoading = true;
    this.postService.getPinnedBoardPosts(boardId).subscribe({
      next: response => {
        this.pinnedBoardPosts = response;
        this.pinnedPostsLoading = false;
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

  loadAllBoardPosts(boardId: string): void {
    this.currentBoardRequestPage = 0;
    this.isLastPageLoaded = false;
    this.allPostsLoading = true;
    this.postService.getAllBoardPosts(boardId, this.currentBoardRequestPage, this.sortState).subscribe({
      next: response => {
        if (response.length < 10) {
          this.isLastPageLoaded = true;
        }
        this.allBoardPosts = response;
        this.allPostsLoading = false;
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
    this.currentBoardRequestPage = Math.floor(this.allBoardPosts.length / 10);
    this.nextPageLoading = true;
    this.postService.getAllBoardPosts(this.currentBoard.boardId, this.currentBoardRequestPage, this.sortState).subscribe({
      next: response => {
        if (response.length < 10) {
          this.isLastPageLoaded = true;
        }
        this.allBoardPosts = this.allBoardPosts.concat(response);
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
    console.log(this.currentBoardRequestPage);
  }

  menuSortPosts(sortOption: Sort): void {
    this.sortState = sortOption;
    this.sortPosts();
  }

  sortPosts(): void {
    this.currentBoardRequestPage = 0;
    switch (this.sortState.active) {
      case 'postDate': {
        this.sortBadge = 'date_range';
        this.loadAllBoardPosts(this.currentBoard.boardId);
        break;
      }
      case 'lastActivity': {
        this.sortBadge = 'access_time';
        this.loadAllBoardPosts(this.currentBoard.boardId);
        break;
      }
      default: {
        this.sortBadge = null;
        this.loadAllBoardPosts(this.currentBoard.boardId);
      }
    }
  }

  customSortCompare(o1: Sort, o2: Sort): boolean {
    return o1.active === o2.active && o1.direction === o2.direction;
  }

  openBoardInfo(): void {
    this.dialogService.openBoardInfoDialog(this.currentBoard);
  }

  openBoardMembers(): void {
    this.dialogService.openBoardMembersDialog(this.currentBoard);
  }

  openBoardJoinRequests(): void {
    this.dialogService.openBoardJoinRequestsDialog(this.currentBoard).afterClosed()
        .subscribe( didMakeChanges => {
          if (didMakeChanges) {
            this.reloadData();
            this.authenticationService.refreshToken().subscribe();
          }
    });
  }

  shareBoard(): void {
    if (navigator.share) {
      navigator.share({
        text: `Dołącz do tablicy ogłoszeń "${this.currentBoard.boardName}" w serwisie VBoard!`,
        url: `localhost:4200/joinBoard/${this.currentBoard.boardId}`
      });
    } else {
      this.clipboard.copy(`Dołącz do tablicy ogłoszeń "${this.currentBoard.boardName}" w serwisie VBoard!
localhost:4200/joinBoard/${this.currentBoard.boardId}`);
      this.snackbarService.openSuccessSnackbar('Skopiowano link do schowka!');
    }
  }

  leaveBoard(): void {
    this.dialogService.openYesNoDialog('Czy na pewno opuścić tę tablicę?', 'Po opuszczeniu tablicy nie będziesz mógł już przeglądać jej zawartości, ani publikować nowych ogłoszeń. <br>' +
      'Żadne twoje ogłoszenia oraz twoje interakcje (komentarze, polubienia, głosy w ankietach itd.) <b>NIE</b> zostaną usunięte po opuszczeniu tablicy. <br><br>' +
      'Jeżeli chcesz usunąć swoją aktywność, skontatkuj się za administratorem tablicy.')
      .beforeClosed().subscribe(result => {
      if (result) {
        this.boardLoading = true;

        this.boardService.leaveBoard(this.currentBoard.boardId, this.authenticationService.userValue.userId)
          .subscribe({
            next: () => {
              this.authenticationService.refreshToken().subscribe();
              this.router.navigate(['/myBoards']).then(() => this.snackbarService.openSuccessSnackbar('Opuściłeś tablicę!'));
            },
            error: err => {
              this.boardLoading = false;
              if (err.error.status === 'FORBIDDEN') {
                this.dialogService.openInfoDialog('Nie możesz opuścić tablicy!', 'Nie możesz opuścić tej tablicy, ponieważ jesteś jej jedynym administratorem.', false);
              } else {
                this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas opuszczania tablicy!');
              }
            }
          });
      }
    });
  }

  pinPost(postToPin: BoardPost): void {
    this.boardLoading = true;

    this.postService.pinPost(postToPin.postId)
      .subscribe({
        next: () => {
          postToPin.isPinned = true;
          this.pinnedBoardPosts.push(postToPin);
          this.snackbarService.openSuccessSnackbar('Pomyślnie przypięto ogłoszenie');
          this.boardLoading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas przypinania ogłoszenia!');
          this.boardLoading = false;
        }
      });
  }

  unpinPost(postToUnpin: BoardPost): void {
    this.boardLoading = true;

    this.postService.unpinPost(postToUnpin.postId)
      .subscribe({
        next: () => {
          postToUnpin.isPinned = false;
          const postIndexInPinnedPosts = this.pinnedBoardPosts.indexOf(postToUnpin, 0);
          this.pinnedBoardPosts.splice(postIndexInPinnedPosts, 1);
          this.snackbarService.openSuccessSnackbar('Pomyślnie odpięto ogłoszenie');
          this.boardLoading = false;
        },
        error: () => {
          this.snackbarService.openErrorSnackbar('Wystąpił błąd podczas odpinania ogłoszenia!');
          this.boardLoading = false;
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
          this.updateAllPostsLikes(postToLike);
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
          this.updateAllPostsLikes(postToUnlike);
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

  updateAllPostsLikes(updatedPost: BoardPost): void {
    for (const pinnedPost of this.pinnedBoardPosts) {
      if (pinnedPost.postId === updatedPost.postId) {
        pinnedPost.postLikesCount = updatedPost.postLikesCount;
        pinnedPost.isLiked = updatedPost.isLiked;
      }
    }

    for (const post of this.allBoardPosts) {
      if (post.postId === updatedPost.postId) {
        post.postLikesCount = updatedPost.postLikesCount;
        post.isLiked = updatedPost.isLiked;
      }
    }
  }

}
