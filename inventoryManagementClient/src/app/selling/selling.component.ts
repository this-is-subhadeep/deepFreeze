import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { VendorService } from '../services/vendor.service';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { DatePipe } from '@angular/common';
import { Vendor } from '../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { Product, ProductType } from '../definitions/product-definition';
import { UIInventoryRow, Inventory, InventoryRow } from '../definitions/inventory-definition';
import { SellingData } from '../definitions/selling-definition';
import { NgModel, FormControl } from '@angular/forms';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class SellingComponent implements OnInit {
  private products: Product[];
  private savedProducts: Product[];
  private sellingProductList: SellingData[];
  private vendors: Vendor[];
  private savedVendor: Vendor;
  private inventory: Inventory;
  private selectedVendor: Vendor;

  constructor(private inventoryService: InventoryService,
    private dateService: DateService) { }

  ngOnInit() {
    this.loadInventoryData();
    this.refresh()
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryData();
      this.refresh();
    });
  }

  private loadInventoryData() {
    let date = this.dateService.date.toISOString();
    this.inventoryService.findInventoryObservable(date).subscribe(uiInventoryRows => {
      this.inventory = uiInventoryRows.inventories;
      this.savedProducts = uiInventoryRows.products;
      this.vendors = uiInventoryRows.vendors;
    });
    // console.log(this.dataSource);
  }

  private refresh() {
    this.selectedVendor = new Vendor();
    this.sellingProductList = new Array();
  }

  private get sellingProductId() {
    // console.log("Here");
    return '';
  }

  private get selectedVendorId() {
    return this.selectedVendor._id;
  }

  private set sellingProductId(id: string) {
    if (this.products !== undefined) {
      let removalindex = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i]._id === id) {
          removalindex = i;
          this.sellingProductList.push(new SellingData(this.products[i]));
          break;
        }
      }
      this.products.splice(removalindex, 1);
    }
  }

  private set selectedVendorId(id: string) {
    console.log(`selectedVendorId : ${id}`);
    this.selectedVendor = this.vendors.filter(ven => ven._id === id)[0];
    this.savedVendor = Vendor.cloneAnother(this.selectedVendor);
    this.products = new Array();
    this.products = this.savedProducts.map(prod => Product.cloneAnother(prod));
  }

  private vendorSelected($event) {
    console.log('Vendor Selected');

  }

  private isVendorSelected(): boolean {
    return this.selectedVendor._id !== undefined && this.selectedVendor._id !== null && this.selectedVendor._id.startsWith('ven');
  }

  private hideProductTable(): boolean {
    return !(this.sellingProductList != null && this.sellingProductList.length > 0 && this.isVendorSelected());
  }

  private getStockBalance(productId: string): number {
    let balance = 0;
    // this.inventory.rows.forEach(invRow => {
    //   if (invRow.id === productId && invRow.stockBalance != null) {
    //     balance = invRow.stockBalance;
    //   }
    // });
    // this.inventory.rows[productId]
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
    let date = this.dateService.date.toISOString();
    this.sellingProductList.forEach(soldRow => {
      if(!this.inventory.rows) {
        this.inventory.rows = {};
      }
      if(!this.inventory.rows[soldRow.product._id]) {
        this.inventory.rows[soldRow.product._id] = new InventoryRow();
      }
      this.inventory.rows[soldRow.product._id].vendorValue[this.selectedVendor._id] = {
        packages : 0,
        pieces : soldRow.soldUnits
      };
    });
    console.log(`Final Inventory : ${JSON.stringify(this.inventory)}`);

    let updateVendor = this.vendors.filter(ven => ven._id === this.selectedVendor._id)[0];
    console.log(`${this.savedVendor.deposit} - ${this.selectedVendor.deposit}`);
    if(this.savedVendor.deposit!==this.selectedVendor.deposit) {
      updateVendor.deposit = this.selectedVendor.deposit;
      console.log(updateVendor);
      this.inventoryService.saveInventoryFull(this.inventory, updateVendor, date).subscribe(resp => {
        this.loadInventoryData();
      });
    } else {
      this.inventoryService.saveInventory(this.inventory, date).subscribe(resp => {
        this.loadInventoryData();
      });
    }
    
    this.refresh();
  }

  private saveAndBillButtonPressed() {
    this.saveButtonPressed();
    console.log('Bill Button Pressed');
  }  

  private deleteProductFromList(ind: number) {
    console.log('Deleting Product :', ind);
    this.products.push(this.sellingProductList[ind].product);
    //Make the below code better ?
    this.products = this.products.sort((ele1, ele2) => {
      let compareRes = ele1.productType.showOrder - ele2.productType.showOrder;
      if (compareRes === 0) {
        compareRes = ele1.name === ele2.name ? 0 : ele1.name < ele2.name ? -1 : 1;
      }
      return compareRes;
    });
    this.sellingProductList.splice(ind, 1);
  }

  private isUnitInvalid(id:number, soldUnitEle:NgModel) {
    console.log('id :',id,'soldUnitEle :',soldUnitEle);
    // if(soldUnitEle.value>10) {
    //   soldUnitEle.invalid = true;
    // }
    return soldUnitEle.invalid;
  }

  private log(data) {
    console.log('Log :', data);
  }

}
