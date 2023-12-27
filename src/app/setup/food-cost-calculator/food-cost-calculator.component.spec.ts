import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCostCalculatorComponent } from './food-cost-calculator.component';

describe('FoodCostCalculatorComponent', () => {
  let component: FoodCostCalculatorComponent;
  let fixture: ComponentFixture<FoodCostCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodCostCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodCostCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
