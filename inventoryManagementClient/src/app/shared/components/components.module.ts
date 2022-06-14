import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatExpansionModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { VendorDetailComponent } from "./vendor-detail/vendor-detail.component";

@NgModule({
    declarations: [
        ProductDetailComponent,
        VendorDetailComponent],
    imports: [
        BrowserModule,
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

export class ComponentsModule {}