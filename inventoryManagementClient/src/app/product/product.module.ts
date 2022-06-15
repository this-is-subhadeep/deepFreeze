import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatExpansionModule, MatInputModule, MatSelectModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";
import { ProductRoutingModule } from "./product-routing.module";
import { ProductViewComponent } from "./product-view/product-view.component";

@NgModule({
    declarations: [ProductViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatExpansionModule,
        ProductRoutingModule,
        SharedModule
    ],
    exports: [ProductViewComponent]
})

export class ProductModule { }