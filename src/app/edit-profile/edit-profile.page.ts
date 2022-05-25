import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  uid: string;
  postID: string;
  listingID: string;
  oldProfileName: string;
  oldProfileImage: string;
  profileName: string;
  profileImage: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  isAndroid: boolean;

  constructor(
    private camera: Camera,
    private crop: Crop,
    private base64: Base64,
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private toastController: ToastController,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.fireStore
          .doc('User Profile/' + this.uid)
          .valueChanges()
          .subscribe((res: any) => {
            if (res) {
              this.oldProfileName = res.profile_name;
              this.oldProfileImage = res.profile_image;
            }
          });
      }
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons: [{
        text: 'Load from Image Library',
        icon: 'folder',
        cssClass: 'option',
        handler: () => {
          let options: CameraOptions = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
          }
          this.camera.getPicture(options).then(filePath => {
            this.crop.crop(filePath).then((croppedPath) => {
              this.base64.encodeFile(croppedPath).then(base64Data => {

                let temp = base64Data.substring(34);
                this.profileImage = 'data:image/jpeg;base64,' + temp;
                setTimeout(() => {
                  document.getElementById("image").setAttribute("src", this.profileImage)
                }, 250)
              })
            })
          })
        }
      },
      {
        text: 'Use Camera',
        icon: 'camera',
        cssClass: 'option',
        handler: () => {
          let options: CameraOptions = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
          }
          this.camera.getPicture(options).then(filePath => {
            this.crop.crop(filePath).then((croppedPath) => {
              this.base64.encodeFile(croppedPath).then(base64Data => {

                const temp = base64Data.substring(34);
                this.profileImage = 'data:image/jpeg;base64,' + temp;
                setTimeout(() => {
                  document.getElementById("image").setAttribute("src", this.profileImage)
                }, 250)
              })
            })
          })
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        cssClass: 'cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  editProfile(){
    this.presentLoading();
    if (this.profileImage) {
      var currentDate = Date.now()
      let task = this.storage.ref(`Profile_Images/${currentDate}`).putString(this.profileImage, "data_url");
      task.snapshotChanges()
      .subscribe((data) => {
        this.downloadURL = this.storage.ref(`Profile_Images/${currentDate}`).getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.fireStore.collection('User Profile').doc(this.uid).update({
              Uid: this.uid,
              profile_name: this.profileName,
              profile_image: downloadURL,
            });
            this.showSuccessfulUploadAlert();
            const User_Posts = firebase
              .firestore()
              .collection('User Posts');
            User_Posts.where('Uid', '==', this.uid)
              .get()
              .then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((post) => {
                    User_Posts.doc(post.id).update({
                      profile_name: this.profileName,
                      profile_image: downloadURL
                    });
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
                    this.postID = comment.data().postId;
                    firebase
                      .firestore()
                      .collection('User Posts/' + this.postID + '/Comments')
                      .doc(comment.id)
                      .update({
                        profile_name: this.profileName,
                        profile_image: downloadURL
                      });
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
                  snapshots.forEach((listing) => {
                    User_Marketplace.doc(listing.id).update({
                      profile_name: this.profileName,
                      profile_image: downloadURL
                    });
                  });
                }
              });
            const User_Requests = firebase
              .firestore()
              .collectionGroup('Comments');
            User_Requests.where('Uid', '==', this.uid)
              .get()
              .then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((listing) => {
                    this.listingID = listing.data().listingId;
                    firebase
                      .firestore()
                      .collection('User Posts/' + this.listingID + '/Requests')
                      .doc(listing.id)
                      .update({
                        profile_name: this.profileName,
                        profile_image: downloadURL
                      });
                  });
                }
              });
            this.showSuccessfulUploadAlert();
            this.router.navigate(['/home']);
          }
        });
      })
    }
    else{
      this.presentLoading();
      this.fireStore.collection('User Profile').doc(this.uid).update({
        Uid: this.uid,
        profile_name: this.profileName,
      });
      const User_Posts = firebase.firestore().collection('User Posts');
      User_Posts.where('Uid', '==', this.uid)
        .get()
        .then((snapshots) => {
          if (snapshots.size > 0) {
            snapshots.forEach((post) => {
              User_Posts.doc(post.id).update({
                profile_name: this.profileName
              });
            });
          }
        });
      const User_Comments = firebase.firestore().collectionGroup('Comments');
      User_Comments.where('Uid', '==', this.uid)
        .get()
        .then((snapshots) => {
          if (snapshots.size > 0) {
            snapshots.forEach((comment) => {
              this.postID = comment.data().postId;
              firebase
                .firestore()
                .collection('User Posts/' + this.postID + '/Comments')
                .doc(comment.id)
                .update({
                  profile_name: this.profileName
                });
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
            snapshots.forEach((listing) => {
              User_Marketplace.doc(listing.id).update({
                profile_name: this.profileName
              });
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
            snapshots.forEach((listing) => {
              this.listingID = listing.data().listingId;
              firebase
                .firestore()
                .collection('User Marketplace/' + this.listingID + '/Requests')
                .doc(listing.id)
                .update({
                  profile_name: this.profileName
                });
            });
          }
        });
      this.showSuccessfulUploadAlert();
      this.router.navigate(['/home']);
    }
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Profile Updated',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: 'crescent',
      duration: 1200
    });
    await loading.present();
  }
}
