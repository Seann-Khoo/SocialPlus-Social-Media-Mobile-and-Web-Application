import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketplaceIndividualPageRoutingModule } from './marketplace-individual-routing.module';

import { MarketplaceIndividualPage } from './marketplace-individual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplaceIndividualPageRoutingModule
  ],
  declarations: [MarketplaceIndividualPage]
})
export class MarketplaceIndividualPageModule {}
