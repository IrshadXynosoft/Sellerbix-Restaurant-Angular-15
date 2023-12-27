import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPoolOrdersComponent } from './driver-pool-orders.component';

describe('DriverPoolOrdersComponent', () => {
  let component: DriverPoolOrdersComponent;
  let fixture: ComponentFixture<DriverPoolOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverPoolOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverPoolOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
