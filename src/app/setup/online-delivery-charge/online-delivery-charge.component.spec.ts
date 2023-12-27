import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDeliveryChargeComponent } from './online-delivery-charge.component';

describe('OnlineDeliveryChargeComponent', () => {
  let component: OnlineDeliveryChargeComponent;
  let fixture: ComponentFixture<OnlineDeliveryChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineDeliveryChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineDeliveryChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
