import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompleteInventory } from '../inventory/inventory-definition';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private serverAddressCompleteInventories='/complete-inventory';
  private getCompleteInventoryUrl=environment.serverBase+this.serverAddressCompleteInventories;
  constructor(private http:HttpClient) { }

  findCompleteInventoryObservable (refDate:string) {
    let url = this.getCompleteInventoryUrl+"/"+refDate;
    return this.http.get<CompleteInventory>(url);
  }
  
  saveCompleteInventory(newCompleteInventory:CompleteInventory, refDate:string) {
    let url = this.getCompleteInventoryUrl+"/"+refDate;
    return this.http.post(url,newCompleteInventory);
  }
}
