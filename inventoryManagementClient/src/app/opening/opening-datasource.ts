import { DataSource } from '@angular/cdk/table';
import { UIInventoryRow, Inventory, UIInventoryOpeningRow } from '../definitions/inventory-definition';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { InventoryService } from '../services/inventory.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { Product } from '../definitions/product-definition';
import { ProductService } from '../services/product.service';
import { RouteService } from '../services/route.service';

export class InventoryOpeningDataSource implements DataSource<UIInventoryOpeningRow> {

    private inventoryOpening$ = new BehaviorSubject<UIInventoryOpeningRow[]>([]);
    private fetchComplete$ = new BehaviorSubject<boolean>(false);
    constructor(private service: InventoryService,
        private productService: ProductService,
        private routeService: RouteService
    ) { }
    connect(): Observable<UIInventoryOpeningRow[]> {
        return this.inventoryOpening$.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.inventoryOpening$.complete();
    }

    loadInventoryOpening(refDate: string) {
        this.fetchComplete$.next(false);
        this.productService.getAllProducts(refDate);
        forkJoin(
            this.service.findInventoryOpeningObservable(refDate),
            this.productService.productTypesObservable,
            this.productService.productObservable
        ).subscribe(([inventoryOpening, productTypes, products]) => {
            if (productTypes) {
                const uiInventoryOpeningRows = new Array<UIInventoryOpeningRow>();
                productTypes.forEach(productType => {
                    const uiInvOpenRowPT = new UIInventoryOpeningRow();
                    uiInvOpenRowPT.id = productType._id;
                    uiInvOpenRowPT.name = productType.name;
                    uiInventoryOpeningRows.push(uiInvOpenRowPT);
                    products.filter(prod => prod.productType._id === productType._id).forEach(product => {
                        const uiInvOpenRowP = new UIInventoryOpeningRow();
                        uiInvOpenRowP.id = product._id;
                        uiInvOpenRowP.name = product.name;
                        uiInvOpenRowP.prodDets = product;
                        if (inventoryOpening.rows && inventoryOpening.rows[product._id]) {
                            uiInvOpenRowP.stockOpening = inventoryOpening.rows[product._id].pieces;
                        }
                        uiInventoryOpeningRows.push(uiInvOpenRowP);
                    });
                });
                // console.log(uiInventoryOpeningRows);
                this.inventoryOpening$.next(uiInventoryOpeningRows);
            }
        }, error => {
            this.routeService.routeToError(error.status === 504 ? 'S005' : 'S001');
        }, () => {
            this.fetchComplete$.next(true);
        });
    }

    private fillStockIn(invs: Inventory, prod: Product, uiInvRow) {
        if (invs && invs.rows) {
            const inventoryRow = invs.rows[prod._id];
            if (inventoryRow) {
                if (inventoryRow.stockSenIn) {
                    uiInvRow.stockSenIn = inventoryRow.stockSenIn;
                    uiInvRow.stockTotalIn = inventoryRow.stockSenIn * prod.packageSize;
                }
                if (inventoryRow.stockOthersIn) {
                    uiInvRow.stockOthersIn = inventoryRow.stockOthersIn;
                    if (!uiInvRow.stockTotalIn) {
                        uiInvRow.stockTotalIn = 0;
                    }
                    uiInvRow.stockTotalIn = uiInvRow.stockTotalIn + inventoryRow.stockOthersIn;
                }
            }
        }
    }
    get fetchComplete() {
        return this.fetchComplete$.asObservable();
    }
}
