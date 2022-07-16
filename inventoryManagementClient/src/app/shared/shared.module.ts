import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatExpansionModule, MatInputModule } from "@angular/material";
import { ComponentsModule } from "./components/components.module";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { VendorDetailComponent } from "./components/vendor-detail/vendor-detail.component";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatInputModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
    exports: [
        ProductDetailComponent,
        VendorDetailComponent
    ]
})

export class SharedModule { }