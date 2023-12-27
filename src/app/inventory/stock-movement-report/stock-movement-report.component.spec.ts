import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovementReportComponent } from './stock-movement-report.component';

describe('StockMovementReportComponent', () => {
  let component: StockMovementReportComponent;
  let fixture: ComponentFixture<StockMovementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMovementReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMovementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
