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
  private validator: ValidatorFn;
  
  @Input() depositValidator: number;

  constructor() {
    this.validator = (c: AbstractControl) => {
      if(c.value <= this.depositValidator) {
        return null;
      } else {
        return {
          depositValidator: true
        }
      }
    }
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
