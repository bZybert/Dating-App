import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private http: HttpClient) {}

  /**what happend on initialization  component*/
  ngOnInit() {
    this.GetValues();
  }

  GetValues() {
    /** in http.get method we set directory from gonna get our data,  */
    /** http://localhost:5000/api/values  our back-end localhost   */
    this.http.get('http://localhost:5000/api/values').subscribe(
      response => {
        this.values = response;
      },
      error => {
        console.log(error);
      }
    );
  }
}
