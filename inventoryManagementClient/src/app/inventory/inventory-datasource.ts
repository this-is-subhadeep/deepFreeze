import { DataSource } from "@angular/cdk/table";
import { CompleteInventory, CompleteInventoryRow } from "./inventory-definition";
import { Observable, BehaviorSubject } from "rxjs";
import { InventoryService } from "../services/inventory.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { CompleteVendor } from "../vendor/vendor-definition";

export class InventoryDataSource implements DataSource<CompleteInventoryRow> {

    private comVendorSubject = new BehaviorSubject<CompleteVendor []>([]);
    private comInventorySubject = new BehaviorSubject<CompleteInventoryRow []>([]);
    // private _totalNoOfItems = 0;
    constructor(private service: InventoryService) {}
    connect(): Observable<CompleteInventoryRow []> {
        return this.comInventorySubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.comInventorySubject.complete();
    }

    loadCompleteInventory(refDate:string) {
        this.service.findCompleteInventoryObservable(refDate)
        .subscribe(completeInventory => {
            // console.log(completeInventory);
            if(completeInventory!=undefined) {
                let compInvList:CompleteInventoryRow[]=new Array();
                if(completeInventory.rows!=undefined) {
                    completeInventory.rows.forEach(completeInventoryRow => {
                        compInvList.push(completeInventoryRow);
                    });
                }
                // this._totalNoOfItems=completeInventory.rows.length;
                this.comInventorySubject.next(compInvList);
                let compVenList:CompleteVendor[]=new Array();
                if(completeInventory.vens!=null) {
                    completeInventory.vens.forEach(vedor => {
                        compVenList.push(vedor);
                    });
                }
                this.comVendorSubject.next(compVenList);
            }
            
        });
    }

    get vendorObservable() {
        return this.comVendorSubject.asObservable();
    }
    // get totalNoOfItems() {
    //     return this._totalNoOfItems;
    // }
}