import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController, Platform } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-marketplace-individual',
  templateUrl: './marketplace-individual.page.html',
  styleUrls: ['./marketplace-individual.page.scss'],
})
export class MarketplaceIndividualPage implements OnInit {

  posts: any = {};
  requests: any[];
  request: string;
  postUid: string;
  postId: string;
  requestId: string;
  requestUid: string;
  timePosted: number;
  isUser: boolean;
  inWishlist: boolean;
  hasRequests: boolean;
  uid: string;
  requestCount: number;
  profileName: string;
  profileImage: string;
  dateJoined: number;
  isAndroid: boolean;
  placeID: string;

  constructor(
    private fireStore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform
  ) { 
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
   }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.uid = firebase.auth().currentUser.uid;
    this.fireStore.collection("User Profile").doc(this.uid).valueChanges().subscribe((data : any) => {
      this.profileName = data.profile_name;
      this.profileImage = data.profile_image;
    })
    this.fireStore
      .collection('User Marketplace')
      .doc(this.postId)
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {
        this.posts = data;
        this.timePosted = this.posts.time_posted.toDate();
        this.placeID = this.posts.placeId;
        this.postUid = this.posts.Uid;
        if (this.postUid === this.uid) {
          this.isUser = true;
        } else {
          this.isUser = false;
        }
        this.fireStore.collection('Users').doc(this.postUid).valueChanges().subscribe((res:any)=>{
          if(res){
            this.dateJoined = res.date_joined.toDate();
          }   
        });
      });
    this.fireStore
      .collection('User Marketplace')
      .doc(this.postId)
      .collection('Requests')
      .valueChanges()
      .subscribe((data) => {
        if (data.length > 0){
          this.requestCount = data.length
          this.hasRequests = true;
        }
        else{
          this.hasRequests = false;
        }
      });
    this.fireStore
      .collection('User Marketplace')
      .doc(this.postId)
      .collection('Requests')
      .valueChanges({ idField: 'id'})
      .subscribe((data) => {
        this.requests = data;
      });
    const User_Wishlist = firebase
      .firestore()
      .collection('User Profile')
      .doc(this.uid)
      .collection('Wishlist')
      .doc(this.postId);
    User_Wishlist.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.inWishlist = false;
      } 
      else {
        this.inWishlist = true;
      }
    });
  }

  deleteListing() {
    const alert = this.alertController.create({
      header: 'Delete Listing',
      message: 'Are you sure you want to delete this listing?',
      buttons: [
        {text: 'No', role: 'Cancel'},
        {text: 'Yes', handler: (alertData => {
          const User_Requests = firebase.firestore().collection("User Marketplace").doc(this.postId).collection("Requests");
          User_Requests
            .get()
            .then((snapshots) => {
              if (snapshots.size > 0) {
                snapshots.forEach((request) => {
                  firebase
                    .firestore()
                    .collection('User Marketplace/' + this.postId + '/Requests')
                    .doc(request.id)
                    .delete();
                });
              }
            });
            const User_Wishlist = firebase.firestore().collectionGroup("Wishlist")
            User_Wishlist.where("listingId", "==", this.postId)
              .get()
              .then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((listing) => {
                    firebase
                      .firestore()
                      .collection('User Profile')
                      .doc(listing.data().Uid)
                      .collection('Wishlist')
                      .doc(this.postId)
                      .delete();
                  });
                }
              });
          this.fireStore.doc('User Marketplace/' + this.postId).delete();
          this.deletePostSuccessful();
          this.router.navigate(['/marketplace']);
        })}
      ]
    }).then(alert => alert.present());
  }

  openSellerWebsite(){
    window.open('https://' + this.posts.seller_website)
  }

  openSellerLocation(){
    window.open('https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeID)
  }

  addRequest(){
    if(!this.request){
      this.insertRequest();
    }
    else{
    this.requestId = this.fireStore.createId();
    this.fireStore.collection("User Marketplace").doc(this.postId).collection("Requests").doc(this.requestId).set({Uid: this.uid, profile_name: this.profileName, profile_image: this.profileImage, listingId: this.postId, requestId: this.requestId,request: this.request, time_posted: firebase.firestore.FieldValue.serverTimestamp()})
    .then(this.request = null)
    }
  }

  deleteRequest(requestID){
    const alert = this.alertController.create({
      header: 'Retract Offer',
      message: 'Are you sure you want to retract this offer?',
      buttons: [
        {text: 'No', role: 'Cancel'},
        {text: 'Yes', handler: (alertData => {
          this.fireStore.collection("User Marketplace").doc(this.postId).collection("Requests").doc(requestID).delete();
          this.deleteRequestSuccessful();
        })}
      ]
    }).then(alert => alert.present());
  }

  addFavourites(){
    const Favourites = firebase
      .firestore()
      .collection('User Profile')
      .doc(this.uid)
      .collection('Wishlist')
      .doc(this.postId);
    Favourites.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.fireStore
          .collection('User Profile')
          .doc(this.uid)
          .collection('Wishlist')
          .doc(this.postId)
          .set({
            Uid: this.uid,
            listingUid: this.postUid,
            listingId: this.postId,
            item_image: this.posts.item_image
          });
        this.inWishlist = true;
      } else {
        this.fireStore
          .collection('User Profile')
          .doc(this.uid)
          .collection('Wishlist')
          .doc(this.postId)
          .delete();
        this.inWishlist = false;
      }
    });
  }

  postUser(){
    let navigationExtras: NavigationExtras = { queryParams: { Uid: this.postUid } };
    this.router.navigate(['/user-listings'], navigationExtras);
  }

  async deletePostSuccessful() {
    const toast = await this.toastController.create({
      message: 'Listing Deleted',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async deleteRequestSuccessful() {
    const toast = await this.toastController.create({
      message: 'Offer Retracted',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertRequest() {
    const toast = await this.toastController.create({
      message: 'Please Insert Offer',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }
}
