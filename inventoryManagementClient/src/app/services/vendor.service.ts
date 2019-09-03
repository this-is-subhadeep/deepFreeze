import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../definitions/vendor-definition';
import { appConfigurations } from 'src/environments/conf';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private getVendorUrl=environment.serverBase+appConfigurations.vendorURL;

  constructor(private http:HttpClient) {
  }

  findVendorObservable (refDate:string) {
    let url = this.getVendorUrl+"/"+refDate;
    return this.http.get<Vendor[]>(url);
  }

  addVendor(newVendor:Vendor, refDate:string) {
    let url = this.getVendorUrl+"/"+refDate;
    return this.http.post(url,newVendor);
  }
  
  updateVendor(newVendor:Vendor, refDate:string) {
    let url = this.getVendorUrl+"/"+refDate;
    return this.http.put(url,newVendor);
  }

}
