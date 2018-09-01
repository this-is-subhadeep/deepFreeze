import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private _date:Date;
  private _dateChangeSubject = new Subject();
  constructor() {
    this._date=new Date();
  }
  get date()  {
    return this._date;
  }
  set date(date:Date) {
    this._date=date;
  }
  get dateChangeListener() {
    return this._dateChangeSubject;
  }
}
