import { Component, OnInit, Input } from '@angular/core';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatExpansionPanel } from '@angular/material';
import { sizeValidator, priceValidator } from 'src/app/validators';
import { ProductService } from 'src/app/shared/services/product.service';
import { DateService } from 'src/app/shared//services/date.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  get product(): CompleteProduct {
    return this._product;
  }
  @Input()
  set product(prod: CompleteProduct) {
    this._product = prod;
    if (this.prodForm) {
      this.prodForm.controls.name.setValue(prod.name);
      this.prodForm.controls.size.setValue(prod.packageSize);
      this.prodForm.controls.cp.setValue(prod.costPrice);
      this.prodForm.controls.sp.setValue(prod.sellingPrice);
    }
  }

  @Input() editable: boolean;

  private _product: CompleteProduct;
  private prodForm: FormGroup;
  private editComponent: boolean;

  constructor(
    private readonly service: ProductService,
    private readonly datePipe: DatePipe,
    private readonly dateService: DateService,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {

    this.prodForm = this.fb.group({
      name: [
        this._product.name, [
          Validators.required
        ]
      ],
      size: [
        this._product.packageSize, [
          Validators.required,
          sizeValidator
        ]
      ],
      cp: [
        this._product.costPrice, [
          Validators.required,
          priceValidator
        ]
      ],
      sp: [
        this._product.sellingPrice, [
          Validators.required,
          priceValidator
        ]
      ]
    });

    this.prodForm.disable();
  }

  onEdit() {
    if (this.editable) {
      if (!this.editComponent) {
        this.editComponent = true
      } else if (!this.isProductUpdated()) {
        this.editComponent = false;
      }
      // this.editComponent = !this.editComponent;
      this.editComponent ? this.prodForm.enable() : this.prodForm.disable();
    }
  }

  isProductUpdated () {
    return this._product.name !== this.prodForm.controls.name.value
      || this._product.packageSize !== this.prodForm.controls.size.value
      || this._product.costPrice !== this.prodForm.controls.cp.value
      || this._product.sellingPrice !== this.prodForm.controls.sp.value
  }

  onUpdate(exPanel: MatExpansionPanel) {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this._product.name = this.prodForm.controls.name.value;
    this._product.packageSize = this.prodForm.controls.size.value;
    this._product.costPrice = this.prodForm.controls.cp.value;
    this._product.sellingPrice = this.prodForm.controls.sp.value;
    this.service.updateCompleteProduct(this._product, date).subscribe(resp => {
      this.editComponent = false;
      exPanel.close();
      this.prodForm.disable();
    });
  }

}
