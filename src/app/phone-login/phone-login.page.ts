import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { CountriesAPIService } from '../countries-api.service';
import firebase from 'firebase';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.page.html',
  styleUrls: ['./phone-login.page.scss'],
})
export class PhoneLoginPage implements OnInit {
  
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  phoneNumber: number;
  countryCode: number;
  cCode: number;
  countryList: any = [];
  isAndroid: boolean;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    private countriesService: CountriesAPIService
  ) 
  {
    this.countriesService.loadAll().subscribe((data) => {
      this.countryList = data;
    });
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-contain',
      {
        size: "invisible"
      }
    );
  }

  signIn(phoneNumber) {
    if(!this.phoneNumber){
      this.insertNumber();
    }
    else{
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = this.countryCode + phoneNumber;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(async (confirmationResult) => {
        let prompt = await this.alertController.create({
          header: 'Please Enter the Verification Code Sent to Your Local Mobile Number',
          inputs: [
            { name: 'confirmationCode', placeholder: 'Verification Code' },
          ],
          buttons: [
            {
              text: 'Send',
              handler: (data) => {
                confirmationResult
                  .confirm(data.confirmationCode)
                  .then((result) => {
                    this.loginSuccessful();
                    this.router.navigate(['/section']);
                    this.phoneNumber = null;
                  })
                  .catch((error) => {
                    this.loginError();
                  });
              },
            },
          ],
        });
        await prompt.present();
      })
      .catch((error) => {
        this.loginError();
      });
    }
  }
  async loginSuccessful() {
    const toast = await this.toastController.create({
      message: 'Login Successful! Welcome Back to Social+!',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertNumber() {
    const toast = await this.toastController.create({
      message: 'Please Enter Mobile Number',
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

  code() {
    if(this.cCode[3] === " ") {
      this.countryCode = this.cCode[0] + this.cCode[1] + this.cCode[2];
    }
    else{
      this.countryCode = this.cCode[0] + this.cCode[1] + this.cCode[2] + this.cCode[3];
    }
  }

}
