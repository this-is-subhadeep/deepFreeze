import { Component, OnInit} from '@angular/core';

import { CompleteProduct } from '../definitions/product-definition';
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

  get newProductTypeId() {
    return this.newCompleteProduct.productType.id;
  }

  set newProductTypeId(id) {
    this.newCompleteProduct.productType=this.service.getProductType(id);
  }

  addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.newCompleteProduct.id=this.service.nextProductId;
    this.service.addCompleteProduct(this.newCompleteProduct,date).subscribe(resp => {
      this.loadCompleteProductData();
      this.service.refresh();
    })
    this.refresh();
  }

  private addClosed() {
    this.refresh();
  }

  private loadCompleteProductData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.service.findCompleteProductObservable(date).subscribe(completeProducts => {
      this.completeProducts=completeProducts;
    })
  }
}
