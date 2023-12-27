import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReportComponent } from './stock-report.component';

describe('StockReportComponent', () => {
  let component: StockReportComponent;
  let fixture: ComponentFixture<StockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
