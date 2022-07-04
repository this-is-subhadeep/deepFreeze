import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { priceValidator } from 'src/app/validators';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { DateService } from 'src/app/shared/services/date.service';
import { DeleteConfirmDialogComponent } from 'src/app/shared/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit {

  get vendor(): CompleteVendor {
    return this._vendor;
  }
  @Input()
  set vendor(ven: CompleteVendor) {
    this._vendor = ven;
    if (this.venForm) {
      this.venForm.controls.name.setValue(ven.name);
      this.venForm.controls.loanAdded.setValue(ven.loanAdded);
      this.venForm.controls.loanPayed.setValue(ven.loanPayed);
      this.venForm.controls.openingDp.setValue(ven.openingDp);
      this.venForm.controls.deposit.setValue(ven.deposit);
      this.venForm.controls.remarks.setValue(ven.remarks);
    }
  }

  @Input() editable: boolean;

  private _vendor: CompleteVendor;
  private venForm: FormGroup;
  private editComponent: boolean;
  private deleteAllowed: boolean
  private billAllowed: boolean

  @Output() endVendorEvent = new EventEmitter<string>();

  constructor(
    private readonly service: VendorService,
    private readonly datePipe: DatePipe,
    private readonly dateService: DateService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
    this.deleteAllowed = false;
    this.billAllowed = false;
  }

  ngOnInit() {
    this.venForm = this.fb.group({
      name: [
        this._vendor.name, [
          Validators.required
        ]
      ],
      loanAdded: [
        this._vendor.loanAdded, [
          priceValidator
        ]
      ],
      loanPayed: [
        this._vendor.loanPayed, [
          priceValidator
        ]
      ],
      openingDp: [
        this._vendor.openingDp, [
          priceValidator
        ]
      ],
      deposit: [
        this._vendor.deposit, [
          priceValidator
        ]
      ],
      remarks: [
        this._vendor.remarks
      ]
    });

    this.venForm.disable();
    this.service.canVendorBeDeleted(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd')
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.deleteAllowed = true;
      }
    });
    this.service.canVendorBeBilled(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd')
    ).subscribe(bilResp => {
      if (bilResp.possible) {
        this.billAllowed = true;
      }
    });
  }

  getFormattedtotalLoan(ven: CompleteVendor) {
    return Math.round(ven.totalLoan * 100) / 100;
  }

  onEdit() {
    if (this.editable) {
      if (!this.editComponent) {
        this.editComponent = true
      } else if (!this.isVendorUpdated()) {
        this.editComponent = false;
      }
      this.editComponent ? this.venForm.enable() : this.venForm.disable();
    }
  }

  isVendorUpdated() {
    return this._vendor.name !== this.venForm.controls.name.value
      || this._vendor.loanAdded !== this.venForm.controls.loanAdded.value
      || this._vendor.loanPayed !== this.venForm.controls.loanPayed.value
      || this._vendor.openingDp !== this.venForm.controls.openingDp.value
      || this._vendor.deposit !== this.venForm.controls.deposit.value
      || this._vendor.remarks !== this.venForm.controls.remarks.value
  }

  onUpdate(exPanel: MatExpansionPanel) {
    let date = this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd');
    this._vendor.name = this.venForm.controls.name.value;
    this._vendor.loanAdded = this.venForm.controls.loanAdded.value;
    this._vendor.loanPayed = this.venForm.controls.loanPayed.value;
    this._vendor.openingDp = this.venForm.controls.openingDp.value;
    this._vendor.deposit = this.venForm.controls.deposit.value;
    this._vendor.remarks = this.venForm.controls.remarks.value;
    this.service.updateCompleteVendor(this._vendor, date).subscribe(resp => {
      this._vendor.totalLoan = resp.totalLoan;
      this.editComponent = false;
      exPanel.close();
      this.venForm.disable();
    });
  }

  isDeleteAllowed() {
    return this.deleteAllowed;
  }

  closeVendor() {
    this.service.canVendorBeDeleted(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd')
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.openDialog(delResp.message).subscribe(res => {
          if (res) {
            this.service.closeCompleteVendor(
              this._vendor,
              this.datePipe.transform(this.dateService.date, 'yyyy-MM-dd')
            ).subscribe(resp => {
              this.endVendorEvent.emit(this._vendor.id);
            });
          }
        });
      }
    });
  }

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: message
    });

    return dialogRef.afterClosed();
  }

  generateBill() {
    this.router.navigate(['/billing', this._vendor.id]);
  }

}
