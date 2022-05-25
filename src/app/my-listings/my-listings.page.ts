import { ListingCategoryPage } from './../listing-category/listing-category.page';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PopoverController, Platform } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage {

  posts: any[];
  profile: any = {};
  dateJoined: number;
  uid: string;
  hasPosts: boolean;
  postCount: number;
  isAndroid: boolean

  constructor(private fireStore: AngularFirestore, private popoverController: PopoverController, private platform: Platform) { 
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
   }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.fireStore.collection('User Marketplace', ref => ref.where('Uid', '==', this.uid).orderBy('time_posted', 'desc')).valueChanges({idField: 'id'}).subscribe((data)=> {
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
      this.fireStore.collection('User Profile').doc(this.uid).valueChanges().subscribe((data) => {
        this.profile = data;
      })
      this.fireStore.collection('Users').doc(this.uid).valueChanges().subscribe((data: any) => {
        this.dateJoined = data.date_joined.toDate();
      })
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
