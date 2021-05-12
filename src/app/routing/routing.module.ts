import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBoardsComponent } from '../board/my-boards/my-boards.component';
import { LoginComponent } from '../authentication/login/login.component';
import { AuthGuard } from '../helpers/guards/auth.guard';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { ResetPasswordComponent } from '../user/reset-password/reset-password.component';
import { ChangePasswordComponent } from '../user/change-password/change-password.component';
import { SignupComponent } from '../user/signup/signup.component';
import { ConfirmSignupComponent } from '../user/confirm-signup/confirm-signup.component';
import { NotAuthGuard } from '../helpers/guards/not-auth.guard';
import { CreateBoardComponent } from '../board/create-board/create-board.component';
import { UserSettingsComponent } from '../user/user-settings/user-settings.component';
import { BoardContentComponent } from '../board/board-content/board-content.component';
import { TokenGuard } from '../helpers/guards/token.guard';
import { BoardSettingsComponent } from '../board/board-settings/board-settings.component';
import { JoinBoardComponent } from '../board/join-board/join-board.component';
import { CreatePostComponent } from '../post/create-post/create-post.component';
import { EditPostComponent } from '../post/edit-post/edit-post.component';
import { SearchPostsComponent } from '../post/search-posts/search-posts.component';
import { PostDetailsComponent } from '../post/post-details/post-details.component';

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [NotAuthGuard]},
  { path: 'landingPage', component: LandingPageComponent},
  { path: 'login', component: LoginComponent , canActivate: [NotAuthGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [NotAuthGuard] },
  { path: 'confirmSignup', component: ConfirmSignupComponent, canActivate: [TokenGuard]},
  { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [NotAuthGuard]},
  { path: 'changePassword', component: ChangePasswordComponent, canActivate: [NotAuthGuard, TokenGuard]},
  { path: 'userSettings', component: UserSettingsComponent, canActivate: [AuthGuard]},
  { path: 'myBoards', component: MyBoardsComponent, canActivate: [AuthGuard] },
  { path: 'createBoard', component: CreateBoardComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId', component: BoardContentComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId/searchPosts', component: SearchPostsComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId/createPost', component: CreatePostComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId/post/:postId', component: PostDetailsComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId/post/:postId/edit', component: EditPostComponent, canActivate: [AuthGuard]},
  { path: 'board/:boardId/settings', component: BoardSettingsComponent, canActivate: [AuthGuard]},
  { path: 'joinBoard/:boardId', component: JoinBoardComponent, canActivate: [AuthGuard]},
  // otherwise redirect to landing page
  { path: '**', redirectTo: 'landingPage'}
  ];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
