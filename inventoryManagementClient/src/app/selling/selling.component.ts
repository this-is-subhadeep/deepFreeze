import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { Vendor } from '../definitions/vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';
import { Product } from '../definitions/product-definition';
import { Inventory, InventoryRow, ProductOpening } from '../definitions/inventory-definition';
import { SellingData } from '../definitions/selling-definition';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { productTextValidator } from '../validators';
import { ProductService } from '../services/product.service';
import { VendorService } from '../services/vendor.service';
import { PrintService } from '../services/print.service';

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
  private inventory: Inventory;
  private selectedVendor: Vendor;
  private productOpenings: ProductOpening;
  private productControl: FormControl;
  filteredProducts: Observable<Product[]>;

  constructor(private inventoryService: InventoryService,
    private productService: ProductService,
    private vendorService: VendorService,
    private dateService: DateService,
    public printService: PrintService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.productControl = new FormControl('', {
      validators: [
        Validators.required,
        productTextValidator
      ]
    });
    this.filteredProducts = this.productControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        if (value instanceof Product) {
          if (!this.sellingProductList.find(sellData => sellData.product._id === value._id)) {
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

  private filterProductList(prodName: string): Product[] {
    if (typeof prodName === 'string') {
      const filteredProd = prodName.toLowerCase();
      return this.products.filter(product => (`${product.name} - ${product.productType.name}`).toLowerCase().indexOf(filteredProd) === 0);
    } else {
      return this.products;
    }
  }

  private loadInventoryData() {
    let date = this.dateService.date.toISOString();
    this.productService.getAllProducts(date);
    this.vendorService.getAllVendors(date);
    forkJoin(
      this.inventoryService.findInventoryOpeningObservable(date),
      this.inventoryService.findInventoryObservable(date),
      this.productService.productObservable,
      this.vendorService.vendorObservable
    ).subscribe(([inventoryOpening, inventories, products, vendors]) => {
      this.productOpenings = this.inventoryService.fillOpenings(inventoryOpening, inventories, products, date, true);
      this.inventory = inventories.find(inv => inv.date === date);
      this.products = products.map(prod => Product.cloneAnother(prod));
      this.vendors = vendors;
    });
  }

  private refresh() {
    this.selectedVendor = new Vendor();
    this.sellingProductList = new Array();
  }

  get vendorDeposit() {
    if (this.inventory && this.inventory.vendorDeposits) {
      return this.inventory.vendorDeposits[this.selectedVendor._id];
    } else {
      return null;
    }
  }

  get selectedVendorId() {
    return this.selectedVendor._id;
  }

  set vendorDeposit(amount: number) {
    if (this.inventory) {
      if (!this.inventory.vendorDeposits) {
        this.inventory.vendorDeposits = {};
      }
    } else {
      this.inventory = new Inventory();
      this.inventory.vendorDeposits = {};
    }
    this.inventory.vendorDeposits[this.selectedVendor._id] = amount;
  }

  set selectedVendorId(id: string) {
    this.selectedVendor = this.vendors.find(ven => ven._id === id);
    this.fillSellingData();
  }

  productNameDisp(prod: Product) {
    return prod ? `${prod.name} - ${prod.productType.name}` : '';
  }

  private fillSellingData() {
    this.sellingProductList = new Array<SellingData>();
    if (this.inventory) {
      for (let prodId in this.inventory.rows) {
        if (this.inventory.rows[prodId].vendorValue && this.inventory.rows[prodId].vendorValue[this.selectedVendor._id]) {
          let sellingProductRow = new SellingData(this.products.find(product => product._id === prodId),
            this.inventory.rows[prodId].vendorValue[this.selectedVendor._id].pieces);
          this.sellingProductList.push(sellingProductRow);
        }
      }
    }
  }

  isVendorSelected(): boolean {
    return this.selectedVendor._id && this.selectedVendor._id.startsWith('ven');
  }

  hideProductTable(): boolean {
    return !(this.sellingProductList && this.sellingProductList.length > 0 && this.isVendorSelected());
  }

  getStockBalance(productId: string): number {
    let balance = 0;
    if (this.productOpenings && this.productOpenings.openingValues) {
      balance = this.productOpenings.openingValues[productId];
    }
    if (this.inventory
      && this.inventory.rows
      && this.inventory.rows[productId]
      && this.inventory.rows[productId].vendorValue
      && this.inventory.rows[productId].vendorValue[this.selectedVendor._id]
      && this.inventory.rows[productId].vendorValue[this.selectedVendor._id].pieces) {
      balance += this.inventory.rows[productId].vendorValue[this.selectedVendor._id].pieces;
    }
    return balance;
  }

  getTotalUnitsSold() {
    let totalUnitsSold = 0;
    if (this.sellingProductList && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalUnitsSold += sellingProduct.soldUnits;
      });
    }
    return totalUnitsSold;
  }

  getTotalAmountSold() {
    let totalAmountSold = 0;
    if (this.sellingProductList && this.sellingProductList.length > 0) {
      this.sellingProductList.forEach(sellingProduct => {
        totalAmountSold += sellingProduct.getSoldPrice();
      });
    }
    return Math.round(totalAmountSold * 100) / 100;
  }

  saveButtonPressed(print = false) {
    console.log('Save Button Pressed', this.sellingProductList);
    let date = this.dateService.date.toISOString();
    this.sellingProductList.forEach(soldRow => {
      if (!this.inventory.rows) {
        this.inventory.rows = {};
      }
      if (!this.inventory.rows[soldRow.product._id]) {
        this.inventory.rows[soldRow.product._id] = new InventoryRow();
      }
      if (!this.inventory.rows[soldRow.product._id].vendorValue) {
        this.inventory.rows[soldRow.product._id].vendorValue = {};
      }
      this.inventory.rows[soldRow.product._id].vendorValue[this.selectedVendor._id] = {
        packages: 0,
        pieces: soldRow.soldUnits
      };
    });
    let tempVenId = this.selectedVendor._id;
    this.inventoryService.saveInventory(this.inventory, date).subscribe(resp => {
      this.snackBar.open('Products', 'Sold', {
        duration: environment.snackBarDuration
      });
      this.loadInventoryData();
      if (print) {
        this.printService.printDocument(tempVenId);
      }
    });

    this.refresh();
  }

  saveAndBillButtonPressed() {
    console.log('Bill Button Pressed');
    this.saveButtonPressed(true);
    // this.printService.printDocument(this.selectedVendor._id);
  }

  deleteProductFromList(ind: number) {
    console.log('Deleting Product :', ind);
    this.sellingProductList.splice(ind, 1);
  }

  isSellingDataPresent(): boolean {
    return this.getTotalUnitsSold() > 0
  }

  private log(data) {
    console.log('Log :', data);
  }

}
