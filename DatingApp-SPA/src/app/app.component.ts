import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


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
    if (token) {
      // when application is load the authService will have decoded token - this.authService.decodedToken
      // as long as token is available in local storage - this.jwtHelper.decodeToken(token);
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
