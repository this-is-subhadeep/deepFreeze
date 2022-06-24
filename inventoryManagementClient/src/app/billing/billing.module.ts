import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material";
import { BillingComponent } from "src/app/billing/billing/billing.component";
import { BillingRoutingModule } from "./billing-routing.module";
import { HalfBillComponent } from './half-bill/half-bill.component';

@NgModule({
    declarations: [BillingComponent, HalfBillComponent],
    imports: [
        CommonModule,
        BillingRoutingModule,
        MatCardModule
    ],
    exports: [BillingComponent]
})

export class BillingModule {}