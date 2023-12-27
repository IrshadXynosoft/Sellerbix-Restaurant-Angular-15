import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverCashSettlementComponent } from './driver-cash-settlement.component';

describe('DriverCashSettlementComponent', () => {
  let component: DriverCashSettlementComponent;
  let fixture: ComponentFixture<DriverCashSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverCashSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverCashSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
