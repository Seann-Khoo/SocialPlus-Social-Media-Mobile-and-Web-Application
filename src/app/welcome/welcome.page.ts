import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  
  uid: string;
  name: string;

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user=>{console.log(user) 
      if (user){
        this.uid = user.uid;
        this.fireStore.doc('User Profile/'+this.uid).valueChanges().subscribe((res:any)=>{
          if(res){
            this.name = res.profile_name;
          }   
        })
      }})
  }

}
