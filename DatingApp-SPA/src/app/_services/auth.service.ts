import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

/**@Injectable means that services can be injected*/
@Injectable({
  providedIn: 'root'
  /** we need to specify witch module will provide this services root = app,
  also we need add AuthService to app.module.ts in providers section*/
})

export class AuthService {
  /** url from backend with our users (set in environments/environments.ts)*/
baseUrl = environment.apiUrl + 'auth/';
/** @auth0 Helper library for handling JWTs in Angular 2+ app */
jwtHelper = new JwtHelperService();
// variable for decoded token
decodedToken: any;
currentUser: User;
// BehaviorSubject - for sending data: any to any component
// always must have some value so we set initial value as default user.png img
photoUrl = new BehaviorSubject<string>('../../assets/user.png');
currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

// method for update photoUrl for next photo
changeMemberPhoto(photoUrl: string) {
this.photoUrl.next(photoUrl);
}

login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
            const user = response;
            if (user) {
              // token from user in local storage
              localStorage.setItem('token', user.token);
              // user, we get from server an object so need to change it to string with JSON.stringify method
              localStorage.setItem('user', JSON.stringify(user.user));
              // assign user what we received with token to currentUser
              this.currentUser = user.user;
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              this.changeMemberPhoto(this.currentUser.photoUrl);
      }
    })
  );
}
register(model: any) {
return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
  const token = localStorage.getItem('token');

  // checking with jwthelper library if token is expired, (in this case it also means this really a token)
  // return boolean
  return !this.jwtHelper.isTokenExpired(token);
}
}
