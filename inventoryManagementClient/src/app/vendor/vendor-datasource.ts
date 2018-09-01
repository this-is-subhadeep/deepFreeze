import { DataSource } from "@angular/cdk/table";
import { CompleteVendor } from "./vendor-definition";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorService } from "../services/vendor.service";
import { CollectionViewer } from "@angular/cdk/collections";

export class VendorDataSource implements DataSource<CompleteVendor> {

    private comVendorSubject = new BehaviorSubject<CompleteVendor []>([]);
    private _totalNoOfItems = 0;
    constructor(private service: VendorService) {}
    connect(): Observable<CompleteVendor[]> {
        return this.comVendorSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.comVendorSubject.complete();
    }
    loadCompleteVendors(refDate:string, pageSize:number, pageNumber:number) {
        this.service.findCompleteVendorObservable(refDate)
        .subscribe(vendors => {
            let startIndex=(pageSize*(pageNumber-1)+1);
            let endIndex=startIndex+pageSize-1;
            let compVenList:CompleteVendor[]=new Array();
            let i=1;
            vendors.forEach(vendor => {
                if(i>=startIndex && i<=endIndex) {
                    compVenList.push(vendor);
                }
                i++;
            })
            this._totalNoOfItems=vendors.length;
            this.comVendorSubject.next(compVenList);
        });
    }
    get totalNoOfItems() {
        return this._totalNoOfItems;
    }
}