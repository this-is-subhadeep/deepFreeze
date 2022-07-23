import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { ProductService } from 'src/app/shared/services/product.service';
import { DateService } from 'src/app/shared/services/date.service';
import { fadeEffect, dropDownEffect } from 'src/app/animations';
import { Observable, Subscription } from 'rxjs';
import { CustomDatePipe } from 'src/app/shared/pipes/custom-date.pipe';

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
    private datePipe: CustomDatePipe,
    private dateService: DateService
  ) {
    this.productsClosed = new Array<string>();
    this.allSubscriptions = new Array<Subscription>();
    this.newCompleteProduct = new CompleteProduct();
  }

  ngOnInit() {
    this.loadCompleteProductData(this.datePipe.transform(this.dateService.date));
    this.refresh();
    this.allSubscriptions.push(this.dateService.dateChange$.subscribe(date => {
      this.loadCompleteProductData(this.datePipe.transform(date));
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
    const dateStr = this.datePipe.transform(this.dateService.date);
    if (dateStr) {
      this.newCompleteProduct.id = this.service.nextProductId;
      this.allSubscriptions.push(this.service.addCompleteProduct(this.newCompleteProduct, dateStr).subscribe(resp => {
        this.loadCompleteProductData(dateStr);
        this.service.refresh();
      }));
      this.refresh();
    }
  }

  addClosed() {
    this.refresh();
  }

  private loadCompleteProductData(date: string) {
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
