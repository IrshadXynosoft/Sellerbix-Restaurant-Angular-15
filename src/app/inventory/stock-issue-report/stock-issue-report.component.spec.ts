import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIssueReportComponent } from './stock-issue-report.component';

describe('StockIssueReportComponent', () => {
  let component: StockIssueReportComponent;
  let fixture: ComponentFixture<StockIssueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockIssueReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockIssueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
