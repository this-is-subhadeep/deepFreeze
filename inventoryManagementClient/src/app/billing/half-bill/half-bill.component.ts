import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CompleteInventory } from 'src/app/definitions/inventory-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { DateService } from 'src/app/shared/services/date.service';

@Component({
  selector: 'app-half-bill',
  templateUrl: './half-bill.component.html',
  styleUrls: ['./half-bill.component.scss']
})
export class HalfBillComponent implements OnInit {

  @Input() completeVendor: CompleteVendor;
  @Input() completeInventory: CompleteInventory;

  selectedDate: string | null;

  constructor(
    private readonly dateService: DateService,
    private readonly datePipe: DatePipe
  ) {
    this.completeVendor = new CompleteVendor();
    this.completeInventory = new CompleteInventory();
    this.selectedDate = '';
  }

  ngOnInit() {
    this.selectedDate = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this.dateService.dateChangeListener.subscribe(() => {
      this.selectedDate = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    });
  }

  getGrossTotal(): number {
    let grossTotal = 0;
    if (this.completeInventory.rows) {
      this.completeInventory.rows.forEach(row => {
        if (row.id.startsWith('itm') && row.vendorValue[this.completeVendor.id] && row.prodDets && row.prodDets.sellingPrice) {
          grossTotal += row.vendorValue[this.completeVendor.id] * row.prodDets.sellingPrice.valueOf();

        }
      });
    }
    return grossTotal;
  }

  getTotalDiscount(): number {
    let totalDiscount = 0;
    if (this.completeInventory.rows && this.completeVendor.id) {
      this.completeInventory.rows.forEach(row => {
        if (row && row.id && row.id.startsWith('itm') && row.vendorValue[this.completeVendor.id]
          && row.prodDets && row.prodDets.sellingPrice && row.prodDets.productType.discount) {
          totalDiscount +=
            row.vendorValue[this.completeVendor.id] *
            row.prodDets.sellingPrice.valueOf() *
            row.prodDets.sellingPrice.valueOf() *
            row.prodDets.productType.discount.valueOf() / 100;
        }
      });
    }
    return totalDiscount;
  }

  getNetTotal(): number {

    if (this.completeVendor.deposit) {
      return this.getGrossTotal() - this.getTotalDiscount() - this.completeVendor.deposit;
    }
    return 0;
  }
}
