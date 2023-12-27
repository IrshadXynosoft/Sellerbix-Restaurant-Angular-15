import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProductionReportDetailComponent } from './batch-production-report-detail.component';

describe('BatchProductionReportDetailComponent', () => {
  let component: BatchProductionReportDetailComponent;
  let fixture: ComponentFixture<BatchProductionReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchProductionReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchProductionReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
