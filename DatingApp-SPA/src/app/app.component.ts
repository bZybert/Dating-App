import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    /** @auth0 Helper library for handling JWTs in Angular 2+ app */
jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) {}

  // we will store token in third part library
  ngOnInit() {
    const token = localStorage.getItem('token');
    // user from local storage is a type of string so we need to turn it to object
    // user have to be a type User
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      // when application is load the authService will have decoded token - this.authService.decodedToken
      // as long as token is available in local storage - this.jwtHelper.decodeToken(token);
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
