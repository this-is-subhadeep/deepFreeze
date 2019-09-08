import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { Vendor } from '../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { Product, ProductType } from '../definitions/product-definition';
import { Inventory, InventoryRow } from '../definitions/inventory-definition';
import { SellingData } from '../definitions/selling-definition';
import { NgModel, FormControl, RequiredValidator, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { productTextValidator } from '../validators';

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class SellingComponent implements OnInit {
  private products: Product[];
  private sellingProductList: SellingData[];
  private vendors: Vendor[];
  private savedVendor: Vendor;
  private inventory: Inventory;
  private selectedVendor: Vendor;
  private productControl : FormControl;
  private filteredProducts : Observable<Product[]>;

  constructor(private inventoryService: InventoryService,
    private dateService: DateService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.productControl = new FormControl('',{
      validators : [
        Validators.required,
        productTextValidator
      ]
    });
    this.filteredProducts = this.productControl.valueChanges.pipe(
      startWith(''),
      map((value : any) => {
        if(value instanceof Product) {
          if(this.sellingProductList.filter(sellData => sellData.product._id === value._id).length===0) {
            this.sellingProductList.push(new SellingData(this.products.filter(prod => prod._id === value._id)[0]));
          }
          return `${value.name} - ${value.productType.name}`;
        } else {
          return value;
        }
      }),
      map(text => text ? this.filterProductList(text) : this.products)
    );
    this.loadInventoryData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryData();
      this.refresh();
    });
  }

  private filterProductList(prodName: string):Product[] {
    console.log(`prodName : ${JSON.stringify(prodName)}`);
    if(typeof prodName === 'string') {
      const filteredProd = prodName.toLowerCase();
      return this.products.filter(product => (`${product.name} - ${product.productType.name}`).toLowerCase().indexOf(filteredProd) === 0);
    } else {
      return this.products;
    }
  }

  private loadInventoryData() {
    let date = this.dateService.date.toISOString();
    this.inventoryService.findInventoryObservable(date).subscribe(uiInventoryRows => {
      this.inventory = uiInventoryRows.inventories;
      // this.savedProducts = uiInventoryRows.products;
      this.products = uiInventoryRows.products.map(prod => Product.cloneAnother(prod));
      this.vendors = uiInventoryRows.vendors;
      // console.log(this.products);
    });
    // console.log(this.dataSource);
  }

  private refresh() {
    this.selectedVendor = new Vendor();
    this.sellingProductList = new Array();
  }

  // private get sellingProductId() {
  //   // console.log("Here");
  //   return '';
  // }

  private get vendorDeposit() {
    if(this.inventory && this.inventory.vendorDeposits) {
      return this.inventory.vendorDeposits[this.selectedVendor._id];
    } else {
      return null;
    }
  }

  private get selectedVendorId() {
    return this.selectedVendor._id;
  }

  private productNameDisp(prod:Product) {
    console.log(prod);
    console.log(this.inventory);
    return prod?`${prod.name} - ${prod.productType.name}`:'';
    // return '';
  }

  // private set sellingProductId(id: string) {
  //   if (this.products !== undefined) {
  //     let removalindex = -1;
  //     for (let i = 0; i < this.products.length; i++) {
  //       if (this.products[i]._id === id) {
  //         removalindex = i;
  //         this.sellingProductList.push(new SellingData(this.products[i]));
  //         break;
  //       }
  //     }
  //     this.products.splice(removalindex, 1);
  //   }
  // }

  private set selectedVendorId(id: string) {
    console.log(`selectedVendorId : ${id}`);
    this.selectedVendor = this.vendors.filter(ven => ven._id === id)[0];
    this.savedVendor = Vendor.cloneAnother(this.selectedVendor);
    // this.products = new Array();
    // this.products = this.savedProducts.map(prod => Product.cloneAnother(prod));
  }

  private set vendorDeposit(amount: number) {
    console.log(amount);
    if(this.inventory) {
      if(!this.inventory.vendorDeposits) {
        this.inventory.vendorDeposits = {};
      }
    } else {
      this.inventory = new Inventory();
      this.inventory.vendorDeposits = {};
    }
    console.log('setting amount');
    this.inventory.vendorDeposits[this.selectedVendor._id] = amount;
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
      console.log(soldRow);
      // console.log(this.inventory);
      if(!this.inventory.rows) {
        this.inventory.rows = {};
      }
      if(!this.inventory.rows[soldRow.product._id]) {
        console.log(`Creating row : ${soldRow.product._id}`);
        this.inventory.rows[soldRow.product._id] = new InventoryRow();
      }
      console.log(this.inventory);
      if(!this.inventory.rows[soldRow.product._id].vendorValue) {
        this.inventory.rows[soldRow.product._id].vendorValue = {};
      }
      this.inventory.rows[soldRow.product._id].vendorValue[this.selectedVendor._id] = {
        packages : 0,
        pieces : soldRow.soldUnits
      };
    });
    console.log(`Final Inventory : ${JSON.stringify(this.inventory)}`);

    let updateVendor = this.vendors.filter(ven => ven._id === this.selectedVendor._id)[0];
    console.log(`${this.savedVendor.deposit} - ${this.selectedVendor.deposit}`);
    // if(this.savedVendor.deposit!==this.selectedVendor.deposit) {
    //   updateVendor.deposit = this.selectedVendor.deposit;
    //   console.log(updateVendor);
    //   this.inventoryService.saveInventoryFull(this.inventory, updateVendor, date).subscribe(resp => {
    //     this.snackBar.open('Products', 'Sold', {
    //       duration : environment.snackBarDuration
    //     });
    //     this.loadInventoryData();
    //   });
    // } else {
    this.inventoryService.saveInventory(this.inventory, date).subscribe(resp => {
      this.snackBar.open('Products', 'Sold', {
        duration : environment.snackBarDuration
      });
      this.loadInventoryData();
    });
    // }
    
    this.refresh();
  }

  private saveAndBillButtonPressed() {
    this.saveButtonPressed();
    console.log('Bill Button Pressed');
  }  

  private deleteProductFromList(ind: number) {
    console.log('Deleting Product :', ind);
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
