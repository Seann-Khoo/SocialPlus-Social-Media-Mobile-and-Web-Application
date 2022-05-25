import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostOptionPageRoutingModule } from './post-option-routing.module';

import { PostOptionPage } from './post-option.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostOptionPageRoutingModule
  ],
  declarations: [PostOptionPage]
})
export class PostOptionPageModule {}
