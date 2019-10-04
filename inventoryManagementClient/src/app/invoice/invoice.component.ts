import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../services/print.service';
import { SellingData } from '../definitions/selling-definition';
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  date: string;
  constructor(private dateService: DateService,
    private printService: PrintService) { }

  ngOnInit() {
    this.date = this.dateService.date.toDateString();
  }

  getSoldAmount(sellData: SellingData): number {
    return Math.round(sellData.product.sellingPrice * sellData.soldUnits * 100) / 100;
  }

  get totalAmount(): number {
    if (this.printService.sellingProductList) {
      const totAmt = this.printService.sellingProductList.reduce<number>((acc, sellData) => acc + this.getSoldAmount(sellData), 0);
      return Math.round(totAmt * 100) / 100;
    } else {
      return 0;
    }
  }

  get toPay(): number {
    if (this.printService.deposit) {
      return Math.round((this.totalAmount - this.printService.deposit) * 100) / 100;
    } else {
      return this.totalAmount;
    }
  }

}
