import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessdayStockReportComponent } from './businessday-stock-report.component';

describe('BusinessdayStockReportComponent', () => {
  let component: BusinessdayStockReportComponent;
  let fixture: ComponentFixture<BusinessdayStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessdayStockReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessdayStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
