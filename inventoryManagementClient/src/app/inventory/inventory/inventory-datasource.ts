import { DataSource } from "@angular/cdk/table";
import { CompleteInventory, CompleteInventoryRow } from "../../definitions/inventory-definition";
import { Observable, BehaviorSubject } from "rxjs";
import { InventoryService } from "../../shared/services/inventory.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { CompleteVendor } from "../../definitions/vendor-definition";

export class InventoryDataSource implements DataSource<CompleteInventoryRow> {

    private comVendorSubject = new BehaviorSubject<CompleteVendor[]>([]);
    private comInventorySubject = new BehaviorSubject<CompleteInventoryRow[]>([]);
    private openingExistSubject = new BehaviorSubject<boolean>(false);
    private comInventory: CompleteInventory;
    constructor(private service: InventoryService) {
        this.comInventory = new CompleteInventory();
    }
    connect(): Observable<CompleteInventoryRow[]> {
        return this.comInventorySubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.comInventorySubject.complete();
    }

    loadCompleteInventory(refDate: string) {
        this.service.findCompleteInventoryObservable(refDate)
            .subscribe(completeInventory => {
                if (completeInventory != undefined) {
                    let totalStockOpening = 0;
                    let compInvList: CompleteInventoryRow[] = new Array();
                    if (completeInventory.rows != undefined) {
                        completeInventory.rows.forEach(completeInventoryRow => {
                            compInvList.push(completeInventoryRow);
                            if (completeInventoryRow.stockOpening) {
                                totalStockOpening += completeInventoryRow.stockOpening;
                            }
                        });
                    }
                    this.comInventorySubject.next(compInvList);
                    let compVenList: CompleteVendor[] = new Array();
                    if (completeInventory.vens != null) {
                        completeInventory.vens.forEach(vedor => {
                            compVenList.push(vedor);
                        });
                    }
                    this.comVendorSubject.next(compVenList);
                    (totalStockOpening > 0) ? this.openingExistSubject.next(true) : this.openingExistSubject.next(false);
                    this.comInventory = completeInventory;
                }

            });
    }

    get vendorObservable() {
        return this.comVendorSubject.asObservable();
    }

    get doesStockOpeningExist() {
        return this.openingExistSubject.asObservable();
    }

    autoGenerateStockOpening(refDate: string) {
        this.service.getStockOpeningForMonth(refDate).subscribe(invOpen => {
            console.log({ invOpen });
            if (this.comInventory && this.comInventory.rows) {
                this.comInventory.rows.forEach(invRow => {
                    if(invOpen.stockOpeing) {
                        invOpen.stockOpeing.forEach(stock => {
                            if (invRow.id === stock.id.productId) {
                                invRow.stockOpening = stock.pieces;
                            }
                        });
                    }
                });
                this.comInventorySubject.next(this.comInventory.rows);
            }
        });
    }
}