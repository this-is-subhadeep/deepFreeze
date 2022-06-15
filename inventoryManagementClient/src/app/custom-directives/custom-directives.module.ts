import { NgModule } from "@angular/core";
import { DepositValidatorDirective } from "./deposit-validator.directive";
import { UnitValidatorDirective } from "./unit-validator.directive";

@NgModule({
    declarations: [
        DepositValidatorDirective,
        UnitValidatorDirective
    ],
    exports: [
        DepositValidatorDirective,
        UnitValidatorDirective
    ]
})

export class CustomDirectivesModule {}