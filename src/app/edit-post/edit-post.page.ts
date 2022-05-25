import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  postId: string;
  post_caption: string;
  post_category: string;
  post_image: string;

  constructor(private toastController: ToastController, private fireStore: AngularFirestore, private router: Router, private activatedRoute: ActivatedRoute, private loadingController: LoadingController) { }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fireStore.doc("User Posts/" + this.postId).valueChanges().subscribe((data:any)=>{
      if(data){
        this.post_caption = data.post_caption;
        this.post_category = data.category;
        this.post_image = data.post_image;
      }
    })
  }

  editPost(){
    this.presentLoading();
    this.fireStore.doc("User Posts/" + this.postId).update({post_caption: this.post_caption});
    this.showSuccessfulUploadAlert();
    this.router.navigate(['/home'])
  }

  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Post Updated',
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
