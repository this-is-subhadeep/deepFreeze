import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CompleteProduct } from 'src/app/definitions/product-definition';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { sizeValidator, priceValidator } from 'src/app/validators';
import { ProductService } from 'src/app/shared/services/product.service';
import { DateService } from 'src/app/shared//services/date.service';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { Subscription } from 'rxjs';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  get product(): CompleteProduct {
    return this._product;
  }
  @Input()
  set product(prod: CompleteProduct) {
    this._product = prod;
    if (this.prodForm) {
      this.prodForm.get('name')!.setValue(prod.name);
      this.prodForm.get('size')!.setValue(prod.packageSize);
      this.prodForm.get('cp')!.setValue(prod.costPrice);
      this.prodForm.get('sp')!.setValue(prod.sellingPrice);
    }
  }

  @Input() editable: boolean;

  prodForm: FormGroup | undefined;
  editComponent: boolean;

  private _product: CompleteProduct;
  private deleteAllowed: boolean;

  private allSubscriptions: Subscription[];

  @Output() endProductEvent = new EventEmitter<string>();

  constructor(
    private readonly service: ProductService,
    private readonly datePipe: CustomDatePipe,
    private readonly dateService: DateService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog
  ) {
    this.deleteAllowed = false;
    this.allSubscriptions = new Array<Subscription>();
    this._product = new CompleteProduct();
    this.editComponent = false;
    this.editable = false;
  }

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
    this.allSubscriptions.push(this.service.canProductBeDeleted(
      this._product.id,
      this.datePipe.transform(this.dateService.date)!
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.deleteAllowed = true;
      }
    }));
  }

  onEdit() {
    if (this.editable && this.prodForm) {
      if (!this.editComponent) {
        this.editComponent = true;
      } else if (!this.isProductUpdated()) {
        this.editComponent = false;
      }
      this.editComponent ? this.prodForm.enable() : this.prodForm.disable();
    }
  }

  isProductUpdated() : boolean {
    if(this.prodForm) {
      return this._product.name !== this.prodForm.get('name')!.value
        || this._product.packageSize !== this.prodForm.get('size')!.value
        || this._product.costPrice !== this.prodForm.get('cp')!.value
        || this._product.sellingPrice !== this.prodForm.get('sp')!.value;
    }
    return false;
  }

  onUpdate(exPanel: MatExpansionPanel) {
    const date = this.datePipe.transform(this.dateService.date);
    if(date && this.prodForm) {
      this._product.name = this.prodForm.get('name')!.value;
      this._product.packageSize = this.prodForm.get('size')!.value;
      this._product.costPrice = this.prodForm.get('cp')!.value;
      this._product.sellingPrice = this.prodForm.get('sp')!.value;
      this.allSubscriptions.push(this.service.updateCompleteProduct(this._product, date).subscribe(resp => {
        this.editComponent = false;
        exPanel.close();
        this.prodForm!.disable();
      }));
    }
  }

  isDeleteAllowed() {
    return this.deleteAllowed;
  }

  closeProduct() {
    this.allSubscriptions.push(this.service.canProductBeDeleted(
      this._product.id,
      this.datePipe.transform(this.dateService.date)!
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.allSubscriptions.push(this.openDialog(delResp.message!).subscribe(res => {
          if (res) {
            this.allSubscriptions.push(this.service.closeCompleteProduct(
              this._product,
              this.datePipe.transform(this.dateService.date)!
            ).subscribe(resp => {
              this.endProductEvent.emit(this._product.id);
            }));
          }
        }));
      }
    }));
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: message
    });

    return dialogRef.afterClosed();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
