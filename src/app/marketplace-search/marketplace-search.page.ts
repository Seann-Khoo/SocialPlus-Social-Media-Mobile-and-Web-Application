import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-marketplace-search',
  templateUrl: './marketplace-search.page.html',
  styleUrls: ['./marketplace-search.page.scss'],
})
export class MarketplaceSearchPage implements OnInit {

  posts: any[];
  hasPosts: boolean;
  postCount: number;
  searchItem: string;

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit() {
  }

  search(){
    this.fireStore.collection('User Marketplace', ref => ref.where('profile_name', '==', this.searchItem).orderBy('time_posted', 'desc')).valueChanges({idField: 'id'}).subscribe((data)=> {
      this.posts = data;
      this.postCount = data.length;
      if(data.length > 0){
        this.hasPosts = true;
      }
      else{
        this.hasPosts = false;
      }
    });
  }

}
