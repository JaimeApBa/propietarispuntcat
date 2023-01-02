import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './components/shared/shared.module';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeCommunityComponent } from './components/home-communities/home-communities.component';
import { JoinCommunityComponent } from './components/join-community/join-community.component';
import { RegisterCommunityComponent } from './components/register-community/register-community.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterUserComponent,
    HomeCommunityComponent,
    JoinCommunityComponent,
    RegisterCommunityComponent,
    MenuComponent,
    UserProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
