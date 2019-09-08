import { AbstractControl } from "@angular/forms";

export function sizeValidator(c: AbstractControl) {
    if (((c.value * 10) % 10 == 0) && ((999 - c.value) >= 0)) {
        return null;
    } else {
        return { error: true };
    }
}

export function priceValidator(c: AbstractControl) {
    if (((c.value * 1000) % 10 == 0)) {
        return null;
    } else {
        return { error: true };
    }
}

export function productTextValidator(c : AbstractControl) {
    if(typeof c.value === 'string' && !c.value.includes(' - ')) {
      return { error : true };
    } else {
      return null;
    }
}