import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptReportsComponent } from './receipt-reports.component';

describe('ReceiptReportsComponent', () => {
  let component: ReceiptReportsComponent;
  let fixture: ComponentFixture<ReceiptReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
