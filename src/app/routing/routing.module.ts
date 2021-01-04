import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyBoardsComponent} from '../components/my-boards/my-boards.component';
import {LoginComponent} from '../components/login/login.component';

const appRoutes: Routes = [
  {path: '', component: MyBoardsComponent},
  {path: 'login', component: LoginComponent}
  ];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
