import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDriverManagerComponent } from './delivery-driver-manager.component';

describe('DeliveryDriverManagerComponent', () => {
  let component: DeliveryDriverManagerComponent;
  let fixture: ComponentFixture<DeliveryDriverManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDriverManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDriverManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
