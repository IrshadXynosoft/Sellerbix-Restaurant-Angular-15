import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDeliveryManagerComponent } from './online-delivery-manager.component';

describe('OnlineDeliveryManagerComponent', () => {
  let component: OnlineDeliveryManagerComponent;
  let fixture: ComponentFixture<OnlineDeliveryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineDeliveryManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineDeliveryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
