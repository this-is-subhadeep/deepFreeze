import { Component, Input } from '@angular/core';
import { Vendor } from '../definitions/vendor-definition';
import { StandardResponse } from '../definitions/service-response-definition';
import { VendorService } from '../services/vendor.service';
import { DateService } from '../services/date.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { priceValidator } from '../validators';
import { MatExpansionPanel, MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { FilesService } from '../services/files.service';
import { appConfigurations } from 'src/environments/conf';
import { HttpErrorResponse } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ErrorService } from '../services/error.service';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations: [trigger('vendorChanged', [
    state('void', style({
      backgroundColor: 'rgb(59, 215, 243)',
      opacity: 0
    })),
    transition('*=>changed', [
      animate(1000)
    ])
  ])]
})
export class VendorComponent {

  venObj: Vendor;
  venForm: FormGroup;
  @Input() editable: boolean;
  dpToUpload = false;
  panelStateOpened = false;
  editingState = false;
  dpFileSelected: File;
  defaultVenDPImage = '../../assets/default_vendor_Image.png';
  animationState = 'init';

  constructor(private service: VendorService,
    private fileService: FilesService,
    private dateService: DateService,
    private errorService: ErrorService,
    private routeService: RouteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  @Input()
  set vendor(ven) {
    this.venObj = ven;
    this.setForm(ven);
    this.animationState = 'changed';
  }

  get vendorPic() {
    const dpURL = environment.serverBase + appConfigurations.fileURL + '/images/';
    return this.venObj.dpFile ? dpURL + this.venObj.dpFile : this.defaultVenDPImage;
  }

  setForm(ven) {
    this.venForm = this.fb.group({
      name: [
        ven.name, [
          Validators.required
        ]
      ],
      loanAdded: [
        ven.loanAdded, [
          priceValidator
        ]
      ],
      loanPayed: [
        ven.loanPayed, [
          priceValidator
        ]
      ],
      openingDp: [
        ven.openingDp, [
          priceValidator
        ]
      ],
      remarks: [
        ven.remarks
      ]
    });

    this.venForm.disable();
  }

  getFormattedtotalLoan(ven: Vendor) {
    return ven.totalLoan ? Math.round(ven.totalLoan * 100) / 100 : 0;
  }

  panelOpened() {
    this.panelStateOpened = true;
  }

  panelClosed() {
    this.dpToUpload = false;
    this.panelStateOpened = false;
    this.editingState = false;
    this.setForm(this.venObj);
  }

  setEdit() {
    this.editingState = true;
    this.venForm.enable();
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
    this.venObj.name = this.venForm.controls.name.value;
    this.venObj.loanAdded = this.venForm.controls.loanAdded.value;
    this.venObj.loanPayed = this.venForm.controls.loanPayed.value;
    this.venObj.openingDp = this.venForm.controls.openingDp.value;
    this.venObj.remarks = this.venForm.controls.remarks.value;
    if (this.dpToUpload) {
      this.fileService.uploadFile(this.dpFileSelected).subscribe((resp: StandardResponse) => {
        this.venObj.dpFile = resp._id;
        this.service.updateVendor(this.venObj, date).subscribe(respVen => {
          this.snackBar.open('Vendor', 'Updated', {
            duration: environment.snackBarDuration
          });
          this.venObj.totalLoan = this.venObj.loanAdded - this.venObj.loanPayed;
          exPanel.close();
        }, error => {
          this.routeService.routeToError(error.status === 504 ? 'S004' : 'S001');
        });
      }, (errorResp: HttpErrorResponse) => {
        this.snackBar.open('Vendor', `Error ${this.errorService.getErrorDescription(errorResp.error[0].code)}`, {
          duration: environment.snackBarDuration
        });
        exPanel.close();
      });
    } else {
      this.service.updateVendor(this.venObj, date).subscribe(resp => {
        this.snackBar.open('Vendor', 'Updated', {
          duration: environment.snackBarDuration
        });
        this.venObj.totalLoan = this.venObj.loanAdded - this.venObj.loanPayed;
        exPanel.close();
      }, error => {
        this.routeService.routeToError(error.status === 504 ? 'S004' : 'S001');
      });
    }
  }

  log(data) {
    console.log(data);
  }

}
