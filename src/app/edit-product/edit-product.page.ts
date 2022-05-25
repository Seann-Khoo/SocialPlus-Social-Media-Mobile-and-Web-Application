import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { Observable } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {

  uid: string;
  listingId: string;
  profile_image: string;
  profile_name: string;
  item_condition: string;
  item_description: string;
  item_price: number;
  seller_contact: number;
  seller_website: string;
  post_image: string;
  postImage: string;
  selectedFile: File = null;
  downloadURL: Observable<string>
  isAndroid: boolean;

  constructor(private toastController: ToastController,private fireStore: AngularFirestore,private router: Router, private activatedRoute: ActivatedRoute, private storage: AngularFireStorage, private camera: Camera, private crop: Crop, private base64: Base64, private actionSheetController: ActionSheetController, private loadingController: LoadingController, private platform: Platform) { 
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
  }

  ngOnInit() {
    this.listingId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fireStore.doc("User Marketplace/" + this.listingId).valueChanges().subscribe((data:any)=>{
      if(data){
        this.item_description = data.item_description;
        this.item_price = data.item_price;
        this.seller_contact = data.seller_contact;
        this.seller_website = data.seller_website;
        this.item_condition = data.item_condition;
        this.post_image = data.item_image;
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
                  document.getElementById("new-image").setAttribute("src", this.postImage)
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
                  document.getElementById("new-image").setAttribute("src", this.postImage)
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

  updateProduct(){
    if(this.postImage){
      this.presentLoading();
      var currentDate = Date.now()
      let task = this.storage.ref(`User_Marketplace_Images/${currentDate}`).putString(this.postImage, "data_url");
      task.snapshotChanges()
      .subscribe((data) => {
        this.downloadURL = this.storage.ref(`User_Marketplace_Images/${currentDate}`).getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if(downloadURL){
            this.fireStore.doc("User Marketplace/" + this.listingId).update({item_description: this.item_description, item_image: downloadURL,item_price: this.item_price, seller_contact: this.seller_contact, seller_website: this.seller_website})
            this.showSuccessfulUploadAlert();
            this.router.navigate(['/marketplace'])
          }
        })
      })
    }
    else{
    this.presentLoading();
    this.fireStore.doc("User Marketplace/" + this.listingId).update({item_description: this.item_description, item_price: this.item_price, seller_contact: this.seller_contact, seller_website: this.seller_website})
    this.showSuccessfulUploadAlert();
    this.router.navigate(['/marketplace'])
    }
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Listing Updated',
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
