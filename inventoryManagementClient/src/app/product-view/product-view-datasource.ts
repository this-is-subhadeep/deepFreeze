import { ProductService } from "../services/product.service";
import { BehaviorSubject, forkJoin } from "rxjs";
import { Product, ProductType } from "../definitions/product-definition";

export class ProductDataSource {
    private products$ = new BehaviorSubject<Product[]>(new Array<Product>());
    private productTypes$ = new BehaviorSubject<ProductType[]>(new Array<ProductType>());
    private fetchComplete$ = new BehaviorSubject<boolean>(false);
    constructor(private service: ProductService) { }

    get productsObservable() {
        return this.products$.asObservable();
    }

    get productTypesObservable() {
        return this.productTypes$.asObservable();
    }

    get fetchComplete() {
        return this.fetchComplete$.asObservable();
    }

    loadProducts(refDate: string) {
        this.fetchComplete$.next(false);
        this.service.getAllProducts(refDate);
        forkJoin(
            this.service.productObservable,
            this.service.productTypesObservable
        ).subscribe(([products, productTypes]) => {
            this.products$.next(products);
            this.productTypes$.next(productTypes);
        }, error => { }, () => {
            this.fetchComplete$.next(true);
        });
    }
}