import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomDirectivesModule } from '../custom-directives/custom-directives.module';
import { SharedModule } from '../shared/shared.module';
import { SellingRoutingModule } from './selling-routing.module';
import { SellingComponent } from './selling/selling.component';

@NgModule({
    declarations: [SellingComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        CustomDirectivesModule,
        SharedModule,
        SellingRoutingModule
    ],
    exports: [SellingComponent]
})

export class SellingModule { }