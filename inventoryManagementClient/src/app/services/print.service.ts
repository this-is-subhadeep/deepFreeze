import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Inventory } from '../definitions/inventory-definition';
import { Product } from '../definitions/product-definition';
import { SellingData } from '../definitions/selling-definition';
import { Vendor } from '../definitions/vendor-definition';
import { InventoryService } from './inventory.service';
import { ProductService } from './product.service';
import { RouteService } from './route.service';
import { VendorService } from './vendor.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private _inventory: Inventory;
  private _products: Product[];
  private _vendor: Vendor;
  private _sellingProductList: SellingData[];
  private _deposit: number;
  isPrinting = false;

  constructor(private inventoryService: InventoryService,
    private productService: ProductService,
    private vendorService: VendorService,
    private routeService: RouteService) { }

  printDocument(documentData: string) {
    this.isPrinting = true;
    this.routeService.routeToPrint(documentData);
  }

  get sellingProductList() {
    return this._sellingProductList;
  }

  get deposit() {
    return this._deposit;
  }

  get vendor() {
    return this._vendor;
  }

  loadInvoiceData(refDate: string, venId: string) {
    this.productService.getAllProducts(refDate);
    this.vendorService.getAllVendors(refDate);
    forkJoin(
      this.inventoryService.findInventoryObservable(refDate),
      this.productService.productObservable,
      this.vendorService.vendorObservable
    ).subscribe(([inventories, products, vendors]) => {
      this._inventory = inventories.find(inv => inv.date === refDate);
      this._products = products.map(prod => Product.cloneAnother(prod));
      this._vendor = vendors.find(ven => ven._id === venId);
    }, error => { }, () => {
      this.fillSellingData(this._inventory, this._products, venId);
      this.onDataReady();
    });
  }

  private fillSellingData(inv, prods, venId: string) {
    this._sellingProductList = new Array<SellingData>();
    if (inv) {
      if (inv.vendorDeposits) {
        this._deposit = inv.vendorDeposits[venId];
      }
      for (const prodId in inv.rows) {
        if (inv.rows[prodId].vendorValue && inv.rows[prodId].vendorValue[venId]) {
          const sellingProductRow = new SellingData(prods.find(product => product._id === prodId),
            inv.rows[prodId].vendorValue[venId].pieces);
          this._sellingProductList.push(sellingProductRow);
        }
      }
    }
  }

  private onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.routeService.routeToSelling();
    });
  }
}
