import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProductType, CompleteProduct } from '../product/product-definition';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serverAddressProductTypes='/product/product-types';
  private serverAddressCompleteProducts='/product';
  private _productTypes:ProductType[];
  private getProductTypesUrl=environment.serverBase+this.serverAddressProductTypes;
  private getCompleteProductUrl=environment.serverBase+this.serverAddressCompleteProducts;
  constructor(private http:HttpClient) {
    this._productTypes=[];
    this.http.get<ProductType[]>(this.getProductTypesUrl).subscribe(data => {
      this._productTypes = data;
    })
  }

  get productTypes() {
    return this._productTypes;
  }

  findCompleteProductObservable (refDate:string) {
    console.log(`findCompleteProductObservable : ${this.getCompleteProductUrl}/${refDate}`)
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.get<CompleteProduct[]>(url);
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
  addCompleteProduct(newCompleteProduct:CompleteProduct, refDate:string) {
    console.log(`addCompleteProduct : ${this.getCompleteProductUrl}/${refDate}`)
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.post(url,newCompleteProduct);
  }
  updateCompleteProduct(newCompleteProduct:CompleteProduct, refDate:string) {
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.put(url,newCompleteProduct);
  }
}
