import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InventoryDataSource } from './inventory-datasource';
import { dropDownEffect, fadeEffect } from 'src/app/animations';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { DateService } from 'src/app/shared/services/date.service';
import { CompleteInventory, CompleteInventoryRow } from 'src/app/definitions/inventory-definition';
import { AutoGenOpeningDialogComponent } from 'src/app/shared/components/auto-gen-opening-dialog/auto-gen-opening-dialog.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

const staticColumnsToDisplay = ['productName',
  'stockOpening',
  'stockBalance',
  'stockTotalIn',
  'stockSenIn',
  'stockOthersIn',
  'stockTotalOut'];

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  animations: [fadeEffect, dropDownEffect]
})
export class InventoryComponent implements OnInit, OnDestroy {
  dataSource: InventoryDataSource;
  is1stDayOfMonth: boolean;
  columnsToDisplay = [];
  
  private prodTypeClass = 'productType';
  private compVenList: CompleteVendor[];
  private isOpeningQuestionAsked: boolean;

  private allSubscriptions: Subscription[];

  constructor(
    private readonly service: InventoryService,
    private readonly dialog: MatDialog,
    private readonly datePipe: DatePipe,
    private readonly dateService: DateService
  ) {
    this.isOpeningQuestionAsked = false;
    this.allSubscriptions = new Array<Subscription>();
  }

  ngOnInit() {
    this.dataSource = new InventoryDataSource(this.service);
    this.loadCompleteInventoryData();
    this.allSubscriptions.push(this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteInventoryData();
    }));

    this.allSubscriptions.push(this.dataSource.vendorObservable.subscribe(compVendors => {
      this.compVenList = compVendors;
      this.columnsToDisplay = [];
      staticColumnsToDisplay.forEach(colName => {
        this.columnsToDisplay.push(colName);
      });
      this.compVenList.forEach(compVendor => {
        this.columnsToDisplay.push(compVendor.id);
      });
    }));
  }

  private loadCompleteInventoryData() {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this.is1stDayOfMonth = this.dateService.date.getDate() === 1;
    this.dataSource.loadCompleteInventory(date);
    this.allSubscriptions.push(this.dataSource.doesStockOpeningExist.subscribe(openingExist => {
      if (this.isOpeningQuestionAsked === false && openingExist === false && this.is1stDayOfMonth) {
        this.isOpeningQuestionAsked = true;
        this.allSubscriptions.push(this.openDialog().subscribe(res => {
          if (res) {
            this.dataSource.autoGenerateStockOpening(date);
          }
        }));
      }
    }));
  }

  isRowProductType(inventoryRow: CompleteInventoryRow) {
    return inventoryRow.id.startsWith('pty');
  }
  getRowTypeClass(inventoryRow: CompleteInventoryRow) {
    return this.isRowProductType(inventoryRow) ? this.prodTypeClass : null;
  }

  getProdDetails(inventoryRow: CompleteInventoryRow) {
    if (!this.isRowProductType(inventoryRow) && inventoryRow.prodDets != undefined) {
      return 'Package Size : ' + inventoryRow.prodDets.packageSize + ' - Price : ' + inventoryRow.prodDets.sellingPrice;
    }
    return '';
  }

  getBalance() {
    let total = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total += compInvRow.stockBalance;
      })
    }));

    return 'Total : ' + total;
  }

  getTotalIn() {
    let total = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total += compInvRow.stockTotalIn;
      })
    }));

    return 'Total : ' + total;
  }

  getTotalSenIn() {
    let total = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total += compInvRow.stockSenIn;
      })
    }));

    return 'Total : ' + total;
  }

  getTotalOthersIn() {
    let total = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total += compInvRow.stockOthersIn;
      })
    }));

    return 'Total : ' + total;
  }

  getTotalOut() {
    let total = 0;
    let value = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total += compInvRow.stockTotalOut;
        if (compInvRow.prodDets != null && compInvRow.prodDets != undefined) {
          value += compInvRow.prodDets.sellingPrice.valueOf() * compInvRow.stockTotalOut
        }
      })
    }));

    return 'Total : ' + total + ' - Value : ' + value;
  }

  getVenDetails(ven: CompleteVendor) {
    // console.log(ven.name,' - ',ven.deposit,' - ',ven.totalLoan);
    let totalOut = 0;
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        if (compInvRow.vendorValue[ven.id] != null && compInvRow.vendorValue[ven.id] != undefined) {
          totalOut += compInvRow.prodDets.sellingPrice.valueOf() * compInvRow.vendorValue[ven.id];
        }
      })
    }));

    return 'Total Loan : ' + ven.totalLoan + ' - Opening : ' + ven.openingDp + ' - Out : ' + totalOut;
  }

  private log(data) {
    console.log(data);
  }

  vendorTrackBy(index, ven: CompleteVendor) {
    return ven.id;
  }

  saveButtonPressed() {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    let compInv = new CompleteInventory();
    compInv.rows = new Array();
    this.allSubscriptions.push(this.dataSource.connect().subscribe(compInvRows => {
      compInv.rows = compInvRows;
    }));
    this.allSubscriptions.push(this.dataSource.vendorObservable.subscribe(vendors => {
      compInv.vens = vendors;
    }));
    this.allSubscriptions.push(this.service.saveCompleteInventory(compInv, date).subscribe(resp => {
      this.loadCompleteInventoryData();
    }));
  }

  validateVendorValue(invRow: CompleteInventoryRow, venId: string) {
    if (!this.validateValue(invRow.vendorValue[venId])) {
      invRow.vendorValue[venId] = undefined;
    }
  }

  validateStockOpening(invRow: CompleteInventoryRow) {
    if (!this.validateValue(invRow.stockOpening)) {
      invRow.stockOpening = undefined;
    }
  }

  validateSenIn(invRow: CompleteInventoryRow) {
    if (!this.validateValue(invRow.stockSenIn)) {
      invRow.stockSenIn = undefined;
    }
  }

  validateOthersIn(invRow: CompleteInventoryRow) {
    if (!this.validateValue(invRow.stockOthersIn)) {
      invRow.stockOthersIn = undefined;
    }
  }

  validateValue(val: number) {
    // console.log(`Value 1 : ${val}`);
    if (val != undefined || val != null) {
      if (val <= 0 || (val - Math.round(val)) != 0) {
        return false;
      }
    }
    return true;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AutoGenOpeningDialogComponent, {
      data: null
    });

    return dialogRef.afterClosed();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
