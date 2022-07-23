import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private _date: Date = new Date();
  private _dateChangeSubject = new BehaviorSubject<Date>(new Date());
  
  get date() {
    return this._date;
  }
  set date(date: Date) {
    this._date = date;
  }
  get dateChange$() {
    return this._dateChangeSubject;
  }
}
