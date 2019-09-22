import { Component, OnInit } from '@angular/core';
import { fadeInEffect, dropDownEffect } from '../animations';
import { BuyingData } from '../definitions/buying-definition';
import { Observable, combineLatest } from 'rxjs';
import { Product } from '../definitions/product-definition';
import { Inventory, InventoryRow, ProductOpening } from '../definitions/inventory-definition';
import { FormControl, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { MatSnackBar } from '@angular/material';
import { productTextValidator } from '../validators';
import { startWith, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-buying',
  templateUrl: './buying.component.html',
  styleUrls: ['./buying.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class BuyingComponent implements OnInit {
  private products: Product[];
  private buyingProductList: BuyingData[];
  private inventory: Inventory;
  private productOpenings: ProductOpening;
  private productControl : FormControl;
  filteredProducts : Observable<Product[]>;

  constructor(private inventoryService: InventoryService,
    private productService: ProductService,
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
          if(!this.buyingProductList.find(buyData => buyData.product._id === value._id)) {
            let buyingDataRow = new BuyingData(this.products.find(prod => prod._id === value._id));
            buyingDataRow.enableDelete = true;
            this.buyingProductList.push(buyingDataRow);
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
    this.productService.getAllProducts(date);
    combineLatest(
      this.inventoryService.findInventoryOpeningObservable(date),
      this.inventoryService.findInventoryObservable(date),
      this.productService.productObservable
    ).subscribe(([inventoryOpening, inventories, products]) => {
      this.productOpenings = this.inventoryService.fillOpenings(inventoryOpening, inventories, products, date, true);
      this.inventory = inventories.find(inv => inv.date === date);
      this.products = products.map(prod => Product.cloneAnother(prod));
      this.fillBuyingData();
    })
  }

  private refresh() {
    this.buyingProductList = new Array();
  }

  productNameDisp(prod:Product) {
    console.log(prod);
    console.log(this.inventory);
    return prod?`${prod.name} - ${prod.productType.name}`:'';
  }

  private fillBuyingData() {
    this.buyingProductList = new Array<BuyingData>();
    if(this.inventory) {
      for(let prodId in this.inventory.rows) {
        console.log(prodId);
        if(this.inventory.rows[prodId].vendorValue && (this.inventory.rows[prodId].stockSenIn || this.inventory.rows[prodId].stockOthersIn) ) {
          let sellingProductRow = new BuyingData(this.products.find(product => product._id === prodId),
                                                  this.inventory.rows[prodId].stockSenIn,
                                                  this.inventory.rows[prodId].stockOthersIn);
          this.buyingProductList.push(sellingProductRow);
        }
      }
    }
  }

  hideProductTable(): boolean {
    return !(this.buyingProductList != null && this.buyingProductList.length > 0);
  }

  getStockSenBalance(productId: string): number {
    let balance = 0;
    if(this.productOpenings && this.productOpenings.openingValues) {
      balance = Math.floor(this.productOpenings.openingValues[productId]/this.products.find(prod => prod._id === productId).packageSize);
    }
    if(this.inventory
      && this.inventory.rows
      && this.inventory.rows[productId]
      && this.inventory.rows[productId].stockSenIn) {
      balance += this.inventory.rows[productId].stockSenIn; 
    }
    return balance;
  }

  getStockOthersBalance(productId: string): number {
    let balance = 0;
    if(this.productOpenings && this.productOpenings.openingValues) {
      balance = this.productOpenings.openingValues[productId]%this.products.find(prod => prod._id === productId).packageSize;
    }
    if(this.inventory
      && this.inventory.rows
      && this.inventory.rows[productId]
      && this.inventory.rows[productId].stockOthersIn) {
      balance += this.inventory.rows[productId].stockOthersIn; 
    }
    return balance;
  }

  getStockBalance(productId: string): number {
    let balance = 0;
    if(this.productOpenings && this.productOpenings.openingValues) {
      balance = this.productOpenings.openingValues[productId];
    }
    if(this.inventory
      && this.inventory.rows
      && this.inventory.rows[productId]
      && this.inventory.rows[productId].stockSenIn) {
      balance += this.inventory.rows[productId].stockSenIn * this.products.find(prod => prod._id === productId).packageSize; 
    }
    if(this.inventory
      && this.inventory.rows
      && this.inventory.rows[productId]
      && this.inventory.rows[productId].stockOthersIn) {
      balance += this.inventory.rows[productId].stockOthersIn; 
    }
    return balance;
  }

  getTotalSenUnitsBought() {
    let totalUnitsSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalUnitsSold += buyingProduct.packageUnits;
      });
    }
    return totalUnitsSold;
  }

  getTotalOthersUnitsBought() {
    let totalUnitsSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalUnitsSold += buyingProduct.pieceUnits;
      });
    }
    return totalUnitsSold;
  }

  getTotalAmountBought() {
    let totalAmountSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalAmountSold += buyingProduct.getBoughtPrice();
      });
    }
    return Math.round(totalAmountSold * 100) / 100;
  }

  saveButtonPressed() {
    console.log('Save Button Pressed', this.buyingProductList);
    let date = this.dateService.date.toISOString();
    this.buyingProductList.forEach(soldRow => {
      console.log(soldRow);
      // console.log(this.inventory);
      if(!this.inventory.rows) {
        this.inventory.rows = {};
      }
      if(!this.inventory.rows[soldRow.product._id]) {
        console.log(`Creating row : ${soldRow.product._id}`);
        this.inventory.rows[soldRow.product._id] = new InventoryRow();
      }
      this.inventory.rows[soldRow.product._id].stockSenIn = soldRow.packageUnits;
      this.inventory.rows[soldRow.product._id].stockOthersIn = soldRow.pieceUnits;
      console.log(this.inventory);
    });
    console.log(`Final Inventory : ${JSON.stringify(this.inventory)}`);

    this.inventoryService.saveInventory(this.inventory, date).subscribe(resp => {
      this.snackBar.open('Products', 'Bought', {
        duration : environment.snackBarDuration
      });
      this.loadInventoryData();
    });
    
    this.refresh();
  }

  saveAndBillButtonPressed() {
    this.saveButtonPressed();
    console.log('Bill Button Pressed');
  }  

  deleteProductFromList(ind: number) {
    console.log('Deleting Product :', ind);
    this.buyingProductList.splice(ind, 1);
  }

}
