import { Component, OnInit } from '@angular/core';
import { VendorDataSource } from './vendor-datasource';
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { CompleteVendor } from './vendor-definition';
import { PageEvent } from '@angular/material';
import { fadeInEffect, dropDownEffect } from '../animations';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class VendorComponent implements OnInit {
  dataSource:VendorDataSource;
  columnsToDisplay=["vendorName", "totalLoan", "loanAdded", "loanPayed", "openingDps", "deposit", "remarks"];
  private showUpdateButton=false;
  private showAddForm=false;
  private pageSize=5;
  private pageIndex=0;
  private newCompleteVendor:CompleteVendor;
  private selectedCompleteVendor:CompleteVendor;
  private selectedClass="selectedRow";

  constructor(private service:VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource=new VendorDataSource(this.service);
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
    this.showUpdateButton=false;
  }

  get showVenTable() {
    return !this.showAddForm;
  }

  get showAddButton() {
    return !this.showUpdateButton;
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

  log(data) {
    console.log("Here",data);
    // return false;
  }
  setVendorSelected(compVen:CompleteVendor) {
    if(!this.isThisVendorSelected(compVen)) {
      this.selectedCompleteVendor=CompleteVendor.cloneAnother(compVen);
      // console.log(this.selectedCompleteVendor);
      this.showUpdateButton=true;
    }
  }

  getSelectRowClass(compVen:CompleteVendor) {
    return this.isThisVendorSelected(compVen)?this.selectedClass:null;
  }
  isThisVendorSelected(compVen:CompleteVendor) {
    return (this.selectedCompleteVendor!=null
            && this.selectedCompleteVendor.id === compVen.id);
  }
  handlePageEvent(e:PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadCompleteVendorData();
    this.service.refresh();
  }
  addVenButtonPressed() {
    this.refresh();
    this.showAddForm=true;
  }

  updateVenButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    console.log(this.selectedCompleteVendor,date);
    this.service.updateCompleteVendor(this.selectedCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    })
    this.showUpdateButton=false;
    this.refresh();
  }

  addButtonPressed() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let nextVendorId = this.service.nextVendorId;
    this.newCompleteVendor.id=this.service.nextVendorId;
    // console.log(this.newCompleteVendor,date);
    this.service.addCompleteVendor(this.newCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
      this.service.refresh();
    })
    this.showAddForm=false;
    this.refresh();
  }

  isUpdateEnabled() {
    let flag = (this.selectedCompleteVendor.name!=null && this.selectedCompleteVendor.name!="");
    if(flag && this.selectedCompleteVendor.loanAdded!=null) {
      flag = ((this.selectedCompleteVendor.loanAdded*1000)%10==0)
    }
    if(flag && this.selectedCompleteVendor.loanPayed!=null) {
      flag = ((this.selectedCompleteVendor.loanPayed*1000)%10==0)
    }
    if(flag && this.selectedCompleteVendor.openingDp!=null) {
      flag = ((this.selectedCompleteVendor.openingDp*1000)%10==0)
    }
    if(flag && this.selectedCompleteVendor.deposit!=null) {
      flag = ((this.selectedCompleteVendor.deposit*1000)%10==0)
    }
  return flag;
  }

  cancelButtonPressed() {
    this.showAddForm=false;
    this.showUpdateButton=false;
    this.refresh();
  }
  private loadCompleteVendorData() {
    let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    // console.log(date);
    this.dataSource.loadCompleteVendors(date,this.pageSize,this.pageIndex+1);
    // console.log(this.dataSource);
  }
}
