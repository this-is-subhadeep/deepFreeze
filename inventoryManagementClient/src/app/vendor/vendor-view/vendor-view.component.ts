import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../shared/services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../../shared/services/date.service';
import { CompleteVendor } from '../../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../../animations';

@Component({
  selector: 'vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class VendorViewComponent implements OnInit {
  private completeVendors: CompleteVendor[];
  private newCompleteVendor:CompleteVendor;

  constructor(private service:VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.loadCompleteVendorData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteVendorData();
      this.service.refresh();
      this.refresh();
    });
  }

  private refresh() {
    this.newCompleteVendor = new CompleteVendor();
  }

  private addVenButtonPressed() {
    this.refresh();
  }

  private addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.newCompleteVendor.id=this.service.nextVendorId;
    this.service.addCompleteVendor(this.newCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    })
    this.refresh();
  }

  private addClosed() {
    this.refresh();
  }

  private loadCompleteVendorData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.service.findCompleteVendorObservable(date).subscribe(completeVendors => {
      this.completeVendors=completeVendors;
    })
  }
}
