import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDashboardComponent } from './delivery-dashboard.component';

describe('DeliveryDashboardComponent', () => {
  let component: DeliveryDashboardComponent;
  let fixture: ComponentFixture<DeliveryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
