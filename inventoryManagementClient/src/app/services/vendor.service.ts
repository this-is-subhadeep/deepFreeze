import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../definitions/vendor-definition';
import { appConfigurations } from 'src/environments/conf';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private getVendorUrl = environment.serverBase + appConfigurations.vendorURL;
  private vendor$ = new Observable<Vendor[]>();

  constructor(private http: HttpClient) {
  }

  get vendorObservable(): Observable<Vendor[]> {
    return this.vendor$;
  }

  getAllVendors(refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    this.vendor$ = this.http.get<Vendor[]>(url)
      .pipe(map(vens => vens.map(ven => Vendor.cloneAnother(ven))));
  }

  addVendor(newVendor: Vendor, refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    return this.http.post(url, newVendor);
  }

  updateVendor(newVendor: Vendor, refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    return this.http.put(url, newVendor);
  }

}
