import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { InventoryDataSource } from './inventory-datasource';
import { fadeInEffect, dropDownEffect } from '../animations';
import { UIInventoryRow, Inventory, InventoryRow } from './inventory-definition';
import { VendorService } from '../services/vendor.service';
import { Vendor } from '../vendor/vendor-definition';
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
    let infoText = "";
    if(ven.totalLoan) {
      infoText += `Total Loan : ${ven.totalLoan}`;
    }
    if(ven.openingDp) {
      if(infoText!== "") {
        infoText += " - ";
      }
      infoText += `Opening : ${ven.openingDp}}`;
    }
    return infoText;
  }

  private log(data) {
    console.log(data);
  }

  private vendorTrackBy(index, ven:Vendor) {
    return ven._id;
  }

  private saveButtonPressed() {
    let date = this.dateService.date.toISOString();
    let inv = new Inventory();
    this.dataSource.connect().subscribe(uiInvRows => {
      uiInvRows.forEach(uiInvRow => {
        if(!uiInvRow.id.startsWith('typ') && (uiInvRow.stockTotalIn || uiInvRow.stockTotalOut)) {
          const invRow = new InventoryRow();
          invRow.stockSenIn = uiInvRow.stockSenIn;
          invRow.stockOthersIn = uiInvRow.stockOthersIn;
          for(const ven in uiInvRow.vendorValue) {
            invRow.vendorValue[ven] = {
              packages : 0,
              pieces : uiInvRow.vendorValue[ven]
            }
          }
          inv.rows[uiInvRow.id] = invRow;
        }
      })
    });
    // this.dataSource.vendorObservable.subscribe(vendors => {
    //   compInv.vens = vendors;
    // })
    this.service.saveInventory(inv, date).subscribe(resp => {
      this.loadInventoryData();
    });
  }

  private validateVendorValue(invRow:UIInventoryRow, venId:string) {
    if(!this.validateValue(invRow.vendorValue[venId])) {
      invRow.vendorValue[venId] = undefined;
    }
  }

  private syncTotalIn(invRow:UIInventoryRow) {
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

  private syncTotalOut(invRow:UIInventoryRow) {
    const prod: Product[] = this.prodList.filter(product => product._id === invRow.id);
    if(prod && prod.length>0) {
      if(invRow.vendorValue) {
        let stockTotalOut = 0;
        this.venList.forEach(ven => {
          if(invRow.vendorValue[ven._id]) {
            stockTotalOut = stockTotalOut + invRow.vendorValue[ven._id];
          }
        });
        if(stockTotalOut) {
          invRow.stockTotalOut = stockTotalOut;
        }
      }
    }
    this.syncBalance(invRow);
  }

  private syncBalance(invRow:UIInventoryRow) {
    if(invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn - invRow.stockTotalOut;
    } else if(invRow.stockTotalIn && !invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn;
    } else if(!invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = 0 - invRow.stockTotalOut;
    }
  }

  private validateSenIn(invRow:UIInventoryRow) {
    if(!this.validateValue(invRow.stockSenIn)) {
      invRow.stockSenIn = undefined;
    }
  }

  private validateOthersIn(invRow:UIInventoryRow) {
    if(!this.validateValue(invRow.stockOthersIn)) {
      invRow.stockOthersIn = undefined;
    }
  }

  private validateValue(val:Number) {
    if(val!=undefined || val!=null) {
      if(val <= 0 || (val.valueOf()-Math.round(val.valueOf()))!=0) {
        return false;
      }
    }
    return true;
  }
}
