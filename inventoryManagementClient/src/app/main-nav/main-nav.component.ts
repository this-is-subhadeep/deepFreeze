import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateService } from '../services/date.service';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  private title = " Inventory Management System";
  private inventoryClass = "";
  private productClass = "";
  private vendorClass = "";
  private datePickerClass = "datePicker";
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(private breakpointObserver: BreakpointObserver, private dateService:DateService) {}

  log(data) {
    console.log(this.dateSelected);
    console.log(data);
  }
  get dateSelected() {
    return this.dateService.date;
  }

  set dateSelected(date:Date) {
    console.log(`dateSelected : ${JSON.stringify(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())))}`);
    this.dateService.date=new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    let today = new Date();
    // console.log("today",today.getFullYear(),"-",today.getMonth(),"-",today.getDate());
    // console.log("date",date.getFullYear(),"-",date.getMonth(),"-",date.getDate());
    if(today.getFullYear() === date.getFullYear()
      && today.getMonth()  === date.getMonth()
      && today.getDate()    === date.getDate()) {
      this.datePickerClass = "datePicker";
    } else {
      this.datePickerClass = "datePickerDiff";
    }
    this.dateService.dateChangeListener.next();
  }

  itemClicked(compName:string) {
    // console.log(compName);
    this.inventoryClass = "";
    this.productClass = "";
    this.vendorClass = "";
      switch(compName) {
      case 'inventory' : this.inventoryClass = "active"; break;
      case 'products' : this.productClass = "active"; break;
      case 'vendors' : this.vendorClass = "active"; break;
    }
  }
}
