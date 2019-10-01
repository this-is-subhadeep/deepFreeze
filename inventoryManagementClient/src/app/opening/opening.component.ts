import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { InventoryOpeningDataSource } from './opening-datasource';
import { ProductService } from '../services/product.service';
import { fadeInEffect, dropDownEffect } from '../animations';
import { UIInventoryOpeningRow, InventoryOpening, InventoryOpeningRow } from '../definitions/inventory-definition';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class OpeningComponent implements OnInit {
  private dataSource: InventoryOpeningDataSource;
  columnsToDisplay = ["productName",
    "stockOpening"];
  private prodTypeClass = "productType";

  constructor(private service: InventoryService,
    private productService: ProductService,
    private dateService: DateService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new InventoryOpeningDataSource(this.service, this.productService);
    this.loadInventoryOpeningData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryOpeningData();
    });
  }

  private loadInventoryOpeningData() {
    let date = this.dateService.date.toISOString();
    this.dataSource.loadInventoryOpening(date);
  }

  isRowProductType(inventoryOpeningRow: UIInventoryOpeningRow) {
    return inventoryOpeningRow.id.startsWith("typ");
  }

  getRowTypeClass(inventoryOpeningRow: UIInventoryOpeningRow) {
    return this.isRowProductType(inventoryOpeningRow) ? this.prodTypeClass : null;
  }

  getProdDetails(inventoryOpeningRow: UIInventoryOpeningRow) {
    if (!this.isRowProductType(inventoryOpeningRow) && inventoryOpeningRow.prodDets != undefined) {
      return "Package Size : " + inventoryOpeningRow.prodDets.packageSize + " - Price : " + inventoryOpeningRow.prodDets.sellingPrice;
    }
    return "";
  }

  private saveButtonPressed() {
    console.log('saveButtonPressed');
    let date = this.dateService.date.toISOString();
    let invOpn = new InventoryOpening();
    this.dataSource.connect().subscribe(uiInvOpnRows => {
      uiInvOpnRows.forEach(uiInvOpnRow => {
        if (!uiInvOpnRow.id.startsWith('typ') && uiInvOpnRow.stockOpening) {
          const invOpnRow = new InventoryOpeningRow();
          invOpnRow.pieces = uiInvOpnRow.stockOpening;
          invOpn.rows[uiInvOpnRow.id] = invOpnRow;
        }
      })
    });
    console.log(invOpn);
    this.service.saveInventoryOpening(invOpn, date).subscribe(resp => {
      this.snackBar.open('Inventory', 'Saved', {
        duration: environment.snackBarDuration
      });
      this.loadInventoryOpeningData();
    });
  }

  validateStockOpening(invRow: UIInventoryOpeningRow) {
    if (!this.validateValue(invRow.stockOpening)) {
      invRow.stockOpening = undefined;
    }
  }

  private validateValue(val: Number) {
    if (val != undefined || val != null) {
      if (val <= 0 || (val.valueOf() - Math.round(val.valueOf())) != 0) {
        return false;
      }
    }
    return true;
  }
}
