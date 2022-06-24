import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfBillComponent } from './half-bill.component';

describe('HalfBillComponent', () => {
  let component: HalfBillComponent;
  let fixture: ComponentFixture<HalfBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalfBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
