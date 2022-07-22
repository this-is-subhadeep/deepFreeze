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
  completeVendors$: Observable<CompleteVendor[]> | undefined;
  newCompleteVendor: CompleteVendor = new CompleteVendor();
  vendorsClosed: Array<string> = new Array<string>();

  private allSubscriptions: Subscription[] = new Array<Subscription>();

  constructor(
    private service: VendorService,
    private datePipe: DatePipe,
    private dateService: DateService
  ) { }

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
    const date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    if (this.service.nextVendorId && date) {
      this.newCompleteVendor.id = this.service.nextVendorId;
      this.allSubscriptions.push(this.service.addCompleteVendor(this.newCompleteVendor, date).subscribe(resp => {
        this.loadCompleteVendorData();
        this.service.refresh();
      }));
      this.refresh();
    }
  }

  addClosed() {
    this.refresh();
  }

  private loadCompleteVendorData() {
    const date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    if (date) {
      this.completeVendors$ = this.service.findCompleteVendorObservable(date);
    }
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
