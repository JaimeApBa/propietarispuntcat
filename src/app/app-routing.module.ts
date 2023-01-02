import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeCommunityComponent } from './components/home-communities/home-communities.component';
import { RegisterCommunityComponent } from './components/register-community/register-community.component';
import { JoinCommunityComponent } from './components/join-community/join-community.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'registerUser', component: RegisterUserComponent},
  { path: 'registerUser/:user', component: RegisterUserComponent},
  { path: 'registerUser/:password', component: RegisterUserComponent},
  { path: 'home', component: HomeCommunityComponent},
  { path: 'registerCommunity', component: RegisterCommunityComponent},
  { path: 'joinCommunity/:cif', component: JoinCommunityComponent},
  { path: 'profile', component: UserProfileComponent},
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import(`./components/dashboard/dashboard.module`).then(m => m.DashboardModule)
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
