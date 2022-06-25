import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompleteInventory } from 'src/app/definitions/inventory-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { DateService } from 'src/app/shared/services/date.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { VendorService } from 'src/app/shared/services/vendor.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  completeVendor: CompleteVendor;
  completeInventory: CompleteInventory;
  constructor(private readonly dateService: DateService,
    private readonly datePipe: DatePipe,
    private readonly activetedRoute: ActivatedRoute,
    private readonly vendorService: VendorService,
    private readonly inventoryService: InventoryService
  ) { }

  ngOnInit() {
    this.loadCompleteVendorData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteVendorData();
    });
  }

  private loadCompleteInventoryData() {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this.inventoryService.findCompleteInventoryForVendor(this.completeVendor.id, date).subscribe(completeInventory => {
      this.completeInventory = completeInventory;
    });
  }

  private loadCompleteVendorData() {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this.activetedRoute.paramMap.subscribe(param => {
      this.vendorService.findCompleteVendor(param.get('venId'),date).subscribe(venResp => {
        this.completeVendor = venResp;
        this.loadCompleteInventoryData();
      });
    });
  }

}
