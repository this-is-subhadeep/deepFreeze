import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfigurations } from 'src/environments/conf';
import { environment } from '../../environments/environment';
import { Vendor } from '../definitions/vendor-definition';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private getVendorUrl = environment.serverBase + appConfigurations.vendorURL;
  private vendor$ = new Observable<Vendor[]>();

  constructor(private http: HttpClient, private userService: UserService) {
  }

  get vendorObservable(): Observable<Vendor[]> {
    return this.vendor$;
  }

  getAllVendors(refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    this.vendor$ = this.http.get<Vendor[]>(url, this.userService.authHeader)
      .pipe(map(vens => vens.map(ven => Vendor.cloneAnother(ven))));
  }

  addVendor(newVendor: Vendor, refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    return this.http.post(url, newVendor, this.userService.authHeader);
  }

  updateVendor(newVendor: Vendor, refDate: string) {
    const url = this.getVendorUrl + '/' + refDate;
    return this.http.put(url, newVendor, this.userService.authHeader);
  }

}
