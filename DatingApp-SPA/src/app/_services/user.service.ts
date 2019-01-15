import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


// setting manually header for token request
/**
const httpOptions = {
  headers: new HttpHeaders({
'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
}; */

@Injectable({
  providedIn: 'root'
})
// needed to add this service in app.module  providers
export class UserService {
baseUrl = environment.apiUrl;  // we set base url address in environments/environments.ts (http://localhost:5000/api/' )

constructor(private http: HttpClient) { }

// return type Observable array of users
getUsers(): Observable<User[]> {
  // we need to tell get method what we will returning <User[]> type
  // added httpOptions to set header in get method
  // return this.http.get<User[]>(this.baseUrl + 'users', httpOptions)
    return this.http.get<User[]>(this.baseUrl + 'users');

}

getUser(id): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user);
}

setMainPhoto(userId: number, id: number) {
  // post required send some data in body thats wy we add empty object {}
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {} ) ;
}

deletePhoto(userId: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}
}
