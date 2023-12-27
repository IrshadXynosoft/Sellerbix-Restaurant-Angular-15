import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPerformanceReportComponent } from './supplier-performance-report.component';

describe('SupplierPerformanceReportComponent', () => {
  let component: SupplierPerformanceReportComponent;
  let fixture: ComponentFixture<SupplierPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPerformanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
