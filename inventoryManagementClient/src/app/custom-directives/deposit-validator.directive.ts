import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, ValidatorFn, Validator, FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[depositValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DepositValidatorDirective,
      multi: true
    }
  ]
})
export class DepositValidatorDirective implements Validator {
  
  @Input() depositValidator: number| undefined;

  validate(c: AbstractControl): {[key: string]: boolean} | null {
    return c.value <= this.depositValidator! ? null : { depositValidator: true };
  }
}
