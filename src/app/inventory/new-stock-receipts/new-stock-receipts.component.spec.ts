import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockReceiptsComponent } from './new-stock-receipts.component';

describe('NewStockReceiptsComponent', () => {
  let component: NewStockReceiptsComponent;
  let fixture: ComponentFixture<NewStockReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStockReceiptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStockReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
