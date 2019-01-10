import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
// this component is child of member-list
export class MemberCardComponent implements OnInit {
// import field from parent
@Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
