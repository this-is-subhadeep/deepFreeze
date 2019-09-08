import { DataSource } from "@angular/cdk/table";
import { UIInventoryRow, Inventory } from "../definitions/inventory-definition";
import { Observable, BehaviorSubject } from "rxjs";
import { InventoryService } from "../services/inventory.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { Vendor } from "../definitions/vendor-definition";
import { Product } from "../definitions/product-definition";

export class InventoryDataSource implements DataSource<UIInventoryRow> {

    private vendorSubject = new BehaviorSubject<Vendor []>([]);
    private productSubject = new BehaviorSubject<Product []>([]);
    private inventorySubject = new BehaviorSubject<UIInventoryRow []>([]);
    constructor(private service: InventoryService) {}
    connect(): Observable<UIInventoryRow []> {
        return this.inventorySubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.inventorySubject.complete();
    }

    loadInventory(refDate:string, pageSize:number, pageNumber:number) {
        // console.log(refDate);
        this.service.findInventoryObservable(refDate)
        .subscribe(inventoryData => {
            // console.log(`invs : ${JSON.stringify(inventoryData.inventories)}`);
            if(inventoryData) {
                if(inventoryData.productTypes) {
                    let startIndex=(pageSize*(pageNumber-1)+1);
                    let endIndex=startIndex+pageSize-1;
                    let i=1;
                    const uiInventoryRows = new Array<UIInventoryRow>();
                    inventoryData.productTypes.forEach(productType => {
                        if(i>=startIndex && i<=endIndex) {
                            let uiInventoryRow = new UIInventoryRow();
                            uiInventoryRow.id = productType._id;
                            uiInventoryRow.name = productType.name;
                            uiInventoryRows.push(uiInventoryRow);
                            i++;
                            inventoryData.products.filter(prod =>  prod.productType._id === productType._id).forEach(product => {
                                if(i>=startIndex && i<=endIndex) {
                                    uiInventoryRow = new UIInventoryRow();
                                    uiInventoryRow.id = product._id;
                                    uiInventoryRow.name = product.name;
                                    uiInventoryRow.prodDets = product;
                                    this.fillStockIn(inventoryData.inventories, product, uiInventoryRow);
                                    this.fillStockOut(inventoryData.inventories, product, inventoryData.vendors , uiInventoryRow);
                                    if(uiInventoryRow.stockTotalIn && uiInventoryRow.stockTotalOut) {
                                        uiInventoryRow.stockBalance = uiInventoryRow.stockTotalIn - uiInventoryRow.stockTotalOut;
                                    } else if(uiInventoryRow.stockTotalIn && !uiInventoryRow.stockTotalOut) {
                                        uiInventoryRow.stockBalance = uiInventoryRow.stockTotalIn;
                                    } else if(!uiInventoryRow.stockTotalIn && uiInventoryRow.stockTotalOut) {
                                        uiInventoryRow.stockBalance = 0 - uiInventoryRow.stockTotalOut;
                                    }
                                    uiInventoryRows.push(uiInventoryRow);
                                    i++;
                                }
                            });
                        }
                    });
                    this.inventorySubject.next(uiInventoryRows);
                    if(inventoryData.vendors) {
                        if(inventoryData.inventories && inventoryData.inventories.vendorDeposits) {
                            inventoryData.vendors.forEach(vendor => {
                                if(inventoryData.inventories.vendorDeposits[vendor._id]) {
                                    vendor.deposit = inventoryData.inventories.vendorDeposits[vendor._id];
                                } else {
                                    vendor.deposit = null;
                                }
                            });
                        }
                        this.vendorSubject.next(inventoryData.vendors);
                    }
                    if(inventoryData.products) {
                        this.productSubject.next(inventoryData.products);
                    }
                }
            }
        });
    }

    private fillStockIn(invs : Inventory, prod : Product, uiInvRow) {
        if(invs && invs.rows) {
            const inventoryRow = invs.rows[prod._id];
            if(inventoryRow) {
                if(inventoryRow.stockSenIn) {
                    uiInvRow.stockSenIn = inventoryRow.stockSenIn;
                    uiInvRow.stockTotalIn = inventoryRow.stockSenIn * prod.packageSize;
                }
                if(inventoryRow.stockOthersIn) {
                    uiInvRow.stockOthersIn = inventoryRow.stockOthersIn;
                    if(!uiInvRow.stockTotalIn) {
                        uiInvRow.stockTotalIn = 0;
                    }
                    uiInvRow.stockTotalIn = uiInvRow.stockTotalIn + inventoryRow.stockOthersIn;
                }
            }
        }
    }

    private fillStockOut(invs : Inventory, prod : Product, vens: Vendor[],uiInvRow : UIInventoryRow) {
        if(invs && invs.rows) {
            const inventoryRow = invs.rows[prod._id];
            if(inventoryRow && inventoryRow.vendorValue) {
                for(let venValue in inventoryRow.vendorValue) {
                    if(inventoryRow.vendorValue[venValue].packages) {
                        uiInvRow.vendorValue[venValue] = inventoryRow.vendorValue[venValue].packages * prod.packageSize;
                    }
                    if(inventoryRow.vendorValue[venValue].pieces) {
                        if(!uiInvRow.vendorValue[venValue]) {
                            uiInvRow.vendorValue[venValue] = 0;
                        }
                        uiInvRow.vendorValue[venValue] += inventoryRow.vendorValue[venValue].pieces;
                    }
                    if(!uiInvRow.stockTotalOut) {
                        uiInvRow.stockTotalOut = 0;
                    }
                    uiInvRow.stockTotalOut += uiInvRow.vendorValue[venValue];
                }
            }
        }
    }

    get vendorObservable() {
        return this.vendorSubject.asObservable();
    }

    get prodObservable() {
        return this.productSubject.asObservable();
    }
}