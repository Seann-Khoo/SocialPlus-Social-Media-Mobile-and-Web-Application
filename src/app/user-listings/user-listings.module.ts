import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListingsPageRoutingModule } from './user-listings-routing.module';

import { UserListingsPage } from './user-listings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserListingsPageRoutingModule
  ],
  declarations: [UserListingsPage]
})
export class UserListingsPageModule {}
