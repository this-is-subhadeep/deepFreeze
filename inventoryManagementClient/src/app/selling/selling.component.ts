import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { Vendor } from '../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { Product } from '../definitions/product-definition';
import { Inventory, InventoryRow } from '../definitions/inventory-definition';
import { SellingData } from '../definitions/selling-definition';
import { NgModel, FormControl, Validators } from '@angular/forms';
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
          if(!this.sellingProductList.find(sellData => sellData.product._id === value._id)) {
            let sellingDataRow = new SellingData(this.products.find(prod => prod._id === value._id));
            sellingDataRow.enableDelete = true;
            this.sellingProductList.push(sellingDataRow);
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
  }

  private set selectedVendorId(id: string) {
    console.log(`selectedVendorId : ${id}`);
    this.selectedVendor = this.vendors.find(ven => ven._id === id);
    this.savedVendor = Vendor.cloneAnother(this.selectedVendor);
    this.fillSellingData();
  }

  private fillSellingData() {
    this.sellingProductList = new Array<SellingData>();
    for(let prodId in this.inventory.rows) {
      console.log(prodId);
      if(this.inventory.rows[prodId].vendorValue && this.inventory.rows[prodId].vendorValue[this.selectedVendor._id]) {
        let sellingProductRow = new SellingData(this.products.find(product => product._id === prodId),
                                                this.inventory.rows[prodId].vendorValue[this.selectedVendor._id].pieces);
        this.sellingProductList.push(sellingProductRow);
      }
    }
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

  private isVendorSelected(): boolean {
    return this.selectedVendor._id && this.selectedVendor._id.startsWith('ven');
  }

  private hideProductTable(): boolean {
    return !(this.sellingProductList && this.sellingProductList.length > 0 && this.isVendorSelected());
  }

  private getStockBalance(productId: string): number {
    let balance = 0;
    return balance;
  }

  private getTotalUnitsSold() {
    let totalUnitsSold = 0;
    if (this.sellingProductList && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalUnitsSold += sellingProduct.soldUnits;
      });
    }
    return totalUnitsSold;
  }

  private getTotalAmountSold() {
    let totalAmountSold = 0;
    if (this.sellingProductList && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalAmountSold += sellingProduct.getSoldPrice();
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

    let updateVendor = this.vendors.find(ven => ven._id === this.selectedVendor._id);
    console.log(`${this.savedVendor.deposit} - ${this.selectedVendor.deposit}`);
    this.inventoryService.saveInventory(this.inventory, date).subscribe(resp => {
      this.snackBar.open('Products', 'Sold', {
        duration : environment.snackBarDuration
      });
      this.loadInventoryData();
    });
    
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
