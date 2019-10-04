import { Component, OnInit } from '@angular/core';
import { DateService } from '../services/date.service';
import { PrintService } from '../services/print.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit {
  private vendorId: string;
  constructor(route: ActivatedRoute,
    private dateService: DateService,
    private printService: PrintService) {
    this.vendorId = route.snapshot.params['vendorId'];
  }

  ngOnInit() {
    this.loadInvoiceData();
  }

  private loadInvoiceData() {
    const date = this.dateService.date.toISOString();
    this.printService.loadInvoiceData(date, this.vendorId);
  }
}
