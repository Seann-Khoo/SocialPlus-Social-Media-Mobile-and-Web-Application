import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  constructor(private popoverController: PopoverController, private router: Router) { }

  ngOnInit() {
  }

  async main(){
    await this.popoverController.dismiss();
    this.router.navigate(['/home'])
  }

  async sportsNOutdoors(){
    await this.popoverController.dismiss();
    this.router.navigate(['/sports'])
  }

  async artsNMusic(){
    await this.popoverController.dismiss();
    this.router.navigate(['/arts'])
  }

  async games(){
    await this.popoverController.dismiss();
    this.router.navigate(['/games'])
  }

  async tech(){
    await this.popoverController.dismiss();
    this.router.navigate(['/tech'])
  }

  async pets(){
    await this.popoverController.dismiss();
    this.router.navigate(['/pets'])
  }

  async others(){
    await this.popoverController.dismiss();
    this.router.navigate(['/others'])
  }

  async myPosts(){
    await this.popoverController.dismiss();
    this.router.navigate(['/my-posts'])
  }

}
