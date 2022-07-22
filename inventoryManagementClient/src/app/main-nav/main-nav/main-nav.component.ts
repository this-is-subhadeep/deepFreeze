import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { DateService } from 'src/app/shared/services/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  title = ' Inventory Management System';
  inventoryClass = '';
  productClass = '';
  vendorClass = '';
  sellingClass = '';
  datePickerClass = 'datePicker';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  constructor(
    private readonly router: Router,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dateService: DateService) { }

  get dateSelected() {
    return this.dateService.date;
  }

  set dateSelected(date: Date) {
    this.dateService.date = date;
    const today = new Date();
    if (today.getFullYear() === date.getFullYear()
      && today.getMonth() === date.getMonth()
      && today.getDate() === date.getDate()) {
      this.datePickerClass = 'datePicker';
    } else {
      this.datePickerClass = 'datePickerDiff';
    }
    this.dateService.dateChangeListener.next(null);
  }

  itemClicked(compName: string, drawer: MatSidenav) {
    this.inventoryClass = '';
    this.productClass = '';
    this.vendorClass = '';
    this.sellingClass = '';
    if (compName) {
      switch (compName) {
        case 'products': this.productClass = 'active'; break;
        case 'vendors': this.vendorClass = 'active'; break;
        case 'selling': this.sellingClass = 'active'; break;
        default: this.inventoryClass = 'active'; break;
      }
      this.router.navigate([`/${compName}`]);
    }
    drawer.close();
  }

}
