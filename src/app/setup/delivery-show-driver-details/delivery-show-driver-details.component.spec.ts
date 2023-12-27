import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryShowDriverDetailsComponent } from './delivery-show-driver-details.component';

describe('DeliveryShowDriverDetailsComponent', () => {
  let component: DeliveryShowDriverDetailsComponent;
  let fixture: ComponentFixture<DeliveryShowDriverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryShowDriverDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryShowDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
