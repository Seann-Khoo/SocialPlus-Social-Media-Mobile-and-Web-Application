import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketplaceSearchPage } from './marketplace-search.page';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceSearchPageRoutingModule {}
