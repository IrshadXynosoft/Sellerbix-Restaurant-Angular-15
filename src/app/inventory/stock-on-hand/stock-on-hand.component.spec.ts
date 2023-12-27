import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOnHandComponent } from './stock-on-hand.component';

describe('StockOnHandComponent', () => {
  let component: StockOnHandComponent;
  let fixture: ComponentFixture<StockOnHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockOnHandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
