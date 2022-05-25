import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, Platform } from '@ionic/angular';
import { CategoryPage } from './../category/category.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  posts: any[];
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
    this.fireStore.collection('User Posts', ref => ref.orderBy('time_posted', 'desc')).valueChanges({idField: 'id'}).subscribe((data)=> {
      this.posts = data;
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
      component: CategoryPage,
      cssClass: 'category',
    })

    return await pop.present();
  }

}
