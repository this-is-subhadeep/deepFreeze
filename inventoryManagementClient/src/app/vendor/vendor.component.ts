import { Component, OnInit } from '@angular/core';
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { CompleteVendor } from './vendor-definition';
import { fadeInEffect, dropDownEffect } from '../animations';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class VendorComponent implements OnInit {
  private completeVendors: CompleteVendor[];
  private newCompleteVendor:CompleteVendor;
  private selectedCompleteVendor:CompleteVendor;
  private selectedClass="selectedRow";

  constructor(private service:VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.loadCompleteVendorData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteVendorData();
      this.service.refresh();
      this.refresh();
    });
  }

  refresh() {
    this.newCompleteVendor = new CompleteVendor();
    this.selectedCompleteVendor = new CompleteVendor();
  }

  get newVendorName() {
    return this.newCompleteVendor.name;
  }

  set newVendorName(name) {
    this.newCompleteVendor.name=name;
  }

  get newLoanAdded() {
    return this.newCompleteVendor.loanAdded;
  }

  set newLoanAdded(loanAdded) {
    this.newCompleteVendor.loanAdded=loanAdded;
  }

  get newLoanPayed() {
    return this.newCompleteVendor.loanPayed;
  }

  set newLoanPayed(loanPayed) {
    this.newCompleteVendor.loanPayed=loanPayed;
  }

  get newOpeningDP() {
    return this.newCompleteVendor.openingDp;
  }

  set newOpeningDP(openingDps) {
    this.newCompleteVendor.openingDp=openingDps;
  }

  get newDeposit() {
    return this.newCompleteVendor.deposit;
  }

  set newDeposit(deposit) {
    this.newCompleteVendor.deposit=deposit;
  }

  get newRemarks() {
    return this.newCompleteVendor.remarks;
  }

  set newRemarks(remarks) {
    this.newCompleteVendor.remarks=remarks;
  }

  getFormattedtotalLoan(completeVendor:CompleteVendor) {
    return Math.round(completeVendor.totalLoan*100)/100;
  }

  log(data) {
    console.log("Here",data);
  }

  addVenButtonPressed() {
    this.refresh();
  }

  updateVenButtonPressed(completeVendor:CompleteVendor) {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    console.log(completeVendor,date);
    this.service.updateCompleteVendor(completeVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    })
    this.refresh();
  }

  addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.newCompleteVendor.id=this.service.nextVendorId;
    console.log(this.newCompleteVendor,date);
    this.service.addCompleteVendor(this.newCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    })
    this.refresh();
  }

  isUpdateEnabled(completeVendor:CompleteVendor) {
    let flag = (completeVendor.name!=null && completeVendor.name!="");
    if(flag && completeVendor.loanAdded!=null) {
      flag = ((completeVendor.loanAdded*1000)%10==0)
    }
    if(flag && completeVendor.loanPayed!=null) {
      flag = ((completeVendor.loanPayed*1000)%10==0)
    }
    if(flag && completeVendor.openingDp!=null) {
      flag = ((completeVendor.openingDp*1000)%10==0)
    }
    if(flag && completeVendor.deposit!=null) {
      flag = ((completeVendor.deposit*1000)%10==0)
    }
  return flag;
  }

  cancelButtonPressed() {
    console.log('in Cancel Button');
    this.refresh();
  }
  private loadCompleteVendorData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    this.service.findCompleteVendorObservable(date).subscribe(completeVendors => {
      this.completeVendors=completeVendors;
    })
  }
}
