import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, PopoverController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerEmail: string;
  registerPassword: string;
  isAndroid: boolean;

  constructor(private auth: AngularFireAuth, private firestore:AngularFirestore, private toastController: ToastController, private router: Router, private popoverController: PopoverController, private platform: Platform) { 
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
  }

  async ngOnInit() {
    if(this.platform.is('android')){
      const pop = await this.popoverController.create({
        component: ModalPage,
        cssClass: 'modal'
      })
  
      return await pop.present();
    }
  }

  async register() {
    if(!this.registerEmail){
      this.insertEmail();
    }
    if(!this.registerPassword){
      this.insertPassword;
    }
    else{
    this.auth.createUserWithEmailAndPassword(this.registerEmail,this.registerPassword)
      .then((data) => {
        this.firestore.collection('Users').doc(data.user.uid).set({Uid: data.user.uid, phone_number: null, email: this.registerEmail, password: this.registerPassword, date_joined: firebase.firestore.FieldValue.serverTimestamp()})
        const toast = this.toastController.create({
          message: 'Registration Successful! Start Posting on Social+!',
          duration: 3500,
          position: 'bottom'
        }).then(alert => alert.present());
        this.router.navigate(['/add-profile']);
        this.registerEmail = null;
        this.registerPassword = null;
      }).catch((error) => { 
        this.registrationError();
      })
    }
  }

  async insertEmail() {
    const toast = await this.toastController.create({
      message: 'Please Enter Email Address',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertPassword() {
    const toast = await this.toastController.create({
      message: 'Please Enter Password',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async registrationError() {
    const toast = await this.toastController.create({
      message: 'Registration Error. Please Try Again Later.',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
}
