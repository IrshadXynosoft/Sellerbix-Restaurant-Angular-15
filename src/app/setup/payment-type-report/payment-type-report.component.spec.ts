import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeReportComponent } from './payment-type-report.component';

describe('PaymentTypeReportComponent', () => {
  let component: PaymentTypeReportComponent;
  let fixture: ComponentFixture<PaymentTypeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTypeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
