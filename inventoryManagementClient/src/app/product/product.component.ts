import { Component, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material';

import { Product } from './product-definition';
import { ProductService } from '../services/product.service';
import { ProductDataSource } from './product-datasource';
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
  dataSource:ProductDataSource;
  columnsToDisplay=["productName", "productType", "packageSize", "costPrice", "sellingPrice"];
  private showUpdateButton=false;
  private showAddForm=false;
  private pageSize=5;
  private pageIndex=0;
  private newProduct:Product;
  private selectedProduct:Product;
  private selectedClass="selectedRow";
  constructor(private service: ProductService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource=new ProductDataSource(this.service);
    this.loadProductData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadProductData();
      // this.service.refresh();
      this.refresh();
    });
  }

  refresh() {
    this.newProduct = new Product();
    this.selectedProduct = new Product();
    this.showUpdateButton=false;
  }

  get productTypes() {
    return this.service.productTypes;
  }

  get showProdTable() {
    return !this.showAddForm;
  }

  get showAddButton() {
    return !this.showUpdateButton;
  }

  get newProductName() {
    return this.newProduct.name;
  }

  set newProductName(name) {
    this.newProduct.name=name;
  }

  get newProductTypeId() {
    console.log(this.newProduct);
    return this.newProduct.productType._id;
  }

  set newProductTypeId(id) {
    this.newProduct.productType=this.service.getProductType(id);
  }

  get newPackageSize() {
    return this.newProduct.packageSize;
  }

  set newPackageSize(size) {
    this.newProduct.packageSize=size;
  }

  get newCostPrice() {
    return this.newProduct.costPrice;
  }

  set newCostPrice(price) {
    this.newProduct.costPrice=price;
  }

  get newSellingPrice() {
    return this.newProduct.sellingPrice;
  }

  set newSellingPrice(price) {
    this.newProduct.sellingPrice=price;
  }
  log(data) {
    console.log("Here",data);
    return false;
  }
  setProductSelected(compProd:Product) {
    if(!this.isThisProductSelected(compProd)) {
      this.selectedProduct=Product.cloneAnother(compProd);
      this.showUpdateButton=true;
    }
  }
  getSelectRowClass(compProd:Product) {
    return this.isThisProductSelected(compProd)?this.selectedClass:null;
  }
  isThisProductSelected(compProd:Product) {
    return (this.selectedProduct!=null
            && this.selectedProduct._id === compProd._id);
  }
  handlePageEvent(e:PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadProductData();
    // this.service.refresh();
  }
  addProdButtonPressed() {
    this.refresh();
    this.showAddForm=true;
  }

  updateProdButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    console.log(this.selectedProduct,date);
    this.service.updateProduct(this.selectedProduct,date).subscribe(resp => {
      this.loadProductData();
      // this.service.refresh();
    })
    this.showUpdateButton=false;
    this.refresh();
  }

  addButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    // let nextProductId = this.service.nextProductId;
    this.newProduct._id=null;
    console.log(this.newProduct,date);
    this.service.addProduct(this.newProduct,date).subscribe(resp => {
      this.loadProductData();
      // this.service.refresh();
    })
    this.showAddForm=false;
    this.refresh();
  }

  isUpdateEnabled() {
    let flag = (this.selectedProduct.name!=null && this.selectedProduct.name!="");
    if(flag) {
      flag = this.selectedProduct.productType!=null;
    }
    if(flag) {
      flag = this.selectedProduct.packageSize!=null && ((this.selectedProduct.packageSize.valueOf()*10)%10==0)
      if(flag) {
        flag = (999 - this.selectedProduct.packageSize.valueOf()) >= 0;
      }
    }
    if(flag) {
      flag = this.selectedProduct.costPrice!=null && ((this.selectedProduct.costPrice.valueOf()*1000)%10==0)
    }
    if(flag) {
      flag =  this.selectedProduct.sellingPrice!=null && ((this.selectedProduct.sellingPrice.valueOf()*1000)%10==0)
    }
  return flag;
  }

  cancelButtonPressed() {
    this.showAddForm=false;
    this.showUpdateButton=false;
    this.refresh();
  }
  private loadProductData() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    console.log(`loadCompleteProductData : ${this.dateService.date.toISOString()}`);
    this.dataSource.loadProducts(date,this.pageSize,this.pageIndex+1);
  }
}
