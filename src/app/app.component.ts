import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  uid:string;
  profile_name: string;
  profile_image: string;

  constructor(private menuController: MenuController, private fireStore: AngularFirestore) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.fireStore
          .doc('User Profile/' + this.uid)
          .valueChanges()
          .subscribe((res: any) => {
            if (res) {
              this.profile_name = res.profile_name;
              this.profile_image = res.profile_image;
            }
          });
      }
    });
  }

  close() {
    this.menuController.close("main");
  }
}
