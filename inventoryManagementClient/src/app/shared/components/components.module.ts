import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { VendorDetailComponent } from "./vendor-detail/vendor-detail.component";
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

@NgModule({
    declarations: [
        ProductDetailComponent,
        VendorDetailComponent,
        DeleteConfirmDialogComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    exports: [
        ProductDetailComponent,
        VendorDetailComponent
    ],
    entryComponents: [
        DeleteConfirmDialogComponent
    ]
})

export class ComponentsModule {}