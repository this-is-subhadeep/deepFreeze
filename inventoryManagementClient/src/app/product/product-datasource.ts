import { DataSource } from "@angular/cdk/table";
import { Product } from "./product-definition";
import { Observable, BehaviorSubject } from "rxjs";
import { ProductService } from "../services/product.service";
import { CollectionViewer } from "@angular/cdk/collections";

export class ProductDataSource implements DataSource<Product> {

    private productSubject = new BehaviorSubject<Product []>([]);
    private _totalNoOfItems = 0;
    constructor(private service: ProductService) {}
    connect(): Observable<Product[]> {
        return this.productSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.productSubject.complete();
    }
    loadProducts(refDate:string, pageSize:number, pageNumber:number) {
        this.service.findProductObservable(refDate)
        .subscribe(products => {
            let startIndex=(pageSize*(pageNumber-1)+1);
            let endIndex=startIndex+pageSize-1;
            let prodList:Product[]=new Array();
            let i=1;
            products.forEach(product => {
                if(i>=startIndex && i<=endIndex) {
                    prodList.push(product);
                }
                i++;
            })
            this._totalNoOfItems=products.length;
            this.productSubject.next(prodList);
        });
    }
    get totalNoOfItems() {
        return this._totalNoOfItems;
    }
}