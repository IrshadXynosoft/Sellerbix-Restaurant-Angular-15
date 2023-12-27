import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProductionReportComponent } from './batch-production-report.component';

describe('BatchProductionReportComponent', () => {
  let component: BatchProductionReportComponent;
  let fixture: ComponentFixture<BatchProductionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchProductionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
