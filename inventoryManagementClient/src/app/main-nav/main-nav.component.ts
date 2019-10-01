import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateService } from '../services/date.service';
import { PrintService } from '../services/print.service';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  longTitle = "Inventory Management System";
  shortTitle = "IMS";
  datePickerClass = "datePicker";
  routesList = [
    {
      route: '/inventory',
      label: 'Inventory'
    },
    {
      route: '/opening',
      label: 'Stock Opening'
    },
    {
      route: '/buying',
      label: 'Buy'
    },
    {
      route: '/selling',
      label: 'Sell'
    },
    {
      route: '/products',
      label: 'Products'
    },
    {
      route: '/vendors',
      label: 'Vendors'
    }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver,
    private dateService: DateService,
    public printService: PrintService) { }

  get dateSelected() {
    return this.dateService.date;
  }

  set dateSelected(date: Date) {
    this.dateService.date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    let today = new Date();
    if (today.getFullYear() === date.getFullYear()
      && today.getMonth() === date.getMonth()
      && today.getDate() === date.getDate()) {
      this.datePickerClass = "datePicker";
    } else {
      this.datePickerClass = "datePickerDiff";
    }
    this.dateService.dateChangeListener.next();
  }

}
