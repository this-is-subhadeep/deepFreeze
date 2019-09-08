import { Component, OnInit} from '@angular/core';

import { Product } from '../definitions/product-definition';
import { ProductService } from '../services/product.service';
import { DateService } from '../services/date.service';
import { fadeInEffect, dropDownEffect } from '../animations';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class ProductViewComponent implements OnInit {
  private newProduct:Product;
  constructor(private service: ProductService, 
    private dateService:DateService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadProductData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadProductData();
      this.refresh();
    });
  }

  refresh() {
    this.newProduct = new Product();
  }

  get products() {
    return this.service.productObservable;
  }

  get productTypes() {
    return this.service.productTypesObservable;
  }

  get newProductTypeId() {
    return this.newProduct.productType._id;
  }

  set newProductTypeId(id) {
    this.service.productTypesObservable.subscribe(prodTyps => {
      this.newProduct.productType=prodTyps.find(prodTyp => prodTyp._id === id);
    });
  }

  addButtonPressed() {
    let date = this.dateService.date.toISOString();
    this.newProduct._id=null;
    this.service.addProduct(this.newProduct,date).subscribe(resp => {
      this.snackBar.open('Products', 'Saved', {
        duration : environment.snackBarDuration
      });
      this.loadProductData();
    })
    this.refresh();
  }

  private loadProductData() {
    let date = this.dateService.date.toISOString();
    this.service.getAllProducts(date);
  }
}
