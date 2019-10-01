import { Component, OnInit } from '@angular/core';
import { VendorService } from '../services/vendor.service';
import { DateService } from '../services/date.service';
import { Vendor } from '../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { VendorDataSource } from './vendor-view-datasource';

@Component({
  selector: 'vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class VendorViewComponent implements OnInit {
  private dataSource: VendorDataSource;
  private newVendor: Vendor;

  constructor(private service: VendorService,
    private dateService: DateService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new VendorDataSource(this.service);
    this.loadVendorData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadVendorData();
      this.refresh();
    });
  }

  get vendors() {
    return this.dataSource.vendorsObservable;
  }

  refresh() {
    this.newVendor = new Vendor();
  }

  addVenButtonPressed() {
    this.refresh();
  }

  addButtonPressed() {
    let date = this.dateService.date.toISOString();
    this.newVendor._id = null;
    this.service.addVendor(this.newVendor, date).subscribe(resp => {
      this.snackBar.open('Vendor', 'Saved', {
        duration: environment.snackBarDuration
      });
      this.loadVendorData();
    })
    this.refresh();
  }

  cancelButtonPressed() {
    this.refresh();
  }
  private loadVendorData() {
    let date = this.dateService.date.toISOString();
    this.dataSource.loadVendors(date);
  }
}
