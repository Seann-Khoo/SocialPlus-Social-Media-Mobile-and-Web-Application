import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProfilePage } from './add-profile.page';

const routes: Routes = [
  {
    path: '',
    component: AddProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProfilePageRoutingModule {}
