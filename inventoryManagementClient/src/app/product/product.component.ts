import { Component, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material';

import { CompleteProduct } from './product-definition';
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
  private newCompleteProduct:CompleteProduct;
  private selectedCompleteProduct:CompleteProduct;
  private selectedClass="selectedRow";
  constructor(private service: ProductService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource=new ProductDataSource(this.service);
    this.loadCompleteProductData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteProductData();
      // this.service.refresh();
      this.refresh();
    });
  }

  refresh() {
    this.newCompleteProduct = new CompleteProduct();
    this.selectedCompleteProduct = new CompleteProduct();
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
    return this.newCompleteProduct.name;
  }

  set newProductName(name) {
    this.newCompleteProduct.name=name;
  }

  get newProductTypeId() {
    console.log(this.newCompleteProduct);
    return this.newCompleteProduct.productType._id;
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
  setProductSelected(compProd:CompleteProduct) {
    if(!this.isThisProductSelected(compProd)) {
      this.selectedCompleteProduct=CompleteProduct.cloneAnother(compProd);
      this.showUpdateButton=true;
    }
  }
  getSelectRowClass(compProd:CompleteProduct) {
    return this.isThisProductSelected(compProd)?this.selectedClass:null;
  }
  isThisProductSelected(compProd:CompleteProduct) {
    return (this.selectedCompleteProduct!=null
            && this.selectedCompleteProduct._id === compProd._id);
  }
  handlePageEvent(e:PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadCompleteProductData();
    // this.service.refresh();
  }
  addProdButtonPressed() {
    this.refresh();
    this.showAddForm=true;
  }

  updateProdButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    console.log(this.selectedCompleteProduct,date);
    this.service.updateCompleteProduct(this.selectedCompleteProduct,date).subscribe(resp => {
      this.loadCompleteProductData();
      // this.service.refresh();
    })
    this.showUpdateButton=false;
    this.refresh();
  }

  addButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    // let nextProductId = this.service.nextProductId;
    this.newCompleteProduct._id=null;
    console.log(this.newCompleteProduct,date);
    this.service.addCompleteProduct(this.newCompleteProduct,date).subscribe(resp => {
      this.loadCompleteProductData();
      // this.service.refresh();
    })
    this.showAddForm=false;
    this.refresh();
  }

  isUpdateEnabled() {
    let flag = (this.selectedCompleteProduct.name!=null && this.selectedCompleteProduct.name!="");
    if(flag) {
      flag = this.selectedCompleteProduct.productType!=null;
    }
    if(flag) {
      flag = this.selectedCompleteProduct.packageSize!=null && ((this.selectedCompleteProduct.packageSize.valueOf()*10)%10==0)
      if(flag) {
        flag = (999 - this.selectedCompleteProduct.packageSize.valueOf()) >= 0;
      }
    }
    if(flag) {
      flag = this.selectedCompleteProduct.costPrice!=null && ((this.selectedCompleteProduct.costPrice.valueOf()*1000)%10==0)
    }
    if(flag) {
      flag =  this.selectedCompleteProduct.sellingPrice!=null && ((this.selectedCompleteProduct.sellingPrice.valueOf()*1000)%10==0)
    }
  return flag;
  }

  cancelButtonPressed() {
    this.showAddForm=false;
    this.showUpdateButton=false;
    this.refresh();
  }
  private loadCompleteProductData() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    console.log(`loadCompleteProductData : ${this.dateService.date.toISOString()}`);
    this.dataSource.loadCompleteProducts(date,this.pageSize,this.pageIndex+1);
  }
}
