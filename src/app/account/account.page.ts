import { ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  uid: string;
  email: string;
  phone_number: number;
  date: number;

  constructor(
    private fireStore: AngularFirestore,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.fireStore
          .doc('Users/' + this.uid)
          .valueChanges()
          .subscribe((res: any) => {
              this.email = res.email;
              this.phone_number = res.phone_number;
              this.date = res.date_joined.toDate();
          });
      }
    });
  }

  deleteAccount() {
    const alert = this.alertController
      .create({
        header: 'Deactivate User Account',
        message: 'Are you sure you want to deactivate this account? User Account and its relevant information cannot be retrieved once deactivated.',
        buttons: [
          { text: 'No', role: 'Cancel' },
          {
            text: 'Yes',
            handler: (alertData) => {
              const User_Likes = firebase.firestore().collectionGroup('Likes');
              User_Likes.where('Uid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((post) => {
                      firebase
                        .firestore()
                        .collection('User Posts')
                        .doc(post.data().postId)
                        .collection('Likes')
                        .doc(this.uid)
                        .delete();
                    });
                  }
                });
              const User_Comments = firebase
                .firestore()
                .collectionGroup('Comments');
              User_Comments.where('Uid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((comment) => {
                      firebase
                        .firestore()
                        .collection('User Posts')
                        .doc(comment.data().postId)
                        .collection('Comments')
                        .doc(comment.id)
                        .delete();
                    });
                  }
                });
              const User_Requests = firebase
                .firestore()
                .collectionGroup('Requests');
              User_Requests.where('Uid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((request) => {
                      firebase
                        .firestore()
                        .collection('User Marketplace')
                        .doc(request.data().listingId)
                        .collection('Requests')
                        .doc(request.id)
                        .delete();
                    });
                  }
                });
              const User_Favourites = firebase
                .firestore()
                .collectionGroup('Favourites');
              User_Favourites.where('postUid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((post) => {
                      firebase
                        .firestore()
                        .collection('User Profile')
                        .doc(post.data().Uid)
                        .collection('Wishlist')
                        .doc(post.data().postId)
                        .delete();
                    });
                  }
                });
              const User_Wishlist = firebase
                .firestore()
                .collectionGroup('Wishlist');
              User_Wishlist.where('listingUid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((listing) => {
                      firebase
                        .firestore()
                        .collection('User Profile')
                        .doc(listing.data().Uid)
                        .collection('Wishlist')
                        .doc(listing.data().listingId)
                        .delete();
                    });
                  }
                });
              const User_Posts = firebase.firestore().collection('User Posts');
              User_Posts.where('Uid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((post) => {
                      const User_Post_Likes = firebase
                        .firestore()
                        .collection('User Posts')
                        .doc(post.id)
                        .collection('Likes');
                      User_Post_Likes.get().then((snapshots) => {
                        if (snapshots.size > 0) {
                          snapshots.forEach((like) => {
                            firebase
                              .firestore()
                              .collection('User Posts')
                              .doc(post.id)
                              .collection('Likes')
                              .doc(like.id)
                              .delete();
                          });
                        }
                      });
                      const User_Post_Comments = firebase
                        .firestore()
                        .collection('User Posts')
                        .doc(post.id)
                        .collection('Comments');
                      User_Post_Comments.get().then((snapshots) => {
                        if (snapshots.size > 0) {
                          snapshots.forEach((comment) => {
                            firebase
                              .firestore()
                              .collection('User Posts')
                              .doc(post.id)
                              .collection('Comments')
                              .doc(comment.id)
                              .delete();
                          });
                        }
                      });
                      firebase
                        .firestore()
                        .collection('User Posts')
                        .doc(post.id)
                        .delete();
                    });
                  }
                });
              const User_Marketplace = firebase
                .firestore()
                .collection('User Marketplace');
              User_Marketplace.where('Uid', '==', this.uid)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((post) => {
                      const User_Post_Requests = firebase
                        .firestore()
                        .collection('User Marketplace')
                        .doc(post.id)
                        .collection('Requests');
                      User_Post_Requests.get().then((snapshots) => {
                        if (snapshots.size > 0) {
                          snapshots.forEach((request) => {
                            firebase
                              .firestore()
                              .collection('User Marketplace')
                              .doc(post.id)
                              .collection('Requests')
                              .doc(request.id)
                              .delete();
                          });
                        }
                      });
                      firebase
                        .firestore()
                        .collection('User Marketplace')
                        .doc(post.id)
                        .delete();
                    });
                  }
                });
              const User_Own_Favourites = firebase
                .firestore()
                .collection('User Profile')
                .doc(this.uid)
                .collection('Favourites');
              User_Own_Favourites.get().then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((favourite) => {
                    firebase
                      .firestore()
                      .collection('User Profile')
                      .doc(this.uid)
                      .collection('Favourites')
                      .doc(favourite.id)
                      .delete();
                  });
                }
              });
              const User_Own_Wishlist = firebase
                .firestore()
                .collection('User Profile')
                .doc(this.uid)
                .collection('Wishlist');
              User_Own_Wishlist.get().then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((favourite) => {
                    firebase
                      .firestore()
                      .collection('User Profile')
                      .doc(this.uid)
                      .collection('Wishlist')
                      .doc(favourite.id)
                      .delete();
                  });
                }
              });
              firebase.firestore()
                .collection('User Profile')
                .doc(this.uid)
                .delete();
              firebase.firestore().collection('Users').doc(this.uid).delete();
              firebase.auth().currentUser.delete();
              this.deleteSuccessful();
              this.router.navigate(['/login']);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  async deleteSuccessful() {
    const toast = await this.toastController.create({
      message: 'Social+ User Account Deleted',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
}