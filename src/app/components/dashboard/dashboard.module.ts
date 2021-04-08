import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
// Components
import { DashboardComponent } from './dashboard.component';
import { CommunityComponent } from './community/community.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterCommunityComponent } from './register-community/register-community.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoinCommunityComponent } from './join-community/join-community.component';




@NgModule({
  declarations: [
    DashboardComponent,
    CommunityComponent,
    MenuComponent,
    RegisterCommunityComponent,
    JoinCommunityComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
