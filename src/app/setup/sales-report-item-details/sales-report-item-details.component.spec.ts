import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportItemDetailsComponent } from './sales-report-item-details.component';

describe('SalesReportItemDetailsComponent', () => {
  let component: SalesReportItemDetailsComponent;
  let fixture: ComponentFixture<SalesReportItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReportItemDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
