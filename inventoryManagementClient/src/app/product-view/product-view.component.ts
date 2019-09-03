import { Component, OnInit} from '@angular/core';

import { Product } from '../definitions/product-definition';
import { ProductService } from '../services/product.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { fadeInEffect, dropDownEffect } from '../animations';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class ProductViewComponent implements OnInit {
  private products: Product[];
  private newProduct:Product;
  constructor(private service: ProductService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
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
  }

  get productTypes() {
    return this.service.productTypes;
  }

  get newProductTypeId() {
    return this.newProduct.productType._id;
  }

  set newProductTypeId(id) {
    this.newProduct.productType=this.service.getProductType(id);
  }

  addButtonPressed() {
    let date = this.dateService.date.toISOString();
    this.newProduct._id=null;
    this.service.addProduct(this.newProduct,date).subscribe(resp => {
      this.loadProductData();
      // this.service.refresh();
    })
    this.refresh();
  }

  private loadProductData() {
    let date = this.dateService.date.toISOString();
    this.service.findProductObservable(date).subscribe(products => {
      this.products=products;
    })
  }
}
