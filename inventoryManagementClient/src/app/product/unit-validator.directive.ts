import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, ValidatorFn, AbstractControl, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[unitValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UnitValidatorDirective,
      multi: true
    }
  ]
})
export class UnitValidatorDirective implements Validator {
  private validator: ValidatorFn;

  @Input() unitValidator: number;

  constructor() {
    this.validator = (c: AbstractControl) => {
      console.log(c);
      if(c.value <= this.unitValidator) {
        return null;
      } else {
        return {
          unitValidator: true
        };
      }
    }
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}
