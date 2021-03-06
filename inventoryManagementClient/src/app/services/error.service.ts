import { Injectable } from '@angular/core';

const errorsDict = {
  S001: 'Server Error.',
  S002: 'Inventory Server Down. Please restart it.',
  S003: 'Product Server Down. Please restart it.',
  S004: 'Vendor Server Down. Please restart it.',
  S005: 'One or More Servers Down. Please restart them.',
  S006: 'Client Error.',
  S007: 'User Server Down. Please restart it.',
  B001: 'Data not Found in DB.',
  B002: 'Reference Date is invalid or empty.',
  B003: 'Input Data Missing.',
  B004: 'File Too Large.',
  B005: 'File Type not Supported.',
  B006: 'User Already Exist. Please Choose another name.',
  B007: 'Username or Password invalid.',
  B008: 'Session Expired. Please re-login.'
};

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  getErrorDescription(code: string): string {
    if (errorsDict[code]) {
      return errorsDict[code];
    } else {
      return 'Error Not Found';
    }
  }
}
