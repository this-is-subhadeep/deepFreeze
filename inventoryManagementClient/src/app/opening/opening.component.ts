import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { DateService } from '../services/date.service';
import { InventoryOpeningDataSource } from './opening-datasource';
import { ProductService } from '../services/product.service';
import { fadeInEffect, dropDownEffect } from '../animations';
import { UIInventoryOpeningRow, InventoryOpening, InventoryOpeningRow } from '../definitions/inventory-definition';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.css'],
  animations: [fadeInEffect, dropDownEffect]
})
export class OpeningComponent implements OnInit {
  private dataSource: InventoryOpeningDataSource;
  columnsToDisplay = ['productName',
    'stockOpening'];
  private prodTypeClass = 'productType';

  constructor(private service: InventoryService,
    private productService: ProductService,
    private dateService: DateService,
    private routeService: RouteService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new InventoryOpeningDataSource(this.service, this.productService, this.routeService);
    this.loadInventoryOpeningData();
    this.dateService.dateChangeListener.subscribe(() => {
      this.loadInventoryOpeningData();
    });
  }

  private loadInventoryOpeningData() {
    const date = this.dateService.date.toISOString();
    this.dataSource.loadInventoryOpening(date);
  }

  isRowProductType(inventoryOpeningRow: UIInventoryOpeningRow) {
    return inventoryOpeningRow.id.startsWith('typ');
  }

  getRowTypeClass(inventoryOpeningRow: UIInventoryOpeningRow) {
    return this.isRowProductType(inventoryOpeningRow) ? this.prodTypeClass : null;
  }

  getProdDetails(inventoryOpeningRow: UIInventoryOpeningRow) {
    if (!this.isRowProductType(inventoryOpeningRow) && inventoryOpeningRow.prodDets) {
      return 'Package Size : ' + inventoryOpeningRow.prodDets.packageSize + ' - Price : ' + inventoryOpeningRow.prodDets.sellingPrice;
    }
    return '';
  }

  private saveButtonPressed() {
    const date = this.dateService.date.toISOString();
    const invOpn = new InventoryOpening();
    this.dataSource.connect().subscribe(uiInvOpnRows => {
      uiInvOpnRows.forEach(uiInvOpnRow => {
        if (!uiInvOpnRow.id.startsWith('typ') && uiInvOpnRow.stockOpening) {
          const invOpnRow = new InventoryOpeningRow();
          invOpnRow.pieces = uiInvOpnRow.stockOpening;
          invOpn.rows[uiInvOpnRow.id] = invOpnRow;
        }
      });
    });
    this.service.saveInventoryOpening(invOpn, date).subscribe(resp => {
      this.snackBar.open('Inventory Opening', 'Saved', {
        duration: environment.snackBarDuration
      });
      this.loadInventoryOpeningData();
    }, error => {
      this.routeService.routeToError(error.status === 504 ? 'S002' : 'S001');
    });
  }

  validateStockOpening(invRow: UIInventoryOpeningRow) {
    if (!this.validateValue(invRow.stockOpening)) {
      invRow.stockOpening = undefined;
    }
  }

  private validateValue(val: Number) {
    if (val || val === 0) {
      if (val <= 0 || (val.valueOf() - Math.round(val.valueOf())) !== 0) {
        return false;
      }
    }
    return true;
  }
}
