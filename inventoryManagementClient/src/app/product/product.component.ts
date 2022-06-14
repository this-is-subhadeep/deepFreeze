import { Component, OnInit, Input } from '@angular/core';
import { CompleteProduct } from '../definitions/product-definition';
import { FormGroup, Validators, AbstractControl, FormBuilder, NgModel } from '@angular/forms';
import { DateService } from '../services/date.service';
import { ProductService } from '../services/product.service';
import { DatePipe } from '@angular/common';
import { MatExpansionPanel } from '@angular/material';
import { sizeValidator, priceValidator } from '../validators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  get product():CompleteProduct {
    return this._product;
  }
  @Input()
  set product(prod:CompleteProduct) {
    this._product = prod;
    if(this.prodForm) {
      this.prodForm.controls.name.setValue(prod.name);
      this.prodForm.controls.size.setValue(prod.packageSize);
      this.prodForm.controls.cp.setValue(prod.costPrice);
      this.prodForm.controls.sp.setValue(prod.sellingPrice);
    }
  }
  
  @Input() editable: boolean;

  private _product: CompleteProduct;
  private prodForm: FormGroup;

  constructor(private service: ProductService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private fb: FormBuilder) { }

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

    if (!this.editable) {
      this.prodForm.disable();
    }
  }

  onUpdate(exPanel: MatExpansionPanel) {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this._product.name = this.prodForm.controls.name.value;
    this._product.packageSize = this.prodForm.controls.size.value;
    this._product.costPrice = this.prodForm.controls.cp.value;
    this._product.sellingPrice = this.prodForm.controls.sp.value;
    this.service.updateCompleteProduct(this._product, date).subscribe(resp => {
      exPanel.close();
    });
  }

}
