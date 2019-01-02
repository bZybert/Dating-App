import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

/**@Injectable means that services can be injected*/
@Injectable({
  providedIn: 'root'
  /** we need to specify witch module will provide this services root = app,
  also we need add AuthService to app.module.ts in providers section*/
})
export class AuthService {
  /** url from backend with our users */
baseUrl = 'http://localhost:5000/api/auth/';

constructor(private http: HttpClient) { }

login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
            const user = response;
            if (user) {
              localStorage.setItem('token', user.token);
      }
    })
  );
}
register(model: any) {
return this.http.post(this.baseUrl + 'register', model);
}
}
