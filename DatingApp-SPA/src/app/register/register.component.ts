import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  /**@Input()  this is what we get from parent component */
  @Output()
  cancelRegister = new EventEmitter(); /** we can send this to parent component*/
  user: User;
  registerForm: FormGroup; // using reactive form
  // for change theme of date-picker,
  // we need to config only theme so make Partial class of <BsDatepickerConfig>
  // Partial make every field in BsDatepickerConfig optional
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();

    // this.registerForm = new FormGroup({
    //   // adding validation to form field
    //   // angular methods fo FormControl()
    //   name: new FormControl('', Validators.required), // '' will be displayed like a placeholder in input
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator ); // adding custom validator method
  }
  // method for create form with FormBuilder
  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'], // male option will be selected at start
        name: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { Validators: this.passwordMatchValidator }
    ); // added custom validation method
  }

  // custom validation method
  passwordMatchValidator(g: FormGroup) {
    // get fields password and confirmPassword and compare them values
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      // Object.assign(target object, value cloned to target object);
      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(
        () => {
          this.alertify.success('Registration successfull');
        },
        error => {
          this.alertify.error(error);
        },
        () => {
          // after user successfully registred automaticly login to page
          this.authService.login(this.user).subscribe(() => {
          // redirect user to members page
          this.router.navigate(['/members']) ;
          });
        }
      );
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
