import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
   /**@Input()  this is what we get from parent component */
  @Output() cancelRegister = new EventEmitter(); /** we can send this to parent component*/
  model: any = {};

  constructor(private authService: AuthService) { }
  ngOnInit() {
  }
  register() {
  this.authService.register(this.model).subscribe(() => {
    console.log('registration: success');
  }, error => {
    console.log(error);
  });
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }

}
