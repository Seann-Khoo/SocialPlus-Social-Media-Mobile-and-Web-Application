import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

  async logout() {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
