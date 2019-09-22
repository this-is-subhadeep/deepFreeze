import { DataSource } from "@angular/cdk/table";
import { UIInventoryRow, Inventory, UIInventoryOpeningRow } from "../definitions/inventory-definition";
import { Observable, BehaviorSubject, forkJoin, combineLatest } from "rxjs";
import { InventoryService } from "../services/inventory.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { Product } from "../definitions/product-definition";
import { ProductService } from "../services/product.service";
// import { combineLatest } from "rxjs/operators";

export class InventoryOpeningDataSource implements DataSource<UIInventoryOpeningRow> {

    private inventoryOpening$ = new BehaviorSubject<UIInventoryOpeningRow []>([]);
    constructor(private service: InventoryService,
        private productService: ProductService
    ) {}
    connect(): Observable<UIInventoryOpeningRow []> {
        return this.inventoryOpening$.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.inventoryOpening$.complete();
    }

    loadInventoryOpening(refDate:string) {
        console.log('loadInventoryOpening');
        console.log(refDate);
        this.productService.getAllProducts(refDate)
        combineLatest(
            this.service.findInventoryOpeningObservable(refDate),
            this.productService.productTypesObservable,
            this.productService.productObservable
        ).subscribe(([inventoryOpening, productTypes, products]) => {
            if(productTypes) {
                // console.log(productTypes);
                const uiInventoryOpeningRows = new Array<UIInventoryOpeningRow>();
                productTypes.forEach(productType => {
                    let uiInvOpenRowPT = new UIInventoryOpeningRow();
                    uiInvOpenRowPT.id = productType._id;
                    uiInvOpenRowPT.name = productType.name;
                    uiInventoryOpeningRows.push(uiInvOpenRowPT);
                    products.filter(prod =>  prod.productType._id === productType._id).forEach(product => {
                        // console.log(product);
                        let uiInvOpenRowP = new UIInventoryOpeningRow();
                        uiInvOpenRowP.id = product._id;
                        uiInvOpenRowP.name = product.name;
                        uiInvOpenRowP.prodDets = product;
                        if(inventoryOpening.rows && inventoryOpening.rows[product._id]) {
                            uiInvOpenRowP.stockOpening = inventoryOpening.rows[product._id].pieces;
                        }
                        uiInventoryOpeningRows.push(uiInvOpenRowP);
                    });
                });
                // console.log(uiInventoryOpeningRows);
                this.inventoryOpening$.next(uiInventoryOpeningRows);
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
}