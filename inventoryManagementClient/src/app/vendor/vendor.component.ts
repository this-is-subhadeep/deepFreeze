import { Component, OnInit, Input } from '@angular/core';
import { Vendor } from '../definitions/vendor-definition';
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sizeValidator, priceValidator } from '../validators';
import { MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  @Input() vendor: Vendor;
  @Input() editable: boolean;

  venForm: FormGroup;
  constructor(private service: VendorService,
    private dateService: DateService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.venForm = this.fb.group({
      name: [
        this.vendor.name, [
          Validators.required
        ]
      ],
      loanAdded: [
        this.vendor.loanAdded, [
          priceValidator
        ]
      ],
      loanPayed: [
        this.vendor.loanPayed, [
          priceValidator
        ]
      ],
      openingDp: [
        this.vendor.openingDp, [
          priceValidator
        ]
      ],
      deposit: [
        this.vendor.deposit, [
          priceValidator
        ]
      ],
      remarks: [
        this.vendor.remarks
      ]
    });

    if (!this.editable) {
      this.venForm.disable();
    }
  }

  getFormattedtotalLoan(ven:Vendor) {
    return ven.totalLoan?Math.round(ven.totalLoan*100)/100:0;
  }


  onUpdate(exPanel: MatExpansionPanel) {
    let date = this.dateService.date.toISOString();
    this.vendor.name = this.venForm.controls.name.value;
    this.vendor.loanAdded = this.venForm.controls.loanAdded.value;
    this.vendor.loanPayed = this.venForm.controls.loanPayed.value;
    this.vendor.openingDp = this.venForm.controls.openingDp.value;
    this.vendor.deposit = this.venForm.controls.deposit.value;
    this.vendor.remarks = this.venForm.controls.remarks.value;
    this.service.updateVendor(this.vendor, date).subscribe(resp => {
      // this.vendor.totalLoan = resp.totalLoan;
      exPanel.close();
    });
  }


}
