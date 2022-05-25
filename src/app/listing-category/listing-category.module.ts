import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingCategoryPageRoutingModule } from './listing-category-routing.module';

import { ListingCategoryPage } from './listing-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingCategoryPageRoutingModule
  ],
  declarations: [ListingCategoryPage]
})
export class ListingCategoryPageModule {}
