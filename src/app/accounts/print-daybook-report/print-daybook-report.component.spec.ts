import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDaybookReportComponent } from './print-daybook-report.component';

describe('PrintDaybookReportComponent', () => {
  let component: PrintDaybookReportComponent;
  let fixture: ComponentFixture<PrintDaybookReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDaybookReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintDaybookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
