import { Component, OnInit, Input } from '@angular/core';
import { CompleteVendor } from '../../../definitions/vendor-definition';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sizeValidator, priceValidator } from '../../../validators';
import { MatExpansionPanel } from '@angular/material';
import { VendorService } from '../../services/vendor.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.css']
})
export class VendorDetailComponent implements OnInit {

  get vendor():CompleteVendor {
    return this._vendor;
  }
  @Input() 
  set vendor(ven: CompleteVendor) {
    this._vendor = ven;
    if(this.venForm) {
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
  
  venForm: FormGroup;
  constructor(private service: VendorService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private fb: FormBuilder) { }

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

    if (!this.editable) {
      this.venForm.disable();
    }
  }

  getFormattedtotalLoan(ven:CompleteVendor) {
    return Math.round(ven.totalLoan*100)/100;
  }

  onUpdate(exPanel: MatExpansionPanel) {
    let date = this.datePipe.transform(this.dateService.date, "yyyy-MM-dd");
    this._vendor.name = this.venForm.controls.name.value;
    this._vendor.loanAdded = this.venForm.controls.loanAdded.value;
    this._vendor.loanPayed = this.venForm.controls.loanPayed.value;
    this._vendor.openingDp = this.venForm.controls.openingDp.value;
    this._vendor.deposit = this.venForm.controls.deposit.value;
    this._vendor.remarks = this.venForm.controls.remarks.value;
    this.service.updateCompleteVendor(this._vendor, date).subscribe(resp => {
      this._vendor.totalLoan = resp.totalLoan;
      exPanel.close();
    });
  }


}
