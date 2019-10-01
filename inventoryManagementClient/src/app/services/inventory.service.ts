import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory, InventoryOpening, UIInventoryRow, ProductOpening } from '../definitions/inventory-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from '../../environments/conf'
import { Observable } from 'rxjs';
import { Product } from '../definitions/product-definition';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private getInventoryUrl = environment.serverBase + appConfigurations.inventoryURL;

  constructor(private http: HttpClient) { }

  findInventoryObservable(refDate: string): Observable<Inventory[]> {
    let url = this.getInventoryUrl + "/" + refDate;
    return this.http.get<Inventory[]>(this.getInventoryUrl + "/till-date/" + refDate);
  }

  findInventoryOpeningObservable(refDate: string): Observable<InventoryOpening> {
    console.log('findInventoryOpeningObservable');
    let url = this.getInventoryUrl + "/opening/" + refDate;
    return this.http.get<InventoryOpening>(url);
  }

  saveInventory(inventory: Inventory, refDate: string) {
    let url = this.getInventoryUrl + "/" + refDate;
    return this.http.post(url, inventory);
  }

  saveInventoryOpening(inventoryOpening: InventoryOpening, refDate: string) {
    let url = this.getInventoryUrl + "/opening/" + refDate;
    return this.http.post(url, inventoryOpening);
  }

  fillOpenings(inventoryOpening: InventoryOpening,
    inventories: Inventory[],
    products: Product[],
    refDate: string,
    withToday: boolean = false): ProductOpening {
    let productOpenings: ProductOpening = {
      openingValues: {}
    };
    products.forEach(product => {
      let opening = 0;
      if (inventoryOpening && inventoryOpening.rows && inventoryOpening.rows[product._id]) {
        opening += inventoryOpening.rows[product._id].pieces;
      }
      if (inventories) {
        inventories.forEach(inventory => {
          if (inventory.rows && inventory.rows[product._id] && (inventory.date !== refDate || withToday)) {
            let totalIn = 0;
            if (inventory.rows[product._id].stockSenIn) {
              totalIn += inventory.rows[product._id].stockSenIn * product.packageSize;
            }
            if (inventory.rows[product._id].stockOthersIn) {
              totalIn += inventory.rows[product._id].stockOthersIn;
            }
            opening += totalIn;
            let totalOut = 0;
            if (inventory.rows[product._id].vendorValue) {
              for (let venId in inventory.rows[product._id].vendorValue) {
                if (inventory.rows[product._id].vendorValue[venId].packages) {
                  totalOut += inventory.rows[product._id].vendorValue[venId].packages * product.packageSize;
                }
                if (inventory.rows[product._id].vendorValue[venId].pieces) {
                  totalOut += inventory.rows[product._id].vendorValue[venId].pieces;
                }
              }
            }
            opening -= totalOut;
          }
        });
      }
      if (opening) {
        productOpenings.openingValues[product._id] = opening;
      }
    });
    return productOpenings;
  }

}
