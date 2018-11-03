import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { VendorService } from '../services/vendor.service';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { DatePipe } from '@angular/common';
import { CompleteVendor } from '../vendor/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { CompleteProduct } from '../product/product-definition';
import { CompleteInventory } from '../inventory/inventory-definition';
import { SellingData } from './selling-definition';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class SellingComponent implements OnInit {
  private completeProducts: CompleteProduct[];
  private savedCompleteProducts: CompleteProduct[];
  // private sellingProductList: CompleteProduct[];
  private sellingProductList: SellingData[];
  private completeVendors: CompleteVendor[];
  private completeInventory: CompleteInventory;
  private selectedVendor: CompleteVendor;

  constructor(private productService: ProductService,
    private vendorService: VendorService,
    private inventoryService: InventoryService,
    private datePipe: DatePipe,
    private dateService: DateService) { }

  ngOnInit() {
    this.loadCompleteProductData();
    this.loadCompleteVendorData();
    this.loadCompleteInventoryData();
    this.refresh()
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteProductData();
      this.loadCompleteVendorData();
      this.loadCompleteInventoryData();
      this.refresh();
    });
  }

  private loadCompleteProductData() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.productService.findCompleteProductObservable(date).subscribe(completeProducts => {
      this.savedCompleteProducts = completeProducts;
    });
  }

  private loadCompleteVendorData() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.vendorService.findCompleteVendorObservable(date).subscribe(completeVendors => {
      this.completeVendors = completeVendors;
    });
  }

  private loadCompleteInventoryData() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.inventoryService.findCompleteInventoryObservable(date).subscribe(completeInventory => {
      this.completeInventory = completeInventory;
    });
    // console.log(this.dataSource);
  }

  private refresh() {
    this.selectedVendor = new CompleteVendor();
    this.sellingProductList = new Array();
  }

  private get sellingProductId() {
    // console.log("Here");
    return '';
  }

  private get selectedVendorId() {
    return this.selectedVendor.id;
  }

  private set sellingProductId(id: string) {
    if (this.completeProducts !== undefined) {
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

  private set selectedVendorId(id: string) {
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
  }

  private vendorSelected($event) {
    console.log('Vendor Selected');

  }

  private isVendorSelected(): boolean {
    return this.selectedVendor.id !== undefined && this.selectedVendor.id !== null && this.selectedVendor.id.startsWith('ven');
  }

  private hideProductTable(): boolean {
    return !(this.sellingProductList != null && this.sellingProductList.length > 0 && this.isVendorSelected());
  }

  private getStockBalance(productId: string): number {
    let balance = 0;
    this.completeInventory.rows.forEach(invRow => {
      if (invRow.id === productId && invRow.stockBalance != null) {
        balance = invRow.stockBalance;
      }
    });
    return balance;
  }

  private getTotalUnitsSold() {
    let totalUnitsSold = 0;
    if (this.sellingProductList != undefined && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalUnitsSold += sellingProduct.soldUnits;
      });
    }
    return totalUnitsSold;
  }

  private getTotalAmountSold() {
    let totalAmountSold = 0;
    if (this.sellingProductList != undefined && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalAmountSold += sellingProduct.soldUnits * sellingProduct.product.sellingPrice.valueOf();
      });
    }
    return Math.round(totalAmountSold * 100) / 100;
  }

  private saveButtonPressed() {
    console.log('Save Button Pressed', this.sellingProductList);
  }

  private saveAndBillButtonPressed() {
    console.log('Save & Bill Button Pressed', this.sellingProductList);
  }

  private deleteProductFromLIst(ind: number) {
    console.log('Deleting Product :', ind);
    this.completeProducts.push(this.sellingProductList[ind].product);
    this.completeProducts = this.completeProducts.sort((ele1, ele2) => {
      let compareRes = ele1.productType.showOrder - ele2.productType.showOrder;
      if (compareRes === 0) {
        compareRes = ele1.name === ele2.name ? 0 : ele1.name < ele2.name ? -1 : 1;
      }
      return compareRes;
    });
    this.sellingProductList.splice(ind, 1);
    // console.log(this.sellingProductList);
  }

  private log(data) {
    console.log('Log :', data);
  }

}
