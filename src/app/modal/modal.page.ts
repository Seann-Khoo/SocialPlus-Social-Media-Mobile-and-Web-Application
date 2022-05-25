import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  constructor(private popoverController: PopoverController, private router: Router) { }

  ngOnInit() {
  }

  async close() {
    await this.popoverController.dismiss();
  }

  async phoneLogin(){
    await this.popoverController.dismiss();
    this.router.navigate(['/phone-register'])
  }

}
