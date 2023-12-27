import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReceiptsComponent } from './stock-receipts.component';

describe('StockReceiptsComponent', () => {
  let component: StockReceiptsComponent;
  let fixture: ComponentFixture<StockReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
