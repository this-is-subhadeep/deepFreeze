import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userFormGroup: FormGroup;
  passwordType: "password";

  constructor(private service: UserService, private routeService: RouteService) { }

  ngOnInit() {
    this.userFormGroup = new FormGroup({
      _id: new FormControl(),
      password: new FormControl()
    });
  }

  onSubmit() {
    this.service.userLogin({
      _id: this.userFormGroup.value._id,
      password: this.userFormGroup.value.password
    }).subscribe(resp => {
      console.log(resp);
      this.service.bearerToken = resp.token;
      this.routeService.routeToAppStart();
    }, error => {
      console.log(error.error);
    });
  }

}
