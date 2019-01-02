import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;

  constructor( private http: HttpClient) { }

  /**on initialization  component*/
  ngOnInit() {
  }

  /**method we gonna use when we get data from children */
  cancelRegisterMode(registerModeChld: boolean) {
  this.registerMode = registerModeChld;
  }

  registerToggle() {
    this.registerMode = true;
  }
}
