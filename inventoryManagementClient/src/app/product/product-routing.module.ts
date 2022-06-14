import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductViewComponent } from "./product-view/product-view.component";

@NgModule({
    imports: [RouterModule.forChild([{path: '', component: ProductViewComponent}])],
    exports: [RouterModule]
})

export class ProductRoutingModule {}