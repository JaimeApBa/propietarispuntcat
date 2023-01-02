import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
// Components
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunityComponent } from './community/community.component';
import { MenuCommunityComponent } from './menu-community/menu-community.component';
import { HttpClientModule } from '@angular/common/http';
import { ProvidersComponent } from './providers/providers.component';
import { RegisterProviderComponent } from './register-provider/register-provider.component';
import { DocumentsComponent } from './documents/documents.component';
import { RegisterDocumentComponent } from './register-document/register-document.component';
import { RegisterProfessionComponent } from './register-profession/register-profession.component';
import { RefurbishmentComponent } from './refurbishment/refurbishment.component';
import { RegisterRefurbishmentComponent } from './register-refurbishment/register-refurbishment.component';
import { ProviderComponent } from './provider/provider.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { RegisterAdvertisementComponent } from './register-advertisement/register-advertisement.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { RegisterMeetingComponent } from './register-meeting/register-meeting.component';
import { PhonesComponent } from './phones/phones.component';
import { RegisterPhoneComponent } from './register-phone/register-phone.component';




@NgModule({
  declarations: [
    DashboardComponent,
    CommunityComponent,
    MenuCommunityComponent,
    ProvidersComponent,
    RegisterProviderComponent,
    DocumentsComponent,
    RegisterDocumentComponent,
    RegisterProfessionComponent,
    RefurbishmentComponent,
    RegisterRefurbishmentComponent,
    ProviderComponent,
    AdvertisementComponent,
    RegisterAdvertisementComponent,
    MeetingsComponent,
    RegisterMeetingComponent,
    PhonesComponent,
    RegisterPhoneComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'ca' } ]
})
export class DashboardModule { }
