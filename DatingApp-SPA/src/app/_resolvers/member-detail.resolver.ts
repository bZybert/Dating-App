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
// also implement in Route.ts  members path
export class MemberDetailResolver implements Resolve<User> {

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        // id for get user - route.params['id']
        // getting to user from parameter
        return this.userService.getUser(route.params['id']).pipe(
            // if there is a problem catch error
            catchError( error => {
                this.alertify.error('Problem with retrieving data');
                // navigate back to members page
                this.router.navigate(['/members']) ;
                // return observable of null
                return of(null);
            })
        ) ;
    }

}