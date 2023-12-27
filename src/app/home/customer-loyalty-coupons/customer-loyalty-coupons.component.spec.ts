import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoyaltyCouponsComponent } from './customer-loyalty-coupons.component';

describe('CustomerLoyaltyCouponsComponent', () => {
  let component: CustomerLoyaltyCouponsComponent;
  let fixture: ComponentFixture<CustomerLoyaltyCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLoyaltyCouponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLoyaltyCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
