import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsumptionComponent } from './stock-consumption.component';

describe('StockConsumptionComponent', () => {
  let component: StockConsumptionComponent;
  let fixture: ComponentFixture<StockConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockConsumptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
