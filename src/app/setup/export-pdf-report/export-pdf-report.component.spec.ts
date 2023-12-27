import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPdfReportComponent } from './export-pdf-report.component';

describe('ExportPdfReportComponent', () => {
  let component: ExportPdfReportComponent;
  let fixture: ComponentFixture<ExportPdfReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPdfReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPdfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
