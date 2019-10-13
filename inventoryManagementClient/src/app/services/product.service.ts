import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductType, Product } from '../definitions/product-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from 'src/environments/conf';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private product$ = new Observable<Product[]>();
  private productType$ = new Observable<ProductType[]>();
  private getProductTypesUrl = environment.serverBase + appConfigurations.productTypeURL;
  private getProductUrl = environment.serverBase + appConfigurations.productURL;
  constructor(private http: HttpClient, private userService: UserService) { }

  get productTypesObservable(): Observable<ProductType[]> {
    return this.productType$;
  }

  get productObservable(): Observable<Product[]> {
    return this.product$;
  }

  getAllProducts(refDate: string) {
    const url = this.getProductUrl + '/' + refDate;
    this.product$ = this.http.get<Product[]>(url, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    }).pipe(map(prods => prods.sort((prod1, prod2) => prod1.productType.showOrder - prod2.productType.showOrder)
        .map(prod => Product.cloneAnother(prod))));
    this.productType$ = this.http.get<ProductType[]>(this.getProductTypesUrl, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    }).pipe(map(prodTyps => prodTyps.map(prodTyp => ProductType.cloneAnother(prodTyp))));
  }

  addProduct(newProduct: Product, refDate: string) {
    const url = this.getProductUrl + '/' + refDate;
    return this.http.post(url, newProduct, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }

  updateProduct(newProduct: Product, refDate: string) {
    const url = this.getProductUrl + '/' + refDate;
    return this.http.put(url, newProduct, {
      headers : new HttpHeaders().set('Authorization', `Bearer ${this.userService.bearerToken}`)
    });
  }
}
