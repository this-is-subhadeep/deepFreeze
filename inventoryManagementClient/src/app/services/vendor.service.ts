import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../definitions/vendor-definition';
import { appConfigurations } from 'src/environments/conf';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private getVendorUrl=environment.serverBase+appConfigurations.vendorURL;
  private vendorBehaviorSubject = new BehaviorSubject<Vendor[]>(new Array<Vendor>());

  constructor(private http:HttpClient) {
  }

  get vendorObservable() : Observable<Vendor[]>{
    return this.vendorBehaviorSubject.asObservable();
  }

  getAllVendors (refDate:string) {
    let url = this.getVendorUrl+"/"+refDate;
    this.http.get<Vendor[]>(url).subscribe(vens => {
      let vendors = vens.map(ven => Vendor.cloneAnother(ven));
      this.vendorBehaviorSubject.next(vendors);
    });
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
