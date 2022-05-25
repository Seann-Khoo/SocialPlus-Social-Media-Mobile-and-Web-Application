import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-category',
  templateUrl: './listing-category.page.html',
  styleUrls: ['./listing-category.page.scss'],
})
export class ListingCategoryPage implements OnInit {

  constructor(private popoverController: PopoverController, private router: Router) { }

  ngOnInit() {
  }

  async main(){
    await this.popoverController.dismiss();
    this.router.navigate(['/marketplace'])
  }

  async myListings(){
    await this.popoverController.dismiss();
    this.router.navigate(['/my-listings'])
  }

}
