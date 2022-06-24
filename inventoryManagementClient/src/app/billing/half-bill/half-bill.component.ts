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

  private selectedDate : string;

  constructor(
    private readonly dateService: DateService,
    private readonly datePipe: DatePipe
  ) {
    this.selectedDate = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
  }

  ngOnInit() {
  }

}
