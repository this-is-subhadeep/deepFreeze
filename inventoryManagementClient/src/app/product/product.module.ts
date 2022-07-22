import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductViewComponent } from './product-view/product-view.component';

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
