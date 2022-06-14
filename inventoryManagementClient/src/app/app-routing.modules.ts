import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InventoryComponent } from "./inventory/inventory/inventory.component";
import { ProductViewComponent } from "./product/product-view/product-view.component";
import { SellingComponent } from "./selling/selling.component";
import { VendorViewComponent } from "./vendor-view/vendor-view.component";

const routes: Routes = [
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },
    { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)},
    { path: 'products', loadChildren: () => import('./product/product.module').then(m => m.ProductModule)},
    { path: 'vendors', component: VendorViewComponent },
    { path: 'selling', component: SellingComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }