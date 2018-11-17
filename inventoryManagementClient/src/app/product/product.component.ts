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

  @Input() product: CompleteProduct;
  @Input() editable: boolean;

  prodForm: FormGroup;
  constructor(private service: ProductService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.prodForm = this.fb.group({
      name: [
        this.product.name, [
          Validators.required
        ]
      ],
      size: [
        this.product.packageSize, [
          Validators.required,
          sizeValidator
        ]
      ],
      cp: [
        this.product.costPrice, [
          Validators.required,
          priceValidator
        ]
      ],
      sp: [
        this.product.sellingPrice, [
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
    this.product.name = this.prodForm.controls.name.value;
    this.product.packageSize = this.prodForm.controls.size.value;
    this.product.costPrice = this.prodForm.controls.cp.value;
    this.product.sellingPrice = this.prodForm.controls.sp.value;
    this.service.updateCompleteProduct(this.product, date).subscribe(resp => {
      exPanel.close();
    });
  }

}
