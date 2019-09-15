import { Component, OnInit } from '@angular/core';
import { fadeInEffect, dropDownEffect } from '../animations';
import { BuyingData } from '../definitions/buying-definition';
import { Observable } from 'rxjs';
import { Product } from '../definitions/product-definition';
import { Inventory, InventoryRow } from '../definitions/inventory-definition';
import { FormControl, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { MatSnackBar } from '@angular/material';
import { productTextValidator } from '../validators';
import { startWith, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

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
    this.inventoryService.findInventoryObservable(date).subscribe(uiInventoryRows => {
      this.inventory = uiInventoryRows.inventories;
      this.products = uiInventoryRows.products.map(prod => Product.cloneAnother(prod));
      this.fillSellingData();
      // console.log(this.products);
    });
    // console.log(this.dataSource);
  }

  private refresh() {
    this.buyingProductList = new Array();
  }

  private productNameDisp(prod:Product) {
    console.log(prod);
    console.log(this.inventory);
    return prod?`${prod.name} - ${prod.productType.name}`:'';
  }

  private fillSellingData() {
    this.buyingProductList = new Array<BuyingData>();
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

  private hideProductTable(): boolean {
    return !(this.buyingProductList != null && this.buyingProductList.length > 0);
  }

  private getStockBalance(productId: string): number {
    let balance = 0;
    return balance;
  }

  private getTotalSenUnitsBought() {
    let totalUnitsSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalUnitsSold += buyingProduct.packageUnits;
      });
    }
    return totalUnitsSold;
  }

  private getTotalOthersUnitsBought() {
    let totalUnitsSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalUnitsSold += buyingProduct.pieceUnits;
      });
    }
    return totalUnitsSold;
  }

  private getTotalAmountBought() {
    let totalAmountSold = 0;
    if (this.buyingProductList && this.buyingProductList.length > 0) {
      this.buyingProductList.forEach(buyingProduct => {
        totalAmountSold += buyingProduct.getBoughtPrice();
      });
    }
    return Math.round(totalAmountSold * 100) / 100;
  }

  private saveButtonPressed() {
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

  private saveAndBillButtonPressed() {
    this.saveButtonPressed();
    console.log('Bill Button Pressed');
  }  

  private deleteProductFromList(ind: number) {
    console.log('Deleting Product :', ind);
    this.buyingProductList.splice(ind, 1);
  }

}
