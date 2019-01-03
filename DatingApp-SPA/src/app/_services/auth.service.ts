import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

/**@Injectable means that services can be injected*/
@Injectable({
  providedIn: 'root'
  /** we need to specify witch module will provide this services root = app,
  also we need add AuthService to app.module.ts in providers section*/
})
export class AuthService {
  /** url from backend with our users */
baseUrl = 'http://localhost:5000/api/auth/';

/** @auth0 Helper library for handling JWTs in Angular 2+ app */
jwtHelper = new JwtHelperService();

decodedToken: any;

constructor(private http: HttpClient) { }

login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
            const user = response;
            if (user) {
              localStorage.setItem('token', user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              console.log(this.decodedToken);
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
