import { ProductService } from '../services/product.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Product, ProductType } from '../definitions/product-definition';
import { RouteService } from '../services/route.service';

export class ProductDataSource {
    private products$ = new BehaviorSubject<Product[]>(new Array<Product>());
    private productTypes$ = new BehaviorSubject<ProductType[]>(new Array<ProductType>());
    private fetchComplete$ = new BehaviorSubject<boolean>(false);
    constructor(private service: ProductService, private routeService: RouteService) { }

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
        }, error => {
            this.routeService.routeToError(error.status === 504 ? 'S003' : 'S001');
        }, () => {
            this.fetchComplete$.next(true);
        });
    }
}
