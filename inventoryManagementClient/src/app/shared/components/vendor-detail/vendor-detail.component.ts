import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CompleteVendor } from 'src/app/definitions/vendor-definition';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { priceValidator } from 'src/app/validators';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { DateService } from 'src/app/shared/services/date.service';
import { DeleteConfirmDialogComponent } from 'src/app/shared/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.scss']
})
export class VendorDetailComponent implements OnInit, OnDestroy {

  get vendor(): CompleteVendor {
    return this._vendor;
  }
  @Input()
  set vendor(ven: CompleteVendor) {
    this._vendor = ven;
    if (this.venForm) {
      this.venForm.get('name')!.setValue(ven.name);
      this.venForm.get('loanAdded')!.setValue(ven.loanAdded);
      this.venForm.get('loanPayed')!.setValue(ven.loanPayed);
      this.venForm.get('openingDp')!.setValue(ven.openingDp);
      this.venForm.get('deposit')!.setValue(ven.deposit);
      this.venForm.get('remarks')!.setValue(ven.remarks);
    }
  }

  @Input() editable: boolean;

  private _vendor: CompleteVendor;
  private deleteAllowed: boolean;

  editComponent: boolean;
  venForm: FormGroup | undefined;
  billAllowed: boolean;

  private allSubscriptions: Subscription[];

  @Output() endVendorEvent = new EventEmitter<string>();

  constructor(
    private readonly service: VendorService,
    private readonly datePipe: CustomDatePipe,
    private readonly dateService: DateService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
    this.deleteAllowed = false;
    this.billAllowed = false;
    this.editable = false;
    this.editComponent = false;
    this.allSubscriptions = new Array<Subscription>();
    this._vendor = new CompleteVendor();
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
    this.allSubscriptions.push(this.service.canVendorBeDeleted(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date)!
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.deleteAllowed = true;
      }
    }));
    this.allSubscriptions.push(this.service.canVendorBeBilled(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date,)!
    ).subscribe(bilResp => {
      if (bilResp.possible) {
        this.billAllowed = true;
      }
    }));
  }

  getFormattedtotalLoan(ven: CompleteVendor): number {
    if (ven.totalLoan) {
      return Math.round(ven.totalLoan * 100) / 100;
    }
    return 0;
  }

  onEdit() {
    if (this.editable && this.venForm) {
      if (!this.editComponent) {
        this.editComponent = true;
      } else if (!this.isVendorUpdated()) {
        this.editComponent = false;
      }
      this.editComponent ? this.venForm.enable() : this.venForm.disable();
    }
  }

  isVendorUpdated(): boolean {
    if (this.venForm) {
      return this._vendor.name !== this.venForm.get('name')!.value
        || this._vendor.loanAdded !== this.venForm.get('loanAdded')!.value
        || this._vendor.loanPayed !== this.venForm.get('loanPayed')!.value
        || this._vendor.openingDp !== this.venForm.get('openingDp')!.value
        || this._vendor.deposit !== this.venForm.get('deposit')!.value
        || this._vendor.remarks !== this.venForm.get('remarks')!.value;
    }
    return false;
  }

  onUpdate(exPanel: MatExpansionPanel) {
    const date = this.datePipe.transform(this.dateService.date);
    if (date && this.venForm) {
      this._vendor.name = this.venForm.get('name')!.value;
      this._vendor.loanAdded = this.venForm.get('loanAdded')!.value;
      this._vendor.loanPayed = this.venForm.get('loanPayed')!.value;
      this._vendor.openingDp = this.venForm.get('openingDp')!.value;
      this._vendor.deposit = this.venForm.get('deposit')!.value;
      this._vendor.remarks = this.venForm.get('remarks')!.value;
      this.service.updateCompleteVendor(this._vendor, date).subscribe(resp => {
        this._vendor.totalLoan = resp.totalLoan;
        this.editComponent = false;
        exPanel.close();
        this.venForm!.disable();
      });
    }
  }

  isDeleteAllowed() {
    return this.deleteAllowed;
  }

  closeVendor() {
    this.allSubscriptions.push(this.service.canVendorBeDeleted(
      this._vendor.id,
      this.datePipe.transform(this.dateService.date)!
    ).subscribe(delResp => {
      if (delResp.possible) {
        this.openDialog(delResp.message!).subscribe(res => {
          if (res) {
            this.service.closeCompleteVendor(
              this._vendor,
              this.datePipe.transform(this.dateService.date)!
            ).subscribe(resp => {
              this.endVendorEvent.emit(this._vendor.id);
            });
          }
        });
      }
    }));
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

  ngOnDestroy(): void {
    this.allSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
