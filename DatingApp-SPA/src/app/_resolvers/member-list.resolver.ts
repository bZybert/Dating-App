import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
// with resolver we will get all data before we activate route itself

// needed to add this class in app.module providers
// also implement in Route.ts  list path
// <User[]> we get array of all users
export class MemberListResolver implements Resolve<User[]> {

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        // getting to all users
        return this.userService.getUsers().pipe(
            // if there is a problem catch error
            catchError( error => {
                this.alertify.error('Problem with retrieving data');
                // navigate back to home page
                this.router.navigate(['/home']) ;
                // return observable of null
                return of(null);
            })
        ) ;
    }

}
