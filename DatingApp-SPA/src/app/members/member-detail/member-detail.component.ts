import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
user: User;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute // needed to get user id
    ) { }

  ngOnInit() {
    this.loadUser();
  }
loadUser() {
  // this.router.snapshot.params['id'] - our id parameter taking from url
  // url is string and when we add '+' in front it convert it to number (+this.route.snapshot.params['id'])
  return this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  this.user = user;
  }, error => {
    this.alertify.error(error);
  });
}

}
