import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, PopoverController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginPassword: string;
  loginEmail: string;
  isAndroid: boolean;

  constructor(private auth: AngularFireAuth, private firestore:AngularFirestore, private toastController: ToastController, private popoverController: PopoverController, private router: Router, private platform: Platform) { 
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

  async login() {
    if(!this.loginEmail){
      this.insertEmail();
    }
    if(!this.loginPassword){
      this.insertPassword();
    }
    else{
    this.auth.signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
      .then((user) => {
        if (user) {
          const toast = this.toastController.create({
            message: 'Login Successful! Welcome Back to Social+!',
            duration: 3500,
            position: 'bottom'
          }).then(alert => alert.present());
          this.router.navigate(['/section']);
          this.loginEmail = null;
          this.loginPassword = null;
        }
      }).catch((error) => { 
        this.loginError();
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
  async loginError() {
    const toast = await this.toastController.create({
      message: 'Login Error. Please Try Again Later.',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }

}
