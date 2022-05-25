import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketplaceIndividualPage } from './marketplace-individual.page';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceIndividualPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceIndividualPageRoutingModule {}
