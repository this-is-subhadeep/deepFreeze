import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { ProductService } from 'src/app/shared/services/product.service';
import { DatePipe } from '@angular/common';
import { DateService } from 'src/app/shared/services/date.service';
import { fadeInEffect, dropDownEffect } from 'src/app/animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class ProductViewComponent implements OnInit, OnDestroy {
  private completeProducts$: Observable<CompleteProduct[]>;
  private newCompleteProduct: CompleteProduct;
  private productsClosed: Array<string>;

  private allSubscriptions: Subscription[];

  constructor(
    private service: ProductService,
    private datePipe: DatePipe,
    private dateService: DateService
  ) {
    this.productsClosed = new Array<string>();
    this.allSubscriptions = new Array<Subscription>();
  }

  ngOnInit() {
    this.loadCompleteProductData();
    this.refresh();
    this.allSubscriptions.push(this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteProductData();
      this.service.refresh();
      this.refresh();
    }));
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
    this.newCompleteProduct.productType = this.service.getProductType(id);
  }

  addButtonPressed() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.newCompleteProduct.id = this.service.nextProductId;
    this.allSubscriptions.push(this.service.addCompleteProduct(this.newCompleteProduct, date).subscribe(resp => {
      this.loadCompleteProductData();
      this.service.refresh();
    }));
    this.refresh();
  }

  private addClosed() {
    this.refresh();
  }

  private loadCompleteProductData() {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this.completeProducts$ = this.service.findCompleteProductObservable(date);
  }

  deleteCompleteProduct(prodId: string) {
    this.productsClosed.push(prodId);
  }

  prodTracking(index: number, value: CompleteProduct) {
    return value.id;
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
