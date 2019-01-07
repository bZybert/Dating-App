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

  constructor(
    public authService: AuthService,
    private alerify: AlertifyService,
    private route: Router) { }

  ngOnInit() {
  }

  login() {
  this.authService.login(this.model).subscribe(next => {
  this.alerify.success('Logged successfully');
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
  localStorage.removeItem('token');
  this.alerify.message('logged out');
  this.route.navigate(['/home']);
}
}
