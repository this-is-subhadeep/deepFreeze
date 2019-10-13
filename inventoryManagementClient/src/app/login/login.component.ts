import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInEffect } from '../animations';
import { RouteService } from '../services/route.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInEffect]
})
export class LoginComponent implements OnInit {
  userFormGroup: FormGroup;
  showPassword = false;

  constructor(private service: UserService,
    private routeService: RouteService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.userFormGroup = this.fb.group({
      _id: [
        '', [
          Validators.required
        ]
      ],
      password: [
        '', [
          Validators.required
        ]
      ]
    });
  }

  onSubmit() {
    console.log('On Submit');
    this.service.userLogin({
      _id: this.userFormGroup.value._id,
      password: this.userFormGroup.value.password
    }).subscribe(resp => {
      this.service.bearerToken = resp.token;
      this.routeService.routeToAppStart();
    }, error => {
      console.log(error.error[0].code);
      let errorCode = 'S001';
      if (error.status === 504) {
        errorCode = 'S007'
      } else if (error.error && error.error[0] && error.error[0].code) {
        errorCode = error.error[0].code;
      }
      this.routeService.routeToError(errorCode);
    });
  }

  visbilityToggle() {
    this.showPassword = !this.showPassword;
  }

}
