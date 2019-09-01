import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory, InventoryServiceResult } from '../inventory/inventory-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from '../../environments/conf'
import { Product, ProductType } from '../product/product-definition';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { Vendor } from '../vendor/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private getInventoryUrl=environment.serverBase+appConfigurations.inventoryURL;
  private getProductURL=environment.serverBase+appConfigurations.productURL;
  private getProductTypeURL=environment.serverBase+appConfigurations.productTypeURL;
  private getVendorURL=environment.serverBase+appConfigurations.vendorURL;
  private completeInventorySubject = new BehaviorSubject<InventoryServiceResult>({
    inventories : new Inventory(),
    products : new Array<Product>(),
    productTypes : new Array<ProductType>(),
    vendors : new Array<Vendor>()
  });

  constructor(private http:HttpClient) { }

  findInventoryObservable (refDate:string) : BehaviorSubject<InventoryServiceResult> {
    forkJoin([
      this.http.get<Inventory>(this.getInventoryUrl+"/"+refDate),
      this.http.get<Product[]>(this.getProductURL+"/"+refDate),
      this.http.get<ProductType[]>(this.getProductTypeURL),
      this.http.get<Vendor[]>(this.getVendorURL+"/"+refDate)
    ]).subscribe(result => {
      let resultObj : InventoryServiceResult = {
        inventories : result[0],
        products : result[1],
        productTypes : result[2],
        vendors : result[3] 
      }
      this.completeInventorySubject.next(resultObj);
    });
    return this.completeInventorySubject
  }
  
  saveInventory(newInventory:Inventory, refDate:string) {
    let url = this.getInventoryUrl+"/"+refDate;
    return this.http.post(url,newInventory);
  }
}
