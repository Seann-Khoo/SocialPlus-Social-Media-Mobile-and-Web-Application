import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  posts: any[];
  hasPosts: boolean;
  postCount: number;
  searchItem: string;

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit() {
  }

  search(){
    this.fireStore.collection('User Posts', ref => ref.where('profile_name', '==', this.searchItem).orderBy('time_posted', 'desc')).valueChanges({idField: 'id'}).subscribe((data)=> {
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
