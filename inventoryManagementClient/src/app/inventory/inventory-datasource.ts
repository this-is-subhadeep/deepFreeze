import { DataSource } from "@angular/cdk/table";
import { UIInventoryRow, Inventory } from "../definitions/inventory-definition";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { InventoryService } from "../services/inventory.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { Vendor } from "../definitions/vendor-definition";
import { Product } from "../definitions/product-definition";
import { ProductService } from "../services/product.service";
import { VendorService } from "../services/vendor.service";

export class InventoryDataSource implements DataSource<UIInventoryRow> {

    private vendorSubject = new BehaviorSubject<Vendor []>([]);
    private productSubject = new BehaviorSubject<Product []>([]);
    private inventorySubject = new BehaviorSubject<UIInventoryRow []>([]);
    constructor(private service: InventoryService,
        private productService: ProductService,
        private vendorService: VendorService
    ) {}
    connect(): Observable<UIInventoryRow []> {
        return this.inventorySubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.inventorySubject.complete();
    }

    loadInventory(refDate:string) {
        // console.log(refDate);
        this.productService.getAllProducts(refDate);
        this.vendorService.getAllVendors(refDate);
        combineLatest(
            this.service.findInventoryOpeningObservable(refDate),
            this.service.findInventoryObservable(refDate),
            this.productService.productTypesObservable,
            this.productService.productObservable,
            this.vendorService.vendorObservable
        ).subscribe(([inventoryOpening, inventories, productTypes, products, vendors]) => {
            // console.log(`invs : ${JSON.stringify(inventoryData.inventories)}`);
            let inventory = inventories.find(inv => inv.date === refDate);
            let productOpenings = this.service.fillOpenings(inventoryOpening, inventories, products, refDate);
            if(productTypes) {
                const uiInventoryRows = new Array<UIInventoryRow>();
                productTypes.forEach(productType => {
                    let uiInventoryRow = new UIInventoryRow();
                    uiInventoryRow.id = productType._id;
                    uiInventoryRow.name = productType.name;
                    uiInventoryRows.push(uiInventoryRow);
                    products.filter(prod =>  prod.productType._id === productType._id).forEach(product => {
                        uiInventoryRow = new UIInventoryRow();
                        uiInventoryRow.id = product._id;
                        uiInventoryRow.name = product.name;
                        uiInventoryRow.prodDets = product;
                        this.fillStockIn(inventory, product, uiInventoryRow);
                        this.fillStockOut(inventory, product, vendors , uiInventoryRow);
                        if(uiInventoryRow.stockTotalIn && uiInventoryRow.stockTotalOut) {
                            uiInventoryRow.stockBalance = uiInventoryRow.stockTotalIn - uiInventoryRow.stockTotalOut;
                        } else if(uiInventoryRow.stockTotalIn && !uiInventoryRow.stockTotalOut) {
                            uiInventoryRow.stockBalance = uiInventoryRow.stockTotalIn;
                        } else if(!uiInventoryRow.stockTotalIn && uiInventoryRow.stockTotalOut) {
                            uiInventoryRow.stockBalance = 0 - uiInventoryRow.stockTotalOut;
                        }
                        if(productOpenings && productOpenings.openingValues && productOpenings.openingValues[product._id]) {
                            uiInventoryRow.stockOpening = productOpenings.openingValues[product._id];
                            if(uiInventoryRow.stockBalance) {
                                uiInventoryRow.stockBalance += uiInventoryRow.stockOpening;
                            }
                        }
                        uiInventoryRows.push(uiInventoryRow);
                    });
                });
                this.inventorySubject.next(uiInventoryRows);
                if(vendors) {
                    if(inventory && inventory.vendorDeposits) {
                        vendors.forEach(vendor => {
                            if(inventory.vendorDeposits[vendor._id]) {
                                vendor.deposit = inventory.vendorDeposits[vendor._id];
                            } else {
                                vendor.deposit = null;
                            }
                        });
                    }
                    this.vendorSubject.next(vendors);
                }
                if(products) {
                    this.productSubject.next(products);
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