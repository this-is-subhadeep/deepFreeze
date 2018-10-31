import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { InventoryDataSource } from './inventory-datasource';
import { fadeInEffect, dropDownEffect } from '../animations';
import { CompleteInventoryRow, CompleteInventory } from './inventory-definition';
import { VendorService } from '../services/vendor.service';
import { CompleteVendor } from '../vendor/vendor-definition';
import { VendorDataSource } from '../vendor/vendor-datasource';
import { BehaviorSubject } from 'rxjs';

const staticColumnsToDisplay=["productName",
                              "stockOpening",
                              "stockBalance",
                              "stockTotalIn",
                              "stockSenIn",
                              "stockOthersIn",
                              "stockTotalOut"];

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class InventoryComponent implements OnInit {
  private dataSource:InventoryDataSource;
  private columnsToDisplay=[];
  private prodTypeClass="productType";
  private compVenList:CompleteVendor[];

  constructor(private service: InventoryService, private vendorService: VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource = new InventoryDataSource(this.service);
    this.loadCompleteInventoryData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteInventoryData();
    });

    this.dataSource.vendorObservable.subscribe(compVendors => {
      this.compVenList=compVendors;
      this.columnsToDisplay=[];
      staticColumnsToDisplay.forEach(colName => {
        this.columnsToDisplay.push(colName);
      });
      this.compVenList.forEach(compVendor => {
        this.columnsToDisplay.push(compVendor.id);
      });
    });
  }

  private loadCompleteInventoryData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.dataSource.loadCompleteInventory(date);
    // console.log(this.dataSource);
  }

  private isRowProductType(inventoryRow:CompleteInventoryRow) {
    return inventoryRow.id.startsWith("pty");
  }
  private getRowTypeClass(inventoryRow:CompleteInventoryRow) {
    return this.isRowProductType(inventoryRow)?this.prodTypeClass:null;
  }

  private getProdDetails(inventoryRow:CompleteInventoryRow) {
    if(!this.isRowProductType(inventoryRow) && inventoryRow.prodDets!=undefined) {
      return "Package Size : "+inventoryRow.prodDets.packageSize+" - Price : "+inventoryRow.prodDets.sellingPrice;
    }
    return "";
  }

  private getBalance() {
    let total = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total+=compInvRow.stockBalance;
      })
    });

    return "Total : "+total;
  }
  
  private getTotalIn() {
    let total = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total+=compInvRow.stockTotalIn;
      })
    });

    return "Total : "+total;
  }
  
  private getTotalSenIn() {
    let total = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total+=compInvRow.stockSenIn;
      })
    });

    return "Total : "+total;
  }
  
  private getTotalOthersIn() {
    let total = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total+=compInvRow.stockOthersIn;
      })
    });

    return "Total : "+total;
  }
  
  private getTotalOut() {
    let total = 0;
    let value = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        total+=compInvRow.stockTotalOut;
        if(compInvRow.prodDets!=null && compInvRow.prodDets!=undefined) {
          value+=compInvRow.prodDets.sellingPrice.valueOf()*compInvRow.stockTotalOut
        }
      })
    });

    return "Total : "+total+" - Value : "+value;
  }

  private  getVenDetails(ven:CompleteVendor) {
    // console.log(ven.name," - ",ven.deposit," - ",ven.totalLoan);
    let totalOut = 0;
    this.dataSource.connect().subscribe(compInvRows => {
      compInvRows.forEach(compInvRow => {
        if(compInvRow.vendorValue[ven.id]!=null && compInvRow.vendorValue[ven.id]!=undefined) {
          totalOut+=compInvRow.prodDets.sellingPrice.valueOf()*compInvRow.vendorValue[ven.id];
        }
      })
    });

    return "Total Loan : "+ven.totalLoan+" - Opening : "+ven.openingDp+" - Out : "+totalOut;
  }

  private log(data) {
    console.log(data);
  }

  vendorTrackBy(index, ven:CompleteVendor) {
    return ven.id;
  }

  private saveButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let compInv = new CompleteInventory();
    compInv.rows = new Array();
    this.dataSource.connect().subscribe(compInvRows => {
      compInv.rows = compInvRows;
    });
    this.dataSource.vendorObservable.subscribe(vendors => {
      compInv.vens = vendors;
    })
    this.service.saveCompleteInventory(compInv, date).subscribe(resp => {
      this.loadCompleteInventoryData();
    });
  }

  validateVendorValue(invRow:CompleteInventoryRow, venId:string) {
    if(!this.validateValue(invRow.vendorValue[venId])) {
      invRow.vendorValue[venId] = undefined;
    }
  }

  validateSenIn(invRow:CompleteInventoryRow) {
    if(!this.validateValue(invRow.stockSenIn)) {
      invRow.stockSenIn = undefined;
    }
  }

  validateOthersIn(invRow:CompleteInventoryRow) {
    if(!this.validateValue(invRow.stockOthersIn)) {
      invRow.stockOthersIn = undefined;
    }
  }

  validateValue(val:number) {
    // console.log(`Value 1 : ${val}`);
    if(val!=undefined || val!=null) {
      if(val <= 0 || (val-Math.round(val))!=0) {
        return false;
      }
    }
    return true;
  }
}
