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
    let url = this.getCompleteInventoryUrl + '/' + refDate;
    return this.http.get<CompleteInventory>(url);
  }

  findCompleteInventoryForVendor(venId: string, refDate: string) {
    let url = this.getCompleteInventoryUrl + `-vendor/${venId}/${refDate}`;
    return this.http.get<CompleteInventory>(url);
  }

  getStockOpeningForMonth(refDate: string) {
    return this.http.get<InventoryOpening>(`${environment.serverBase}/inventory-opening/${refDate}`);
  }

  saveCompleteInventory(newCompleteInventory: CompleteInventory, refDate: string) {
    let url = this.getCompleteInventoryUrl + '/' + refDate;
    return this.http.post(url, newCompleteInventory);
  }
}
