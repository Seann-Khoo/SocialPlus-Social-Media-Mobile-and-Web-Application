import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  posts: any[];
  uid: string;
  hasPosts: boolean;
  postCount: number;
  isAndroid: boolean;

  constructor(private fireStore: AngularFirestore, private platform: Platform) { 
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
        this.fireStore.collection('User Profile').doc(this.uid).collection("Favourites").valueChanges({idField: 'id'}).subscribe((data)=> {
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
    });
  }

}
