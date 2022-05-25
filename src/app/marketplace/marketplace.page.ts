import { ListingCategoryPage } from './../listing-category/listing-category.page';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage implements OnInit {

  products: any[];
  hasPosts: boolean;
  postCount: number;
  isAndroid: boolean;

  constructor(private fireStore: AngularFirestore, private popoverController: PopoverController, private platform: Platform) { 
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
  }

  ngOnInit() {
    this.fireStore.collection('User Marketplace', ref => ref.orderBy('time_posted', 'desc')).valueChanges({idField: 'id'}).subscribe((data)=> {
      this.products = data;
      this.postCount = data.length;
      if(data.length > 0){
        this.hasPosts = true;
      }
      else{
        this.hasPosts = false;
      }
    });
  }

  async category(){
    const pop = await this.popoverController.create({
      component: ListingCategoryPage,
      cssClass: 'category',
    })

    return await pop.present();
  }

}
