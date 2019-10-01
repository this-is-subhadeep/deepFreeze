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

  @Input() unitValidator: number;

  validate(c: FormControl): { [key: string]: boolean } {
    return c.value <= this.unitValidator ? null : { unitValidator: true };
  }
}
