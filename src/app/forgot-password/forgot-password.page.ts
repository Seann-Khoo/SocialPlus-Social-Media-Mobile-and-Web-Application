import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordEmail: string="";

  constructor(private auth: AngularFireAuth, private firestore:AngularFirestore, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
  }

  forgotPassword() {
    return this.auth.sendPasswordResetEmail(this.forgotPasswordEmail)
      .then(() => {
        const toast = this.toastController.create({
          message: 'Password Recovery Email Sent. Please Check Student Email Inbox.',
          duration: 3500,
          position: 'bottom'
        }).then(alert => alert.present());
        this.router.navigate(['/login']);
      }).catch((error) => { })
  }

}
