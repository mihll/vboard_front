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

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [NotAuthGuard]},
  { path: 'landingPage', component: LandingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'confirmSignup', component: ConfirmSignupComponent},
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'changePassword', component: ChangePasswordComponent},
  { path: 'userSettings', component: UserSettingsComponent, canActivate: [AuthGuard]},
  { path: 'myBoards', component: MyBoardsComponent, canActivate: [AuthGuard] },
  { path: 'createBoard', component: CreateBoardComponent, canActivate: [AuthGuard]},
  // otherwise redirect to landing page
  { path: '**', redirectTo: ''}
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
