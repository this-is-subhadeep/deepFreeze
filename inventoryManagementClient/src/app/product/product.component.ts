import { Component, OnInit} from '@angular/core';

import { CompleteProduct } from './product-definition';
import { ProductService } from '../services/product.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { fadeInEffect, dropDownEffect } from '../animations';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class ProductComponent implements OnInit {
  private completeProducts: CompleteProduct[];
  private newCompleteProduct:CompleteProduct;
  constructor(private service: ProductService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.loadCompleteProductData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteProductData();
      this.service.refresh();
      this.refresh();
    });
  }

  refresh() {
    this.newCompleteProduct = new CompleteProduct();
  }

  get productTypes() {
    return this.service.productTypes;
  }

  get newProductName() {
    return this.newCompleteProduct.name;
  }

  set newProductName(name) {
    this.newCompleteProduct.name=name;
  }

  get newProductTypeId() {
    return this.newCompleteProduct.productType.id;
  }

  set newProductTypeId(id) {
    this.newCompleteProduct.productType=this.service.getProductType(id);
  }

  get newPackageSize() {
    return this.newCompleteProduct.packageSize;
  }

  set newPackageSize(size) {
    this.newCompleteProduct.packageSize=size;
  }

  get newCostPrice() {
    return this.newCompleteProduct.costPrice;
  }

  set newCostPrice(price) {
    this.newCompleteProduct.costPrice=price;
  }

  get newSellingPrice() {
    return this.newCompleteProduct.sellingPrice;
  }

  set newSellingPrice(price) {
    this.newCompleteProduct.sellingPrice=price;
  }

  log(data) {
    console.log("Here",data);
    return false;
  }

  updateProdButtonPressed(completeProduct:CompleteProduct) {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    console.log(completeProduct, date);
    this.service.updateCompleteProduct(completeProduct, date).subscribe(resp => {
      this.loadCompleteProductData();
      this.service.refresh();
    })
    this.refresh();
  }

  addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.newCompleteProduct.id=this.service.nextProductId;
    console.log(this.newCompleteProduct,date);
    this.service.addCompleteProduct(this.newCompleteProduct,date).subscribe(resp => {
      this.loadCompleteProductData();
      this.service.refresh();
    })
    this.refresh();
  }

  isUpdateEnabled(completeProduct:CompleteProduct) {
    let flag = (completeProduct.name!=null && completeProduct.name!="");
    if(flag) {
      flag = completeProduct.productType!=null;
    }
    if(flag) {
      flag = completeProduct.packageSize!=null && ((completeProduct.packageSize.valueOf()*10)%10==0)
      if(flag) {
        flag = (999 - completeProduct.packageSize.valueOf()) >= 0;
      }
    }
    if(flag) {
      flag = completeProduct.costPrice!=null && ((completeProduct.costPrice.valueOf()*1000)%10==0)
    }
    if(flag) {
      flag =  completeProduct.sellingPrice!=null && ((completeProduct.sellingPrice.valueOf()*1000)%10==0)
    }
  return flag;
  }

  private loadCompleteProductData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.service.findCompleteProductObservable(date).subscribe(completeProducts => {
      this.completeProducts=completeProducts;
    })
  }
}
