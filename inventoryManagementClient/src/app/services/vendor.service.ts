import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StringResponse } from '../definitions/support-definition';
import { CompleteVendor } from '../definitions/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private serverAddressCompleteVendors='/complete-Vendors';
  private serverAddressNextVendorId='/vendor-next-id';
  private _nextVendorId:string;
  private getNextVendorIdUrl=environment.serverBase+this.serverAddressNextVendorId;
  private getCompleteVendorUrl=environment.serverBase+this.serverAddressCompleteVendors;

  constructor(private http:HttpClient) {
    this.refresh();
  }

  refresh() {
    this.http.get<StringResponse>(this.getNextVendorIdUrl).subscribe(data => {
      this._nextVendorId = data.response;
    });
  }

  get nextVendorId() {
    return this._nextVendorId;
  }

  findCompleteVendorObservable (refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.get<CompleteVendor[]>(url);
  }

  addCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.post<CompleteVendor>(url,newVendor);
  }
  
  updateCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.put<CompleteVendor>(url,newVendor);
  }

}
