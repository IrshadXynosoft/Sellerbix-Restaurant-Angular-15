import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedSalesReportDetailComponent } from './updated-sales-report-detail.component';

describe('UpdatedSalesReportDetailComponent', () => {
  let component: UpdatedSalesReportDetailComponent;
  let fixture: ComponentFixture<UpdatedSalesReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedSalesReportDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedSalesReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
