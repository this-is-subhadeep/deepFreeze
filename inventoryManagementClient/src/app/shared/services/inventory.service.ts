import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteInventory, InventoryOpening } from '../../definitions/inventory-definition';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private serverAddressCompleteInventories = '/complete-inventory';
  private getCompleteInventoryUrl = environment.serverBase + this.serverAddressCompleteInventories;
  constructor(private http: HttpClient) { }

  findCompleteInventoryObservable(refDate: string) {
    return this.http.get<CompleteInventory>(this.getCompleteInventoryUrl + '/' + refDate);
  }

  findCompleteInventoryForVendor(venId: string, refDate: string) {
    return this.http.get<CompleteInventory>(this.getCompleteInventoryUrl + `-vendor/${venId}/${refDate}`);
  }

  getStockOpeningForMonth(refDate: string) {
    return this.http.get<InventoryOpening>(`${environment.serverBase}/inventory-opening/${refDate}`);
  }

  saveCompleteInventory(newCompleteInventory: CompleteInventory, refDate: string) {
    return this.http.post(this.getCompleteInventoryUrl + '/' + refDate, newCompleteInventory);
  }
}
