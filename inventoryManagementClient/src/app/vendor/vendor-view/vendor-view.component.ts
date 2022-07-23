import { Component, OnDestroy, OnInit } from '@angular/core';
import { VendorService } from '../../shared/services/vendor.service';
import { DateService } from '../../shared/services/date.service';
import { CompleteVendor } from '../../definitions/vendor-definition';
import { fadeEffect, dropDownEffect } from '../../animations';
import { Observable, Subscription } from 'rxjs';
import { CustomDatePipe } from 'src/app/shared/pipes/custom-date.pipe';

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
    private datePipe: CustomDatePipe,
    private dateService: DateService
  ) { }

  ngOnInit() {
    this.loadCompleteVendorData(this.datePipe.transform(this.dateService.date));
    this.refresh();
    this.allSubscriptions.push(this.dateService.dateChange$.subscribe(date => {
      this.loadCompleteVendorData(this.datePipe.transform(date));
      this.service.refresh();
      this.refresh();
    }));
  }

  private refresh() {
    this.newCompleteVendor = new CompleteVendor();
  }

  addButtonPressed() {
    const dateStr = this.datePipe.transform(this.dateService.date);
    if (this.service.nextVendorId && dateStr) {
      this.newCompleteVendor.id = this.service.nextVendorId;
      this.allSubscriptions.push(this.service.addCompleteVendor(this.newCompleteVendor, dateStr).subscribe(resp => {
        this.loadCompleteVendorData(dateStr);
        this.service.refresh();
      }));
      this.refresh();
    }
  }

  addClosed() {
    this.refresh();
  }

  private loadCompleteVendorData(date: string) {
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
