import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStockPrintComponent } from './current-stock-print.component';

describe('CurrentStockPrintComponent', () => {
  let component: CurrentStockPrintComponent;
  let fixture: ComponentFixture<CurrentStockPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentStockPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentStockPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
