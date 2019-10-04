import { Component, Input } from '@angular/core';
import { Product } from '../definitions/product-definition';
import { FormGroup, Validators, AbstractControl, FormBuilder, NgModel } from '@angular/forms';
import { DateService } from '../services/date.service';
import { ProductService } from '../services/product.service';
import { MatExpansionPanel, MatSnackBar } from '@angular/material';
import { sizeValidator, priceValidator } from '../validators';
import { environment } from 'src/environments/environment';
import { FilesService } from '../services/files.service';
import { appConfigurations } from 'src/environments/conf';
import { StandardResponse } from '../definitions/service-response-definition';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ErrorService } from '../services/error.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [trigger('productChanged', [
    state('void', style({
      backgroundColor: 'rgb(235, 172, 116)',
      opacity: 0
    })),
    transition('*=>changed', [
      animate(1000)
    ])
  ])]
})
export class ProductComponent {

  prodObj: Product;
  prodForm: FormGroup;
  @Input() editable: boolean;
  dpToUpload = false;
  panelStateOpened = false;
  editingState = false;
  dpFileSelected: File;
  defaultProdDPImage = '../../assets/default_product_Image.png';
  animationState = 'init';

  constructor(private service: ProductService,
    private fileService: FilesService,
    private dateService: DateService,
    private errorService: ErrorService,
    private routeService: RouteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  @Input()
  set product(prod) {
    this.prodObj = prod;
    this.setForm(prod);
    this.animationState = 'changed';
  }

  get productPic() {
    const dpURL = environment.serverBase + appConfigurations.fileURL + '/images/';
    return this.prodObj.productIcon ? dpURL + this.prodObj.productIcon : this.defaultProdDPImage;
  }

  setForm(prod) {

    this.prodForm = this.fb.group({
      name: [
        prod.name, [
          Validators.required
        ]
      ],
      size: [
        prod.packageSize, [
          Validators.required,
          sizeValidator
        ]
      ],
      cp: [
        prod.costPrice, [
          Validators.required,
          priceValidator
        ]
      ],
      sp: [
        prod.sellingPrice, [
          Validators.required,
          priceValidator
        ]
      ]
    });

    this.prodForm.disable();
  }

  panelOpened() {
    this.panelStateOpened = true;
  }

  panelClosed() {
    this.dpToUpload = false;
    this.panelStateOpened = false;
    this.editingState = false;
    this.setForm(this.prodObj);
  }

  setEdit() {
    this.editingState = true;
    this.prodForm.enable();
  }

  onImageClick(fileChooser) {
    if (this.editingState) {
      fileChooser.click();
    }
  }

  onFileSelected(event) {
    this.dpFileSelected = <File>event.target.files[0];
    this.dpToUpload = true;
  }

  onUpdate(exPanel: MatExpansionPanel) {
    const date = this.dateService.date.toISOString();
    this.prodObj.name = this.prodForm.controls.name.value;
    this.prodObj.packageSize = this.prodForm.controls.size.value;
    this.prodObj.costPrice = this.prodForm.controls.cp.value;
    this.prodObj.sellingPrice = this.prodForm.controls.sp.value;
    if (this.dpToUpload) {
      this.fileService.uploadFile(this.dpFileSelected).subscribe((resp: StandardResponse) => {
        this.prodObj.productIcon = resp._id;
        this.service.updateProduct(this.prodObj, date).subscribe(respProd => {
          this.snackBar.open('Product', 'Updated', {
            duration: environment.snackBarDuration
          });
          exPanel.close();
        }, error => {
          this.routeService.routeToError(error.status === 504 ? 'S003' : 'S001');
        });
      }, (errorResp: HttpErrorResponse) => {
        this.snackBar.open('Product', `Error ${this.errorService.getErrorDescription(errorResp.error[0].code)}`, {
          duration: environment.snackBarDuration
        });
        exPanel.close();
      });
    } else {
      this.service.updateProduct(this.prodObj, date).subscribe(resp => {
        this.snackBar.open('Product', 'Updated', {
          duration: environment.snackBarDuration
        });
        exPanel.close();
      }, error => {
        this.routeService.routeToError(error.status === 504 ? 'S003' : 'S001');
      });
    }
  }

}
