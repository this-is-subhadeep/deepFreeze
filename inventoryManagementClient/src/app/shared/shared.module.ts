import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatExpansionModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { ComponentsModule } from "./components/components.module";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { VendorDetailComponent } from "./components/vendor-detail/vendor-detail.component";

@NgModule({
    declarations: [
        ProductDetailComponent,
        VendorDetailComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ProductDetailComponent,
        VendorDetailComponent
    ]
})

export class SharedModule { }