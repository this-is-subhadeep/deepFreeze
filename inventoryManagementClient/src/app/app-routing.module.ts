import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { VendorViewComponent } from './vendor-view/vendor-view.component';
import { SellingComponent } from './selling/selling.component';
import { BuyingComponent } from './buying/buying.component';
import { OpeningComponent } from './opening/opening.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    component: InventoryComponent
  },
  {
    path: 'products',
    component: ProductViewComponent
  },
  {
    path: 'vendors',
    component: VendorViewComponent
  },
  {
    path: 'selling',
    component: SellingComponent,
    children: [
      {
        path: 'print/:vendorId',
        outlet: 'print',
        component: PrintLayoutComponent
      }
    ]
  },
  {
    path: 'buying',
    component: BuyingComponent
  },
  {
    path: 'opening',
    component: OpeningComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
