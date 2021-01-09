import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyBoardsComponent } from '../components/my-boards/my-boards.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../helpers/auth.guard';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';

const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetPassword', component: ResetPasswordComponent},
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
