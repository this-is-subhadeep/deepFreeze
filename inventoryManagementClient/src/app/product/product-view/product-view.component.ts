import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { ProductService } from 'src/app/shared/services/product.service';
import { DatePipe } from '@angular/common';
import { DateService } from 'src/app/shared/services/date.service';
import { fadeEffect, dropDownEffect } from 'src/app/animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
  animations: [fadeEffect, dropDownEffect]
})
export class ProductViewComponent implements OnInit, OnDestroy {
  completeProducts$: Observable<CompleteProduct[]> | undefined;
  newCompleteProduct: CompleteProduct;
  productsClosed: Array<string>;

  private allSubscriptions: Subscription[];

  constructor(
    private service: ProductService,
    private datePipe: DatePipe,
    private dateService: DateService
  ) {
    this.productsClosed = new Array<string>();
    this.allSubscriptions = new Array<Subscription>();
    this.newCompleteProduct = new CompleteProduct();
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
    if (this.service.getProductType(id)) {
      this.newCompleteProduct.productType = this.service.getProductType(id)!;
    }
  }

  addButtonPressed() {
    const date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    if (date) {
      this.newCompleteProduct.id = this.service.nextProductId;
      this.allSubscriptions.push(this.service.addCompleteProduct(this.newCompleteProduct, date).subscribe(resp => {
        this.loadCompleteProductData();
        this.service.refresh();
      }));
      this.refresh();
    }
  }

  addClosed() {
    this.refresh();
  }

  private loadCompleteProductData() {
    const date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    if (date) {
      this.completeProducts$ = this.service.findCompleteProductObservable(date);
    }
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
