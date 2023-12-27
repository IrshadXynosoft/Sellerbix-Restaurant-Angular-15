import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCostingReportComponent } from './food-costing-report.component';

describe('FoodCostingReportComponent', () => {
  let component: FoodCostingReportComponent;
  let fixture: ComponentFixture<FoodCostingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodCostingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodCostingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
