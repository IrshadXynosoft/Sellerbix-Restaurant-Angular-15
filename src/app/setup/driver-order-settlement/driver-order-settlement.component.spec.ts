import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOrderSettlementComponent } from './driver-order-settlement.component';

describe('DriverOrderSettlementComponent', () => {
  let component: DriverOrderSettlementComponent;
  let fixture: ComponentFixture<DriverOrderSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverOrderSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverOrderSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
