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
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginComponent } from './login/login.component';
import { CanActivateRouteGuard } from './can-activate-route.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [CanActivateRouteGuard]
  },
  {
    path: 'products',
    component: ProductViewComponent,
    canActivate: [CanActivateRouteGuard]
  },
  {
    path: 'vendors',
    component: VendorViewComponent,
    canActivate: [CanActivateRouteGuard]
  },
  {
    path: 'selling',
    component: SellingComponent,
    canActivate: [CanActivateRouteGuard],
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
    component: BuyingComponent,
    canActivate: [CanActivateRouteGuard]
  },
  {
    path: 'opening',
    component: OpeningComponent,
    canActivate: [CanActivateRouteGuard]
  },
  {
    path: 'error/:code',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
