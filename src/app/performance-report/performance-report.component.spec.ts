import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceReportComponent } from './performance-report.component';

describe('PerformanceReportComponent', () => {
  let component: PerformanceReportComponent;
  let fixture: ComponentFixture<PerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
