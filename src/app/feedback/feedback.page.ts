import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  
  category: string;
  feedback: string;

  constructor(private fireStore: AngularFirestore, private router: Router, private toastController: ToastController, private loadingController: LoadingController) {}

  ngOnInit() {}

  sendFeedback() {
    if(!this.feedback) {
      this.insertFeedback();
    }
    if(!this.category) {
      this.selectCategory();
    }
    else {
      this.presentLoading();
      this.fireStore
        .collection('User Feedback')
        .add({
          category: this.category,
          feedback: this.feedback,
          time_posted: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }
    this.showSuccessfulUploadAlert();
    this.router.navigate(['/menu']);
  }
  async showSuccessfulUploadAlert() {
    const toast = await this.toastController.create({
      message: 'Feedback Sent! Thank You!',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }
  async insertFeedback() {
    const toast = await this.toastController.create({
      message: 'Please Enter User Experience Feedback',
      duration: 3500,
      position: 'bottom'
    });
    await toast.present();
  }
  async selectCategory() {
    const toast = await this.toastController.create({
      message: 'Please Select Feedback Category',
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
