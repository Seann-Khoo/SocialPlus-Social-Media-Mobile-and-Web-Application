import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostIndividualPage } from './post-individual.page';

const routes: Routes = [
  {
    path: '',
    component: PostIndividualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostIndividualPageRoutingModule {}
