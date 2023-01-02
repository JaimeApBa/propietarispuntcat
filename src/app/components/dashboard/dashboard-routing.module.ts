import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommunityComponent } from './community/community.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProvidersComponent } from './providers/providers.component';
import { RegisterProviderComponent } from './register-provider/register-provider.component';
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

const routes: Routes = [
  {path: 'community/:cif', component: CommunityComponent},
  {path: 'phones/:cif', component: PhonesComponent},
  {path: 'registerPhone/:cif', component: RegisterPhoneComponent},
  {path: 'registerPhone/:cif/:phone', component: RegisterPhoneComponent},
  {path: 'providers/:cif', component: ProvidersComponent},
  {path: 'provider/:cif/:provider', component: ProviderComponent},
  {path: 'registerProvider/:cif', component: RegisterProviderComponent},
  {path: 'registerProvider/:cif/:provider', component: RegisterProviderComponent},
  {path: 'registerProfession/:cif', component: RegisterProfessionComponent},
  {path: 'refurbishments/:cif', component: RefurbishmentComponent},
  {path: 'registerRefurbishment/:cif', component: RegisterRefurbishmentComponent},
  {path: 'registerRefurbishment/:cif/:refurbishment', component: RegisterRefurbishmentComponent},
  {path: 'documents/:cif', component: DocumentsComponent},
  {path: 'registerDocuments/:cif', component: RegisterDocumentComponent},
  {path: 'advertisements/:cif', component: AdvertisementComponent},
  {path: 'registerAdvertisement/:cif', component: RegisterAdvertisementComponent},
  {path: 'registerAdvertisement/:cif/:advertisement', component: RegisterAdvertisementComponent},
  {path: 'meetings/:cif', component: MeetingsComponent},
  {path: 'registerMeeting/:cif', component: RegisterMeetingComponent},
  {path: 'registerMeeting/:cif/:meeting', component: RegisterMeetingComponent},
  { path: '', redirectTo: '/community/:cif', pathMatch: 'full'  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
