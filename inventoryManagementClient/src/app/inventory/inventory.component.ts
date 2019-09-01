import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { InventoryDataSource } from './inventory-datasource';
import { fadeInEffect, dropDownEffect } from '../animations';
import { UIInventoryRow, Inventory, InventoryRow } from './inventory-definition';
import { VendorService } from '../services/vendor.service';
import { Vendor } from '../vendor/vendor-definition';
import { VendorDataSource } from '../vendor/vendor-datasource';
import { P } from '@angular/core/src/render3';
import { Product } from '../product/product-definition';

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
  private pageSize=1000;
  private pageIndex=0;
  private prodTypeClass="productType";
  private venList:Vendor[];
  private prodList:Product[];

  constructor(private service: InventoryService, private vendorService: VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource = new InventoryDataSource(this.service);
    this.loadInventoryData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryData();
    });

    this.dataSource.vendorObservable.subscribe(vendors => {
      this.venList=vendors;
      this.columnsToDisplay=[];
      staticColumnsToDisplay.forEach(colName => {
        this.columnsToDisplay.push(colName);
      });
      this.venList.forEach(vendor => {
        this.columnsToDisplay.push(vendor._id);
      });
    });

    this.dataSource.prodObservable.subscribe(products => {
      this.prodList=products;
    });
  }

  private loadInventoryData() {
    let date = this.dateService.date.toISOString();
    this.dataSource.loadInventory(date,this.pageSize,this.pageIndex+1);
    // console.log(this.dataSource);
  }

  private isRowProductType(inventoryRow:UIInventoryRow) {
    return inventoryRow.id.startsWith("typ");
  }
  private getRowTypeClass(inventoryRow:UIInventoryRow) {
    return this.isRowProductType(inventoryRow)?this.prodTypeClass:null;
  }

  private getProdDetails(inventoryRow:UIInventoryRow) {
    if(!this.isRowProductType(inventoryRow) && inventoryRow.prodDets!=undefined) {
      return "Package Size : "+inventoryRow.prodDets.packageSize+" - Price : "+inventoryRow.prodDets.sellingPrice;
    }
    return "";
  }

  private  getVenDetails(ven:Vendor) {
    // console.log(ven.name," - ",ven.deposit," - ",ven.totalLoan);
    return "Total Loan : "+ven.totalLoan+" - Opening : "+ven.openingDp;
  }

  private log(data) {
    console.log(data);
  }

  vendorTrackBy(index, ven:Vendor) {
    return ven._id;
  }

  private saveButtonPressed() {
    let date = this.dateService.date.toISOString();
    let inv = new Inventory();
    this.dataSource.connect().subscribe(uiInvRows => {
      console.log(uiInvRows);
      uiInvRows.forEach(uiInvRow => {
        if(!uiInvRow.id.startsWith('typ') && uiInvRow.stockOpening!== uiInvRow.stockBalance) {
          const invRow = new InventoryRow();
          invRow.stockSenIn = uiInvRow.stockSenIn;
          invRow.stockOthersIn = uiInvRow.stockOthersIn;
          console.log(invRow);
          for(const ven in uiInvRow.vendorValue) {
            console.log(`ven : ${ven}`);
            invRow.vendorValue[ven] = {
              packages : 0,
              pieces : uiInvRow.vendorValue[ven]
            }
          }
          inv.rows[uiInvRow.id] = invRow;
        }
      })
    });
    console.log(`inv : ${JSON.stringify(inv)}`);
    // this.dataSource.vendorObservable.subscribe(vendors => {
    //   compInv.vens = vendors;
    // })
    this.service.saveInventory(inv, date).subscribe(resp => {
      this.loadInventoryData();
    });
  }

  validateVendorValue(invRow:UIInventoryRow, venId:string) {
    if(!this.validateValue(invRow.vendorValue[venId])) {
      invRow.vendorValue[venId] = undefined;
    }
  }

  syncTotalIn(invRow:UIInventoryRow) {
    const prod: Product[] = this.prodList.filter(product => product._id === invRow.id);
    if(prod && prod.length>0) {
      if(invRow.stockSenIn && invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockSenIn * prod[0].packageSize + invRow.stockOthersIn;
      } else if(invRow.stockSenIn && !invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockSenIn * prod[0].packageSize;
      } else if(!invRow.stockSenIn && invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockOthersIn;
      }
    }
    this.syncBalance(invRow);
  }

  syncTotalOut(invRow:UIInventoryRow, venId: string) {
    const prod: Product[] = this.prodList.filter(product => product._id === invRow.id);
    if(prod && prod.length>0) {
      if(invRow.vendorValue && invRow.vendorValue[venId]) {
        invRow.stockTotalOut = invRow.stockTotalOut ? invRow.stockTotalOut + invRow.vendorValue[venId] : invRow.vendorValue[venId];
      }
    }
    this.syncBalance(invRow);
  }

  syncBalance(invRow:UIInventoryRow) {
    if(invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn - invRow.stockTotalOut;
    } else if(invRow.stockTotalIn && !invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn;
    } else if(!invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = 0 - invRow.stockTotalOut;
    }
  }

  validateSenIn(invRow:UIInventoryRow) {
    if(!this.validateValue(invRow.stockSenIn)) {
      invRow.stockSenIn = undefined;
    }
  }

  validateOthersIn(invRow:UIInventoryRow) {
    if(!this.validateValue(invRow.stockOthersIn)) {
      invRow.stockOthersIn = undefined;
    }
  }

  validateValue(val:Number) {
    // console.log(`Value 1 : ${val}`);
    if(val!=undefined || val!=null) {
      if(val <= 0 || (val.valueOf()-Math.round(val.valueOf()))!=0) {
        return false;
      }
    }
    return true;
  }
}
