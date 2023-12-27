import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryManagerComponent } from './delivery-manager.component';

describe('DeliveryManagerComponent', () => {
  let component: DeliveryManagerComponent;
  let fixture: ComponentFixture<DeliveryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
