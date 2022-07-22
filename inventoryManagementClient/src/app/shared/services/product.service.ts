import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductType, CompleteProduct } from '../../definitions/product-definition';
import { environment } from '../../../environments/environment';
import { DeleteResponse, StringResponse } from '../../definitions/support-definition';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serverAddressNextProductId = '/product-next-id';
  private serverAddressProductTypes = '/product-types';
  private serverAddressCompleteProducts = '/complete-products';
  private _nextProductId: string = '';
  private _productTypes: ProductType[];
  private getNextProductIdUrl = environment.serverBase + this.serverAddressNextProductId;
  private getProductTypesUrl = environment.serverBase + this.serverAddressProductTypes;
  private getCompleteProductUrl = environment.serverBase + this.serverAddressCompleteProducts;
  constructor(private http: HttpClient) {
    this._productTypes = [];
    this.http.get<ProductType[]>(this.getProductTypesUrl).subscribe(data => {
      this._productTypes = data;
    });
    this.refresh();
  }

  refresh() {
    this.http.get<StringResponse>(this.getNextProductIdUrl).subscribe(data => {
      if (data.response) {
        this._nextProductId = data.response;
      }
    });
  }

  get nextProductId() {
    return this._nextProductId;
  }

  get productTypes() {
    return this._productTypes;
  }

  findCompleteProductObservable(refDate: string) {
    return this.http.get<CompleteProduct[]>(this.getCompleteProductUrl + '/' + refDate);
  }
  getProductType(typeId: string): ProductType | null {
    let prodType: ProductType | null = null;
    this.productTypes.forEach(productType => {
      if (productType.id === typeId) {
        prodType = productType;
      }
    });
    return prodType;
  }
  canProductBeDeleted(prodId: string, refDate: string) {
    return this.http.get<DeleteResponse>(environment.serverBase + '/can-delete-product/' + prodId + '/' + refDate);
  }
  addCompleteProduct(newCompleteProduct: CompleteProduct, refDate: string) {
    return this.http.post(this.getCompleteProductUrl + '/' + refDate, newCompleteProduct);
  }
  updateCompleteProduct(completeProduct: CompleteProduct, refDate: string) {
    return this.http.put(this.getCompleteProductUrl + '/' + refDate, completeProduct);
  }
  closeCompleteProduct(completeProduct: CompleteProduct, refDate: string) {
    return this.http.put(this.getCompleteProductUrl + '/close/' + refDate, completeProduct);
  }
}
