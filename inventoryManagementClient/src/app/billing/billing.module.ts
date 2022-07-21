import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule, MatCardModule } from "@angular/material";
import { NgxPrintModule } from "ngx-print";
import { BillingComponent } from "src/app/billing/billing/billing.component";
import { BillingRoutingModule } from "./billing-routing.module";
import { HalfBillComponent } from './half-bill/half-bill.component';

@NgModule({
    declarations: [BillingComponent, HalfBillComponent],
    imports: [
        CommonModule,
        BillingRoutingModule,
        MatCardModule,
        MatButtonModule,
        NgxPrintModule
    ],
    exports: [BillingComponent]
})

export class BillingModule {}