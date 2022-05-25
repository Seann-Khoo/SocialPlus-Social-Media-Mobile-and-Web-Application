import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController, Platform } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-post-individual',
  templateUrl: './post-individual.page.html',
  styleUrls: ['./post-individual.page.scss'],
})
export class PostIndividualPage implements OnInit {
  posts: any = {};
  comments: any[];
  likes: any[];
  comment: string;
  postUid: string;
  postId: string;
  commentId: string;
  commentUid: string;
  timePosted: number;
  isUser: boolean;
  isLiked: boolean;
  inFavourites: boolean;
  hasComments: boolean;
  uid: string;
  likeCount: number;
  commentCount: number;
  profileName: string;
  profileImage: string;
  isAndroid: boolean;

  constructor(
    private fireStore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform
  ) {
    if(this.platform.is('android')){
      this.isAndroid = true;
    }
    else{
      this.isAndroid = false;
    }
  }

  ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.uid = firebase.auth().currentUser.uid;
    this.fireStore.collection("User Profile").doc(this.uid).valueChanges().subscribe((data : any) => {
      this.profileName = data.profile_name;
      this.profileImage = data.profile_image;
    })
    this.fireStore
      .collection('User Posts')
      .doc(this.postId)
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {
        this.posts = data;
        this.timePosted = this.posts.time_posted.toDate();
        this.postUid = this.posts.Uid;
        if (this.postUid === this.uid) {
          this.isUser = true;
        } else {
          this.isUser = false;
        }
      });
    this.fireStore
      .collection('User Posts')
      .doc(this.postId)
      .collection('Likes')
      .valueChanges()
      .subscribe((data) => {
        this.likeCount = data.length;
      });
    this.fireStore
      .collection('User Posts')
      .doc(this.postId)
      .collection('Comments')
      .valueChanges()
      .subscribe((data) => {
        if (data.length > 0) {
          this.commentCount = data.length;
          this.hasComments = true;
        } else {
          this.hasComments = false;
        }
      });
    this.fireStore
      .collection('User Posts')
      .doc(this.postId)
      .collection('Comments')
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {
        this.comments = data;
      });
    const User_Likes = firebase
      .firestore()
      .collection('User Posts')
      .doc(this.postId)
      .collection('Likes')
      .doc(this.uid);
    User_Likes.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.isLiked = false;
      } 
      else {
        this.isLiked = true;
      }
    });
    const User_Favourites = firebase
      .firestore()
      .collection('User Profile')
      .doc(this.uid)
      .collection('Favourites')
      .doc(this.postId);
    User_Favourites.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.inFavourites = false;
      } 
      else {
        this.inFavourites = true;
      }
    });
  }

  likePost() {
    const User_Likes = firebase
      .firestore()
      .collection('User Posts')
      .doc(this.postId)
      .collection('Likes')
      .doc(this.uid);
    User_Likes.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.fireStore
          .collection('User Posts')
          .doc(this.postId)
          .collection('Likes')
          .doc(this.uid)
          .set({
            Uid: this.uid,
            postId: this.postId,
            time_posted: firebase.firestore.FieldValue.serverTimestamp(),
          });
        this.isLiked = true;
      } else {
        this.fireStore
          .collection('User Posts')
          .doc(this.postId)
          .collection('Likes')
          .doc(this.uid)
          .delete();
        this.isLiked = false;
      }
    });
  }

  deletePost() {
    const alert = this.alertController
      .create({
        header: 'Delete Post',
        message: 'Are you sure you want to delete this post?',
        buttons: [
          { text: 'No', role: 'Cancel' },
          {
            text: 'Yes',
            handler: (alertData) => {
              const User_Comments = firebase
                .firestore()
                .collection('User Posts')
                .doc(this.postId)
                .collection('Comments');
              User_Comments.get().then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((comment) => {
                    firebase
                      .firestore()
                      .collection('User Posts/' + this.postId + '/Comments')
                      .doc(comment.id)
                      .delete();
                  });
                }
              });
              const User_Likes = firebase
                .firestore()
                .collection('User Posts')
                .doc(this.postId)
                .collection('Likes');
              User_Likes.get().then((snapshots) => {
                if (snapshots.size > 0) {
                  snapshots.forEach((like) => {
                    firebase
                      .firestore()
                      .collection('User Posts/' + this.postId + '/Likes')
                      .doc(like.id)
                      .delete();
                  });
                }
              });
              const User_Favourites = firebase
                .firestore()
                .collectionGroup('Favourites');
              User_Favourites.where('postId', '==', this.postId)
                .get()
                .then((snapshots) => {
                  if (snapshots.size > 0) {
                    snapshots.forEach((post) => {
                      firebase
                        .firestore()
                        .collection('User Profile')
                        .doc(post.data().Uid)
                        .collection('Favourites')
                        .doc(this.postId)
                        .delete();
                    });
                  }
                });
              this.fireStore.doc('User Posts/' + this.postId).delete();
              this.deletePostSuccessful();
              this.router.navigate(['/home']);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  addComment() {
    if (!this.comment) {
      this.insertComment();
    } else {
      this.commentId = this.fireStore.createId();
      this.fireStore
        .collection('User Posts')
        .doc(this.postId)
        .collection('Comments')
        .doc(this.commentId)
        .set({
          Uid: this.uid,
          profile_name: this.profileName,
          profile_image: this.profileImage,
          postId: this.postId,
          commentId: this.commentId,
          comment: this.comment,
          time_posted: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((this.comment = null));
    }
  }

  deleteComment(commentID) {
    const alert = this.alertController
      .create({
        header: 'Delete Comment',
        message: 'Are you sure you want to delete this comment?',
        buttons: [
          { text: 'No', role: 'Cancel' },
          {
            text: 'Yes',
            handler: (alertData) => {
              this.fireStore
                .collection('User Posts')
                .doc(this.postId)
                .collection('Comments')
                .doc(commentID)
                .delete();
              this.deleteCommentSuccessful();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  addFavourites() {
    const Favourites = firebase
      .firestore()
      .collection('User Profile')
      .doc(this.uid)
      .collection('Favourites')
      .doc(this.postId);
    Favourites.get().then((snapshots) => {
      if (!snapshots.exists) {
        this.fireStore
          .collection('User Profile')
          .doc(this.uid)
          .collection('Favourites')
          .doc(this.postId)
          .set({
            Uid: this.uid,
            postUid: this.postUid,
            postId: this.postId,
            post_image: this.posts.post_image,
          });
        this.inFavourites = true;
      } else {
        this.fireStore
          .collection('User Profile')
          .doc(this.uid)
          .collection('Favourites')
          .doc(this.postId)
          .delete();
        this.inFavourites = false;
      }
    });
  }

  category(){
    if(this.posts.category === 'Sports & Outdoors'){
      this.router.navigate(['/sports'])
    }
    if(this.posts.category === 'Arts & Music'){
      this.router.navigate(['/arts'])
    }
    if(this.posts.category === 'Games'){
      this.router.navigate(['/games'])
    }
    if(this.posts.category === 'Tech'){
      this.router.navigate(['/tech'])
    }
    if(this.posts.category === 'Pets'){
      this.router.navigate(['/pets'])
    }
    if(this.posts.category === 'Others'){
      this.router.navigate(['/others'])
    }
  }

  postUser(){
    let navigationExtras: NavigationExtras = { queryParams: { Uid: this.postUid } };
    this.router.navigate(['/user-posts'], navigationExtras);
  }

  async deletePostSuccessful() {
    const toast = await this.toastController.create({
      message: 'Post Deleted',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }

  async deleteCommentSuccessful() {
    const toast = await this.toastController.create({
      message: 'Comment Deleted',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
  async insertComment() {
    const toast = await this.toastController.create({
      message: 'Please Insert Comment',
      duration: 3500,
      position: 'bottom',
    });
    await toast.present();
  }
}
