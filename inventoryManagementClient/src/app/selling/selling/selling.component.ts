import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModel, FormControl } from '@angular/forms';
import { dropDownEffect, fadeInEffect } from 'src/app/animations';
import { CompleteInventory } from 'src/app/definitions/inventory-definition';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { SellingData } from 'src/app/definitions/selling-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { DateService } from 'src/app/shared/services/date.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss'],
  animations: [fadeInEffect, dropDownEffect]
})
export class SellingComponent implements OnInit {
  private completeProducts: CompleteProduct[];
  private savedCompleteProducts: CompleteProduct[];
  private sellingProductList: SellingData[];
  private completeVendors: CompleteVendor[];
  private completeInventory: CompleteInventory;
  private selectedVendor: CompleteVendor;

  constructor(private productService: ProductService,
    private inventoryService: InventoryService,
    private datePipe: DatePipe,
    private dateService: DateService) { }

  ngOnInit() {
    this.loadCompleteProductData();
    this.loadCompleteInventoryData();
    this.refresh()
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteProductData();
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

  private loadCompleteInventoryData() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.inventoryService.findCompleteInventoryObservable(date).subscribe(completeInventory => {
      this.completeInventory = completeInventory;
      this.completeVendors = completeInventory.vens;
    });
  }

  private refresh() {
    this.selectedVendor = new CompleteVendor();
    this.sellingProductList = new Array();
  }

  private get sellingProductId() {
    return '';
  }

  private get selectedVendorId() {
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

  private set sellingProductId(id: string) {
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
    this.completeInventory.rows.forEach(row => {
      if (row.vendorValue[id]) {
        this.addSellingProduct(row.id, row.vendorValue[id]);
        // this.sellingProductId = row.id; 
      }
    });

    console.log(this.sellingProductList);
  }

  private vendorSelected($event) {
    console.log('Vendor Selected');

  }

  private isVendorSelected(): boolean {
    return this.selectedVendor.id !== undefined && this.selectedVendor.id !== null && this.selectedVendor.id.startsWith('ven');
  }

  private showProductTable(): boolean {
    return this.sellingProductList != null && this.sellingProductList.length > 0 && this.isVendorSelected();
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
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.completeInventory.rows.forEach(row => {
      this.sellingProductList.forEach(soldRow => {
        if (row.id === soldRow.product.id) {
          row.vendorValue[this.selectedVendor.id] = soldRow.soldUnits.valueOf();
        }
      });
    });
    this.completeInventory.vens.forEach(ven => {
      if (ven.id === this.selectedVendor.id) {
        ven.deposit = this.selectedVendor.deposit;
      }
    });
    this.inventoryService.saveCompleteInventory(this.completeInventory, date).subscribe(resp => {
      this.loadCompleteInventoryData();
      this.refresh();
    });
  }

  private saveAndBillButtonPressed() {
    this.saveButtonPressed();
    console.log('Bill Button Pressed');
  }

  private deleteProductFromList(ind: number) {
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
  }

  private isUnitInvalid(id: number, soldUnitEle: NgModel) {
    console.log('id :', id, 'soldUnitEle :', soldUnitEle);
    return soldUnitEle.invalid;
  }

  private sellingProductTrackBy(index, sellProd:SellingData) {
    return sellProd.product.id;
  }

  private log(data) {
    console.log('Log :', data);
  }

}
