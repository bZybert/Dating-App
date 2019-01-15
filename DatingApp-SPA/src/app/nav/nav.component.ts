import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {}; /**empty object */
photoUrl: string ;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private route: Router) { }

  ngOnInit() {
    // updating user photo displayed on nav bar when logged
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
  this.authService.login(this.model).subscribe(next => {
  this.alertify.success('Logged successfully');
}, error => {
  console.log(error);
}, () => {
  // when user logs in route send him to /members path
  // this could be added to next as well
  this.route.navigate(['/members']);
});
}

loggedIn() {
  // !!true or false
  return this.authService.loggedIn();
}

logout() {
  // after user logout we need to remove data from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // also need to reset value of decodedToken and currentUser fields
  this.authService.decodedToken = null;
  this.authService.currentUser = null;
  // display message to user when he logout
  this.alertify.message('logged out');
  // redirect user to home page
  this.route.navigate(['/home']);
}
}
