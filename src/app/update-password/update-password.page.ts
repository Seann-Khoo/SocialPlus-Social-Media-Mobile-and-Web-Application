import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CountriesAPIService } from '../countries-api.service';
import firebase from 'firebase';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  phoneNumber: number;
  uid: string;
  email: boolean;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  verificationId: string;
  countryCode: string;
  cCode: string;
  countryList: any = [];

  constructor(private fireStore: AngularFirestore, private router: Router, private toastController: ToastController, private alertController: AlertController, private countriesService: CountriesAPIService, private loadingController: LoadingController) { 
    this.countriesService.loadAll().subscribe((data) => {
      this.countryList = data;
    });
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.fireStore
          .doc('Users/' + this.uid)
          .valueChanges()
          .subscribe((res: any) => {
            if (res.phone_number === null) {
              this.email = true;
            }
            else{
              this.email = false;
            }
          });
      }
    });
  }

  ionViewWillEnter(){
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha',
      {
        size: "invisible"
      }
    );
  }

  updatePassword(){
    if(!this.oldPassword){
      this.insertOldPassword();
    }
    if(!this.newPassword){
      this.insertNewPassword();
    }
    if(!this.confirmPassword){
      this.confirmNewPassword();
    }
    if(this.newPassword != this.confirmPassword){
      this.nonMatchingPasswords();
    }
    if(this.newPassword === this.oldPassword){
      this.samePasswords();
    }
    else{
    this.presentLoading();
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, this.oldPassword)

    firebase.auth().currentUser.reauthenticateWithCredential(credentials).then((result) => {
      firebase.auth().currentUser.updatePassword(this.newPassword).then((result2) => {
        this.fireStore.collection('Users').doc(this.uid).update({password: this.newPassword}).then((result3) => {
          this.updateSuccessful();
          this.router.navigate(['/menu'])
        })
      })
    })
  }
  }

  updatePhoneNumber(){
    if(!this.phoneNumber){
      this.insertMobileNumber();
    }
    else{
    this.presentLoading();
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = this.countryCode + this.phoneNumber;
    const provider = new firebase.auth.PhoneAuthProvider();
    provider.verifyPhoneNumber(phoneNumberString, appVerifier).then(async (id) => {
      this.verificationId = id;
      let prompt = await this.alertController.create({
        header: 'Please Enter the Verification Code Sent to Your Local Mobile Number',
        inputs: [
          { name: 'confirmationCode', placeholder: 'Verification Code' },
        ],
        buttons: [
          {
            text: 'Send',
            handler: (data) => {
              const phoneCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, data.confirmationCode);
              firebase.auth().currentUser.updatePhoneNumber(phoneCredential).then((result4) => {
                this.fireStore.collection('Users').doc(this.uid).update({phone_number: this.phoneNumber}).then((result5) => {
                  this.updatePhoneSuccessful();
                  this.router.navigate(['/menu'])
                })
              })
            },
          },
        ],
      });
      await prompt.present();
    })
  }
  }

  async updateSuccessful() {
    const toast = await this.toastController.create({
      message: 'Password Updated',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async updatePhoneSuccessful() {
    const toast = await this.toastController.create({
      message: 'Mobile Number Updated',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertOldPassword() {
    const toast = await this.toastController.create({
      message: 'Please Enter Current Password',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertNewPassword() {
    const toast = await this.toastController.create({
      message: 'Please Enter New Password',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async confirmNewPassword() {
    const toast = await this.toastController.create({
      message: 'Please Confirm New Password',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async nonMatchingPasswords() {
    const toast = await this.toastController.create({
      message: 'New Password and Confirm Password Do Not Match',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async samePasswords() {
    const toast = await this.toastController.create({
      message: 'New Password Matches Current Password',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertMobileNumber() {
    const toast = await this.toastController.create({
      message: 'Please Enter New Mobile Number',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }

  code() {
    if(this.cCode[3] === " ") {
      this.countryCode = this.cCode[0] + this.cCode[1] + this.cCode[2];
      console.log(this.countryCode);
    }
    else{
      this.countryCode = this.cCode[0] + this.cCode[1] + this.cCode[2] + this.cCode[3];
    }
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
