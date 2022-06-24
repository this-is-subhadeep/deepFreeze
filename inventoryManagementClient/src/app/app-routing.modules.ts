import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },
    { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)},
    { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule)},
    { path: 'vendors', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule) },
    { path: 'selling', loadChildren: () => import('./selling/selling.module').then(m => m.SellingModule) },
    { path: 'billing/:venId', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }