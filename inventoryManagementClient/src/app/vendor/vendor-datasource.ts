import { DataSource } from "@angular/cdk/table";
import { Vendor } from "./vendor-definition";
import { BehaviorSubject, Observable } from "rxjs";
import { VendorService } from "../services/vendor.service";
import { CollectionViewer } from "@angular/cdk/collections";

export class VendorDataSource implements DataSource<Vendor> {

    private vendorSubject = new BehaviorSubject<Vendor []>([]);
    private _totalNoOfItems = 0;
    constructor(private service: VendorService) {}
    connect(): Observable<Vendor[]> {
        return this.vendorSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.vendorSubject.complete();
    }
    loadVendors(refDate:string, pageSize:number, pageNumber:number) {
        this.service.findVendorObservable(refDate)
        .subscribe(vendors => {
            let startIndex=(pageSize*(pageNumber-1)+1);
            let endIndex=startIndex+pageSize-1;
            let venList:Vendor[]=new Array();
            let i=1;
            vendors.forEach(vendor => {
                if(i>=startIndex && i<=endIndex) {
                    venList.push(vendor);
                }
                i++;
            })
            this._totalNoOfItems=vendors.length;
            this.vendorSubject.next(venList);
        });
    }
    get totalNoOfItems() {
        return this._totalNoOfItems;
    }
}