import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'registerUser', component: RegisterUserComponent},
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
