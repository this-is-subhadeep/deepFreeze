import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { AutoGenOpeningDialogComponent } from './auto-gen-opening-dialog/auto-gen-opening-dialog.component';

@NgModule({
    declarations: [
        ProductDetailComponent,
        VendorDetailComponent,
        DeleteConfirmDialogComponent,
        AutoGenOpeningDialogComponent],
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
        VendorDetailComponent,
        AutoGenOpeningDialogComponent
    ],
    entryComponents: [
        DeleteConfirmDialogComponent,
        AutoGenOpeningDialogComponent
    ]
})

export class ComponentsModule { }
