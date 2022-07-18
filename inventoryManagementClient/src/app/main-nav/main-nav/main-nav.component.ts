import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';
import { DateService } from 'src/app/shared/services/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  private title = ' Inventory Management System';
  private inventoryClass = '';
  private productClass = '';
  private vendorClass = '';
  private sellingClass = '';
  private datePickerClass = 'datePicker';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        console.log(result.matches);
        return result.matches;
      })
    );

  constructor(
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dateService: DateService) { }

  log(data) {
    console.log(this.dateSelected);
    console.log(data);
  }
  get dateSelected() {
    return this.dateService.date;
  }

  set dateSelected(date: Date) {
    this.dateService.date = date;
    let today = new Date();
    if (today.getFullYear() === date.getFullYear()
      && today.getMonth() === date.getMonth()
      && today.getDate() === date.getDate()) {
      this.datePickerClass = 'datePicker';
    } else {
      this.datePickerClass = 'datePickerDiff';
    }
    this.dateService.dateChangeListener.next();
  }

  itemClicked(compName: string, drawer: MatSidenav) {
    this.inventoryClass = '';
    this.productClass = '';
    this.vendorClass = '';
    this.sellingClass = ''
    if(compName) {
      switch (compName) {
        case 'products': this.productClass = 'active'; break;
        case 'vendors': this.vendorClass = 'active'; break;
        case 'selling': this.sellingClass = 'active'; break;
        default : this.inventoryClass = 'active'; break;
      }
      this.router.navigate([`/${compName}`]);
    }
    drawer.close();
  }
  navigateTo(pageName) {
    switch (pageName) {
      case 'products': this.router.navigate(['/products']); break;
      default: this.router.navigate(['/inventory']);
    }
  }
}
