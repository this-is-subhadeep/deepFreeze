import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inventory, InventoryOpening, ProductOpening } from '../definitions/inventory-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from '../../environments/conf';
import { Observable } from 'rxjs';
import { Product } from '../definitions/product-definition';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private getInventoryUrl = environment.serverBase + appConfigurations.inventoryURL;

  constructor(private http: HttpClient, private userService: UserService) { }

  findInventoryObservable(refDate: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.getInventoryUrl + '/till-date/' + refDate, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }

  findInventoryOpeningObservable(refDate: string): Observable<InventoryOpening> {
    console.log('findInventoryOpeningObservable');
    const url = this.getInventoryUrl + '/opening/' + refDate;
    return this.http.get<InventoryOpening>(url, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }

  saveInventory(inventory: Inventory, refDate: string) {
    const url = this.getInventoryUrl + '/' + refDate;
    return this.http.post(url, inventory, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }

  saveInventoryOpening(inventoryOpening: InventoryOpening, refDate: string) {
    const url = this.getInventoryUrl + '/opening/' + refDate;
    return this.http.post(url, inventoryOpening, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }

  fillOpenings(inventoryOpening: InventoryOpening,
    inventories: Inventory[],
    products: Product[],
    refDate: string,
    withToday: boolean = false): ProductOpening {
    const productOpenings: ProductOpening = {
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
              for (const venId in inventory.rows[product._id].vendorValue) {
                if (inventory.rows[product._id].vendorValue.hasOwnProperty(venId)) {
                  if (inventory.rows[product._id].vendorValue[venId].packages) {
                    totalOut += inventory.rows[product._id].vendorValue[venId].packages * product.packageSize;
                  }
                  if (inventory.rows[product._id].vendorValue[venId].pieces) {
                    totalOut += inventory.rows[product._id].vendorValue[venId].pieces;
                  }
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
