import { DataSource } from "@angular/cdk/table";
import { CompleteProduct } from "./product-definition";
import { Observable, BehaviorSubject } from "rxjs";
import { ProductService } from "../services/product.service";
import { CollectionViewer } from "@angular/cdk/collections";

export class ProductDataSource implements DataSource<CompleteProduct> {

    private comProductSubject = new BehaviorSubject<CompleteProduct []>([]);
    private _totalNoOfItems = 0;
    constructor(private service: ProductService) {}
    connect(): Observable<CompleteProduct[]> {
        return this.comProductSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer) {
        this.comProductSubject.complete();
    }
    loadCompleteProducts(refDate:string, pageSize:number, pageNumber:number) {
        this.service.findCompleteProductObservable(refDate)
        .subscribe(completeProducts => {
            let startIndex=(pageSize*(pageNumber-1)+1);
            let endIndex=startIndex+pageSize-1;
            let compProdList:CompleteProduct[]=new Array();
            let i=1;
            completeProducts.forEach(completeProduct => {
                if(i>=startIndex && i<=endIndex) {
                    compProdList.push(completeProduct);
                }
                i++;
            })
            this._totalNoOfItems=completeProducts.length;
            this.comProductSubject.next(compProdList);
        });
    }
    get totalNoOfItems() {
        return this._totalNoOfItems;
    }
}