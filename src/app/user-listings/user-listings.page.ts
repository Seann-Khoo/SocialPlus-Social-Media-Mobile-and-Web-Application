import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.page.html',
  styleUrls: ['./user-listings.page.scss'],
})
export class UserListingsPage implements OnInit {

  uid: string;
  posts: any[];
  profile: any = {};
  postCount: number;
  dateJoined: number;

  constructor(private fireStore: AngularFirestore, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe(params => { this.uid = params.Uid; });
   }

  ngOnInit() {
    this.fireStore.collection('User Marketplace', ref => ref.where('Uid', '==', this.uid)).valueChanges({ idField: 'id' }).subscribe((data) => {
      this.posts = data;
      this.postCount = data.length;
    })
    this.fireStore.collection('User Profile').doc(this.uid).valueChanges().subscribe((data) => {
      this.profile = data;
    })
    this.fireStore.collection('Users').doc(this.uid).valueChanges().subscribe((data: any) => {
      this.dateJoined = data.date_joined.toDate();
    })
  }

}