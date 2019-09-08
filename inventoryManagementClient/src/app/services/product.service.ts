import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProductType, Product } from '../definitions/product-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from 'src/environments/conf';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productBehaviorSubject = new BehaviorSubject<Product[]>(new Array<Product>());
  private productTypeBehaviorSubject = new BehaviorSubject<ProductType[]>(new Array<ProductType>());
  private getProductTypesUrl=environment.serverBase+appConfigurations.productTypeURL;
  private getProductUrl=environment.serverBase+appConfigurations.productURL;
  constructor(private http:HttpClient) {}

  get productTypesObservable() : Observable<ProductType[]> {
    return this.productTypeBehaviorSubject.asObservable();
  }

  get productObservable() : Observable<Product[]> {
    return this.productBehaviorSubject.asObservable();
  }

  getAllProducts (refDate:string) {
    let url = this.getProductUrl+"/"+refDate;
    this.http.get<Product[]>(url).subscribe(prods => {
      let products = prods.sort((prod1, prod2) => prod1.productType.showOrder - prod2.productType.showOrder).
                           map(prod => Product.cloneAnother(prod));
      this.productBehaviorSubject.next(products);
    });
    this.http.get<ProductType[]>(this.getProductTypesUrl).subscribe(prodTyps => {
      let productTypes = prodTyps.map(prodTyp => ProductType.cloneAnother(prodTyp));
      this.productTypeBehaviorSubject.next(productTypes);
    })
  }

  addProduct(newProduct:Product, refDate:string) {
    let url = this.getProductUrl+"/"+refDate;
    return this.http.post(url,newProduct);
  }

  updateProduct(newProduct:Product, refDate:string) {
    let url = this.getProductUrl+"/"+refDate;
    return this.http.put(url,newProduct);
  }
}
