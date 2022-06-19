import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeleteResponse, StringResponse } from 'src/app/definitions/support-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private serverAddressCompleteVendors='/complete-vendors';
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
    let url = this.getCompleteVendorUrl+'/'+refDate;
    return this.http.get<CompleteVendor[]>(url);
  }

  canVendorBeDeleted(venId: string, refDate: string) {
    let url = environment.serverBase+'/can-delete-vendor/'+venId+'/'+refDate;
    return this.http.get<DeleteResponse>(url);
  }

  addCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+'/'+refDate;
    return this.http.post<CompleteVendor>(url,newVendor);
  }
  
  updateCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+'/'+refDate;
    return this.http.put<CompleteVendor>(url,newVendor);
  }

  closeCompleteVendor(completeVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+"/close/"+refDate;
    return this.http.put(url,completeVendor);
  }

}
