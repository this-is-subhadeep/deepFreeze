import { Component, OnInit } from '@angular/core';
import { VendorDataSource } from './vendor-datasource';
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { DateService } from '../services/date.service';
import { Vendor } from './vendor-definition';
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
  private newCompleteVendor:Vendor;
  private selectedCompleteVendor:Vendor;
  private selectedClass="selectedRow";

  constructor(private service:VendorService, private datePipe: DatePipe, private dateService:DateService) { }

  ngOnInit() {
    this.dataSource=new VendorDataSource(this.service);
    this.loadCompleteVendorData();
    this.refresh();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadCompleteVendorData();
      this.refresh();
    });
  }

  refresh() {
    this.newCompleteVendor = new Vendor();
    this.selectedCompleteVendor = new Vendor();
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
  }
  setVendorSelected(compVen:Vendor) {
    if(!this.isThisVendorSelected(compVen)) {
      this.selectedCompleteVendor=Vendor.cloneAnother(compVen);
      // console.log(this.selectedCompleteVendor);
      this.showUpdateButton=true;
    }
  }

  getSelectRowClass(compVen:Vendor) {
    return this.isThisVendorSelected(compVen)?this.selectedClass:null;
  }
  isThisVendorSelected(compVen:Vendor) {
    return (this.selectedCompleteVendor!=null
            && this.selectedCompleteVendor._id === compVen._id);
  }
  handlePageEvent(e:PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadCompleteVendorData();
  }
  addVenButtonPressed() {
    this.refresh();
    this.showAddForm=true;
  }

  updateVenButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    console.log(this.selectedCompleteVendor,date);
    this.service.updateVendor(this.selectedCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
    })
    this.showUpdateButton=false;
    this.refresh();
  }

  addButtonPressed() {
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    // let nextVendorId = this.service.nextVendorId;
    this.newCompleteVendor._id=null;
    // console.log(this.newCompleteVendor,date);
    this.service.addVendor(this.newCompleteVendor,date).subscribe(resp => {
      this.loadCompleteVendorData();
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
    // let date=this.datePipe.transform(this.dateService.date,"yyyy-MM-dd");
    let date = this.dateService.date.toISOString();
    // console.log(date);
    this.dataSource.loadVendors(date,this.pageSize,this.pageIndex+1);
    // console.log(this.dataSource);
  }
}
