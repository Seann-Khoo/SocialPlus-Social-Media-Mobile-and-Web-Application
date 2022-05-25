import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { AngularFireStorage } from "@angular/fire/storage"
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.page.html',
  styleUrls: ['./add-profile.page.scss'],
})
export class AddProfilePage implements OnInit {

  uid: string;
  profileName: string;
  profileImage: string;
  selectedFile: File = null;
  downloadURL: Observable<string>

  constructor(private camera: Camera, private crop: Crop, private base64: Base64 ,private toastController: ToastController, private storage: AngularFireStorage, private fireStore: AngularFirestore, private router: Router, private actionSheetController: ActionSheetController, private loadingController: LoadingController) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user=> {
      if(user){
        this.uid = user.uid;
      }
    })
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

  uploadProfile(){
    if(!this.profileName){
      this.insertProfileName();
    }
    if(!this.profileImage){
      this.selectProfileImage();
    }
    else{
    this.presentLoading();
    var currentDate = Date.now()
    let task = this.storage.ref(`Profile_Images/${currentDate}`).putString(this.profileImage, "data_url");
    task.snapshotChanges()
    .subscribe((data) => {
      this.downloadURL = this.storage.ref(`Profile_Images/${currentDate}`).getDownloadURL();
      this.downloadURL.subscribe(downloadURL => {
        if (downloadURL) {
          this.fireStore.collection("User Profile").doc(this.uid).set({Uid: this.uid, profile_name: this.profileName, profile_image: downloadURL})
          this.showSuccessfulUploadAlert();
          this.router.navigate(['/welcome'])
        }
      })
     })
    }
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Profile Saved!',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertProfileName() {
    const toast = await this.toastController.create({
      message: 'Please Enter Profile Name',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async selectProfileImage() {
    const toast = await this.toastController.create({
      message: 'Please Select Profile Image',
      duration: 3500,
      position: 'bottom'
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
