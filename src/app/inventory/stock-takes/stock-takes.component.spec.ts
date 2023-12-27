import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakesComponent } from './stock-takes.component';

describe('StockTakesComponent', () => {
  let component: StockTakesComponent;
  let fixture: ComponentFixture<StockTakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTakesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
