import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends DatePipe implements PipeTransform {

  override transform(value: any, args?: any): any {
    if (args) {
      return super.transform(value, args);
    } else {
      return super.transform(value, 'yyyy-MM-dd');
    }
  }

}
