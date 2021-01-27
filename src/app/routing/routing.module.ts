import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBoardsComponent } from '../components/my-boards/my-boards.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../helpers/auth.guard';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { SignupComponent } from '../components/signup/signup.component';
import { ConfirmSignupComponent } from '../components/confirm-signup/confirm-signup.component';
import {NotAuthGuard} from '../helpers/not-auth.guard';

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [NotAuthGuard]},
  { path: 'landingPage', component: LandingPageComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'confirmSignup', component: ConfirmSignupComponent},
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'changePassword', component: ChangePasswordComponent},
  { path: 'myBoards', component: MyBoardsComponent, canActivate: [AuthGuard] },
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
