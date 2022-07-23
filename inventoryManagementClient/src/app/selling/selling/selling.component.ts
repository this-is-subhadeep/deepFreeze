import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { dropDownEffect, fadeEffect } from 'src/app/animations';
import { CompleteInventory } from 'src/app/definitions/inventory-definition';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { SellingData } from 'src/app/definitions/selling-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { CustomDatePipe } from 'src/app/shared/pipes/custom-date.pipe';
import { DateService } from 'src/app/shared/services/date.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss'],
  animations: [fadeEffect, dropDownEffect]
})
export class SellingComponent implements OnInit {
  private savedCompleteProducts: CompleteProduct[] = new Array<CompleteProduct>();
  private completeInventory: CompleteInventory = new CompleteInventory();

  completeProducts: CompleteProduct[] = new Array<CompleteProduct>();
  sellingProductList: SellingData[] = new Array<SellingData>();
  completeVendors: CompleteVendor[] = new Array<CompleteVendor>();
  selectedVendor: CompleteVendor = new CompleteVendor();

  constructor(private productService: ProductService,
    private inventoryService: InventoryService,
    private datePipe: CustomDatePipe,
    private dateService: DateService,
    private readonly router: Router) { }

  ngOnInit() {
    this.loadCompleteProductData();
    this.loadCompleteInventoryData();
    this.refresh();
    this.dateService.dateChange$.subscribe(() => {
      this.loadCompleteProductData();
      this.loadCompleteInventoryData();
      this.refresh();
    });
  }

  private loadCompleteProductData() {
    const date = this.datePipe.transform(this.dateService.date);
    if (date) {
      this.productService.findCompleteProductObservable(date).subscribe(completeProducts => {
        this.savedCompleteProducts = completeProducts;
      });
    }
  }

  private loadCompleteInventoryData() {
    const date = this.datePipe.transform(this.dateService.date,);
    if (date) {
      this.inventoryService.findCompleteInventoryObservable(date).subscribe(completeInventory => {
        this.completeInventory = completeInventory;
        if (completeInventory.vens) {
          this.completeVendors = completeInventory.vens;
        }
      });
    }
  }

  private refresh() {
    this.selectedVendor = new CompleteVendor();
    this.sellingProductList = new Array();
  }

  get sellingProductId() {
    return '';
  }

  get selectedVendorId() {
    return this.selectedVendor.id;
  }

  private addSellingProduct(id: string, unit: number) {
    if (this.completeProducts) {
      let removalindex = -1;
      for (let i = 0; i < this.completeProducts.length; i++) {
        if (this.completeProducts[i].id === id) {
          removalindex = i;
          this.sellingProductList.push(new SellingData(this.completeProducts[i], unit));
          break;
        }
      }
      this.completeProducts.splice(removalindex, 1);
    }
  }

  set sellingProductId(id: string) {
    if (this.completeProducts) {
      let removalindex = -1;
      for (let i = 0; i < this.completeProducts.length; i++) {
        if (this.completeProducts[i].id === id) {
          removalindex = i;
          this.sellingProductList.push(new SellingData(this.completeProducts[i]));
          break;
        }
      }
      this.completeProducts.splice(removalindex, 1);
    }
  }

  set selectedVendorId(id: string) {
    this.completeVendors.forEach(compVen => {
      if (compVen.id === id) {
        this.selectedVendor = compVen;
        this.sellingProductList = new Array();
        this.completeProducts = new Array();
        this.savedCompleteProducts.forEach(compProd => {
          this.completeProducts.push(compProd);
        });
        return;
      }
    });
    if (this.completeInventory.rows) {
      this.completeInventory.rows.forEach(row => {
        if (row.vendorValue[id]) {
          this.addSellingProduct(row.id, row.vendorValue[id]);
        }
      });
    }
  }

  isVendorSelected(): boolean {
    return this.selectedVendor.id !== undefined && this.selectedVendor.id !== null && this.selectedVendor.id.startsWith('ven');
  }

  showProductTable(): boolean {
    return this.sellingProductList != null && this.sellingProductList.length > 0 && this.isVendorSelected();
  }

  getStockBalance(productId: string): number {
    let balance = 0;
    if (this.completeInventory.rows) {
      this.completeInventory.rows.forEach(invRow => {
        if (invRow.id === productId && invRow.stockBalance != null) {
          balance = invRow.stockBalance;
        }
      });
    }
    return balance;
  }

  getTotalUnitsSold() {
    let totalUnitsSold = 0;
    if (this.sellingProductList !== undefined && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        if (sellingProduct.soldUnits) {
          totalUnitsSold += sellingProduct.soldUnits;
        }
      });
    }
    return totalUnitsSold;
  }

  getTotalAmountSold() {
    let totalAmountSold = 0;
    if (this.sellingProductList !== undefined && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        if (sellingProduct.soldUnits && sellingProduct.product.sellingPrice) {
          totalAmountSold += sellingProduct.soldUnits * sellingProduct.product.sellingPrice.valueOf();
        }
      });
    }
    return Math.round(totalAmountSold * 100) / 100;
  }

  saveButtonPressed() {
    const date = this.datePipe.transform(this.dateService.date);
    if (this.completeInventory.rows) {
      this.completeInventory.rows.forEach(row => {
        this.sellingProductList.forEach(soldRow => {
          if (row.id === soldRow.product.id && soldRow.soldUnits) {
            row.vendorValue[this.selectedVendor.id] = soldRow.soldUnits.valueOf();
          }
        });
      });
    }
    if (this.completeInventory.vens) {
      this.completeInventory.vens.forEach(ven => {
        if (ven.id === this.selectedVendor.id) {
          ven.deposit = this.selectedVendor.deposit;
        }
      });
    }
    if (date) {
      this.inventoryService.saveCompleteInventory(this.completeInventory, date).subscribe(resp => {
        this.loadCompleteInventoryData();
        this.refresh();
      });
    }
  }

  saveAndBillButtonPressed() {
    this.saveButtonPressed();
    this.generateBill();
  }

  deleteProductFromList(ind: number) {
    this.completeProducts.push(this.sellingProductList[ind].product);
    this.completeProducts = this.completeProducts.sort((ele1, ele2) => {
      if (ele1.productType.showOrder && ele2.productType.showOrder && ele1.name && ele2.name) {
        let compareRes = ele1.productType.showOrder - ele2.productType.showOrder;
        if (compareRes === 0) {
          compareRes = ele1.name === ele2.name ? 0 : ele1.name < ele2.name ? -1 : 1;
        }
        return compareRes;
      }
      return 0;
    });
    this.sellingProductList.splice(ind, 1);
  }

  private isUnitInvalid(id: number, soldUnitEle: NgModel) {
    return soldUnitEle.invalid;
  }

  private sellingProductTrackBy(index: number, sellProd: SellingData) {
    return sellProd.product.id;
  }

  private generateBill() {
    this.router.navigate(['/billing', this.selectedVendor.id]);
  }

}
