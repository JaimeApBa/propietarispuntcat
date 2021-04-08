import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { RegisterCommunityComponent } from './register-community/register-community.component';
import { JoinCommunityComponent } from './join-community/join-community.component';

const routes: Routes = [
  {path: 'dashboard', component: CommunityComponent},
  {path: 'registerCommunity', component: RegisterCommunityComponent},
  {path: 'joinCommunity/:cif', component: JoinCommunityComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
