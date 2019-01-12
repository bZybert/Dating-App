import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
/**
 * component for editing user profile
 need to add in app.module
 need to create route path in routes.ts*/
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;  // this field gives as possibility to reset form
  user: User;
  /**
   * if user make any changes in form (.dirty) (editForm our form name)
     and try to close page in browser
    dialog box will popup with information for user that he will lost unsaved changes*/
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
     // tslint:disable-next-line:no-unused-expression
     $event.returnValue.true;
    }
  }

  constructor(
private route: ActivatedRoute,
private alertify: AlertifyService,
private userService: UserService,
private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
    this.user = data['user'];  // resolver added to this path
    });

  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile updated successfully');
      // reset form after submit
      // we send this.user property to display updated user data after reset form
      // in other way we will se blank form after reset
      // @ViewChild('editForm') editForm: NgForm;  gives as access to reset method
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });

  }
  }


