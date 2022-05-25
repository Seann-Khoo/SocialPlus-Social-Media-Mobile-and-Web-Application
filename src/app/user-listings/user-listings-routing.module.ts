import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListingsPage } from './user-listings.page';

const routes: Routes = [
  {
    path: '',
    component: UserListingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserListingsPageRoutingModule {}
