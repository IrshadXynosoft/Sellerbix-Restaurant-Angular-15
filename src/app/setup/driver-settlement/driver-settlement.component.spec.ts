import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSettlementComponent } from './driver-settlement.component';

describe('DriverSettlementComponent', () => {
  let component: DriverSettlementComponent;
  let fixture: ComponentFixture<DriverSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
