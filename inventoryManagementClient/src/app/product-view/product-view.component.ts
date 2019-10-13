import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment.prod';
import { dropDownEffect, fadeInEffect } from '../animations';
import { Product } from '../definitions/product-definition';
import { DateService } from '../services/date.service';
import { ProductService } from '../services/product.service';
import { RouteService } from '../services/route.service';
import { ProductDataSource } from './product-view-datasource';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class ProductViewComponent implements OnInit {
  private dataSource: ProductDataSource;
  private newProduct: Product;
  constructor(private service: ProductService,
    private dateService: DateService,
    private routeService: RouteService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new ProductDataSource(this.service, this.routeService);
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
    return this.dataSource.productsObservable;
  }

  get productTypes() {
    return this.dataSource.productTypesObservable;
  }

  get newProductTypeId() {
    return this.newProduct.productType._id;
  }

  set newProductTypeId(id) {
    this.service.productTypesObservable.subscribe(prodTyps => {
      this.newProduct.productType = prodTyps.find(prodTyp => prodTyp._id === id);
    });
  }

  addButtonPressed() {
    const date = this.dateService.date.toISOString();
    this.newProduct._id = null;
    this.service.addProduct(this.newProduct, date).subscribe(resp => {
      this.snackBar.open('Products', 'Saved', {
        duration: environment.snackBarDuration
      });
      this.loadProductData();
    }, error => {
      this.routeService.routeToError(error.status === 504 ? 'S003' : 'S001');
    });
    this.refresh();
  }

  private loadProductData() {
    const date = this.dateService.date.toISOString();
    this.dataSource.loadProducts(date);
  }
}
