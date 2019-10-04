import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { fadeInEffect } from '../animations';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
  animations: [fadeInEffect]
})
export class ErrorPageComponent implements OnInit {
  errorCode: string;
  errorText: String;
  constructor(route: ActivatedRoute, private errorService: ErrorService) {
    this.errorCode = route.snapshot.params['code'];
  }

  ngOnInit() {
    this.errorText = this.errorService.getErrorDescription(this.errorCode);
  }

}
