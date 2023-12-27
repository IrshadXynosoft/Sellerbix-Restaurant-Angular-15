import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportsComponent } from './payment-reports.component';

describe('PaymentReportsComponent', () => {
  let component: PaymentReportsComponent;
  let fixture: ComponentFixture<PaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
