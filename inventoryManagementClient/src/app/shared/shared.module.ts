import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { ComponentsModule } from './components/components.module';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { VendorDetailComponent } from './components/vendor-detail/vendor-detail.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';

@NgModule({
    declarations: [
        CustomDatePipe
    ],
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
        VendorDetailComponent,
        CustomDatePipe
    ]
})

export class SharedModule { }