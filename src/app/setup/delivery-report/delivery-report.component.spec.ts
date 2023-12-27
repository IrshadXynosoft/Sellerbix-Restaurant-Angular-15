import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryReportComponent } from './delivery-report.component';

describe('DeliveryReportComponent', () => {
  let component: DeliveryReportComponent;
  let fixture: ComponentFixture<DeliveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
