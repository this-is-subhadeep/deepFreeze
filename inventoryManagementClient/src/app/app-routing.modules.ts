import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SellingComponent } from "./selling/selling/selling.component";
import { VendorViewComponent } from "./vendor/vendor-view/vendor-view.component";

const routes: Routes = [
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },
    { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)},
    { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule)},
    { path: 'vendors', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule) },
    { path: 'selling', loadChildren: () => import('./selling/selling.module').then(m => m.SellingModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }