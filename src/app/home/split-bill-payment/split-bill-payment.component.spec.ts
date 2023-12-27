import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitBillPaymentComponent } from './split-bill-payment.component';

describe('SplitBillPaymentComponent', () => {
  let component: SplitBillPaymentComponent;
  let fixture: ComponentFixture<SplitBillPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitBillPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitBillPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
