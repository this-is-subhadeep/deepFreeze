import { Component, OnDestroy, OnInit } from '@angular/core';
import { VendorService } from '../../shared/services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../../shared/services/date.service';
import { CompleteVendor } from '../../definitions/vendor-definition';
import { fadeEffect, dropDownEffect } from '../../animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'vendor-view',
  templateUrl: './vendor-view.component.html',
  styleUrls: ['./vendor-view.component.scss'],
  animations: [fadeEffect, dropDownEffect]
})
export class VendorViewComponent implements OnInit, OnDestroy {
  completeVendors$: Observable<CompleteVendor[]>;
  newCompleteVendor:CompleteVendor;
  vendorsClosed: Array<string>;

  private allSubscriptions: Subscription[];

  constructor(
    private service:VendorService,
    private datePipe: DatePipe,
    private dateService:DateService
  ) {
    this.vendorsClosed = new Array<string>();
    this.allSubscriptions = new Array<Subscription>();
  }

  ngOnInit() {
    this.loadCompleteVendorData();
    this.refresh();
    this.allSubscriptions.push(this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteVendorData();
      this.service.refresh();
      this.refresh();
    }));
  }

  private refresh() {
    this.newCompleteVendor = new CompleteVendor();
  }

  addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,'yyyy-MM-dd');
    this.newCompleteVendor.id=this.service.nextVendorId;
    this.allSubscriptions.push(this.service.addCompleteVendor(this.newCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    }));
    this.refresh();
  }

  addClosed() {
    this.refresh();
  }

  private loadCompleteVendorData() {
    let date=this.datePipe.transform(this.dateService.date,'yyyy-MM-dd');
    this.completeVendors$ = this.service.findCompleteVendorObservable(date);
  }

  deleteCompleteVendor(venId: string) {
    this.vendorsClosed.push(venId);
  }

  venTracking(index: number, value: CompleteVendor) {
    return value.id;
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
