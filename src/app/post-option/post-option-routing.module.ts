import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostOptionPage } from './post-option.page';

const routes: Routes = [
  {
    path: '',
    component: PostOptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostOptionPageRoutingModule {}
