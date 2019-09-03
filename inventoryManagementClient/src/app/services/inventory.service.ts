import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory, InventoryGetResult, InventorySaveResult } from '../definitions/inventory-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from '../../environments/conf'
import { Product, ProductType } from '../definitions/product-definition';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { Vendor } from '../definitions/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private getInventoryUrl=environment.serverBase+appConfigurations.inventoryURL;
  private getProductURL=environment.serverBase+appConfigurations.productURL;
  private getProductTypeURL=environment.serverBase+appConfigurations.productTypeURL;
  private getVendorURL=environment.serverBase+appConfigurations.vendorURL;
  private completeInventorySubject = new BehaviorSubject<InventoryGetResult>({
    inventories : new Inventory(),
    products : new Array<Product>(),
    productTypes : new Array<ProductType>(),
    vendors : new Array<Vendor>()
  });
  private inventoryUpdateSubject = new BehaviorSubject<InventorySaveResult>({
    inventoryId : '',
    vendorId : ''
  });

  constructor(private http:HttpClient) { }

  findInventoryObservable (refDate:string) : BehaviorSubject<InventoryGetResult> {
    forkJoin([
      this.http.get<Inventory>(this.getInventoryUrl+"/"+refDate),
      this.http.get<Product[]>(this.getProductURL+"/"+refDate),
      this.http.get<ProductType[]>(this.getProductTypeURL),
      this.http.get<Vendor[]>(this.getVendorURL+"/"+refDate)
    ]).subscribe(result => {
      let resultObj : InventoryGetResult = {
        inventories : result[0],
        products : result[1],
        productTypes : result[2],
        vendors : result[3] 
      }
      this.completeInventorySubject.next(resultObj);
    });
    return this.completeInventorySubject
  }

  saveInventory(inventory:Inventory, refDate:string) {
    let url = this.getInventoryUrl+"/"+refDate;
    return this.http.post(url,inventory);
  }

  saveInventoryFull(inventory:Inventory, vendor:Vendor, refDate:string) {
    // let url = this.getInventoryUrl+"/"+refDate;
    forkJoin([
      this.http.post<{_id:string}>(this.getInventoryUrl+"/"+refDate,inventory),
      this.http.put<{_id:string}>(this.getVendorURL+"/"+refDate,vendor)
    ]).subscribe(result => {
      let resultObj:InventorySaveResult = {
        inventoryId : result[0]._id,
        vendorId : result[1]._id
      }
      this.inventoryUpdateSubject.next(resultObj);
    });
    return this.inventoryUpdateSubject;
    // return this.http.post(url,compInventory.inventories);
  }
}
