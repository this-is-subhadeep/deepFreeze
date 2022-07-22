import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeleteResponse, StringResponse } from 'src/app/definitions/support-definition';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private serverAddressCompleteVendors = '/complete-vendors';
  private serverAddressNextVendorId = '/vendor-next-id';
  private _nextVendorId: string | undefined;
  private getNextVendorIdUrl = environment.serverBase + this.serverAddressNextVendorId;
  private getCompleteVendorUrl = environment.serverBase + this.serverAddressCompleteVendors;

  constructor(private http: HttpClient) {
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

  findCompleteVendorObservable(refDate: string) {
    return this.http.get<CompleteVendor[]>(this.getCompleteVendorUrl + '/' + refDate);
  }

  findCompleteVendor(venId: string, refDate: string) {
    return this.http.get<CompleteVendor>(`${environment.serverBase}/complete-vendor/${venId}/${refDate}`);
  }

  canVendorBeDeleted(venId: string, refDate: string) {
    return this.http.get<DeleteResponse>(environment.serverBase + '/can-delete-vendor/' + venId + '/' + refDate);
  }

  canVendorBeBilled(venId: string, refDate: string) {
    return this.http.get<DeleteResponse>(environment.serverBase + '/can-bill-vendor/' + venId + '/' + refDate);
  }

  addCompleteVendor(newVendor: CompleteVendor, refDate: string) {
    return this.http.post<CompleteVendor>(this.getCompleteVendorUrl + '/' + refDate, newVendor);
  }

  updateCompleteVendor(newVendor: CompleteVendor, refDate: string) {
    return this.http.put<CompleteVendor>(this.getCompleteVendorUrl + '/' + refDate, newVendor);
  }

  closeCompleteVendor(completeVendor: CompleteVendor, refDate: string) {
    return this.http.put(this.getCompleteVendorUrl + '/close/' + refDate, completeVendor);
  }

}
