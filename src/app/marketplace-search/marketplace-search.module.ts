import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketplaceSearchPageRoutingModule } from './marketplace-search-routing.module';

import { MarketplaceSearchPage } from './marketplace-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplaceSearchPageRoutingModule
  ],
  declarations: [MarketplaceSearchPage]
})
export class MarketplaceSearchPageModule {}
