import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGenOpeningDialogComponent } from './auto-gen-opening-dialog.component';

describe('AutoGenOpeningDialogComponent', () => {
  let component: AutoGenOpeningDialogComponent;
  let fixture: ComponentFixture<AutoGenOpeningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoGenOpeningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoGenOpeningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
