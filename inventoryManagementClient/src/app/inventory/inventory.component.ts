import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { InventoryDataSource } from './inventory-datasource';
import { fadeInEffect, dropDownEffect } from '../animations';
import { UIInventoryRow, Inventory, InventoryRow } from '../definitions/inventory-definition';
import { Vendor } from '../definitions/vendor-definition';
import { Product } from '../definitions/product-definition';
import { MatSnackBar, MatSlideToggleChange } from '@angular/material';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from '../services/product.service';
import { VendorService } from '../services/vendor.service';
import { RouteService } from '../services/route.service';

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
  styleUrls: ['./inventory.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class InventoryComponent implements OnInit {
  private dataSource: InventoryDataSource;
  private columnsToDisplay = [];
  private prodTypeClass = 'productType';
  private venList: Vendor[];
  private prodList: Product[];
  private editSlider$: BehaviorSubject<boolean>;

  constructor(private service: InventoryService,
    private productService: ProductService,
    private vendorService: VendorService,
    private dateService: DateService,
    private routeService: RouteService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.editSlider$ = new BehaviorSubject(false);
    this.dataSource = new InventoryDataSource(this.service, this.productService, this.vendorService, this.routeService);
    this.loadInventoryData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryData();
    });

    this.dataSource.vendorObservable.subscribe(vendors => {
      this.venList = vendors;
      this.columnsToDisplay = [];
      staticColumnsToDisplay.forEach(colName => {
        this.columnsToDisplay.push(colName);
      });
      this.venList.forEach(vendor => {
        this.columnsToDisplay.push(vendor._id);
      });
    });

    this.dataSource.prodObservable.subscribe(products => {
      this.prodList = products;
    });
  }

  sliderChanged(event: MatSlideToggleChange) {
    console.log('Slider ', event.checked);
    this.editSlider$.next(event.checked);
  }

  private loadInventoryData() {
    const date = this.dateService.date.toISOString();
    this.dataSource.loadInventory(date);
  }

  private isRowProductType(inventoryRow: UIInventoryRow) {
    return inventoryRow.id.startsWith('typ');
  }
  private getRowTypeClass(inventoryRow: UIInventoryRow) {
    return this.isRowProductType(inventoryRow) ? this.prodTypeClass : null;
  }

  private getProdDetails(inventoryRow: UIInventoryRow) {
    if (!this.isRowProductType(inventoryRow) && inventoryRow.prodDets) {
      return 'Package Size : ' + inventoryRow.prodDets.packageSize + ' - Price : ' + inventoryRow.prodDets.sellingPrice;
    }
    return '';
  }

  private getBalance() {
    let total = 0;
    this.dataSource.connect().subscribe(invRows => {
      invRows.forEach(invRow => {
        if (invRow.stockBalance) {
          total += invRow.stockBalance;
        }
      });
    });

    return 'Total : ' + total;
  }

  private getTotalIn() {
    let total = 0;
    this.dataSource.connect().subscribe(invRows => {
      invRows.forEach(invRow => {
        if (invRow.stockTotalIn) {
          total += invRow.stockTotalIn;
        }
      });
    });

    return 'Total : ' + total;
  }

  private getTotalSenIn() {
    let total = 0;
    this.dataSource.connect().subscribe(invRows => {
      invRows.forEach(invRow => {
        if (invRow.stockSenIn) {
          total += invRow.stockSenIn;
        }
      });
    });

    return 'Total : ' + total;
  }

  private getTotalOthersIn() {
    let total = 0;
    this.dataSource.connect().subscribe(invRows => {
      invRows.forEach(invRow => {
        if (invRow.stockOthersIn) {
          total += invRow.stockOthersIn;
        }
      });
    });

    return 'Total : ' + total;
  }

  private getTotalOut() {
    let total = 0;
    let value = 0;
    this.dataSource.connect().subscribe(invRows => {
      invRows.forEach(invRow => {
        if (invRow.stockTotalOut) {
          total += invRow.stockTotalOut;
          if (invRow.prodDets) {
            value += invRow.prodDets.sellingPrice.valueOf() * invRow.stockTotalOut;
          }
        }
      });
    });

    return 'Total : ' + total + ' - Value : ' + value;
  }

  private getVenDetails(ven: Vendor) {
    let infoText = '';
    if (ven.totalLoan) {
      infoText += `Total Loan : ${ven.totalLoan}`;
    }
    if (ven.openingDp) {
      if (infoText !== '') {
        infoText += ' - ';
      }
      infoText += `Opening : ${ven.openingDp}`;
    }
    return infoText;
  }

  private log(data) {
    console.log(data);
  }

  private vendorTrackBy(index, ven: Vendor) {
    return ven._id;
  }

  private saveButtonPressed() {
    const date = this.dateService.date.toISOString();
    const inv = new Inventory();
    this.dataSource.connect().subscribe(uiInvRows => {
      uiInvRows.forEach(uiInvRow => {
        if (!uiInvRow.id.startsWith('typ') && (uiInvRow.stockTotalIn || uiInvRow.stockTotalOut)) {
          const invRow = new InventoryRow();
          invRow.stockSenIn = uiInvRow.stockSenIn;
          invRow.stockOthersIn = uiInvRow.stockOthersIn;
          for (const ven in uiInvRow.vendorValue) {
            if (uiInvRow.vendorValue.hasOwnProperty(ven)) {
              invRow.vendorValue[ven] = {
                packages: 0,
                pieces: uiInvRow.vendorValue[ven]
              };
            }
          }
          inv.rows[uiInvRow.id] = invRow;
        }
      });
    });
    this.dataSource.vendorObservable.subscribe(vendors => {
      // console.log(vendors);
      vendors.forEach(vendor => {
        if (vendor.deposit) {
          inv.vendorDeposits[vendor._id] = vendor.deposit;
        }
      });
      // compInv.vens = vendors;
    });
    this.service.saveInventory(inv, date).subscribe(resp => {
      this.snackBar.open('Inventory', 'Saved', {
        duration: environment.snackBarDuration
      });
      this.loadInventoryData();
    }, error => {
      this.routeService.routeToError(error.status === 504 ? 'S002' : 'S001');
    });
  }

  private syncTotalIn(invRow: UIInventoryRow) {
    const prod: Product = this.prodList.find(product => product._id === invRow.id);
    if (prod) {
      if (invRow.stockSenIn && invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockSenIn * prod.packageSize + invRow.stockOthersIn;
      } else if (invRow.stockSenIn && !invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockSenIn * prod.packageSize;
      } else if (!invRow.stockSenIn && invRow.stockOthersIn) {
        invRow.stockTotalIn = invRow.stockOthersIn;
      }
    }
    this.syncBalance(invRow);
  }

  private syncTotalOut(invRow: UIInventoryRow) {
    // const prod: Product = this.prodList.find(product => product._id === invRow.id);
    // if(prod) {
    if (invRow.vendorValue) {
      let stockTotalOut = 0;
      this.venList.forEach(ven => {
        if (invRow.vendorValue[ven._id]) {
          stockTotalOut = stockTotalOut + invRow.vendorValue[ven._id];
        }
      });
      if (stockTotalOut) {
        invRow.stockTotalOut = stockTotalOut;
      }
    }
    // }
    this.syncBalance(invRow);
  }

  private syncBalance(invRow: UIInventoryRow) {
    if (invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn - invRow.stockTotalOut;
    } else if (invRow.stockTotalIn && !invRow.stockTotalOut) {
      invRow.stockBalance = invRow.stockTotalIn;
    } else if (!invRow.stockTotalIn && invRow.stockTotalOut) {
      invRow.stockBalance = 0 - invRow.stockTotalOut;
    }
  }

  private validateVendorValue(invRow: UIInventoryRow, venId: string) {
    if (!this.validateValue(invRow.vendorValue[venId])) {
      invRow.vendorValue[venId] = undefined;
    }
  }

  private validateSenIn(invRow: UIInventoryRow) {
    if (!this.validateValue(invRow.stockSenIn)) {
      invRow.stockSenIn = undefined;
    }
  }

  private validateOthersIn(invRow: UIInventoryRow) {
    if (!this.validateValue(invRow.stockOthersIn)) {
      invRow.stockOthersIn = undefined;
    }
  }

  private validateValue(val: Number) {
    if (val || val === 0) {
      if (val <= 0 || (val.valueOf() - Math.round(val.valueOf())) !== 0) {
        return false;
      }
    }
    return true;
  }
}
