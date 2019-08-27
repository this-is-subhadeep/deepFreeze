import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteInventory } from '../inventory/inventory-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from '../../environments/conf'
import { CompleteProduct, ProductType } from '../product/product-definition';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { CompleteVendor } from '../vendor/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private getInventoryUrl=environment.serverBase+appConfigurations.inventoryURL;
  private getProductURL=environment.serverBase+appConfigurations.productURL;
  private getProductTypeURL=environment.serverBase+appConfigurations.productTypeURL;
  private getVendorURL=environment.serverBase+appConfigurations.vendorURL;
  private completeProduct = new BehaviorSubject([]);

  constructor(private http:HttpClient) { }

  findCompleteInventoryObservable (refDate:string) {
    forkJoin([
      this.http.get<CompleteInventory>(this.getInventoryUrl+"/"+refDate),
      this.http.get<CompleteProduct[]>(this.getProductURL+"/"+refDate),
      this.http.get<ProductType>(this.getProductTypeURL),
      this.http.get<CompleteVendor>(this.getVendorURL+"/"+refDate)
    ]).subscribe(result => {
      this.completeProduct.next(result);
    });
    return this.completeProduct
  }
  
  saveCompleteInventory(newCompleteInventory:CompleteInventory, refDate:string) {
    let url = this.getInventoryUrl+"/"+refDate;
    return this.http.post(url,newCompleteInventory);
  }
}
