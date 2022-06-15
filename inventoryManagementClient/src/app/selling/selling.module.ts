import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule } from "@angular/material";
import { CustomDirectivesModule } from "../custom-directives/custom-directives.module";
import { DepositValidatorDirective } from "../custom-directives/deposit-validator.directive";
import { SharedModule } from "../shared/shared.module";
import { SellingRoutingModule } from "./selling-routing.module";
import { SellingComponent } from "./selling/selling.component";

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

export class SellingModule {}