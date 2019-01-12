import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
// with resolver we will get all data before we activate route itself

// needed to add this class in app.module providers
// also implement in Route.ts  member/edit path
export class MemberEditResolver implements Resolve<User> {

    constructor(
        private userService: UserService,
        private router: Router,
        private alertify: AlertifyService,
        private authService: AuthService
        ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // getting to user from parameter
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            // if there is a problem catch error
            catchError( error => {
                this.alertify.error('Problem with retrieving your data');
                // navigate back to members page
                this.router.navigate(['/members']) ;
                // return observable of null
                return of(null);
            })
        ) ;
    }

}