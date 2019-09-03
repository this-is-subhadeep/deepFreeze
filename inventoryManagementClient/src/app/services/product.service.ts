import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProductType, Product } from '../definitions/product-definition';
import { environment } from '../../environments/environment';
import { appConfigurations } from 'src/environments/conf';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productTypes:ProductType[];
  private getProductTypesUrl=environment.serverBase+appConfigurations.productTypeURL;
  private getProductUrl=environment.serverBase+appConfigurations.productURL;
  constructor(private http:HttpClient) {
    this._productTypes=[];
    this.http.get<ProductType[]>(this.getProductTypesUrl).subscribe(data => {
      this._productTypes = data;
    })
  }

  get productTypes() {
    return this._productTypes;
  }

  findProductObservable (refDate:string) {
    // console.log(`findProductObservable : ${this.getProductUrl}/${refDate}`)
    let url = this.getProductUrl+"/"+refDate;
    return this.http.get<Product[]>(url).pipe(map(products => products.sort((prod1, prod2) => prod1.productType.showOrder - prod2.productType.showOrder)));
  }
  getProductType(typeId:string):ProductType {
    let prodType:ProductType=null;
    this.productTypes.forEach(productType => {
      if(productType._id==typeId) {
        prodType = productType;
      }
    })
    return prodType;
  }
  addProduct(newProduct:Product, refDate:string) {
    // console.log(`addProduct : ${this.getProductUrl}/${refDate}`)
    let url = this.getProductUrl+"/"+refDate;
    return this.http.post(url,newProduct);
  }
  updateProduct(newProduct:Product, refDate:string) {
    let url = this.getProductUrl+"/"+refDate;
    return this.http.put(url,newProduct);
  }
}
