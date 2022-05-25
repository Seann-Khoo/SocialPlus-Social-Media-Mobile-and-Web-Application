import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostIndividualPageRoutingModule } from './post-individual-routing.module';

import { PostIndividualPage } from './post-individual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostIndividualPageRoutingModule
  ],
  declarations: [PostIndividualPage]
})
export class PostIndividualPageModule {}
