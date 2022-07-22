import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule, } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorViewComponent } from './vendor-view/vendor-view.component';

@NgModule({
    declarations: [VendorViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatExpansionModule,
        SharedModule,
        VendorRoutingModule
    ],
    exports: [VendorViewComponent]
})

export class VendorModule { }
