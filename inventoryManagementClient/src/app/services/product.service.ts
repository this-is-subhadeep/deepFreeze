import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProductType, CompleteProduct } from '../product/product-definition';
import { environment } from '../../environments/environment';
import { StringResponse } from '../support/support-definition';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serverAddressNextProductId='/product-next-id';
  private serverAddressProductTypes='/product-types';
  private serverAddressCompleteProducts='/complete-products';
  private _nextProductId:string;
  private _productTypes:ProductType[];
  private getNextProductIdUrl=environment.serverBase+this.serverAddressNextProductId;
  private getProductTypesUrl=environment.serverBase+this.serverAddressProductTypes;
  private getCompleteProductUrl=environment.serverBase+this.serverAddressCompleteProducts;
  constructor(private http:HttpClient) {
    this._productTypes=[];
    this.http.get<ProductType[]>(this.getProductTypesUrl).subscribe(data => {
      this._productTypes = data;
    })
    this.refresh();
  }

  refresh() {
    this.http.get<StringResponse>(this.getNextProductIdUrl).subscribe(data => {
      this._nextProductId = data.response;
    });
  }

  get nextProductId() {
    return this._nextProductId;
  }

  get productTypes() {
    return this._productTypes;
  }

  findCompleteProductObservable (refDate:string) {
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.get<CompleteProduct[]>(url);
  }
  getProductType(typeId:string):ProductType {
    let prodType:ProductType=null;
    this.productTypes.forEach(productType => {
      if(productType.id==typeId) {
        prodType = productType;
      }
    })
    return prodType;
  }
  addCompleteProduct(newCompleteProduct:CompleteProduct, refDate:string) {
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.post(url,newCompleteProduct);
  }
  updateCompleteProduct(newCompleteProduct:CompleteProduct, refDate:string) {
    let url = this.getCompleteProductUrl+"/"+refDate;
    return this.http.put(url,newCompleteProduct);
  }
}
