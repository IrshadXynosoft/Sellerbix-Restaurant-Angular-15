import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDiscountReportComponent } from './order-discount-report.component';

describe('OrderDiscountReportComponent', () => {
  let component: OrderDiscountReportComponent;
  let fixture: ComponentFixture<OrderDiscountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDiscountReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDiscountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
