import { LocationPage } from './../location/location.page';
import { Crop } from '@ionic-native/crop/ngx';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage"
import { ToastController, ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import firebase from 'firebase';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  uid: string;
  listingId: string;
  profile_image: string;
  profile_name: string;
  item_condition: string;
  item_description: string;
  item_price: number;
  seller_contact: number;
  seller_website: string;
  postImage: string;
  location: string;
  placeId: string;
  haveLocation: boolean = false;
  selectedFile: File = null;
  downloadURL: Observable<string>

  constructor(private camera: Camera, private toastController: ToastController, private storage: AngularFireStorage, private fireStore: AngularFirestore, private router: Router, private actionSheetController: ActionSheetController, private base64: Base64, private crop: Crop, private loadingController: LoadingController, private modalController: ModalController) { }

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
                  document.getElementById("product-image").setAttribute("src", this.postImage)
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
                  document.getElementById("product-image").setAttribute("src", this.postImage)
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

  addProduct(){
    if(!this.postImage){
      this.insertImage();
    }
    if(!this.item_condition){
      this.insertCondition();
    }
    if(!this.item_description){
      this.insertDescription();
    }
    if(!this.item_price){
      this.insertPrice();
    }
    if(!this.seller_contact){
      this.insertContact();
    }
    else {
      this.presentLoading();
      var currentDate = Date.now();
      let task = this.storage.ref(`User_Marketplace_Images/${currentDate}`).putString(this.postImage, "data_url");
      task.snapshotChanges()
      .subscribe((data) => {
        this.downloadURL = this.storage.ref(`User_Marketplace_Images/${currentDate}`).getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
           if (downloadURL) {
            this.listingId = this.fireStore.createId();
            if (this.seller_website){
            this.fireStore.collection("User Marketplace").doc(this.listingId).set({Uid: this.uid, listingId: this.listingId, profile_name: this.profile_name, profile_image: this.profile_image, item_condition: this.item_condition, item_description: this.item_description, item_price: this.item_price, seller_contact: this.seller_contact, seller_website: this.seller_website, item_image: downloadURL, placeId: this.placeId, time_posted: firebase.firestore.FieldValue.serverTimestamp()})
            this.showSuccessfulUploadAlert();
            this.router.navigate(['/marketplace']);
          }
          else{
            this.presentLoading();
            this.fireStore.collection("User Marketplace").doc(this.listingId).set({Uid: this.uid, listingId: this.listingId, profile_name: this.profile_name, profile_image: this.profile_image, item_condition: this.item_condition, item_description: this.item_description, item_price: this.item_price, seller_contact: this.seller_contact, seller_website: null, item_image: downloadURL, placeId: this.placeId, time_posted: firebase.firestore.FieldValue.serverTimestamp()})
            this.showSuccessfulUploadAlert();
            this.router.navigate(['/marketplace']);
          }
        }
        console.log(downloadURL);
      });
    })
    }
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Listing Added!',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }
  
  async insertImage() {
    const toast = await this.toastController.create({
      message: 'Please Insert Product Image',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertDescription() {
    const toast = await this.toastController.create({
      message: 'Please Insert Product Description',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertPrice() {
    const toast = await this.toastController.create({
      message: 'Please Insert Product Price',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertContact() {
    const toast = await this.toastController.create({
      message: 'Please Insert Seller Contact Number',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }

  async insertCondition() {
    const toast = await this.toastController.create({
      message: 'Please Select Item Condition',
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

  async launchLocationPage(){
    const modal = await this.modalController.create({
      component: LocationPage,
    })

    await modal.present();

    await modal.onDidDismiss().then((location: any) => {
      this.haveLocation = true;
      this.location = location.data.location;
      this.placeId = location.data.place;
      console.log(this.location);
      console.log(this.placeId);
    })
  }

}
