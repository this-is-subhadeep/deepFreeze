/* tslint:disable:no-unused-variable */

import { Injectable, LOCALE_ID } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CustomDatePipe } from './custom-date.pipe';

describe('Pipe: CustomDatePipee', () => {
  it('create an instance', () => {
    let pipe = new CustomDatePipe('');
    expect(pipe).toBeTruthy();
  });
});
