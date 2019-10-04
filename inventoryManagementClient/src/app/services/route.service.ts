import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private router: Router) { }

  routeToError(code) {
    this.router.navigate(['error', code]);
  }

  routeToPrint(docData) {
    this.router.navigate(['selling', {
      outlets: {
        'print': ['print', docData]
      }
    }]);
  }

  routeToSelling() {
    this.router.navigate(['selling']);
  }
}
