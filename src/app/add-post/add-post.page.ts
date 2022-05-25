import { Crop } from '@ionic-native/crop/ngx';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage"
import { ToastController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import firebase from 'firebase';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage {

  uid: string;
  postId: string;
  profile_image: string;
  profile_name: string;
  post_caption: string;
  post_category: string;
  postImage: string;
  selectedFile: File = null;
  downloadURL: Observable<string>

  constructor(private camera: Camera, private toastController: ToastController, private storage: AngularFireStorage, private fireStore: AngularFirestore, private router: Router, private actionSheetController: ActionSheetController, private crop: Crop, private base64: Base64, private loadingController: LoadingController) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user=>{console.log(user) 
    if (user){
      this.uid = user.uid;
      this.fireStore.doc('User Profile/'+this.uid).valueChanges().subscribe((res:any)=>{
        if(res){
          this.profile_name = res.profile_name;
          this.profile_image = res.profile_image;
        }   
      })
    }})
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
                this.postImage = 'data:image/jpeg;base64,' + temp;
                setTimeout(() => {
                  document.getElementById("post-image").setAttribute("src", this.postImage)
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
                this.postImage = 'data:image/jpeg;base64,' + temp;
                setTimeout(() => {
                  document.getElementById("post-image").setAttribute("src", this.postImage)
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

  addPost(){
    if(!this.postImage){
      this.insertImage();
    }
    if(!this.post_caption){
      this.insertCaption();
    }
    if(!this.post_category){
      this.insertCategory();
    }
    else{
    this.presentLoading();
    var currentDate = Date.now()
    let task = this.storage.ref(`User_Post_Images/${currentDate}`).putString(this.postImage, "data_url");
    task.snapshotChanges()
    .subscribe((data) => {
      this.downloadURL = this.storage.ref(`User_Post_Images/${currentDate}`).getDownloadURL();
      this.downloadURL.subscribe(downloadURL => {
        if (downloadURL) {
          this.postId = this.fireStore.createId()
          this.fireStore.collection("User Posts").doc(this.postId).set({Uid: this.uid, postId: this.postId,profile_name: this.profile_name, profile_image: this.profile_image, post_caption: this.post_caption, category: this.post_category, post_image: downloadURL, time_posted: firebase.firestore.FieldValue.serverTimestamp()})
          this.loadingController.dismiss();
          this.showSuccessfulUploadAlert();
          this.router.navigate(['/home']);
        }
        console.log(downloadURL);
      });
    })
    }
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Post Added!',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertImage() {
    const toast = await this.toastController.create({
      message: 'Please Insert Post Image',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertCaption() {
    const toast = await this.toastController.create({
      message: 'Please Insert Post Caption',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertCategory() {
    const toast = await this.toastController.create({
      message: 'Please Insert Post Category',
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
