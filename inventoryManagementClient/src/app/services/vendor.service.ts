import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompleteVendor } from '../vendor/vendor-definition';
import { appConfigurations } from 'src/environments/conf';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private getCompleteVendorUrl=environment.serverBase+appConfigurations.vendorURL;

  constructor(private http:HttpClient) {
  }

  findCompleteVendorObservable (refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.get<CompleteVendor[]>(url);
  }

  addCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.post(url,newVendor);
  }
  
  updateCompleteVendor(newVendor:CompleteVendor, refDate:string) {
    let url = this.getCompleteVendorUrl+"/"+refDate;
    return this.http.put(url,newVendor);
  }

}
