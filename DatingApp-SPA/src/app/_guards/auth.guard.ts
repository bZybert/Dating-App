import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
// need to add this in app.module  providers
// and routes.ts add to path what we want to secure
// CanActivate tell our root if  can or can'r have access
export class AuthGuard implements CanActivate {
constructor(
  private authService: AuthService,
  private router: Router,
  private alertify: AlertifyService) {}

  // it  can returns type: Observable<boolean> | Promise<boolean> | boolean
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // checking if user is logged in
    if (this.authService.loggedIn()) {
      // if true then can activate
      return true;
    }
    // else
    this.alertify.error('You have no access !!');
    // and redirect user to home page
    this.router.navigate(['/home']);

    return false;
  }
}
