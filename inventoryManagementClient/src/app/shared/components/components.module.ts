import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatExpansionModule, MatIconModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { VendorDetailComponent } from "./vendor-detail/vendor-detail.component";

@NgModule({
    declarations: [
        ProductDetailComponent,
        VendorDetailComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ProductDetailComponent,
        VendorDetailComponent
    ]
})

export class ComponentsModule {}